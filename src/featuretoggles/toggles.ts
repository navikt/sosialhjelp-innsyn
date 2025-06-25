export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number];
export const EXPECTED_TOGGLES = [
    "sosialhjelp.innsyn.klage_enabled", // Toggle som hører til en gammel klage-POC som mest sannsynlig skal slettes
    "sosialhjelp.innsyn.uxsignals_kort_soknad",
    "sosialhjelp.innsyn.ny_landingsside",
    "sosialhjelp.innsyn.ny_soknaderside",
    "sosialhjelp.innsyn.ny_soknadside",
    "sosialhjelp.innsyn.klage",
] as const;
