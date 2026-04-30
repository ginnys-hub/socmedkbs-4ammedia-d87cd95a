import { useState, FormEvent, useEffect } from "react";
import { Navigate, Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { isTransientBackendError, waitForRetry } from "@/lib/backendRetry";

/** Ensure a valid session exists before performing a mutation.
 *  Prevents RLS errors when the session is still hydrating or has expired. */
const ensureSession = async (): Promise<string | null> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    const { data, error } = await supabase.auth.refreshSession();
    if (error || !data.session) return "Your session expired. Please sign in again.";
  }
  return null;
};
import {
  useAnnouncements,
  useMacros,
  useScorecardWeeks,
  useScorecardEntries,
  type Announcement,
  type Macro,
  type ScorecardWeek,
  type ScorecardEntry,
} from "@/hooks/useContent";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { BRANDS } from "@/data/brands";
import { TEAM_MEMBERS } from "@/data/team";
import {
  LogOut,
  Plus,
  Trash2,
  Pencil,
  Save,
  X,
  Star,
  Home,
} from "lucide-react";

async function runAdminRequest(
  request: () => any,
  maxAttempts = 3
): Promise<{ data: any; error: { message?: string } | null }> {
  let lastResult: { data: any; error: { message?: string } | null } = { data: null, error: null };

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    try {
      lastResult = await request();
      if (!lastResult.error) return lastResult;
    } catch (err: any) {
      lastResult = { data: null, error: { message: err?.message ?? String(err) } };
    }

    if (!isTransientBackendError(lastResult.error) || attempt === maxAttempts - 1) return lastResult;
    await waitForRetry(700 * (attempt + 1));
  }

  return lastResult;
}

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-48 rounded-full" />
      </div>
    );
  }
  if (!user) return <Navigate to="/admin/login" replace />;
  if (!isAdmin)
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="rounded-3xl bg-card p-8 shadow-soft text-center max-w-md">
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            This account doesn't have admin permissions.
          </p>
          <Button onClick={signOut} variant="outline">Sign out</Button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <h1 className="text-lg font-extrabold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm" className="rounded-full">
              <Link to="/"><Home className="mr-2 h-4 w-4" /> View site</Link>
            </Button>
            <Button onClick={signOut} variant="outline" size="sm" className="rounded-full">
              <LogOut className="mr-2 h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="container py-8">
        <Tabs defaultValue="announcements" className="space-y-6">
          <TabsList className="rounded-full bg-muted p-1">
            <TabsTrigger value="announcements" className="rounded-full">Announcements</TabsTrigger>
            <TabsTrigger value="macros" className="rounded-full">Macros</TabsTrigger>
            <TabsTrigger value="scorecards" className="rounded-full">Scorecards</TabsTrigger>
          </TabsList>
          <TabsContent value="announcements"><AnnouncementsAdmin /></TabsContent>
          <TabsContent value="macros"><MacrosAdmin /></TabsContent>
          <TabsContent value="scorecards"><ScorecardsAdmin /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

