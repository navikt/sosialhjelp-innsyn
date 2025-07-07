import { getTranslations } from "next-intl/server";

import { SaksStatusResponse } from "../../generated/ssr/model";

import { VedtakUtfall } from "./VedtakUtfall";

export const VedtakUtfallDelvisInnvilget = async ({ sak }: { sak: SaksStatusResponse }) => {
    const t = await getTranslations("StatusVedtakDelvisInnvilget");
    return (
        <VedtakUtfall tittel={sak.tittel} beskrivelse={t("beskrivelse")} utfallVedtak={sak.utfallVedtak}></VedtakUtfall>
    );
};
