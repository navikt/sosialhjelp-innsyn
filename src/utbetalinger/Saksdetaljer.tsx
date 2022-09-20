import React from "react";
import {Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import SaksPanelUtbetalinger from "./SaksPanelUtbetalinger";

const Saksdetaljer: React.FC<{fiksDigisosId: string}> = ({fiksDigisosId}) => {
    const saker: Sakstype[] = useSelector((state: InnsynAppState) => state.innsynsdata.saker);
    const sak: Sakstype | undefined = saker.find((sak: Sakstype) => {
        if (sak.fiksDigisosId === fiksDigisosId) {
            return sak;
        } else {
            return null;
        }
    });

    return (
        <>
            {sak && (
                <SaksPanelUtbetalinger
                    fiksDigisosId={sak.fiksDigisosId}
                    tittel={sak.soknadTittel}
                    status={sak.status}
                    oppdatert={sak.sistOppdatert}
                    key={"sakpanel_ " + sak.fiksDigisosId}
                    antallNyeOppgaver={sak.antallNyeOppgaver}
                    harBlittLastetInn={sak.restStatus !== REST_STATUS.PENDING}
                />
            )}
        </>
    );
};

export default Saksdetaljer;
