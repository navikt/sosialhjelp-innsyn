import { CalendarIcon, ExclamationmarkTriangleIcon } from "@navikt/aksel-icons";
import { Tag } from "@navikt/ds-react";

interface Props {
    stopped: boolean;
    date: Date;
    t: (key: string, values?: Record<string, string | number | Date>) => string;
}

const UtbetalingStatusTag = ({ stopped, date, t }: Props) => {
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
