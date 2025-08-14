export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number];
export const EXPECTED_TOGGLES = [
    "sosialhjelp.innsyn.uxsignals_kort_soknad",
    "sosialhjelp.innsyn.ny_landingsside",
    "sosialhjelp.innsyn.ny_soknaderside",
    "sosialhjelp.innsyn.ny_soknadside",
    "sosialhjelp.innsyn.klage",
    "sosialhjelp.innsyn.ny_utbetalinger_side",
] as const;
