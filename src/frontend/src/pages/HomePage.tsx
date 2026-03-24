import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CheckCircle2,
  Clock,
  MessageSquare,
  Search,
  Star,
  TicketCheck,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Zap,
    title: "Instant Answers",
    description:
      "AI resolves common questions in under 2 seconds, 24 hours a day, 365 days a year — no wait times, no queue.",
  },
  {
    icon: BookOpen,
    title: "Smart FAQ Engine",
    description:
      "Automatically surfaces the most relevant articles from your knowledge base using semantic search.",
  },
  {
    icon: TicketCheck,
    title: "Ticket Tracking",
    description:
      "When AI can't help, create and track support tickets seamlessly. Real-time status updates keep customers informed.",
  },
];

const stats = [
  { value: "98%", label: "Customer satisfaction" },
  { value: "<2s", label: "Avg. response time" },
  { value: "24/7", label: "Always online" },
  { value: "10k+", label: "Issues resolved" },
];

const popularTopics = [
  "Getting Started",
  "Billing & Plans",
  "Account Settings",
  "Integrations",
  "API Reference",
  "Troubleshooting",
];

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-background py-20 lg:py-28 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge className="mb-5 bg-accent text-accent-foreground border-0 gap-1.5 py-1 px-3">
                <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                AI-Powered · Always On
              </Badge>
              <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-[1.1] mb-5">
                24/7 AI Customer
                <br />
                <span className="text-primary">Support Assistant</span>
              </h1>
              <p className="text-base lg:text-lg text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Deploy an intelligent support agent that resolves customer
                questions instantly, manages your FAQ knowledge base, and
                escalates complex issues — all without a single human
                intervention.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  size="lg"
                  className="gap-2 text-base"
                  asChild
                  data-ocid="hero.primary_button"
                >
                  <Link to="/chat">
                    <MessageSquare className="w-5 h-5" />
                    Start Chatting
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-base text-primary hover:text-primary hover:bg-accent"
                  asChild
                  data-ocid="hero.secondary_button"
                >
                  <Link to="/faq">
                    View FAQ
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mt-10 pt-8 border-t border-border">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="font-display font-bold text-xl text-foreground">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: product mockup */}
            <motion.div
              initial={{ opacity: 0, x: 32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="relative"
            >
              <div className="relative">
                <img
                  src="/assets/generated/hero-chat-mockup.dim_560x420.png"
                  alt="AideSupport chat interface mockup"
                  className="w-full rounded-2xl shadow-card-hover ring-1 ring-border"
                />
                {/* Floating cards */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                  className="absolute -bottom-4 -left-4 bg-card rounded-xl shadow-card-hover border border-border p-3 flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-foreground">
                      Ticket Resolved
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Avg. 2 min response
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75, duration: 0.4 }}
                  className="absolute -top-3 -right-3 bg-card rounded-xl shadow-card-hover border border-border p-3 flex items-center gap-2"
                >
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <div className="text-xs font-semibold text-foreground">
                    98% CSAT Score
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-3">
              How AideSupport Works
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A complete support stack powered by AI — from instant answers to
              full ticket management.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="border-border shadow-card hover:shadow-card-hover transition-shadow h-full">
                  <CardContent className="p-6">
                    <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center mb-4">
                      <f.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-display font-semibold text-base text-foreground mb-2">
                      {f.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {f.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* FAQ Preview */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-border shadow-card h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-semibold text-foreground">
                      FAQ Knowledge Base
                    </h3>
                  </div>
                  <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <div className="h-9 bg-muted rounded-md pl-9 flex items-center">
                      <span className="text-sm text-muted-foreground">
                        Search knowledge base...
                      </span>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-muted-foreground mb-2">
                    Popular Topics
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {popularTopics.map((t) => (
                      <Badge
                        key={t}
                        variant="secondary"
                        className="text-xs cursor-pointer hover:bg-accent transition-colors"
                      >
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5"
                      asChild
                    >
                      <Link to="/faq">
                        Browse All Articles{" "}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Chat Preview */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-border shadow-card overflow-hidden h-full">
                {/* Dark header */}
                <div className="bg-sidebar px-4 py-3 flex items-center gap-2">
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
                        Online 24/7
                      </span>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-xs text-foreground max-w-[80%]">
                      Hi! I'm your AI support assistant. How can I help you
                      today?
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <div className="bg-primary rounded-xl rounded-tr-sm px-3 py-2 text-xs text-primary-foreground max-w-[80%]">
                      How do I reset my password?
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-xl rounded-tl-sm px-3 py-2 text-xs text-foreground max-w-[80%]">
                      To reset your password, go to Settings → Security → Reset
                      Password. You'll receive an email within 60 seconds.
                    </div>
                  </div>
                </CardContent>
                <div className="px-4 pb-4">
                  <Button size="sm" className="w-full gap-1.5" asChild>
                    <Link to="/chat">
                      Open Live Chat <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Ticket + Admin row */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Ticket form preview */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Card className="border-border shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TicketCheck className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-semibold text-foreground">
                      Submit a Support Ticket
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {["Your Name", "Email Address", "Subject"].map((p) => (
                      <div
                        key={p}
                        className="h-8 bg-muted rounded-md flex items-center px-3"
                      >
                        <span className="text-xs text-muted-foreground">
                          {p}
                        </span>
                      </div>
                    ))}
                    <div className="h-16 bg-muted rounded-md flex items-start px-3 pt-2">
                      <span className="text-xs text-muted-foreground">
                        Describe your issue...
                      </span>
                    </div>
                  </div>
                  <Button size="sm" className="w-full mt-3 gap-1.5" asChild>
                    <Link to="/ticket">
                      Open Ticket Form <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Admin preview */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="border-border shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="w-5 h-5 text-primary" />
                    <h3 className="font-display font-semibold text-foreground">
                      Admin Dashboard
                    </h3>
                    <Badge className="ml-auto bg-accent text-accent-foreground border-0 text-xs">
                      Protected
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: "Open Tickets", value: "12" },
                      { label: "Resolved Today", value: "34" },
                      { label: "FAQ Entries", value: "87" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="bg-muted rounded-lg p-3 text-center"
                      >
                        <div className="font-display font-bold text-xl text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-1.5"
                    asChild
                  >
                    <Link to="/admin">
                      Go to Admin <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
