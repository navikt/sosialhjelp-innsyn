"use client";

import { Heading } from "@navikt/ds-react";
import { FileUploadItem } from "@navikt/ds-react/FileUpload";
import { useTranslations } from "next-intl";
import * as R from "remeda";
import { EttersendelseDto, VedleggResponse } from "@generated/model";
import ExpandableList from "@components/showmore/ExpandableList";

type Props = {
    klagePdf: VedleggResponse;
    opplastedeVedlegg: VedleggResponse[];
    ettersendelser: EttersendelseDto[];
};

const LABELLED_BY_ID = "klage-dokumenter-tittel";

const Dokumenter = ({ klagePdf, opplastedeVedlegg, ettersendelser }: Props) => {
    const t = useTranslations("KlageDokumenter");

    const vedlegg = R.sortBy(
        [...opplastedeVedlegg, ...ettersendelser.flatMap((ettersendelse) => ettersendelse.vedlegg)],
        [(v) => new Date(v.datoLagtTil).getTime(), "desc"]
    ).map((v) => ({ ...v, defaultTittel: t("ettersendelseDefaultTittel") }));

    const filer = klagePdf ? [...vedlegg, { ...klagePdf, defaultTittel: t("klagePdfDefaultTittel") }] : vedlegg;

    return (
        <div>
            <Heading size="medium" level="3" className="mb-4" id={LABELLED_BY_ID}>
                {t("tittel")}
            </Heading>
            <ExpandableList
                items={filer}
                id="klage-dokumenter-liste"
                itemsLimit={3}
                showMoreSuffix={t("visFlereDokumenter")}
                labelledById={LABELLED_BY_ID}
            >
                {(fil, ref) => (
                    <li key={fil.url} ref={ref} tabIndex={-1}>
                        <FileUploadItem
                            href={fil.url}
                            file={{
                                name: fil.filnavn?.length ? fil.filnavn : fil.defaultTittel,
                                size: fil.storrelse,
                            }}
                            className="w-full"
                        />
                    </li>
                )}
            </ExpandableList>
        </div>
    );
};

export default Dokumenter;
