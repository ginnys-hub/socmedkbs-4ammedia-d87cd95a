// Live "FB Open Tickets Log" tracker.
//
// The source spreadsheet is a private, manually-updated internal sheet, so it
// can't be polled directly from a public site. Instead, a small mirror sheet
// (owned by the team, shared "Anyone with the link can view") re-publishes
// just the "FB Open Tickets Log" tab via an IMPORTRANGE formula, refreshed by
// Google Sheets on its own cadence. We poll that mirror's CSV export here.
//
// Uses the `gviz/tq` endpoint rather than `/export?format=csv`: the gviz
// endpoint is part of the Google Visualization API and is built for exactly
// this (embedding a public sheet's data into another site), so it sends
// permissive CORS headers. `/export` is meant for direct browser downloads
// and isn't reliably fetchable cross-origin from client-side JS.
export const MIRROR_SHEET_ID = "1BbofIj4dSH71dxM88GoYrQ3kf83CmlpWVRWJ2wb6xPQ";
// The mirror's single tab did NOT end up as gid 0 (Sheets assigned it its own
// gid when the file was created) - this must match the tab's real gid or the
// gviz endpoint silently fails to find matching data.
export const MIRROR_SHEET_GID = "556196617";
export const MIRROR_CSV_URL = `https://docs.google.com/spreadsheets/d/${MIRROR_SHEET_ID}/gviz/tq?tqx=out:csv&gid=${MIRROR_SHEET_GID}`;
export const SOURCE_SHEET_URL =
  "https://docs.google.com/spreadsheets/d/1jf_h7l-yP8GXHOv_v9OyNPh3jMGAQLraldAk-qPIgzQ/edit?gid=294927594#gid=294927594";

export const HOURS_PER_DAY = 24;

export type TicketLogData = {
  /** One entry per date column found in the sheet, in sheet order. */
  dates: Date[];
  /** matrix[hour][dateIndex] = open ticket count logged for that hour, or null if not logged. */
  matrix: (number | null)[][];
};

/** Minimal RFC4180-ish CSV parser: handles quoted fields, escaped quotes, and commas inside quotes. */
export const parseCsv = (text: string): string[][] => {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char === "\r") {
      // skip; \n handles the line break
    } else {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
};

// Google Sheets/Excel serial dates count days since 1899-12-30 (UTC).
const SHEETS_EPOCH_MS = Date.UTC(1899, 11, 30);
const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Parses a date-column header cell. Handles both a formatted date string and a raw Sheets serial number. */
const parseDateCell = (raw: string): Date | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber) && asNumber > 1000) {
    return new Date(SHEETS_EPOCH_MS + Math.round(asNumber) * MS_PER_DAY);
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

/** Parses an hour-of-day row label cell (e.g. "0:00", "13:00", or a Sheets time-of-day fraction). */
const parseHourCell = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const colonMatch = trimmed.match(/^(\d{1,2}):(\d{2})/);
  if (colonMatch) {
    const hour = Number(colonMatch[1]);
    return hour >= 0 && hour < HOURS_PER_DAY ? hour : null;
  }

  const asNumber = Number(trimmed);
  if (Number.isFinite(asNumber)) {
    if (asNumber >= 0 && asNumber < 1) {
      return Math.round(asNumber * HOURS_PER_DAY) % HOURS_PER_DAY;
    }
    if (asNumber >= 0 && asNumber < HOURS_PER_DAY) {
      return Math.round(asNumber);
    }
  }

  return null;
};

const parseCountCell = (raw: string): number | null => {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : null;
};

/** Turns the raw CSV grid into a dates[] + matrix[hour][dateIndex] shape, per the sheet's known layout. */
export const parseTicketLogCsv = (csvText: string): TicketLogData => {
  const rows = parseCsv(csvText);

  const dateRowIndex = rows.findIndex((row) => row[1]?.trim() === "Date");
  if (dateRowIndex === -1 || !rows[dateRowIndex + 1]) {
    return { dates: [], matrix: Array.from({ length: HOURS_PER_DAY }, () => []) };
  }

  const dateRow = rows[dateRowIndex + 1];
  const dateColumns: { colIndex: number; date: Date }[] = [];
  for (let col = 1; col < dateRow.length; col += 1) {
    const date = parseDateCell(dateRow[col] ?? "");
    if (date) dateColumns.push({ colIndex: col, date });
  }

  const matrix: (number | null)[][] = Array.from({ length: HOURS_PER_DAY }, () => []);
  const hourRows = rows.slice(dateRowIndex + 2, dateRowIndex + 2 + HOURS_PER_DAY);

  hourRows.forEach((hourRow) => {
    const hour = parseHourCell(hourRow[0] ?? "");
    if (hour === null) return;
    matrix[hour] = dateColumns.map(({ colIndex }) => parseCountCell(hourRow[colIndex] ?? ""));
  });

  return { dates: dateColumns.map((d) => d.date), matrix };
};

