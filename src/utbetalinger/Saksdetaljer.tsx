import React from "react";
import {Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import SakPanel from "../saksoversikt/sakpanel/SakPanel";
import {REST_STATUS} from "../utils/restUtils";

const Saksdetaljer: React.FC<{fiksDigisosId: string; border?: boolean}> = ({fiksDigisosId, border}) => {
    const saker: Sakstype[] = useSelector((state: InnsynAppState) => state.innsynsdata.saker);
    const sak: Sakstype | undefined = saker.find((sak: Sakstype) => {
        if (sak.fiksDigisosId === fiksDigisosId) {
            return sak;
        } else {
            return null;
        }
    });

    return (
        <div>
            {sak && (
                <SakPanel
                    fiksDigisosId={sak.fiksDigisosId}
                    tittel={sak.soknadTittel}
                    status={sak.status}
                    oppdatert={sak.sistOppdatert}
                    key={"sakpanel_ " + sak.fiksDigisosId}
                    url={sak.url}
                    kilde={sak.kilde}
                    antallNyeOppgaver={sak.antallNyeOppgaver}
                    harBlittLastetInn={sak.restStatus !== REST_STATUS.PENDING}
                    border={border}
                />
            )}
        </div>
    );
};

export default Saksdetaljer;
