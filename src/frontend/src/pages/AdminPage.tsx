import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useInternetIdentity } from "@/hooks/useInternetIdentity";
import {
  useAddFaq,
  useAllFaqs,
  useAllTickets,
  useDeleteFaq,
  useIsAdmin,
  useUpdateFaq,
  useUpdateTicket,
} from "@/hooks/useQueries";
import {
  BookOpen,
  CheckCircle2,
  Loader2,
  LogIn,
  Pencil,
  Plus,
  RefreshCw,
  ShieldCheck,
  Ticket,
  Trash2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Faq, FaqId } from "../backend.d";

const STATUS_OPTIONS = ["open", "in-progress", "resolved", "closed"];
const STATUS_COLORS: Record<string, string> = {
  open: "bg-blue-100 text-blue-700",
  "in-progress": "bg-yellow-100 text-yellow-700",
  resolved: "bg-green-100 text-green-700",
  closed: "bg-muted text-muted-foreground",
};

function AdminUnauthorized() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === "logging-in";
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card
        className="w-full max-w-sm border-border shadow-card text-center"
        data-ocid="admin.modal"
      >
        <CardContent className="p-8">
          <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h2 className="font-display text-xl font-bold text-foreground mb-2">
            Admin Access Required
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            This dashboard is restricted to administrators. Please log in with
            your admin identity.
          </p>
          <Button
            className="w-full gap-2"
            onClick={() => login()}
            disabled={isLoggingIn}
            data-ocid="admin.login.button"
          >
            {isLoggingIn ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogIn className="w-4 h-4" />
            )}
            {isLoggingIn ? "Connecting..." : "Log In to Continue"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function TicketsTab() {
  const ticketsQuery = useAllTickets();
  const updateTicket = useUpdateTicket();
  const [updatingId, setUpdatingId] = useState<bigint | null>(null);

  const tickets = ticketsQuery.data ?? [];

  const handleStatusChange = async (ticketId: bigint, status: string) => {
    setUpdatingId(ticketId);
    try {
      await updateTicket.mutateAsync({ ticketId, input: { status } });
      toast.success("Ticket status updated");
    } catch {
      toast.error("Failed to update ticket");
    } finally {
      setUpdatingId(null);
    }
  };

  if (ticketsQuery.isLoading) {
    return (
      <div className="space-y-3" data-ocid="admin.tickets.loading_state">
        {Array.from({ length: 4 }, (_, i) => i).map((n) => (
          <Skeleton key={n} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-16" data-ocid="admin.tickets.empty_state">
        <Ticket className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <h3 className="font-semibold text-foreground mb-1">No tickets yet</h3>
        <p className="text-sm text-muted-foreground">
          Submitted tickets will appear here.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-lg border border-border overflow-hidden"
      data-ocid="admin.tickets.table"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="text-xs">ID</TableHead>
            <TableHead className="text-xs">Name</TableHead>
            <TableHead className="text-xs">Subject</TableHead>
            <TableHead className="text-xs">Status</TableHead>
            <TableHead className="text-xs">Date</TableHead>
            <TableHead className="text-xs">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket, i) => (
            <TableRow
              key={`ticket-${ticket.email}-${i}`}
              data-ocid={`admin.tickets.row.${i + 1}`}
            >
              <TableCell className="text-xs font-mono text-muted-foreground">
                #{i + 1}
              </TableCell>
              <TableCell className="text-xs font-medium">
                {ticket.name}
              </TableCell>
              <TableCell className="text-xs max-w-[200px] truncate">
                {ticket.subject}
              </TableCell>
              <TableCell>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[ticket.status] ?? "bg-muted text-muted-foreground"}`}
                >
                  {ticket.status}
                </span>
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {new Date(
                  Number(ticket.timestamp) / 1_000_000,
                ).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Select
                  value={ticket.status}
                  onValueChange={(val) => handleStatusChange(BigInt(i), val)}
                  disabled={updatingId === BigInt(i)}
                >
                  <SelectTrigger
                    className="h-7 text-xs w-32"
                    data-ocid={`admin.tickets.select.${i + 1}`}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function FaqTab() {
  const faqsQuery = useAllFaqs();
  const addFaq = useAddFaq();
  const deleteFaq = useDeleteFaq();
  const updateFaq = useUpdateFaq();

  const [showAdd, setShowAdd] = useState(false);
  const [newFaq, setNewFaq] = useState({
    question: "",
    answer: "",
    category: "",
  });
  const [editTarget, setEditTarget] = useState<{ id: FaqId; faq: Faq } | null>(
    null,
  );

  const faqs = faqsQuery.data ?? [];

  const handleAdd = async () => {
    if (
      !newFaq.question.trim() ||
      !newFaq.answer.trim() ||
      !newFaq.category.trim()
    ) {
      toast.error("All fields are required");
      return;
    }
    try {
      await addFaq.mutateAsync(newFaq);
      setNewFaq({ question: "", answer: "", category: "" });
      setShowAdd(false);
      toast.success("FAQ added successfully");
    } catch {
      toast.error("Failed to add FAQ");
    }
  };

  const handleDelete = async (id: FaqId) => {
    try {
      await deleteFaq.mutateAsync(id);
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete FAQ");
    }
  };

  const handleUpdate = async () => {
    if (!editTarget) return;
    try {
      await updateFaq.mutateAsync({
        faqId: editTarget.id,
        input: editTarget.faq,
      });
      setEditTarget(null);
      toast.success("FAQ updated");
    } catch {
      toast.error("Failed to update FAQ");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setShowAdd(true)}
          data-ocid="admin.faq.open_modal_button"
        >
          <Plus className="w-4 h-4" />
          Add FAQ
        </Button>
      </div>

      {/* Add FAQ Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent data-ocid="admin.faq.dialog">
          <DialogHeader>
            <DialogTitle>Add New FAQ</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input
                placeholder="e.g. Billing"
                value={newFaq.category}
                onChange={(e) =>
                  setNewFaq((p) => ({ ...p, category: e.target.value }))
                }
                data-ocid="admin.faq.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Question</Label>
              <Input
                placeholder="Enter the question"
                value={newFaq.question}
                onChange={(e) =>
                  setNewFaq((p) => ({ ...p, question: e.target.value }))
                }
                data-ocid="admin.faq.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Answer</Label>
              <Textarea
                placeholder="Enter the answer"
                rows={4}
                value={newFaq.answer}
                onChange={(e) =>
                  setNewFaq((p) => ({ ...p, answer: e.target.value }))
                }
                className="resize-none"
                data-ocid="admin.faq.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAdd(false)}
              data-ocid="admin.faq.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={addFaq.isPending}
              data-ocid="admin.faq.confirm_button"
            >
              {addFaq.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Add FAQ
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent data-ocid="admin.faq.edit.dialog">
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
          </DialogHeader>
          {editTarget && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Category</Label>
                <Input
                  value={editTarget.faq.category}
                  onChange={(e) =>
                    setEditTarget((p) =>
                      p
                        ? { ...p, faq: { ...p.faq, category: e.target.value } }
                        : null,
                    )
                  }
                  data-ocid="admin.faq.edit.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Question</Label>
                <Input
                  value={editTarget.faq.question}
                  onChange={(e) =>
                    setEditTarget((p) =>
                      p
                        ? { ...p, faq: { ...p.faq, question: e.target.value } }
                        : null,
                    )
                  }
                  data-ocid="admin.faq.edit.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Answer</Label>
                <Textarea
                  rows={4}
                  value={editTarget.faq.answer}
                  onChange={(e) =>
                    setEditTarget((p) =>
                      p
                        ? { ...p, faq: { ...p.faq, answer: e.target.value } }
                        : null,
                    )
                  }
                  className="resize-none"
                  data-ocid="admin.faq.edit.textarea"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditTarget(null)}
              data-ocid="admin.faq.edit.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateFaq.isPending}
              data-ocid="admin.faq.edit.confirm_button"
            >
              {updateFaq.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {faqsQuery.isLoading ? (
        <div className="space-y-2" data-ocid="admin.faq.loading_state">
          {["f1", "f2", "f3", "f4"].map((k) => (
            <Skeleton key={k} className="h-14" />
          ))}
        </div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-12" data-ocid="admin.faq.empty_state">
          <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            No FAQs yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {faqs.map((faq, i) => (
            <div
              key={faq.question}
              className="flex items-start gap-3 bg-card border border-border rounded-lg p-4"
              data-ocid={`admin.faq.item.${i + 1}`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    {faq.category}
                  </Badge>
                </div>
                <p className="text-sm font-medium text-foreground truncate">
                  {faq.question}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                  {faq.answer}
                </p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-accent"
                  onClick={() => setEditTarget({ id: BigInt(i), faq })}
                  data-ocid={`admin.faq.edit_button.${i + 1}`}
                >
                  <Pencil className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 hover:bg-destructive/10 text-destructive"
                  onClick={() => handleDelete(BigInt(i))}
                  disabled={deleteFaq.isPending}
                  data-ocid={`admin.faq.delete_button.${i + 1}`}
                >
                  {deleteFaq.isPending ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const { identity } = useInternetIdentity();
  const isAdminQuery = useIsAdmin();

  if (!identity) {
    return <AdminUnauthorized />;
  }

  if (isAdminQuery.isLoading) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="admin.loading_state"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">
            Verifying admin access...
          </span>
        </div>
      </div>
    );
  }

  if (!isAdminQuery.data) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card
          className="w-full max-w-sm border-border shadow-card text-center"
          data-ocid="admin.error_state"
        >
          <CardContent className="p-8">
            <div className="w-14 h-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-7 h-7 text-destructive" />
            </div>
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Unauthorized
            </h2>
            <p className="text-sm text-muted-foreground">
              Your account does not have admin privileges. Contact your
              administrator for access.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-foreground">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">
                  Manage tickets and FAQ knowledge base
                </p>
              </div>
            </div>
            <Badge className="bg-green-100 text-green-700 border-0 gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Admin Access
            </Badge>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Ticket, label: "Total Tickets", value: "—" },
              { icon: BookOpen, label: "FAQ Entries", value: "—" },
              { icon: Users, label: "Active Sessions", value: "1" },
            ].map((s) => (
              <Card key={s.label} className="border-border shadow-xs">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-accent flex items-center justify-center">
                    <s.icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <div className="font-display font-bold text-lg text-foreground">
                      {s.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {s.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="tickets" data-ocid="admin.tab">
            <TabsList className="mb-4">
              <TabsTrigger
                value="tickets"
                className="gap-1.5"
                data-ocid="admin.tickets.tab"
              >
                <Ticket className="w-4 h-4" />
                Tickets
              </TabsTrigger>
              <TabsTrigger
                value="faq"
                className="gap-1.5"
                data-ocid="admin.faq.tab"
              >
                <BookOpen className="w-4 h-4" />
                FAQ Management
              </TabsTrigger>
            </TabsList>
            <TabsContent value="tickets">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Support Tickets</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 h-7"
                      data-ocid="admin.tickets.button"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      Refresh
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <TicketsTab />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="faq">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">FAQ Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <FaqTab />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
