import { useTranslations } from "next-intl";
import { BodyShort, Tag, TagProps } from "@navikt/ds-react";
import { SaksStatusResponseStatus, SaksStatusResponseUtfallVedtak } from "@generated/model";
import useIsMobile from "@utils/useIsMobile";

type SaksStatus = NonNullable<SaksStatusResponseStatus>;
type VedtakUtfall = NonNullable<SaksStatusResponseUtfallVedtak>;

const utfallVariant: Record<VedtakUtfall, TagProps["variant"]> = {
    INNVILGET: "success",
    DELVIS_INNVILGET: "warning",
    AVVIST: "error",
    AVSLATT: "error",
};

const statusVariant: Record<SaksStatus, TagProps["variant"]> = {
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

const StatusTag = ({ vedtakUtfall, className, status: statusProp }: StatusTagProps) => {
    const t = useTranslations("StatusTag");
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";
    const status = statusProp ?? "UNDER_BEHANDLING";

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
