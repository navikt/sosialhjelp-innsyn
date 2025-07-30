"use client";

import { FileUpload, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";

import { VedleggResponse } from "../../../generated/model";

interface Props {
    vedlegg: VedleggResponse[];
}

const VedleggListe = ({ vedlegg }: Props) => {
    const t = useTranslations("VedleggListe");
    return (
        <VStack as="ul" gap="2">
            {vedlegg.map((fil) => (
                <FileUpload.Item
                    as="li"
                    key={`${fil.filnavn}-${fil.datoLagtTil}`}
                    href={fil.url}
                    description={`${filesize(fil.storrelse)}, ${t("lastetOpp", { dato: new Date(fil.datoLagtTil) })}`}
                    file={{
                        name: fil.filnavn,
                        size: fil.storrelse,
                    }}
                    className="w-full"
                />
            ))}
        </VStack>
    );
};

export default VedleggListe;
