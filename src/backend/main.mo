import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type FaqId = Nat;
  type TicketId = Nat;

  type FaqInput = {
    category : Text;
    question : Text;
    answer : Text;
  };

  public type Faq = FaqInput;

  type TicketInput = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
  };

  public type Ticket = {
    name : Text;
    email : Text;
    subject : Text;
    message : Text;
    status : Text;
    timestamp : Int;
  };

  type TicketUpdateInput = {
    status : Text;
  };

  public type UserProfile = {
    name : Text;
  };

  // State
  var nextFaqId : FaqId = 1;
  var nextTicketId : TicketId = 1;

  let faqs = Map.empty<FaqId, Faq>();
  let tickets = Map.empty<TicketId, Ticket>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Helper modules
  module Faq {
    public func compare(faq1 : (Nat, Faq), faq2 : (Nat, Faq)) : Order.Order {
      Nat.compare(faq1.0, faq2.0);
    };
  };

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // FAQ Management
  public shared ({ caller }) func addFaq(faqInput : FaqInput) : async FaqId {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can add FAQs");
    };
    let faqId = nextFaqId;
    faqs.add(faqId, faqInput);
    nextFaqId += 1;
    faqId;
  };

  public shared ({ caller }) func updateFaq(faqId : FaqId, faqInput : FaqInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update FAQs");
    };
    if (not faqs.containsKey(faqId)) {
      Runtime.trap("FAQ not found");
    };
    faqs.add(faqId, faqInput);
  };

  public shared ({ caller }) func deleteFaq(faqId : FaqId) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete FAQs");
    };
    if (not faqs.containsKey(faqId)) {
      Runtime.trap("FAQ not found");
    };
    faqs.remove(faqId);
  };

  public query func getAllFaqs() : async [Faq] {
    faqs.values().toArray();
  };

  public query func getFaqByCategory(category : Text) : async [Faq] {
    faqs.values().toArray().filter(
      func(faq) {
        Text.equal(faq.category, category);
      }
    );
  };

  public query func searchFaqs(keyword : Text) : async [Faq] {
    faqs.values().toArray().filter(
      func(faq) {
        let lowerKeyword = keyword.toLower().toText();
        faq.question.toLower().toText().contains(#text lowerKeyword) or faq.answer.toLower().toText().contains(#text lowerKeyword)
      }
    );
  };

  // Support Tickets
  public shared func submitTicket(ticketInput : TicketInput) : async TicketId {
    let ticketId = nextTicketId;
    let ticket : Ticket = {
      ticketInput with
      status = "open";
      timestamp = Time.now();
    };
    tickets.add(ticketId, ticket);
    nextTicketId += 1;
    ticketId;
  };

  public shared ({ caller }) func updateTicket(ticketId : TicketId, updateInput : TicketUpdateInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update tickets");
    };
    let ticket = switch (tickets.get(ticketId)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?ticket) { ticket };
    };
    let updatedTicket = { ticket with status = updateInput.status };
    tickets.add(ticketId, updatedTicket);
  };

  public query ({ caller }) func getAllTickets() : async [Ticket] {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view tickets");
    };
    tickets.values().toArray();
  };

  public query ({ caller }) func getTicketStatus(ticketId : TicketId) : async ?Text {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view ticket status");
    };
    switch (tickets.get(ticketId)) {
      case (null) { null };
      case (?ticket) { ?ticket.status };
    };
  };

  public query ({ caller }) func getTicket(ticketId : TicketId) : async Ticket {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can view ticket details");
    };
    switch (tickets.get(ticketId)) {
      case (null) { Runtime.trap("Ticket not found") };
      case (?ticket) { ticket };
    };
  };

  // Chat
  public query func sendMessage(message : Text) : async Text {
    let lowerMessage = message.toLower().toText();
    let faqsArray = faqs.values().toArray();
    let matchingFaqs = faqsArray.filter(
      func(faq) {
        faq.question.toLower().toText().contains(#text lowerMessage);
      }
    );
    if (not matchingFaqs.isEmpty()) {
      let formattedFaqs = matchingFaqs.map(
        func(f) { "Q: " # f.question # "\nA: " # f.answer }
      );
      return "Here are some FAQs that might help:\n" # formattedFaqs.values().join("\n\n");
    };
    "I'm sorry, I couldn't find an answer to your question. I'll connect you with a human agent shortly.";
  };
};
