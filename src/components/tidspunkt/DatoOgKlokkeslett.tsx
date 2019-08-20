import React from 'react';
import {FormattedDate, FormattedTime, FormattedMessage} from "react-intl";

/*
      DatoOgKlokkeslett("2018-10-12T13:37:00.134")
         => "12.10.2018 klokken 13:37"
 */
const DatoOgKlokkeslett: React.FC<{ tidspunkt: string, bareDato?: boolean }> = ({tidspunkt, bareDato}) => {
    const visKlokkeslett = !(bareDato && bareDato === true) && (new Date(tidspunkt).getHours() + new Date(tidspunkt).getMinutes()) > 0;
    return (
        <>
            <FormattedDate
                value={new Date(tidspunkt)}
                month="2-digit"
                day="2-digit"
                year="numeric"
            />
            {visKlokkeslett && (
                <>
                    &nbsp;<FormattedMessage id="tidspunkt.klokken" />&nbsp;
                    <FormattedTime
                        value={new Date(tidspunkt)}
                        hour="2-digit"
                        minute="2-digit"
                    />
			    </>
            )}
        </>
    );
};

export default DatoOgKlokkeslett;
