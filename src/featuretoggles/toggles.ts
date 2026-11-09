export type ExpectedToggles = (typeof EXPECTED_TOGGLES)[number];
export const EXPECTED_TOGGLES = [
    "sosialhjelp.innsyn.klage",
    "sosialhjelp.innsyn.direkte-opplasting-pilot",
    "sosialhjelp.innsyn.direkte-ettersendelse",
] as const;
