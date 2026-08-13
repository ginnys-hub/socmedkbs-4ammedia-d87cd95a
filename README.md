# 4AM Media Social Media KBS

Team knowledge base site for 4AM Media social media support workflows.

## Zendesk Macro Tree

The `/zendesk-macros` page includes a searchable Zendesk macro tree built from the provided `REF_Zendesk_Macros.xlsx` workbook. The existing `/macros` page remains the original macros page.

It includes:

- all 214 macro paths from the workbook
- category and subcategory tree browsing
- active-only filtering
- search by macro path or macro name
- detail panel showing the selected macro's exact Zendesk path

## Hourly Ticket Tracker

The `/hourly-tracker` page is a live dashboard for the "FB Open Tickets Log" sheet: open-ticket
counts by hour, compared against the historical average for that hour, with a correlation score
against the typical daily pattern.

It polls the CSV export of a small public mirror sheet (`src/lib/hourlyTicketLog.ts`,
`MIRROR_SHEET_ID`) that re-publishes just that one tab via `IMPORTRANGE` from the private source
spreadsheet, so the original sheet (with its other, non-public tabs) never has to be shared
publicly. If the mirror sheet's sharing ever gets reset to private, or the source tab is renamed,
the page will show a "Couldn't load the live tracker" message instead of data.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Cloudflare Pages

Use npm for installs and builds:

- Build command: `npm run build`
- Build output directory: `dist`
