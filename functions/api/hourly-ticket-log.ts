const DEFAULT_SOURCE =
  "https://docs.google.com/spreadsheets/d/1BbofIj4dSH71dxM88GoYrQ3kf83CmlpWVRWJ2wb6xPQ/gviz/tq?tqx=out:csv&gid=556196617";

export async function onRequestGet({ env }: { env: { HOURLY_TICKET_CSV_URL?: string } }) {
  const headers = { "Cache-Control": "no-store", "Content-Type": "text/csv; charset=utf-8" };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 40000);

  try {
    const source = new URL(env.HOURLY_TICKET_CSV_URL || DEFAULT_SOURCE);
    source.searchParams.set("cachebust", String(Date.now()));
    const response = await fetch(source, { signal: controller.signal, cache: "no-store" });
    if (!response.ok) throw new Error(`Hourly ticket source returned ${response.status}`);

    const csv = await response.text();
    if (!csv.trim() || /<!doctype html|<html|ServiceLogin/i.test(csv)) {
      throw new Error("Hourly ticket source did not return CSV");
    }

    return new Response(csv, { headers });
  } catch {
    return new Response("Hourly ticket refresh is temporarily unavailable.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Content-Type": "text/plain" },
    });
  } finally {
    clearTimeout(timeout);
  }
}
