"use client";

import { BodyShort, FileUpload, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";
import { filesize } from "filesize";
import cx from "classnames";
import { LinkCard } from "@navikt/ds-react/LinkCard";
import React from "react";
import {
    FileCsvIcon,
    FileExcelIcon,
    FileIcon,
    FileImageIcon,
    FilePdfIcon,
    FileTextIcon,
    FileWordIcon,
} from "@navikt/aksel-icons";

import { UrlResponse, VedleggResponse } from "@generated/model";

export type SoknadFile = UrlResponse & { date?: string };

interface Props {
    vedlegg: VedleggResponse[];
}
const iconProps = {
    fontSize: "2rem",
    "aria-hidden": true,
};

// Copy-paste fra aksel sin ItemIcon komponent
// grunne er fordi det ikke er en direkte måte å bruke det
export const IkonBilde = (fil: VedleggResponse) => {
    const extension = fil.filnavn.substring(fil.filnavn.lastIndexOf(".") + 1);
    switch (extension) {
        case "jpg":
        case "jpeg":
        case "png":
        case "gif":
        case "webp":
            return <FileImageIcon {...iconProps} />;
        case "pdf":
            return <FilePdfIcon {...iconProps} />;
        case "txt":
            return <FileTextIcon {...iconProps} />;
        case "csv":
            return <FileCsvIcon {...iconProps} />;
        case "xls":
        case "xlsx":
            return <FileExcelIcon {...iconProps} />;
        case "doc":
        case "docx":
            return <FileWordIcon {...iconProps} />;
        default:
            return <FileIcon {...iconProps} />;
    }
};

const VedleggListe = ({ vedlegg }: Props) => {
    const t = useTranslations("VedleggListe");
    return (
        <VStack as="ul" gap="2">
            {vedlegg.map((fil) => (
                <>
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
                    <LinkCard key={`linkcard-${fil.filnavn}-${fil.datoLagtTil}`} className="w-full">
                        <LinkCard.Icon className={cx("navds-file-item__inner")}>{IkonBilde(fil)}</LinkCard.Icon>
                        <LinkCard.Title>
                            <LinkCard.Anchor href={fil.url}>{fil.filnavn}</LinkCard.Anchor>
                        </LinkCard.Title>
                        <LinkCard.Description>
                            <HStack gap="1">
                                <BodyShort>{filesize(fil.storrelse)},</BodyShort>
                                <BodyShort>
                                    {t.rich("lastetOpp", {
                                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                                        dato: new Date(fil.datoLagtTil),
                                    })}
                                </BodyShort>
                            </HStack>
                        </LinkCard.Description>
                    </LinkCard>
                </>
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
