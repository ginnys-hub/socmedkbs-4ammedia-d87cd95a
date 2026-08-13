import { describe, expect, it } from "vitest";
import {
  computeForecast,
  computeHourlyStats,
  computeWeekdayHourHeatmap,
  dateKey,
  parseCsv,
  parseTicketLogCsv,
  pearsonCorrelation,
} from "./hourlyTicketLog";

// Real column snapshots pulled from the "FB Open Tickets Log" tab (Aug 8-12, 2026),
// with hour 3/4/22/23 left blank on some days the way the sheet actually does.
const RAW_HOUR_ROWS: (number | "")[][] = [
  [0.0, 0.0, 0.0, 1.0, 0.0], // 0:00
  [0.0, 10.0, 10.0, 2.0, 7.0], // 1:00
  [0.0, 13.0, 10.0, 2.0, 9.0], // 2:00
  [1.0, 0.0, 0.0, 0.0, ""], // 3:00
  [0.0, 0.0, 0.0, "", ""], // 4:00
  [0.0, 2.0, 0.0, 0.0, 0.0], // 5:00
  [0.0, 2.0, 2.0, 0.0, 0.0], // 6:00
  [4.0, 2.0, 1.0, 2.0, 0.0], // 7:00
  ["", 3.0, 5.0, 0.0, 4.0], // 8:00
  ["", 4.0, 0.0, 2.0, 4.0], // 9:00
  ["", 1.0, 1.0, 3.0, 1.0], // 10:00
  ["", 5.0, 7.0, 13.0, 13.0], // 11:00
  ["", 5.0, 17.0, 11.0, 10.0], // 12:00
  [2.0, 10.0, 10.0, 8.0, 5.0], // 13:00
  [2.0, 7.0, 1.0, 1.0, 3.0], // 14:00
  [0.0, 0.0, 2.0, 0.0, 3.0], // 15:00
  [5.0, 3.0, 4.0, 0.0, 5.0], // 16:00
  [9.0, 0.0, 1.0, 1.0, 4.0], // 17:00
  [5.0, 4.0, 0.0, 0.0, 0.0], // 18:00
  [2.0, 0.0, 0.0, 0.0, 0.0], // 19:00
  [0.0, 0.0, 0.0, 2.0, 4.0], // 20:00
  [0.0, 2.0, 1.0, 1.0, 0.0], // 21:00
  [2.0, 2.0, 0.0, 1.0, ""], // 22:00
  [5.0, 5.0, 0.0, 3.0, ""], // 23:00
];

const DATE_SERIALS = [46242, 46243, 46244, 46245, 46246]; // Aug 8-12, 2026
const HOUR_SERIALS = Array.from({ length: 24 }, (_, h) => h / 24);
const HOUR_LABELS = Array.from(
  { length: 24 },
  (_, h) => `${h}:00`
);

const buildCsv = (dateCells: (string | number)[], hourCells: (string | number)[]) => {
  const lines = [
    "",
    "Number of open tickets,,,,,",
    ",Date,,,,",
    `,${dateCells.join(",")}`,
    ...RAW_HOUR_ROWS.map((row, i) => `${hourCells[i]},${row.join(",")}`),
  ];
  return lines.join("\n");
};

describe("parseCsv", () => {
  it("handles quoted fields with embedded commas and quotes", () => {
    const rows = parseCsv('a,"b, c","d ""quoted"""\n1,2,3\n');
    expect(rows[0]).toEqual(["a", "b, c", 'd "quoted"']);
    expect(rows[1]).toEqual(["1", "2", "3"]);
  });
});

