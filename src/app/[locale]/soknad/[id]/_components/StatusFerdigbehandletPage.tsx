import { getTranslations } from "next-intl/server";
import { Heading, Tag } from "@navikt/ds-react";

import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";
import { getTranslationKeyForUtfall, isVedtakUtfallKey } from "@components/vedtak/VedtakUtfallMap";
import { VedtakUtfall } from "@components/vedtak/VedtakUtfall";

import { StatusPage } from "./StatusPage";

interface Props {
    id: string;
}

export const StatusFerdigbehandletPage = async ({ id }: Props) => {
    const t = await getTranslations("StatusFerdigbehandletPage");
    const saker = await hentSaksStatuser(id);

    return (
        <StatusPage heading={t("tittel")} id={id}>
            {saker.map(async (sak, index) => {
                const key = sak.utfallVedtak;
                if (key && isVedtakUtfallKey(key)) {
                    const utfallKey = getTranslationKeyForUtfall(key);
                    const utfallTranslations = await getTranslations(utfallKey);
                    return (
                        <VedtakUtfall
                            key={index}
                            tittel={sak.tittel}
                            beskrivelse={utfallTranslations("beskrivelse")}
                            vedtaksfilUrlList={sak.vedtaksfilUrlList}
                            utfallVedtak={sak.utfallVedtak}
                            utfallVedtakStatus={utfallTranslations("tittel")}
                        />
                    );
                }

                if (sak.status === "UNDER_BEHANDLING") {
                    return (
                        <div key={index}>
                            <Heading size="xlarge" level="2">
                                {sak.tittel} asd
                            </Heading>
                            <Tag variant="info-moderate" key={index}>
                                {t("underBehandlingAlert")}
                            </Tag>
                        </div>
                    );
                }
                return null;
            })}
        </StatusPage>
    );
};
