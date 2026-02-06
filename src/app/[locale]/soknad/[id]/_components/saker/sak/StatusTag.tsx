import { useTranslations } from "next-intl";
import { BodyShort, Tag, TagProps } from "@navikt/ds-react";
import { SaksStatusResponseUtfallVedtak } from "@generated/model";
import useIsMobile from "@utils/useIsMobile";

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
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";

    if (vedtakUtfall) {
        return (
            <Tag variant={utfallVariant[vedtakUtfall]} className={className} size={size}>
                {t.rich(vedtakUtfall, { b: (chunks) => <BodyShort weight="semibold">{chunks}</BodyShort> })}
            </Tag>
        );
    }
    return (
        <Tag variant="info-moderate" className={className} size={size}>
            {t("UNDER_BEHANDLING")}
        </Tag>
    );
};

export default StatusTag;