export const fetchTicketLog = async (): Promise<TicketLogData> => {
  const response = await fetch(`${MIRROR_CSV_URL}&cachebust=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Failed to load live ticket log (HTTP ${response.status})`);
  }
  const csvText = await response.text();
  return parseTicketLogCsv(csvText);
};

/** UTC calendar-day key so we're comparing the sheet's date-only columns consistently regardless of viewer timezone. */
export const dateKey = (d: Date): string =>
  `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;

export const formatDateLabel = (d: Date): string =>
  new Intl.DateTimeFormat("en", { weekday: "short", month: "short", day: "numeric" }).format(d);

export const formatHourLabel = (hour: number): string => {
  const period = hour < 12 ? "AM" : "PM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour} ${period}`;
};

export type HourlyStats = {
  /** The date this "today" series represents (most recent date column with any logged data). */
  todayDate: Date | null;
  /** Open ticket count per hour today; null for hours not yet logged. */
  today: (number | null)[];
  /** Average open ticket count per hour across the lookback window (excluding today). */
  historicalAverage: (number | null)[];
  /** Lowest logged count per hour across the lookback window. */
  historicalMin: (number | null)[];
  /** Highest logged count per hour across the lookback window. */
  historicalMax: (number | null)[];
  /** Number of prior days actually averaged into historicalAverage. */
  daysInAverage: number;
  /** Pearson correlation between today's logged hours and the historical average for those same hours. */
  correlation: number | null;
  /** Latest logged hour today, if any. */
  latestHour: number | null;
  /** Open ticket count at the latest logged hour today. */
  latestCount: number | null;
};

const mean = (values: number[]) => values.reduce((sum, v) => sum + v, 0) / values.length;

export const pearsonCorrelation = (a: number[], b: number[]): number | null => {
  if (a.length < 2 || a.length !== b.length) return null;
  const meanA = mean(a);
  const meanB = mean(b);
  let numerator = 0;
  let denomA = 0;
  let denomB = 0;
  for (let i = 0; i < a.length; i += 1) {
    const da = a[i] - meanA;
    const db = b[i] - meanB;
    numerator += da * db;
    denomA += da * da;
    denomB += db * db;
  }
  const denom = Math.sqrt(denomA * denomB);
  return denom === 0 ? null : numerator / denom;
};

export const computeHourlyStats = (data: TicketLogData, lookbackDays = 28): HourlyStats => {
  const { dates, matrix } = data;

  if (dates.length === 0) {
    return {
      todayDate: null,
      today: Array(HOURS_PER_DAY).fill(null),
      historicalAverage: Array(HOURS_PER_DAY).fill(null),
      historicalMin: Array(HOURS_PER_DAY).fill(null),
      historicalMax: Array(HOURS_PER_DAY).fill(null),
      daysInAverage: 0,
      correlation: null,
      latestHour: null,
      latestCount: null,
    };
  }

  // Most recent date column that has at least one logged hour is treated as "today".
  let todayIndex = -1;
  for (let i = dates.length - 1; i >= 0; i -= 1) {
    if (matrix.some((hourRow) => hourRow[i] !== null && hourRow[i] !== undefined)) {
      todayIndex = i;
      break;
    }
  }

  if (todayIndex === -1) {
    return {
      todayDate: null,
      today: Array(HOURS_PER_DAY).fill(null),
      historicalAverage: Array(HOURS_PER_DAY).fill(null),
      historicalMin: Array(HOURS_PER_DAY).fill(null),
      historicalMax: Array(HOURS_PER_DAY).fill(null),
      daysInAverage: 0,
      correlation: null,
      latestHour: null,
      latestCount: null,
    };
  }

  const todayDate = dates[todayIndex];
  const today = matrix.map((hourRow) => hourRow[todayIndex] ?? null);

  const lookbackStart = Math.max(0, todayIndex - lookbackDays);
  const historyIndices: number[] = [];
  for (let i = lookbackStart; i < todayIndex; i += 1) historyIndices.push(i);

  const historicalAverage: (number | null)[] = Array(HOURS_PER_DAY).fill(null);
  const historicalMin: (number | null)[] = Array(HOURS_PER_DAY).fill(null);
  const historicalMax: (number | null)[] = Array(HOURS_PER_DAY).fill(null);
  for (let hour = 0; hour < HOURS_PER_DAY; hour += 1) {
    const values = historyIndices
      .map((i) => matrix[hour][i])
      .filter((v): v is number => v !== null && v !== undefined);
    historicalAverage[hour] = values.length > 0 ? mean(values) : null;
    historicalMin[hour] = values.length > 0 ? Math.min(...values) : null;
    historicalMax[hour] = values.length > 0 ? Math.max(...values) : null;
  }

  const loggedHours: number[] = [];
  today.forEach((v, hour) => {
    if (v !== null && historicalAverage[hour] !== null) loggedHours.push(hour);
  });

  const correlation =
    loggedHours.length >= 3
      ? pearsonCorrelation(
          loggedHours.map((h) => today[h] as number),
          loggedHours.map((h) => historicalAverage[h] as number)
        )
      : null;

  let latestHour: number | null = null;
  let latestCount: number | null = null;
  for (let hour = HOURS_PER_DAY - 1; hour >= 0; hour -= 1) {
    if (today[hour] !== null) {
      latestHour = hour;
      latestCount = today[hour];
      break;
    }
  }

  return {
    todayDate,
    today,
    historicalAverage,
    historicalMin,
    historicalMax,
    daysInAverage: historyIndices.length,
    correlation,
    latestHour,
    latestCount,
  };
};

