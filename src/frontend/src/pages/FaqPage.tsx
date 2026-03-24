import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useFaqByCategory, useSearchFaqs } from "@/hooks/useQueries";
import { BookOpen, HelpCircle, Search } from "lucide-react";
import { motion } from "motion/react";
import { useDeferredValue, useState } from "react";
import type { Faq } from "../backend.d";

const CATEGORIES = [
  "All",
  "Getting Started",
  "Billing",
  "Account",
  "Technical",
  "Integrations",
];

const SAMPLE_FAQS: Faq[] = [
  {
    question: "How do I reset my password?",
    answer:
      "Go to Settings → Security → Reset Password. Enter your email address and you'll receive a password reset link within 60 seconds. Check your spam folder if you don't see it.",
    category: "Account",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual enterprise plans. All transactions are secured with 256-bit SSL encryption.",
    category: "Billing",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "You can cancel anytime from Account Settings → Subscription → Cancel Plan. Your access continues until the end of the billing period. No cancellation fees apply.",
    category: "Billing",
  },
  {
    question: "Can I export my data?",
    answer:
      "Yes! Go to Settings → Data → Export. You can download all your data as a CSV or JSON file. Exports are available for all plans including the free tier.",
    category: "Account",
  },
  {
    question: "How do I connect third-party integrations?",
    answer:
      "Navigate to Settings → Integrations. We support over 50 integrations including Slack, Zendesk, Salesforce, and HubSpot. Each integration has a step-by-step setup guide.",
    category: "Integrations",
  },
  {
    question: "What is your uptime SLA?",
    answer:
      "We guarantee 99.9% uptime for all paid plans. Our status page at status.aidesupport.com shows real-time system health and historical uptime records.",
    category: "Technical",
  },
  {
    question: "How do I get started with the API?",
    answer:
      "Visit our developer portal at docs.aidesupport.com to get your API key. The getting started guide walks through authentication, rate limits, and common use cases with code examples.",
    category: "Getting Started",
  },
  {
    question: "Is my data secure?",
    answer:
      "Absolutely. We use AES-256 encryption at rest, TLS 1.3 in transit, and are SOC 2 Type II certified. Your data is never shared with third parties and you retain full ownership.",
    category: "Technical",
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const deferredSearch = useDeferredValue(search);

  const searchQuery = useSearchFaqs(deferredSearch);
  const categoryQuery = useFaqByCategory(category);

  // Use search results when searching, category results otherwise
  const isSearching = deferredSearch.trim().length > 0;
  const queryResult = isSearching ? searchQuery : categoryQuery;

  // Fall back to sample FAQs if backend returns empty
  let faqs: Faq[] = queryResult.data ?? [];
  if (faqs.length === 0 && !queryResult.isLoading) {
    faqs = SAMPLE_FAQS.filter((f) => {
      const matchCat = category === "All" || f.category === category;
      const matchSearch =
        !isSearching ||
        f.question.toLowerCase().includes(deferredSearch.toLowerCase()) ||
        f.answer.toLowerCase().includes(deferredSearch.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-card border-b border-border py-12">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              FAQ Knowledge Base
            </h1>
            <p className="text-muted-foreground mb-6">
              Find answers to common questions instantly
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 h-11 bg-background"
                data-ocid="faq.search_input"
              />
            </div>
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8" data-ocid="faq.tab">
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => {
                setCategory(cat);
                setSearch("");
              }}
              data-ocid={`faq.${cat.toLowerCase().replace(/ /g, "_")}.tab`}
            >
              <Badge
                variant={category === cat ? "default" : "secondary"}
                className="cursor-pointer text-sm py-1 px-3 hover:opacity-80 transition-opacity"
              >
                {cat}
              </Badge>
            </button>
          ))}
        </div>

        {/* Results */}
        {queryResult.isLoading ? (
          <div className="space-y-3" data-ocid="faq.loading_state">
            {["s1", "s2", "s3", "s4", "s5"].map((sk) => (
              <Skeleton key={sk} className="h-14 w-full rounded-lg" />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
            data-ocid="faq.empty_state"
          >
            <HelpCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-semibold text-foreground mb-1">
              No articles found
            </h3>
            <p className="text-sm text-muted-foreground">
              Try a different search term or browse all categories.
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground mb-4">
              {faqs.length} article{faqs.length !== 1 ? "s" : ""} found
            </p>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, i) => (
                <AccordionItem
                  key={faq.question}
                  value={faq.question}
                  className="bg-card border border-border rounded-lg px-4 shadow-xs"
                  data-ocid={`faq.item.${i + 1}`}
                >
                  <AccordionTrigger className="text-sm font-medium text-foreground hover:no-underline py-4">
                    <div className="flex items-start gap-2 text-left">
                      <Badge
                        variant="secondary"
                        className="mt-0.5 flex-shrink-0 text-xs"
                      >
                        {faq.category}
                      </Badge>
                      {faq.question}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        )}
      </div>
    </div>
  );
}
