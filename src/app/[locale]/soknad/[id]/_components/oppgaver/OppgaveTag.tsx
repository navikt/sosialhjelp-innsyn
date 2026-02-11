import { useTranslations } from "next-intl";
import { Tag } from "@navikt/ds-react";
import { CalendarIcon, CheckmarkIcon } from "@navikt/aksel-icons";
import React from "react";

interface FristTagProps {
    frist?: string;
    completed: boolean;
}

const OppgaveTag = ({ frist, completed }: FristTagProps) => {
    const t = useTranslations("OppgaveTag");
    if (completed) {
        return (
            <Tag variant="success-moderate" icon={<CheckmarkIcon aria-hidden />}>
                {t("completed")}
            </Tag>
        );
    }
    if (frist) {
        return (
            <Tag variant="warning-moderate">
                <CalendarIcon className="mr-0.5" aria-hidden />
                {t("frist", { frist: new Date(frist) })}
            </Tag>
        );
    }
};

export default OppgaveTag;