export type ForecastResult = {
  /** How today's logged-so-far pace compares to the historical pace over the same hours (1 = right on typical). */
  paceRatio: number | null;
  /** Projected count per hour: the actual logged value where known, else average scaled by paceRatio. */
  byHour: (number | null)[];
  /** Sum of the projected day, once every hour has either a real value or a projection. */
  projectedTotal: number | null;
};

/** A simple pace-adjusted seasonal forecast: scale the historical average curve by how today has tracked so far. */
export const computeForecast = (stats: HourlyStats): ForecastResult => {
  const elapsed = stats.today
    .map((v, hour) => ({ hour, v, avg: stats.historicalAverage[hour] }))
    .filter((e): e is { hour: number; v: number; avg: number } => e.v !== null && e.avg !== null);

  const elapsedTodaySum = elapsed.reduce((sum, e) => sum + e.v, 0);
  const elapsedAvgSum = elapsed.reduce((sum, e) => sum + e.avg, 0);
  const paceRatio = elapsed.length > 0 && elapsedAvgSum > 0 ? elapsedTodaySum / elapsedAvgSum : null;

  const byHour = stats.today.map((v, hour) => {
    if (v !== null) return v;
    const avg = stats.historicalAverage[hour];
    if (avg === null) return null;
    return paceRatio !== null ? avg * paceRatio : avg;
  });

  const known = byHour.filter((v): v is number => v !== null);
  const projectedTotal = known.length === HOURS_PER_DAY ? known.reduce((sum, v) => sum + v, 0) : null;

  return { paceRatio, byHour, projectedTotal };
};

export type Heatmap = {
  /** 4-hour block labels, e.g. "12–4 AM". */
  rowLabels: string[];
  /** Weekday labels, Sunday first. */
  colLabels: string[];
  /** values[row][col] = average open ticket count for that block/weekday across the lookback window. */
  values: (number | null)[][];
};

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const BLOCK_SIZE = 4;
const BLOCK_ROW_LABELS = Array.from({ length: HOURS_PER_DAY / BLOCK_SIZE }, (_, i) => {
  const start = i * BLOCK_SIZE;
  const end = start + BLOCK_SIZE;
  return `${formatHourLabel(start).replace(" ", "")}–${formatHourLabel(end % HOURS_PER_DAY).replace(" ", "")}`;
});

/** Average open-ticket count by (4-hour block × weekday) over the lookback window, for spotting the typical pattern. */
export const computeWeekdayHourHeatmap = (data: TicketLogData, lookbackDays = 84): Heatmap => {
  const { dates, matrix } = data;
  const cutoff = dates.length - 1 - lookbackDays;
  const buckets: number[][][] = Array.from({ length: BLOCK_ROW_LABELS.length }, () =>
    Array.from({ length: 7 }, () => [])
  );

  dates.forEach((date, dateIndex) => {
    if (dateIndex >= dates.length - 1) return; // exclude today (still in progress)
    if (dateIndex < Math.max(0, cutoff)) return;
    const weekday = date.getUTCDay();
    for (let hour = 0; hour < HOURS_PER_DAY; hour += 1) {
      const value = matrix[hour][dateIndex];
      if (value === null || value === undefined) continue;
      buckets[Math.floor(hour / BLOCK_SIZE)][weekday].push(value);
    }
  });

  const values = buckets.map((row) => row.map((cell) => (cell.length > 0 ? mean(cell) : null)));

  return { rowLabels: BLOCK_ROW_LABELS, colLabels: WEEKDAY_LABELS, values };
};
