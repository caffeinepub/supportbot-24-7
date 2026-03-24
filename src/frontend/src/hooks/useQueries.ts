import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  Faq,
  FaqId,
  FaqInput,
  Ticket,
  TicketId,
  TicketInput,
  TicketUpdateInput,
} from "../backend.d";
import { UserRole } from "../backend.d";
import { useActor } from "./useActor";
import { useInternetIdentity } from "./useInternetIdentity";

export function useAllFaqs() {
  const { actor, isFetching } = useActor();
  return useQuery<Faq[]>({
    queryKey: ["faqs"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllFaqs();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSearchFaqs(keyword: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Faq[]>({
    queryKey: ["faqs", "search", keyword],
    queryFn: async () => {
      if (!actor) return [];
      if (!keyword.trim()) return actor.getAllFaqs();
      return actor.searchFaqs(keyword);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useFaqByCategory(category: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Faq[]>({
    queryKey: ["faqs", "category", category],
    queryFn: async () => {
      if (!actor) return [];
      if (!category || category === "All") return actor.getAllFaqs();
      return actor.getFaqByCategory(category);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllTickets() {
  const { actor, isFetching } = useActor();
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTickets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery<boolean>({
    queryKey: ["isAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useClaimAdmin() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Not connected");
      // Use claimFirstAdmin - works if no admin exists yet
      return (actor as any).claimFirstAdmin();
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["isAdmin"] }),
  });
}

export function useSendMessage() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (message: string) => {
      if (!actor) throw new Error("Not connected");
      const response = await actor.sendMessage(message);
      return response;
    },
  });
}

export function useSubmitTicket() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async (input: TicketInput) => {
      if (!actor) throw new Error("Not connected");
      // Retry up to 3 times
      let lastError: unknown;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          return await actor.submitTicket(input);
        } catch (err) {
          lastError = err;
          await new Promise((r) => setTimeout(r, 500 * (attempt + 1)));
        }
      }
      throw lastError;
    },
  });
}

export function useAddFaq() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: FaqInput) => {
      if (!actor) throw new Error("Not connected");
      return actor.addFaq(input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useDeleteFaq() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (faqId: FaqId) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteFaq(faqId);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useUpdateFaq() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ faqId, input }: { faqId: FaqId; input: FaqInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateFaq(faqId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["faqs"] }),
  });
}

export function useUpdateTicket() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      ticketId,
      input,
    }: { ticketId: TicketId; input: TicketUpdateInput }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateTicket(ticketId, input);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tickets"] }),
  });
}
