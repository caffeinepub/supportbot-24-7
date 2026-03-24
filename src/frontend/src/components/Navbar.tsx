import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import { Link } from "@tanstack/react-router";
import { Bot, LogIn, LogOut, MessageSquare, ShieldCheck } from "lucide-react";

export default function Navbar() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-sm border-b border-border shadow-xs">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 group"
          data-ocid="nav.link"
        >
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
            A
          </div>
          <span className="font-display font-bold text-lg text-foreground">
            AideSupport
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          <Link
            to="/chat"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.chat.link"
          >
            <MessageSquare className="w-4 h-4" />
            Chat
          </Link>
          <Link
            to="/faq"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.faq.link"
          >
            FAQ
          </Link>
          <Link
            to="/ticket"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.ticket.link"
          >
            Support
          </Link>
          <Link
            to="/admin"
            className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            data-ocid="nav.admin.link"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin
          </Link>
        </nav>

        {/* Auth */}
        <div className="flex items-center gap-2">
          {isLoggedIn ? (
            <>
              <span className="hidden sm:block text-xs text-muted-foreground truncate max-w-[120px]">
                {identity?.getPrincipal().toString().slice(0, 8)}...
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clear()}
                className="gap-1.5"
                data-ocid="nav.logout.button"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => login()}
                disabled={isLoggingIn}
                className="gap-1.5"
                data-ocid="nav.login.button"
              >
                <LogIn className="w-4 h-4" />
                {isLoggingIn ? "Connecting..." : "Log In"}
              </Button>
              <Button
                size="sm"
                className="gap-1.5 hidden sm:flex"
                asChild
                data-ocid="nav.demo.button"
              >
                <Link to="/chat">
                  <Bot className="w-4 h-4" />
                  Try Free
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
