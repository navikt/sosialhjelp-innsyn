export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number];
export const EXPECTED_TOGGLES = [
    "sosialhjelp.innsyn.ny_soknadside",
    "sosialhjelp.innsyn.klage",
    "sosialhjelp.innsyn.ny_upload",
] as const;
