import { getTranslations } from "next-intl/server";
import { randomUUID } from "node:crypto";
import { EttersendelseDto, VedleggResponse } from "@generated/model";
import FilopplastingSection from "@components/filopplasting/FilopplastingSection";

import KlageEttersendelse from "./KlageEttersendelse";

interface Props {
    fiksDigisosId: string;
    klageId: string;
    klagePdf: VedleggResponse;
    opplastedeVedlegg: VedleggResponse[];
    ettersendelser: EttersendelseDto[];
}

const KlageDokumentasjon = async ({ fiksDigisosId, klageId, klagePdf, opplastedeVedlegg, ettersendelser }: Props) => {
    const t = await getTranslations("KlageDokumenter");
    const vedlegg = [...opplastedeVedlegg, ...ettersendelser.flatMap((ettersendelse) => ettersendelse.vedlegg)].map(
        (fil) => ({ ...fil, filnavn: fil.filnavn || t("ettersendelseDefaultTittel") })
    );

    return (
        <FilopplastingSection
            upload={<KlageEttersendelse fiksDigisosId={fiksDigisosId} klageId={klageId} contextId={randomUUID()} />}
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
