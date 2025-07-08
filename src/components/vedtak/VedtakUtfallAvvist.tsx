import { getTranslations } from "next-intl/server";

import { SaksStatusResponse } from "../../generated/ssr/model";

import { VedtakUtfall } from "./VedtakUtfall";

export const VedtakUtfallAvvist = async ({ sak }: { sak: SaksStatusResponse }) => {
    const t = await getTranslations("StatusVedtakAvvist");
    return (
        <VedtakUtfall
            tittel={sak.tittel}
            beskrivelse={t("beskrivelse")}
            vedtaksfilUrlList={sak.vedtaksfilUrlList}
            utfallVedtak={sak.utfallVedtak}
        />
    );
};
