import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface TicketInput {
    subject: string;
    name: string;
    email: string;
    message: string;
}
export interface Faq {
    question: string;
    answer: string;
    category: string;
}
export interface TicketUpdateInput {
    status: string;
}
export type FaqId = bigint;
export interface FaqInput {
    question: string;
    answer: string;
    category: string;
}
export interface Ticket {
    status: string;
    subject: string;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export type TicketId = bigint;
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addFaq(faqInput: FaqInput): Promise<FaqId>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteFaq(faqId: FaqId): Promise<void>;
    getAllFaqs(): Promise<Array<Faq>>;
    getAllTickets(): Promise<Array<Ticket>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getFaqByCategory(category: string): Promise<Array<Faq>>;
    getTicket(ticketId: TicketId): Promise<Ticket>;
    getTicketStatus(ticketId: TicketId): Promise<string | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    searchFaqs(keyword: string): Promise<Array<Faq>>;
    sendMessage(message: string): Promise<string>;
    submitTicket(ticketInput: TicketInput): Promise<TicketId>;
    updateFaq(faqId: FaqId, faqInput: FaqInput): Promise<void>;
    updateTicket(ticketId: TicketId, updateInput: TicketUpdateInput): Promise<void>;
}
