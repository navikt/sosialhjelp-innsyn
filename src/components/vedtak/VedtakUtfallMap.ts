type VedtakUtfallKey = "INNVILGET" | "DELVIS_INNVILGET" | "AVSLATT" | "AVVIST";

export function isVedtakUtfallKey(value: string): value is VedtakUtfallKey {
    return ["INNVILGET", "DELVIS_INNVILGET", "AVSLATT", "AVVIST"].includes(value);
}

export const vedtakUtfallMap: Record<VedtakUtfallKey, string> = {
    INNVILGET: "StatusVedtakInnvilget",
    DELVIS_INNVILGET: "StatusVedtakDelvisInnvilget",
    AVSLATT: "StatusVedtakAvslag",
    AVVIST: "StatusVedtakAvvist",
};

export function getTranslationKeyForUtfall(key: VedtakUtfallKey): string {
    return vedtakUtfallMap[key] ?? "StatusVedtak";
}
