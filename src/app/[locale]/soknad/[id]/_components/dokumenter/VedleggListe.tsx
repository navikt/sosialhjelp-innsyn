"use client";

import { FileUpload, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";

import { OriginalSoknadDto, UrlResponse, VedleggResponse } from "@generated/model";

export type SoknadFile = UrlResponse & { date?: string };

interface Props {
    vedlegg: VedleggResponse[];
    originalSoknad?: OriginalSoknadDto;
}

const VedleggListe = ({ vedlegg, originalSoknad }: Props) => {
    const t = useTranslations("VedleggListe");
    return (
        <VStack as="ul" gap="2">
            {originalSoknad && (
                <FileUpload.Item
                    as="li"
                    href={originalSoknad.url}
                    description={
                        originalSoknad.date
                            ? `${t("sendt", {
                                  dato: new Date(originalSoknad.date),
                              })}`
                            : undefined
                    }
                    file={{
                        name: originalSoknad.filename?.length ? originalSoknad.filename : t("soknadFilename"),
                        size: originalSoknad.size,
                    }}
                    className="w-full"
                />
            )}
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

export const VedleggListeSkeleton = () => (
    <VStack as="ul" gap="2" className="navds-file-item__inner">
        <HStack as="li" align="center" gap="2">
            <Skeleton variant="circle" height="48px" width="48px" />
            <VStack justify="center" gap="2">
                <Skeleton variant="rectangle" width="200px" />
                <Skeleton variant="rectangle" width="50px" />
            </VStack>
        </HStack>
    </VStack>
);

export default VedleggListe;
