import React, { forwardRef, Ref } from "react";
import { useTranslations } from "next-intl";
import Event from "../Event";
import { Link } from "@navikt/ds-react";

interface Props {
    tidspunkt: Date;
    url: string;
}

const DokumentasjonskravEvent = ({ tidspunkt, url }: Props, ref: Ref<HTMLLIElement>): React.JSX.Element => {
    const t = useTranslations("History.DokumentasjonskravEvent");
    return (
        <Event ref={ref} title={t("tittel")} status="completed" timestamp={tidspunkt}>
            <Link href={url} className="text-ax-text-accent-subtle">
                {t("seBrevet")}
            </Link>
        </Event>
    );
};

export default forwardRef(DokumentasjonskravEvent);
