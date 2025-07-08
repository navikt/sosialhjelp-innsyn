import { getTranslations } from "next-intl/server";

import { SaksStatusResponse } from "../../generated/ssr/model";

import { VedtakUtfall } from "./VedtakUtfall";

export const VedtakUtfallAvslag = async ({ sak }: { sak: SaksStatusResponse }) => {
    const t = await getTranslations("StatusVedtakAvslag");
    return (
        <VedtakUtfall
            tittel={sak.tittel}
            beskrivelse={t("beskrivelse")}
            vedtaksfilUrlList={sak.vedtaksfilUrlList}
            utfallVedtak={sak.utfallVedtak}
        />
    );
};
