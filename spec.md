# SupportBot 24/7

## Current State
New project — no existing application files.

## Requested Changes (Diff)

### Add
- Landing page hero with brand, description, and CTAs ("Start Chat", "View FAQ")
- 24/7 AI chat widget with rule-based/FAQ-driven responses and a conversational UI
- FAQ knowledge base with search and topic categories
- Support ticket submission form (name, email, subject, message) stored in backend
- Admin dashboard (login-gated) to view submitted tickets and manage FAQ entries
- Role-based access: public users can chat and submit tickets; admins can manage everything

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: Motoko actor with data models for:
   - FAQs: id, category, question, answer
   - Tickets: id, name, email, subject, message, status (open/closed), timestamp
   - Role management (admin vs public)
2. Expose public endpoints: getFAQs, searchFAQs, submitTicket, chat (rule/FAQ-based response)
3. Expose admin endpoints: getTickets, updateTicketStatus, addFAQ, deleteFAQ
4. Frontend pages:
   - Landing/Home: hero, how-it-works section, FAQ preview, chat preview, ticket form preview
   - Chat page: live chat widget with simulated AI responses from FAQ matching
   - FAQ page: searchable FAQ list with category filters
   - Ticket submission page: form
   - Admin dashboard: ticket list with status management, FAQ management
5. Authorization component for admin login
