"use client";

import { BodyShort, Heading, Tag, TagProps, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { SaksStatusResponseUtfallVedtak } from "@generated/model";

interface Props {
    tittel: string;
    vedtakUtfall?: SaksStatusResponseUtfallVedtak;
}

const utfallVariant: Record<SaksStatusResponseUtfallVedtak, TagProps["variant"]> = {
    INNVILGET: "success-moderate",
    DELVIS_INNVILGET: "warning-moderate",
    AVVIST: "error-moderate",
    AVSLATT: "error-moderate",
};

interface StatusTagProps {
    vedtakUtfall?: SaksStatusResponseUtfallVedtak;
    className?: string;
}

const StatusTag = ({ vedtakUtfall, className }: StatusTagProps) => {
    const t = useTranslations("StatusTag");

    if (vedtakUtfall) {
        return (
            <Tag variant={utfallVariant[vedtakUtfall]} className={className}>
                {t.rich(vedtakUtfall, { b: (chunks) => <BodyShort weight="semibold">{chunks}</BodyShort> })}
            </Tag>
        );
    }
    return (
        <Tag variant="info-moderate" className={className}>
            {t("UNDER_BEHANDLING")}
        </Tag>
    );
};

const KlageVedtakHeader = ({ tittel, vedtakUtfall }: Props) => {
    const t = useTranslations("KlageVedtakHeader");
    return (
        <VStack>
            <Heading size="large" level="2">
                {t.rich("tittel", {
                    sakstittel: tittel,
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            </Heading>
            <StatusTag vedtakUtfall={vedtakUtfall} className="self-start" />
        </VStack>
    );
};

export default KlageVedtakHeader;
