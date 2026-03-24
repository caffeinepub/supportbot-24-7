import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSendMessage } from "@/hooks/useQueries";
import { cn } from "@/lib/utils";
import { Bot, Loader2, MessageSquare, Plus, Send, User } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
  timestamp: Date;
}

const WELCOME: Message = {
  id: "welcome",
  role: "bot",
  content:
    "Hi there! 👋 I'm AideSupport, your 24/7 AI customer support assistant. I can help you with account questions, billing, technical issues, and more. What can I help you with today?",
  timestamp: new Date(),
};

const SUGGESTED = [
  "How do I reset my password?",
  "What are your pricing plans?",
  "I need to cancel my subscription",
  "How do I contact a human agent?",
];

// Smart local AI fallback responses
function getLocalResponse(message: string): string {
  const lower = message.toLowerCase();

  if (
    lower.includes("password") ||
    lower.includes("reset") ||
    lower.includes("forgot")
  ) {
    return "To reset your password, click 'Forgot Password' on the login page and follow the email instructions. If you don't receive the email within a few minutes, check your spam folder. Need further help? Submit a support ticket.";
  }
  if (
    lower.includes("billing") ||
    lower.includes("payment") ||
    lower.includes("invoice") ||
    lower.includes("charge")
  ) {
    return "For billing inquiries, please check your account dashboard for invoice history and payment details. If you notice any unexpected charges, submit a support ticket and our billing team will investigate promptly.";
  }
  if (
    lower.includes("cancel") ||
    lower.includes("subscription") ||
    lower.includes("unsubscribe")
  ) {
    return "To cancel your subscription, go to Account Settings > Subscription > Cancel Plan. Your access will remain active until the end of the current billing period. We're sorry to see you go — is there anything we can help improve?";
  }
  if (lower.includes("refund") || lower.includes("money back")) {
    return "Refund requests are reviewed within 3-5 business days. Please submit a support ticket with your order details and reason for the refund, and our team will process it as quickly as possible.";
  }
  if (
    lower.includes("account") ||
    lower.includes("login") ||
    lower.includes("sign in") ||
    lower.includes("access")
  ) {
    return "If you're having trouble accessing your account, try clearing your browser cache or using a different browser. If the issue persists, reset your password or submit a support ticket for further assistance.";
  }
  if (
    lower.includes("human") ||
    lower.includes("agent") ||
    lower.includes("person") ||
    lower.includes("talk to")
  ) {
    return "To speak with a human agent, please submit a support ticket and our team will respond within 24 hours. For urgent issues, mention 'URGENT' in your ticket subject for priority handling.";
  }
  if (
    lower.includes("price") ||
    lower.includes("pricing") ||
    lower.includes("plan") ||
    lower.includes("cost")
  ) {
    return "We offer flexible pricing plans to suit different needs. Please check our pricing page for the latest details, or submit a ticket if you'd like a custom quote for your team.";
  }
  if (
    lower.includes("error") ||
    lower.includes("bug") ||
    lower.includes("not working") ||
    lower.includes("broken") ||
    lower.includes("issue")
  ) {
    return "Sorry to hear you're experiencing a technical issue! Please describe the error in detail and submit a support ticket. Include any error messages you see and the steps to reproduce the issue — our technical team will investigate and respond promptly.";
  }
  if (
    lower.includes("thank") ||
    lower.includes("thanks") ||
    lower.includes("great") ||
    lower.includes("awesome")
  ) {
    return "You're welcome! 😊 I'm always here to help. Is there anything else I can assist you with?";
  }
  if (
    lower.includes("hello") ||
    lower.includes("hi") ||
    lower.includes("hey") ||
    lower.includes("good")
  ) {
    return "Hello! 👋 Great to hear from you. How can I assist you today? Feel free to ask about billing, account access, technical issues, or anything else.";
  }

  // Default helpful response
  return `Thank you for reaching out! I understand you're asking about: "${message}". Our support team is here to help. For the most accurate assistance, I recommend submitting a support ticket with the details of your issue, and our team will respond within 24 hours. You can also browse our FAQ section for quick answers to common questions.`;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage();

  const addBotMessage = (content: string) => {
    const botMsg: Message = {
      id: `b-${Date.now()}`,
      role: "bot",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMsg]);
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  };

  const handleSend = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );

    try {
      const response = await sendMessage.mutateAsync(content);
      setIsTyping(false);
      // If backend returns no match, use local fallback
      if (!response || response === "__NO_MATCH__") {
        addBotMessage(getLocalResponse(content));
      } else {
        addBotMessage(response);
      }
    } catch {
      // Backend unavailable - use local fallback (never show error to user)
      setIsTyping(false);
      // Small delay to feel natural
      setTimeout(() => {
        addBotMessage(getLocalResponse(content));
      }, 600);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-sidebar border-r border-sidebar-border flex-shrink-0">
        <div className="p-4 border-b border-sidebar-border">
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 bg-sidebar-accent border-sidebar-border text-sidebar-foreground hover:bg-sidebar-accent/80"
            onClick={() => {
              setMessages([WELCOME]);
              setInput("");
            }}
            data-ocid="chat.new.button"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </Button>
        </div>
        <div className="p-3">
          <p className="text-xs font-medium text-sidebar-accent-foreground mb-2 px-1">
            Recent
          </p>
          {["Password reset help", "Billing inquiry", "Account upgrade"].map(
            (title) => (
              <button
                type="button"
                key={title}
                className="w-full text-left px-3 py-2 rounded-md text-xs text-sidebar-foreground hover:bg-sidebar-accent transition-colors flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
                <span className="truncate">{title}</span>
              </button>
            ),
          )}
        </div>
        <div className="mt-auto p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-xs font-semibold text-sidebar-foreground">
                AideSupport AI
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                <span className="text-xs text-sidebar-accent-foreground">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 min-w-0 bg-background">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary-foreground" />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">
              AideSupport AI
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-xs text-muted-foreground">
                Always online · Ready to help
              </span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1" data-ocid="chat.canvas_target">
          <div className="p-4 space-y-4 max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className={cn(
                    "flex gap-2.5",
                    msg.role === "user" ? "justify-end" : "justify-start",
                  )}
                >
                  {msg.role === "bot" && (
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2.5 text-sm max-w-[75%] leading-relaxed",
                      msg.role === "bot"
                        ? "bg-muted text-foreground rounded-tl-sm"
                        : "bg-primary text-primary-foreground rounded-tr-sm",
                    )}
                  >
                    {msg.content}
                    <div
                      className={cn(
                        "text-xs mt-1 opacity-60",
                        msg.role === "user" ? "text-right" : "",
                      )}
                    >
                      {msg.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {msg.role === "user" && (
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-2.5 justify-start"
                data-ocid="chat.loading_state"
              >
                <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={`bounce-${i}`}
                      className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>
        </ScrollArea>

        {/* Suggested prompts (only show on welcome) */}
        {messages.length === 1 && (
          <div className="px-4 pb-2 max-w-3xl mx-auto w-full">
            <div className="flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button
                  type="button"
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-card border border-border rounded-full px-3 py-1.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-border bg-card">
          <div className="max-w-3xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              disabled={isTyping}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-shadow"
              data-ocid="chat.input"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || isTyping}
              className="rounded-xl px-4"
              data-ocid="chat.submit_button"
            >
              {isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
