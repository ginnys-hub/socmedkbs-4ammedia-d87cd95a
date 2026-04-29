import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type AnnouncementCategory = "update" | "reminder" | "issue" | "resolved" | "important";

export type Announcement = {
  id: string;
  title: string;
  body: string;
  posted_on: string;
  category: AnnouncementCategory;
};

export type Macro = {
  id: string;
  brand: string;
  title: string;
  body: string;
  tags: string[];
};

export type ScorecardWeek = {
  id: string;
  week_of: string;
  label: string;
  is_current: boolean;
};

export type ScorecardEntry = {
  id: string;
  week_id: string;
  member: string;
  hours_worked: number;
  hours_scheduled: number;
  qa_score: number;
  qa_max: number;
  ticket_target: number;
  ticket_actual: number;
  work_ethic_score: number;
  work_ethic_max: number;
  infractions: number;
  overall_pct: number;
};

export const useAnnouncements = () =>
  useQuery({
    queryKey: ["announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("posted_on", { ascending: false });
      if (error) throw error;
      return data as Announcement[];
    },
  });

export const useMacros = () =>
  useQuery({
    queryKey: ["macros"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("macros")
        .select("*")
        .order("brand", { ascending: true })
        .order("title", { ascending: true });
      if (error) throw error;
      return data as Macro[];
    },
  });

export const useScorecardWeeks = () =>
  useQuery({
    queryKey: ["scorecard_weeks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scorecard_weeks")
        .select("*")
        .order("week_of", { ascending: false });
      if (error) throw error;
      return data as ScorecardWeek[];
    },
  });

export const useScorecardEntries = (weekId?: string) =>
  useQuery({
    queryKey: ["scorecard_entries", weekId],
    queryFn: async () => {
      if (!weekId) return [] as ScorecardEntry[];
      const { data, error } = await supabase
        .from("scorecard_entries")
        .select("*")
        .eq("week_id", weekId)
        .order("overall_pct", { ascending: false });
      if (error) throw error;
      return data as ScorecardEntry[];
    },
    enabled: !!weekId,
  });

// All entries across all weeks (for individual board history)
export const useAllScorecardEntries = () =>
  useQuery({
    queryKey: ["scorecard_entries_all"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scorecard_entries")
        .select("*");
      if (error) throw error;
      return data as ScorecardEntry[];
    },
  });
