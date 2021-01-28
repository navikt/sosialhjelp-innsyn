import React from "react";
import {FormattedDate, FormattedTime, FormattedMessage} from "react-intl";

/*
      DatoOgKlokkeslett("2018-10-12T13:37:00.134")
         => "12. oktober 2018 klokken 13:37"
 */
const DatoOgKlokkeslett: React.FC<{tidspunkt: string; bareDato?: boolean; brukKortMaanedNavn?: boolean}> = ({
    tidspunkt,
    bareDato,
    brukKortMaanedNavn,
}) => {
    const visKlokkeslett =
        !(bareDato && bareDato === true) && new Date(tidspunkt).getHours() + new Date(tidspunkt).getMinutes() > 0;
    return (
        <>
            <time className="dato">
                <FormattedDate
                    value={new Date(tidspunkt)}
                    month={brukKortMaanedNavn ? "short" : "long"}
                    day="numeric"
                    year="numeric"
                />
            </time>
            {visKlokkeslett && (
                <time>
                    &nbsp;
                    <FormattedMessage id="tidspunkt.klokken" />
                    &nbsp;
                    <FormattedTime value={new Date(tidspunkt)} hour="2-digit" minute="2-digit" />
                </time>
            )}
        </>
    );
};

export default DatoOgKlokkeslett;
