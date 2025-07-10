import { getTranslations } from "next-intl/server";

import { SaksStatusResponse } from "../../generated/ssr/model";

import { VedtakUtfall } from "./VedtakUtfall";

export const VedtakUtfallInnvilget = async ({ sak }: { sak: SaksStatusResponse }) => {
    const t = await getTranslations("StatusVedtakInnvilget");
    return (
        <VedtakUtfall
            tittel={sak.tittel}
            beskrivelse={t("beskrivelse")}
            vedtaksfilUrlList={sak.vedtaksfilUrlList}
            utfallVedtak={sak.utfallVedtak}
            utfallVedtakStatus={t("tittel")}
        />
    );
};
