import React, { forwardRef, Ref } from "react";
import Event from "../Event";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import { Link as AkselLink } from "@navikt/ds-react";

interface Props {
    tidspunkt?: Date;
}

const UtbetalingerOppdatertEvent = ({ tidspunkt }: Props, ref: Ref<HTMLLIElement>): React.JSX.Element => {
    const t = useTranslations("History.UtbetalingerOppdatertEvent");
    return (
        <Event ref={ref} title={t("tittel")} status="completed" timestamp={tidspunkt}>
            <AkselLink as={Link} href="/utbetaling">
                {t("beskrivelse")}
            </AkselLink>
        </Event>
    );
};

export default forwardRef(UtbetalingerOppdatertEvent);