describe("parseTicketLogCsv", () => {
  it("parses raw Sheets serial numbers (the IMPORTRANGE case, no formatting carried over)", () => {
    const csv = buildCsv(DATE_SERIALS, HOUR_SERIALS);
    const { dates, matrix } = parseTicketLogCsv(csv);

    expect(dates.map(dateKey)).toEqual([
      "2026-08-08",
      "2026-08-09",
      "2026-08-10",
      "2026-08-11",
      "2026-08-12",
    ]);
    expect(matrix[0]).toEqual([0, 0, 0, 1, 0]); // hour 0 row
    expect(matrix[3][4]).toBeNull(); // hour 3, Aug 12 -> blank cell
    expect(matrix[21][4]).toBe(0); // hour 21, Aug 12 -> logged zero, not blank
  });

  it("parses formatted date/time strings just as well", () => {
    const csv = buildCsv(
      ["8/8/2026", "8/9/2026", "8/10/2026", "8/11/2026", "8/12/2026"],
      HOUR_LABELS
    );
    const { dates, matrix } = parseTicketLogCsv(csv);

    expect(dates.map(dateKey)).toEqual([
      "2026-08-08",
      "2026-08-09",
      "2026-08-10",
      "2026-08-11",
      "2026-08-12",
    ]);
    expect(matrix[0]).toEqual([0, 0, 0, 1, 0]);
    expect(matrix[21][4]).toBe(0);
  });
});

describe("computeHourlyStats", () => {
  it("treats the last date column with any data as today, keeps zeros distinct from unlogged hours, and correlates against history", () => {
    const csv = buildCsv(DATE_SERIALS, HOUR_SERIALS);
    const data = parseTicketLogCsv(csv);
    const stats = computeHourlyStats(data, 28);

    expect(stats.todayDate && dateKey(stats.todayDate)).toBe("2026-08-12");
    expect(stats.daysInAverage).toBe(4); // Aug 8-11
    expect(stats.latestHour).toBe(21); // last non-null hour on Aug 12
    expect(stats.latestCount).toBe(0);
    expect(stats.today[3]).toBeNull(); // unlogged hour stays null
    expect(stats.today[22]).toBeNull();
    expect(stats.correlation).not.toBeNull();
    expect(stats.correlation as number).toBeGreaterThan(-1);
    expect(stats.correlation as number).toBeLessThanOrEqual(1);
  });
});

describe("pearsonCorrelation", () => {
  it("is 1 for perfectly correlated series and null for constant input", () => {
    expect(pearsonCorrelation([1, 2, 3], [2, 4, 6])).toBeCloseTo(1);
    expect(pearsonCorrelation([5, 5, 5], [1, 2, 3])).toBeNull();
  });
});

describe("computeForecast", () => {
  it("fills unlogged hours with the average scaled by today's pace, and totals the full day", () => {
    const csv = buildCsv(DATE_SERIALS, HOUR_SERIALS);
    const stats = computeHourlyStats(parseTicketLogCsv(csv), 28);
    const forecast = computeForecast(stats);

    expect(forecast.paceRatio).not.toBeNull();
    // Every hour is either a real value or a projection, so the day is fully known.
    expect(forecast.byHour.every((v) => v !== null)).toBe(true);
    expect(forecast.projectedTotal).not.toBeNull();
    // Hours already logged today keep their real value, not a projection.
    stats.today.forEach((v, hour) => {
      if (v !== null) expect(forecast.byHour[hour]).toBe(v);
    });
  });

  it("returns nulls when there's no historical average to project from", () => {
    const forecast = computeForecast({
      todayDate: new Date(),
      today: Array(24).fill(null),
      historicalAverage: Array(24).fill(null),
      historicalMin: Array(24).fill(null),
      historicalMax: Array(24).fill(null),
      daysInAverage: 0,
      correlation: null,
      latestHour: null,
      latestCount: null,
    });
    expect(forecast.paceRatio).toBeNull();
    expect(forecast.projectedTotal).toBeNull();
  });
});

describe("computeWeekdayHourHeatmap", () => {
  it("buckets historical (non-today) hours into 4-hour blocks by weekday", () => {
    const csv = buildCsv(DATE_SERIALS, HOUR_SERIALS);
    const heatmap = computeWeekdayHourHeatmap(parseTicketLogCsv(csv), 28);

    expect(heatmap.rowLabels).toHaveLength(6);
    expect(heatmap.colLabels).toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
    // Aug 8, 2026 is a Saturday; hour 0 (0.0) went into the first 4-hour block.
    const satCol = heatmap.colLabels.indexOf("Sat");
    expect(heatmap.values[0][satCol]).not.toBeNull();
    // Today (Aug 12) is excluded from the heatmap.
    const wedCol = heatmap.colLabels.indexOf("Wed");
    expect(heatmap.values.some((row) => row[wedCol] !== null)).toBe(false);
  });
});