/* ---------------- Announcements ---------------- */
const AnnouncementsAdmin = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useAnnouncements();
  const [editing, setEditing] = useState<Partial<Announcement> | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  const startNew = () => setEditing({ title: "", body: "", posted_on: today, category: "update" });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    console.log("[Admin] Save announcement clicked", editing);
    if (!editing?.title?.trim() || !editing?.body?.trim()) {
      toast.error("Title and body are required");
      return;
    }
    const sessionErr = await ensureSession();
    if (sessionErr) {
      console.warn("[Admin] Session check failed:", sessionErr);
      return toast.error(sessionErr);
    }
    const payload = {
      title: editing.title.trim(),
      body: editing.body.trim(),
      posted_on: editing.posted_on || today,
      category: (editing.category as any) || "update",
    };
    console.log("[Admin] Submitting announcement payload", payload);
    const { error } = await runAdminRequest(() =>
      editing.id
        ? supabase.from("announcements").update(payload).eq("id", editing.id)
        : supabase.from("announcements").insert(payload)
    );
    if (error) {
      console.error("[Admin] Announcement save error:", error);
      return toast.error(error.message ?? "Save failed");
    }
    toast.success("Saved");
    setEditing(null);
    await qc.refetchQueries({ queryKey: ["announcements"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const { error } = await runAdminRequest(() =>
      supabase.from("announcements").delete().eq("id", id)
    );
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await qc.refetchQueries({ queryKey: ["announcements"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Announcements</h2>
        {!editing && (
          <Button onClick={startNew} className="rounded-full">
            <Plus className="mr-2 h-4 w-4" /> New
          </Button>
        )}
      </div>

      {editing && (
        <form onSubmit={save} className="rounded-3xl bg-card p-6 shadow-soft space-y-4">
          <div className="flex flex-wrap gap-4">
            <div>
              <Label>Posted on</Label>
              <Input type="date" value={editing.posted_on ?? today} onChange={(e) => setEditing({ ...editing, posted_on: e.target.value })} className="mt-1 max-w-xs" />
            </div>
            <div>
              <Label>Category</Label>
              <Select value={(editing.category as string) ?? "update"} onValueChange={(v) => setEditing({ ...editing, category: v as any })}>
                <SelectTrigger className="mt-1 w-[180px]"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="reminder">Reminder</SelectItem>
                  <SelectItem value="issue">Issue</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                  <SelectItem value="important">Important</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Title</Label>
            <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-1" required />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea rows={8} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="mt-1" required />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full"><Save className="mr-2 h-4 w-4" /> Save</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)} className="rounded-full"><X className="mr-2 h-4 w-4" /> Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <Skeleton className="h-40 rounded-3xl" />
      ) : (
        <div className="space-y-3">
          {(data ?? []).map((a) => (
            <div key={a.id} className="rounded-2xl bg-card p-4 shadow-soft flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{a.posted_on}</span>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase">{a.category}</span>
                </div>
                <h3 className="font-bold">{a.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">{a.body}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => setEditing(a)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(a.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- Macros ---------------- */
const MacrosAdmin = () => {
  const qc = useQueryClient();
  const { data, isLoading } = useMacros();
  const [editing, setEditing] = useState<Partial<Macro> | null>(null);
  const [filterBrand, setFilterBrand] = useState<string>("All");

  const startNew = () =>
    setEditing({ brand: BRANDS[0], title: "", body: "", tags: [] });

  const save = async (e: FormEvent) => {
    e.preventDefault();
    console.log("[Admin] Save macro clicked", editing);
    if (!editing?.title?.trim() || !editing?.body?.trim() || !editing?.brand) {
      toast.error("Brand, title and body are required");
      return;
    }
    const sessionErr = await ensureSession();
    if (sessionErr) {
      console.warn("[Admin] Session check failed:", sessionErr);
      return toast.error(sessionErr);
    }
    const payload = {
      brand: editing.brand,
      title: editing.title.trim(),
      body: editing.body.trim(),
      tags: editing.tags ?? [],
    };
    console.log("[Admin] Submitting macro payload", payload);
    const { error } = await runAdminRequest(() =>
      editing.id
        ? supabase.from("macros").update(payload).eq("id", editing.id)
        : supabase.from("macros").insert(payload)
    );
    if (error) {
      console.error("[Admin] Macro save error:", error);
      return toast.error(error.message ?? "Save failed");
    }
    toast.success("Saved");
    setEditing(null);
    await qc.refetchQueries({ queryKey: ["macros"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this macro?")) return;
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const { error } = await runAdminRequest(() =>
      supabase.from("macros").delete().eq("id", id)
    );
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await qc.refetchQueries({ queryKey: ["macros"] });
  };

  const filtered = (data ?? []).filter((m) => filterBrand === "All" || m.brand === filterBrand);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Macros</h2>
        <div className="flex items-center gap-2">
          <Select value={filterBrand} onValueChange={setFilterBrand}>
            <SelectTrigger className="w-[220px] rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All brands</SelectItem>
              {BRANDS.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
            </SelectContent>
          </Select>
          {!editing && (
            <Button onClick={startNew} className="rounded-full"><Plus className="mr-2 h-4 w-4" /> New</Button>
          )}
        </div>
      </div>

      {editing && (
        <form onSubmit={save} className="rounded-3xl bg-card p-6 shadow-soft space-y-4">
          <div>
            <Label>Brand</Label>
            <Select value={editing.brand} onValueChange={(v) => setEditing({ ...editing, brand: v })}>
              <SelectTrigger className="mt-1 max-w-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                {BRANDS.map((b) => (<SelectItem key={b} value={b}>{b}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Title</Label>
            <Input value={editing.title ?? ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className="mt-1" required />
          </div>
          <div>
            <Label>Body</Label>
            <Textarea rows={8} value={editing.body ?? ""} onChange={(e) => setEditing({ ...editing, body: e.target.value })} className="mt-1" required />
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input
              value={(editing.tags ?? []).join(", ")}
              onChange={(e) => setEditing({ ...editing, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })}
              className="mt-1"
              placeholder="shipping, returns"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full"><Save className="mr-2 h-4 w-4" /> Save</Button>
            <Button type="button" variant="ghost" onClick={() => setEditing(null)} className="rounded-full"><X className="mr-2 h-4 w-4" /> Cancel</Button>
          </div>
        </form>
      )}

      {isLoading ? (
        <Skeleton className="h-40 rounded-3xl" />
      ) : (
        <div className="space-y-3">
          {filtered.map((m) => (
            <div key={m.id} className="rounded-2xl bg-card p-4 shadow-soft flex items-start justify-between gap-3">
              <div className="min-w-0">
                <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">{m.brand}</span>
                <h3 className="font-bold mt-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-line">{m.body}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" onClick={() => setEditing(m)}><Pencil className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" onClick={() => remove(m.id)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------------- Scorecards ---------------- */
const ScorecardsAdmin = () => {
  const qc = useQueryClient();
  const { data: weeks } = useScorecardWeeks();
  const [selectedWeekId, setSelectedWeekId] = useState<string>("");
  const { data: entries } = useScorecardEntries(selectedWeekId);

  useEffect(() => {
    if (!selectedWeekId && weeks && weeks.length > 0) {
      setSelectedWeekId((weeks.find((w) => w.is_current) ?? weeks[0]).id);
    }
  }, [weeks, selectedWeekId]);

  const [newWeek, setNewWeek] = useState({ week_of: "", label: "" });

  const addWeek = async (e: FormEvent) => {
    e.preventDefault();
    if (!newWeek.week_of || !newWeek.label.trim()) return toast.error("Both fields required");
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const { data, error } = await runAdminRequest(() =>
      supabase
        .from("scorecard_weeks")
        .insert({ week_of: newWeek.week_of, label: newWeek.label.trim() })
        .select()
        .single()
    );
    if (error) return toast.error(error.message);
    toast.success("Week added");
    setNewWeek({ week_of: "", label: "" });
    await qc.refetchQueries({ queryKey: ["scorecard_weeks"] });
    if (data) setSelectedWeekId(data.id);
  };

  const setCurrent = async (id: string) => {
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const { error: e1 } = await runAdminRequest(() =>
      supabase.from("scorecard_weeks").update({ is_current: false }).neq("id", "00000000-0000-0000-0000-000000000000")
    );
    if (e1) return toast.error(e1.message);
    const { error: e2 } = await runAdminRequest(() =>
      supabase.from("scorecard_weeks").update({ is_current: true }).eq("id", id)
    );
    if (e2) return toast.error(e2.message);
    toast.success("Set as current week");
    await qc.refetchQueries({ queryKey: ["scorecard_weeks"] });
  };

  const deleteWeek = async (id: string) => {
    if (!confirm("Delete this week and all its entries?")) return;
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const { error } = await runAdminRequest(() => supabase.from("scorecard_weeks").delete().eq("id", id));
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    await qc.refetchQueries({ queryKey: ["scorecard_weeks"] });
    await qc.refetchQueries({ queryKey: ["scorecard_entries_all"] });
    setSelectedWeekId("");
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-card p-6 shadow-soft">
        <h2 className="text-lg font-bold mb-3">Add a new week</h2>
        <form onSubmit={addWeek} className="flex flex-wrap items-end gap-3">
          <div>
            <Label>Week starting (Monday)</Label>
            <Input type="date" value={newWeek.week_of} onChange={(e) => setNewWeek({ ...newWeek, week_of: e.target.value })} className="mt-1" required />
          </div>
          <div className="flex-1 min-w-[240px]">
            <Label>Label</Label>
            <Input placeholder="e.g. Apr 27 – May 3, 2026" value={newWeek.label} onChange={(e) => setNewWeek({ ...newWeek, label: e.target.value })} className="mt-1" required />
          </div>
          <Button type="submit" className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Add week</Button>
        </form>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Label>Editing week:</Label>
        <Select value={selectedWeekId} onValueChange={setSelectedWeekId}>
          <SelectTrigger className="w-[280px] rounded-full"><SelectValue placeholder="Select a week" /></SelectTrigger>
          <SelectContent>
            {(weeks ?? []).map((w) => (
              <SelectItem key={w.id} value={w.id}>
                {w.label}{w.is_current ? " ★ current" : ""}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedWeekId && (
          <>
            <Button size="sm" variant="outline" className="rounded-full" onClick={() => setCurrent(selectedWeekId)}>
              <Star className="mr-2 h-4 w-4" /> Mark as current
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full text-destructive" onClick={() => deleteWeek(selectedWeekId)}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete week
            </Button>
          </>
        )}
      </div>

      {selectedWeekId && (
        <EntriesEditor weekId={selectedWeekId} entries={entries ?? []} />
      )}
    </div>
  );
};

const blankEntry = (weekId: string, member: string): Partial<ScorecardEntry> => ({
  week_id: weekId,
  member,
  hours_worked: 0,
  hours_scheduled: 40,
  qa_score: 40,
  qa_max: 40,
  ticket_target: 0,
  ticket_actual: 0,
  work_ethic_score: 10,
  work_ethic_max: 10,
  infractions: 0,
  overall_pct: 0,
});

const EntriesEditor = ({ weekId, entries }: { weekId: string; entries: ScorecardEntry[] }) => {
  const qc = useQueryClient();
  const [draft, setDraft] = useState<Partial<ScorecardEntry> | null>(null);

  const usedMembers = new Set(entries.map((e) => e.member));
  const availableMembers = TEAM_MEMBERS.filter((m) => !usedMembers.has(m));

  const startAdd = () => {
    const member = availableMembers[0] ?? "";
    setDraft(blankEntry(weekId, member));
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!draft?.member) return toast.error("Pick a member");
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const payload = {
      week_id: weekId,
      member: draft.member,
      hours_worked: Number(draft.hours_worked) || 0,
      hours_scheduled: Number(draft.hours_scheduled) || 0,
      qa_score: Number(draft.qa_score) || 0,
      qa_max: Number(draft.qa_max) || 40,
      ticket_target: Number(draft.ticket_target) || 0,
      ticket_actual: Number(draft.ticket_actual) || 0,
      work_ethic_score: Number(draft.work_ethic_score) || 0,
      work_ethic_max: Number(draft.work_ethic_max) || 10,
      infractions: Number(draft.infractions) || 0,
      overall_pct: Number(draft.overall_pct) || 0,
    };
    const { error } = await runAdminRequest(() =>
      draft.id
        ? supabase.from("scorecard_entries").update(payload).eq("id", draft.id)
        : supabase.from("scorecard_entries").insert(payload)
    );
    if (error) return toast.error(error.message);
    toast.success("Saved");
    setDraft(null);
    await qc.refetchQueries({ queryKey: ["scorecard_entries", weekId] });
    await qc.refetchQueries({ queryKey: ["scorecard_entries_all"] });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this entry?")) return;
    const sessionErr = await ensureSession();
    if (sessionErr) return toast.error(sessionErr);
    const { error } = await runAdminRequest(() => supabase.from("scorecard_entries").delete().eq("id", id));
    if (error) return toast.error(error.message);
    await qc.refetchQueries({ queryKey: ["scorecard_entries", weekId] });
    await qc.refetchQueries({ queryKey: ["scorecard_entries_all"] });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold">Team entries</h3>
        {!draft && availableMembers.length > 0 && (
          <Button onClick={startAdd} size="sm" className="rounded-full"><Plus className="mr-2 h-4 w-4" /> Add member</Button>
        )}
      </div>

      {draft && (
        <form onSubmit={save} className="rounded-3xl bg-card p-6 shadow-soft space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label>Member</Label>
              {draft.id ? (
                <Input value={draft.member} disabled className="mt-1" />
              ) : (
                <Select value={draft.member} onValueChange={(v) => setDraft({ ...draft, member: v })}>
                  <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {availableMembers.map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <NumField label="Overall %" v={draft.overall_pct} on={(n) => setDraft({ ...draft, overall_pct: n })} step="0.01" />
            <NumField label="Hours worked" v={draft.hours_worked} on={(n) => setDraft({ ...draft, hours_worked: n })} step="0.01" />
            <NumField label="Hours scheduled" v={draft.hours_scheduled} on={(n) => setDraft({ ...draft, hours_scheduled: n })} step="0.01" />
            <NumField label="QA score" v={draft.qa_score} on={(n) => setDraft({ ...draft, qa_score: n })} />
            <NumField label="QA max" v={draft.qa_max} on={(n) => setDraft({ ...draft, qa_max: n })} />
            <NumField label="Ticket target" v={draft.ticket_target} on={(n) => setDraft({ ...draft, ticket_target: n })} />
            <NumField label="Ticket actual" v={draft.ticket_actual} on={(n) => setDraft({ ...draft, ticket_actual: n })} />
            <NumField label="Work ethic score" v={draft.work_ethic_score} on={(n) => setDraft({ ...draft, work_ethic_score: n })} />
            <NumField label="Work ethic max" v={draft.work_ethic_max} on={(n) => setDraft({ ...draft, work_ethic_max: n })} />
            <NumField label="Infractions" v={draft.infractions} on={(n) => setDraft({ ...draft, infractions: n })} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="rounded-full"><Save className="mr-2 h-4 w-4" /> Save</Button>
            <Button type="button" variant="ghost" onClick={() => setDraft(null)} className="rounded-full"><X className="mr-2 h-4 w-4" /> Cancel</Button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-3xl bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="bg-muted text-xs uppercase text-muted-foreground">
            <tr>
              <th className="p-3 text-left">Member</th>
              <th className="p-3 text-right">Hours</th>
              <th className="p-3 text-right">QA</th>
              <th className="p-3 text-right">Tickets</th>
              <th className="p-3 text-right">Overall</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => (
              <tr key={e.id} className="border-t border-border">
                <td className="p-3 font-semibold">{e.member}</td>
                <td className="p-3 text-right">{e.hours_worked}/{e.hours_scheduled}</td>
                <td className="p-3 text-right">{e.qa_score}/{e.qa_max}</td>
                <td className="p-3 text-right">{e.ticket_actual}/{e.ticket_target}</td>
                <td className="p-3 text-right font-bold text-primary">{Number(e.overall_pct).toFixed(2)}%</td>
                <td className="p-3 text-right">
                  <Button size="icon" variant="ghost" onClick={() => setDraft(e)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => remove(e.id)}><Trash2 className="h-4 w-4" /></Button>
                </td>
              </tr>
            ))}
            {entries.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">No entries yet for this week.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const NumField = ({
  label, v, on, step = "1",
}: { label: string; v: number | undefined; on: (n: number) => void; step?: string }) => (
  <div>
    <Label>{label}</Label>
    <Input type="number" step={step} value={v ?? 0} onChange={(e) => on(Number(e.target.value))} className="mt-1" />
  </div>
);

export default Admin;
