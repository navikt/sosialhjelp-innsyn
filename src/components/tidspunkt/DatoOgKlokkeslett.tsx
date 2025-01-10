import React from "react";
import { useTranslation } from "next-i18next";

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
    const { t, i18n } = useTranslation();

    if (!tidspunkt) {
        return null;
    }
    const visKlokkeslett = !bareDato && new Date(tidspunkt).getHours() + new Date(tidspunkt).getMinutes() > 0;
    return (
        <>
            <time className="dato">
                {new Intl.DateTimeFormat(i18n.language, {
                    month: brukKortMaanedNavn ? "short" : "long",
                    day: "numeric",
                    year: "numeric",
                }).format(new Date(tidspunkt))}
            </time>
            {visKlokkeslett && (
                <time>
                    &nbsp;
                    {t("tidspunkt.klokken")}
                    &nbsp;
                    {new Intl.DateTimeFormat(i18n.language, {
                        hour: "2-digit",
                        minute: "2-digit",
                    }).format(new Date(tidspunkt))}
                </time>
            )}
        </>
    );
};

export default DatoOgKlokkeslett;
