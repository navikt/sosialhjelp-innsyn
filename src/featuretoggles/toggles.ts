export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number];
export const EXPECTED_TOGGLES = [
    "sosialhjelp.innsyn.klage_enabled",
    "sosialhjelp.innsyn.uxsignals_kort_soknad",
    "sosialhjelp.innsyn.ny_landingsside",
] as const;
