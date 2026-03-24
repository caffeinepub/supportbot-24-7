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

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useSendMessage();

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
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );

    try {
      const response = await sendMessage.mutateAsync(content);
      const botMsg: Message = {
        id: `b-${Date.now()}`,
        role: "bot",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      requestAnimationFrame(() =>
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
    } catch {
      const errMsg: Message = {
        id: `e-${Date.now()}`,
        role: "bot",
        content:
          "I'm sorry, I encountered an error. Please try again or submit a support ticket.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errMsg]);
      requestAnimationFrame(() =>
        bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      );
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
            {sendMessage.isPending && (
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
              disabled={sendMessage.isPending}
              className="flex-1 bg-background border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition-shadow"
              data-ocid="chat.input"
            />
            <Button
              onClick={() => handleSend()}
              disabled={!input.trim() || sendMessage.isPending}
              className="rounded-xl px-4"
              data-ocid="chat.submit_button"
            >
              {sendMessage.isPending ? (
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
