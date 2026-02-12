import { CalendarIcon, ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface Props {
    stopped: boolean;
    date: Date;
}

const UtbetalingStatusTag = ({ stopped, date }: Props) => {
    const t = useTranslations("KommendeUtbetalingerTag");

    if (stopped) {
        return (
            <Tag variant="warning-moderate" size="small" icon={<ExclamationmarkTriangleIcon aria-hidden={true} />}>
                {t("utbetalingStoppet")}
            </Tag>
        );
    }

    return (
        <Tag variant="info-moderate" size="small" icon={<CalendarIcon aria-hidden={true} />}>
            {t("utbetales", { date })}
        </Tag>
    );
};

export default UtbetalingStatusTag;
