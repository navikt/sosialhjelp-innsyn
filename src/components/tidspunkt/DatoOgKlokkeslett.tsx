import React from "react";
import { useFormatter, useTranslations } from "next-intl";

/*
      DatoOgKlokkeslett("2018-10-12T13:37:00.134")
         => "12. oktober 2018 klokken 13:37"
 */

interface Props {
    tidspunkt?: string;
    bareDato?: boolean;
    brukKortMaanedNavn?: boolean;
}
const DatoOgKlokkeslett = (props: Props) => {
    const { tidspunkt, bareDato, brukKortMaanedNavn } = props;
    const format = useFormatter();
    const t = useTranslations("common");

    if (!tidspunkt) {
        return null;
    }
    const visKlokkeslett = !bareDato && new Date(tidspunkt).getHours() + new Date(tidspunkt).getMinutes() > 0;
    return (
        <>
            <time className="dato">
                {format.dateTime(new Date(tidspunkt), {
                    month: brukKortMaanedNavn ? "short" : "long",
                    day: "numeric",
                    year: "numeric",
                })}
            </time>
            {visKlokkeslett && (
                <time>
                    &nbsp;
                    {t("tidspunkt.klokken")}
                    &nbsp;
                    {format.dateTime(new Date(tidspunkt), {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </time>
            )}
        </>
    );
};

export default DatoOgKlokkeslett;
