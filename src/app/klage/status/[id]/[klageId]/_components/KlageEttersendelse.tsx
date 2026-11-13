"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import OpplastingsboksContent from "@components/filopplasting/OpplastingsboksContent";
import { useDocumentState } from "@components/filopplasting/api/useDocumentState";
import useSendKlageEttersendelseTus from "@components/filopplasting/api/useSendKlageEttersendelseTus";
import { umamiCustomTrack } from "../../../../../umami";

interface Props {
    fiksDigisosId: string;
    klageId: string;
    contextId: string;
}

const KlageEttersendelse = ({ fiksDigisosId, klageId, contextId }: Props) => {
    const t = useTranslations("KlagePage.ettersendelse");
    const [navEksternRefId, setNavEksternRefId] = useState(() => crypto.randomUUID());
    const { state: docState, resetState, addUploads, removeUpload, hasFiles, canSubmit } = useDocumentState(contextId);
    const { upload, resetMutation, isPending, isUploadSuccess, error } = useSendKlageEttersendelseTus(
        fiksDigisosId,
        klageId,
        () => {
            resetState();
            setNavEksternRefId(crypto.randomUUID());
        },
        () =>
            umamiCustomTrack("opplasting fullført", {
                uploadVariant: "tus",
                dokumentKontekst: "klage-ettersendelse",
                digisosId: fiksDigisosId,
                antallDokumenter: docState.uploads?.length ?? 0,
            })
    );

    return (
        <OpplastingsboksContent
            fileSelectProps={{
                label: t("opplastingTittel"),
                description: t("opplastingBeskrivelse"),
                docState,
                contextId,
                target: { type: "klage", klageId, navEksternRefId },
                onSelect: (files) => {
                    if (!isPending) {
                        resetMutation();
                    }
                    umamiCustomTrack("opplasting startet", {
                        uploadVariant: "tus",
                        dokumentKontekst: "klage-ettersendelse",
                        digisosId: fiksDigisosId,
                        antallDokumenter: files.length,
                    });
                },
                onUploadsAdded: addUploads,
                onUploadRemoved: removeUpload,
                isPending,
            }}
            hasFiles={hasFiles}
            canSubmit={canSubmit}
            isUploadSuccess={isUploadSuccess}
            error={error}
            onSubmit={() => upload(docState.submissionId!)}
            resetMutation={resetMutation}
        />
    );
};

export default KlageEttersendelse;
