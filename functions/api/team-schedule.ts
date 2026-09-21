const DEFAULT_SOURCE = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQrmKfzOfp3LBKpQN6mXbTyTxhyTA-AnWN30ipie7WfaPmqxdfq4UmKyI32Hc9gUqpfHPtz7QZmpGWF/pub?gid=1893211963&single=true&output=csv";

export async function onRequestGet({ env }: { env: { SCHEDULE_CSV_URL?: string } }) {
  const headers = { "Cache-Control": "no-store", "Content-Type": "text/csv; charset=utf-8" };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);
  try {
    const source = new URL(env.SCHEDULE_CSV_URL || DEFAULT_SOURCE);
    source.searchParams.set("cachebust", String(Date.now()));
    const response = await fetch(source, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`Schedule source returned ${response.status}`);
    const csv = await response.text();
    if (!csv.trim() || /<!doctype html|<html|ServiceLogin/i.test(csv)) {
      throw new Error("Schedule source did not return CSV");
    }
    return new Response(csv, { headers });
  } catch {
    return new Response("Schedule refresh is temporarily unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
