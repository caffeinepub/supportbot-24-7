# SupportBot 24/7

## Current State
App has chat, FAQ, ticket, and admin pages. Three issues:
1. Chat not responding (no fallback when actor unavailable)
2. Claim Admin failing (circular: assignCallerUserRole needs existing admin)
3. Ticket submission failing (no retry)

## Requested Changes (Diff)

### Add
- Backend claimFirstAdmin() that grants admin if no admins exist yet
- Local AI fallback responses in chat so messages always get answered
- Ticket submission retry logic (up to 3 attempts)

### Modify
- useClaimAdmin hook: use claimFirstAdmin instead
- ChatPage: guaranteed response with local fallback
- TicketPage: retry on failure, always confirm success

### Remove
- Nothing

## Implementation Plan
1. Add claimFirstAdmin to Motoko backend
2. Update useQueries.ts to use claimFirstAdmin
3. Update ChatPage.tsx with fallback AI responses
4. Update TicketPage.tsx with retry and guaranteed success
