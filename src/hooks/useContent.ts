import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LOCAL_SCORECARD_ENTRIES, LOCAL_SCORECARD_WEEKS } from "@/data/localScorecards";

/** Subscribe to realtime announcement changes and refresh the cache. */
export const useAnnouncementsRealtime = () => {
  const qc = useQueryClient();
  useEffect(() => {
    const channel = supabase
      .channel("announcements-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "announcements" },
        () => {
          qc.invalidateQueries({ queryKey: ["announcements"] });
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [qc]);
};

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

const sortWeeks = (weeks: ScorecardWeek[]) =>
  [...weeks].sort((a, b) => b.week_of.localeCompare(a.week_of));

const sortEntries = (entries: ScorecardEntry[]) =>
  [...entries].sort((a, b) => Number(b.overall_pct) - Number(a.overall_pct));

const mergeScorecardWeeks = (remoteWeeks: ScorecardWeek[] = []) => {
  const localWeekDates = new Set(LOCAL_SCORECARD_WEEKS.map((week) => week.week_of));
  const localHasCurrent = LOCAL_SCORECARD_WEEKS.some((week) => week.is_current);
  const remoteOnly = remoteWeeks
    .filter((week) => !localWeekDates.has(week.week_of))
    .map((week) => ({
      ...week,
      is_current: localHasCurrent ? false : week.is_current,
    }));

  return sortWeeks([...LOCAL_SCORECARD_WEEKS, ...remoteOnly]);
};

const mergeScorecardEntries = (
  remoteEntries: ScorecardEntry[] = [],
  localEntries: ScorecardEntry[] = LOCAL_SCORECARD_ENTRIES
) => {
  const localKeys = new Set(
    localEntries.map((entry) => `${entry.week_id}::${entry.member}`)
  );
  const remoteOnly = remoteEntries.filter(
    (entry) => !localKeys.has(`${entry.week_id}::${entry.member}`)
  );

  return sortEntries([...localEntries, ...remoteOnly]);
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
      try {
        const { data, error } = await supabase
          .from("scorecard_weeks")
          .select("*")
          .order("week_of", { ascending: false });
        if (error) throw error;
        return mergeScorecardWeeks(data as ScorecardWeek[]);
      } catch (error) {
        if (LOCAL_SCORECARD_WEEKS.length > 0) return mergeScorecardWeeks();
        throw error;
      }
    },
  });

export const useScorecardEntries = (weekId?: string) =>
  useQuery({
    queryKey: ["scorecard_entries", weekId],
    queryFn: async () => {
      if (!weekId) return [] as ScorecardEntry[];
      const localForWeek = LOCAL_SCORECARD_ENTRIES.filter(
        (entry) => entry.week_id === weekId
      );

      try {
        const { data, error } = await supabase
          .from("scorecard_entries")
          .select("*")
          .eq("week_id", weekId)
          .order("overall_pct", { ascending: false });
        if (error) throw error;
        return mergeScorecardEntries(data as ScorecardEntry[], localForWeek);
      } catch (error) {
        if (localForWeek.length > 0) return sortEntries(localForWeek);
        throw error;
      }
    },
    enabled: !!weekId,
  });

// All entries across all weeks (for individual board history)
export const useAllScorecardEntries = () =>
  useQuery({
    queryKey: ["scorecard_entries_all"],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from("scorecard_entries")
          .select("*");
        if (error) throw error;
        return mergeScorecardEntries(data as ScorecardEntry[]);
      } catch (error) {
        if (LOCAL_SCORECARD_ENTRIES.length > 0) return sortEntries(LOCAL_SCORECARD_ENTRIES);
        throw error;
      }
    },
  });
