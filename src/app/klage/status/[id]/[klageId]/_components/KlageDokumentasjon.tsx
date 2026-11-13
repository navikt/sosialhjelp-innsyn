import { getTranslations } from "next-intl/server";
import { randomUUID } from "node:crypto";
import { EttersendelseDto, VedleggResponse } from "@generated/model";
import FilopplastingSection from "@components/filopplasting/FilopplastingSection";
import { erEttersendelsesfristUtlopt } from "@utils/klageFrist";

import KlageEttersendelse from "./KlageEttersendelse";
import { InlineMessage } from "@navikt/ds-react";

interface Props {
    fiksDigisosId: string;
    klageId: string;
    klagePdf: VedleggResponse;
    opplastedeVedlegg: VedleggResponse[];
    ettersendelser: EttersendelseDto[];
    timestampSendt: number;
}

const KlageDokumentasjon = async ({
    fiksDigisosId,
    klageId,
    klagePdf,
    opplastedeVedlegg,
    ettersendelser,
    timestampSendt,
}: Props) => {
    const t = await getTranslations("KlageDokumenter");
    const fristUtlopt = erEttersendelsesfristUtlopt(timestampSendt);
    const vedlegg = [...opplastedeVedlegg, ...ettersendelser.flatMap((ettersendelse) => ettersendelse.vedlegg)].map(
        (fil) => ({ ...fil, filnavn: fil.filnavn || t("ettersendelseDefaultTittel") })
    );

    return (
        <FilopplastingSection
            upload={
                !fristUtlopt ? (
                    <KlageEttersendelse fiksDigisosId={fiksDigisosId} klageId={klageId} contextId={randomUUID()} />
                ) : (
                    <InlineMessage status="info">{t("fristUtlopt")}</InlineMessage>
                )
            }
            hideReadMore={fristUtlopt}
            vedlegg={vedlegg}
            visType={false}
            originalSoknad={{
                url: klagePdf.url,
                filename: klagePdf.filnavn || t("klagePdfDefaultTittel"),
                date: klagePdf.datoLagtTil,
                size: klagePdf.storrelse,
                skjult: false,
            }}
        />
    );
};

export default KlageDokumentasjon;
