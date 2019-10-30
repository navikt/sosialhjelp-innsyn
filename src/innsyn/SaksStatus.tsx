import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";
import ArkfanePanel from "../components/arkfanePanel/ArkfanePanel";
import VedleggView from "../components/vedlegg/VedleggView";
import {setBrodsmuleSti} from "../redux/navigasjon/navigasjonsReducer";
import {useIntl} from 'react-intl';

interface Props {
    match: {
        params: {
            soknadId: any;
        }
    };
}

const SaksStatusView: React.FC<Props> = ({match}) => {
    const soknadId = match.params.soknadId;
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    const restStatus = innsynsdata.restStatus;
    const dispatch = useDispatch();

    const intl = useIntl();

    useEffect(() => {
        const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS));
    }, [dispatch, soknadId]);

    useEffect(() => {
        const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
        console.warn("restStatus " + restStatus.saksStatus);
        if (restStatus.saksStatus === REST_STATUS.OK) {
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.OPPGAVER));
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SOKNADS_STATUS));
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.HENDELSER));
            dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.VEDLEGG));
        }
    }, [dispatch, soknadId, innsynsdata.restStatus.saksStatus]);

    useEffect(() => {
        dispatch(setBrodsmuleSti([
            {sti: "/sosialhjelp/innsyn", tittel: "Økonomisk sosialhjelp"},
            {sti: "/sosialhjelp/innsyn/status", tittel: "Status for din søknad"}
        ]))
    }, [dispatch]);
    const leserData = (restStatus: REST_STATUS): boolean => {
        return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    };

    return (
        <>
            <SoknadsStatus
                status={innsynsdata.soknadsStatus.status}
                saksStatus={innsynsdata.saksStatus}
                leserData={leserData(restStatus.saksStatus)}
            />

            <Oppgaver
                oppgaver={innsynsdata.oppgaver}
                soknadId={soknadId}
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
