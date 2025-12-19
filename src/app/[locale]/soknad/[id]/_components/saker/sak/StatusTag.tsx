import { useTranslations } from "next-intl";
import { BodyShort, Tag, TagProps } from "@navikt/ds-react";
import { SaksStatusResponseUtfallVedtak } from "@generated/model";

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

export default StatusTag;
