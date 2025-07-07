import { SaksStatusResponse } from "../../generated/ssr/model";

import { VedtakUtfallInnvilget } from "./VedtakUtfallInnvilget";
import { VedtakUtfallDelvisInnvilget } from "./VedtakUtfallDelvisInnvilget";
import { VedtakUtfallAvslag } from "./VedtakUtfallAvslag";
import { VedtakUtfallAvvist } from "./VedtakUtfallAvvist";

type VedtakUtfallKey = "INNVILGET" | "DELVIS_INNVILGET" | "AVSLATT" | "AVVIST";

export function isVedtakUtfallKey(value: string): value is VedtakUtfallKey {
    return ["INNVILGET", "DELVIS_INNVILGET", "AVSLATT", "AVVIST"].includes(value);
}

export const vedtakUtfallMap: Record<VedtakUtfallKey, React.FC<{ sak: SaksStatusResponse }>> = {
    INNVILGET: VedtakUtfallInnvilget,
    DELVIS_INNVILGET: VedtakUtfallDelvisInnvilget,
    AVSLATT: VedtakUtfallAvslag,
    AVVIST: VedtakUtfallAvvist,
};
