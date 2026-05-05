import { useTranslations } from "next-intl";
import { Tag } from "@navikt/ds-react";
import { CalendarIcon, CheckmarkIcon } from "@navikt/aksel-icons";
import useIsMobile from "@utils/useIsMobile";

interface FristTagProps {
    frist?: string;
    completed: boolean;
}

const OppgaveTag = ({ frist, completed }: FristTagProps) => {
    const t = useTranslations("OppgaveTag");
    const isMobile = useIsMobile();
    const size = isMobile ? "small" : "medium";
    if (completed) {
        return (
            <Tag variant="success-moderate" icon={<CheckmarkIcon aria-hidden />} size={size}>
                {t("completed")}
            </Tag>
        );
    }
    if (frist) {
        return (
            <Tag variant="warning-moderate" size={size}>
                <CalendarIcon className="mr-0.5" aria-hidden />
                {t("frist", { frist: new Date(frist) })}
            </Tag>
        );
    }
};

export default OppgaveTag;
