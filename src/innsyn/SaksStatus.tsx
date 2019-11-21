import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataActionTypeKeys, InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";
import ArkfanePanel from "../components/arkfanePanel/ArkfanePanel";
import VedleggView from "../components/vedlegg/VedleggView";
import {setBrodsmuleSti} from "../redux/navigasjon/navigasjonsReducer";
import {useIntl} from 'react-intl';
import ForelopigSvarAlertstripe from "../components/forelopigSvar/ForelopigSvar";
import DriftsmeldingAlertstripe from "../components/driftsmelding/Driftsmelding";

interface Props {
    match: {
        params: {
            soknadId: string;
        }
    };
}

const SaksStatusView: React.FC<Props> = ({match}) => {
    const fiksDigisosId: string = match.params.soknadId;
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const restStatus = innsynsdata.restStatus;
    const dispatch = useDispatch();
    const intl = useIntl();

    useEffect(() => {
        dispatch({
            type:  InnsynsdataActionTypeKeys.SETT_FIKSDIGISOSID,
            fiksDigisosId: fiksDigisosId
        });
        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS));
        dispatch(setBrodsmuleSti([
            {sti: "/sosialhjelp/innsyn", tittel: "Økonomisk sosialhjelp"},
            {sti: "/sosialhjelp/innsyn/status", tittel: "Status for din søknad"}
        ]));
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        if (innsynsdata.restStatus.saksStatus === REST_STATUS.OK) {
            [
                InnsynsdataSti.OPPGAVER,
                InnsynsdataSti.SOKNADS_STATUS,
                InnsynsdataSti.HENDELSER,
                InnsynsdataSti.VEDLEGG,
                InnsynsdataSti.FORELOPIG_SVAR,
                InnsynsdataSti.KOMMUNE
            ].map((restDataSti: InnsynsdataSti) =>
                dispatch(hentInnsynsdata(fiksDigisosId, restDataSti))
            );
        }
    }, [dispatch, fiksDigisosId, innsynsdata.restStatus.saksStatus]);

    const leserData = (restStatus: REST_STATUS): boolean => {
        return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    };

    return (
        <>
            <DriftsmeldingAlertstripe />
            <ForelopigSvarAlertstripe />

            <SoknadsStatus
                status={innsynsdata.soknadsStatus.status}
                sak={innsynsdata.saksStatus}
                leserData={leserData(restStatus.saksStatus)}
            />

            <Oppgaver
                oppgaver={innsynsdata.oppgaver}
                leserData={leserData(restStatus.oppgaver)}
            />

            <ArkfanePanel
                className="panel-luft-over"
                arkfaner={[
                    {
                        tittel: intl.formatMessage({id:'historikk.tittel'}),
                        content: (
                            <Historikk
                                hendelser={innsynsdata.hendelser}
                                leserData={leserData(restStatus.hendelser)}
                            />
                        )
                    },
                    {
                        tittel: intl.formatMessage({id:'vedlegg.tittel'}),
                        content: (
                            <VedleggView
                                vedlegg={innsynsdata.vedlegg}
                                leserData={leserData(restStatus.saksStatus)}
                            />
                        )
                    }
                ]}
                defaultArkfane={0}
            />
        </>
    )
};

export default SaksStatusView;
