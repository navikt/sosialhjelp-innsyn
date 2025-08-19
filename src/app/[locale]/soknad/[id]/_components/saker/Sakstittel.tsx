import { BodyShort, Heading, Tag, TagProps } from "@navikt/ds-react";
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

const Sakstittel = ({ tittel, vedtakUtfall }: Props) => {
    const t = useTranslations("Sakstittel");
    return (
        <>
            <Heading size="large" level="2">
                {t.rich("tittel", {
                    sakstittel: tittel,
                    norsk: (chunks) => <span lang="no">{chunks}</span>,
                })}
            </Heading>
            <StatusTag vedtakUtfall={vedtakUtfall} className="self-start" />
        </>
    );
};

export default Sakstittel;
