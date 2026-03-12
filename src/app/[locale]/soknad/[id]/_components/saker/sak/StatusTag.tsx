import { useTranslations } from "next-intl";
import { BodyShort, Tag, TagProps } from "@navikt/ds-react";
import { SaksStatusResponseStatus, SaksStatusResponseUtfallVedtak } from "@generated/model";
import useIsMobile from "@utils/useIsMobile";

const utfallVariant: Record<SaksStatusResponseUtfallVedtak, TagProps["variant"]> = {
    INNVILGET: "success",
    DELVIS_INNVILGET: "warning",
    AVVIST: "error",
    AVSLATT: "error",
};

const statusVariant: Record<SaksStatusResponseStatus, TagProps["variant"]> = {
    FEILREGISTRERT: undefined,
    FERDIGBEHANDLET: undefined,
    UNDER_BEHANDLING: "info-moderate",
    IKKE_INNSYN: "warning-moderate",
    BEHANDLES_IKKE: "warning-moderate",
};

interface StatusTagProps {
    vedtakUtfall?: SaksStatusResponseUtfallVedtak;
    status?: SaksStatusResponseStatus;
    className?: string;
}

const StatusTag = ({ vedtakUtfall, className, status = "UNDER_BEHANDLING" }: StatusTagProps) => {
    const t = useTranslations("StatusTag");
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";

    if (vedtakUtfall) {
        return (
            <Tag variant={utfallVariant[vedtakUtfall]} className={className} size={size}>
                {t.rich(vedtakUtfall, {
                    b: (chunks) => (
                        <BodyShort size={size} weight="semibold">
                            {chunks}
                        </BodyShort>
                    ),
                })}
            </Tag>
        );
    }
    const variant = statusVariant[status];
    if (!variant) {
        return null;
    }
    return (
        <Tag variant={variant} className={className} size={size}>
            {t(status)}
        </Tag>
    );
};

export default StatusTag;
