import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {REST_STATUS} from "../utils/restUtils";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {
    InnsynsdataActionTypeKeys,
    InnsynsdataSti,
    InnsynsdataType,
    KommuneResponse,
} from "../redux/innsynsdata/innsynsdataReducer";
import SoknadsStatus from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import Historikk from "../components/historikk/Historikk";
import ArkfanePanel from "../components/arkfanePanel/ArkfanePanel";
import VedleggView from "../components/vedlegg/VedleggView";
import {FormattedMessage, IntlShape, useIntl} from "react-intl";
import ForelopigSvarAlertstripe from "../components/forelopigSvar/ForelopigSvar";
import DriftsmeldingAlertstripe from "../components/driftsmelding/Driftsmelding";
import Brodsmulesti, {UrlType} from "../components/brodsmuleSti/BrodsmuleSti";
import {soknadsStatusTittel} from "../components/soknadsStatus/soknadsStatusUtils";
import {Panel} from "nav-frontend-paneler";
import {Systemtittel} from "nav-frontend-typografi";
import {
    SoknadFraBergenHotjarTrigger,
    SoknadMedInnsynHotjarTrigger,
    SoknadUtenInnsynHotjarTrigger,
} from "../components/hotjarTrigger/HotjarTrigger";
import {isKommuneBergen, isKommuneMedInnsynUtenBergen, isKommuneUtenInnsynUtenBergen} from "./saksStatusUtils";

interface Props {
    match: {
        params: {
            soknadId: string;
        };
    };
}

const SaksStatusView: React.FC<Props> = ({match}) => {
    const fiksDigisosId: string = match.params.soknadId;
    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);
    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const restStatus = innsynsdata.restStatus;
    const dispatch = useDispatch();
    const intl: IntlShape = useIntl();

    useEffect(() => {
        dispatch({
            type: InnsynsdataActionTypeKeys.SETT_FIKSDIGISOSID,
            fiksDigisosId: fiksDigisosId,
        });
        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS));
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        if (innsynsdata.restStatus.saksStatus === REST_STATUS.OK) {
            [
                InnsynsdataSti.OPPGAVER,
                InnsynsdataSti.SOKNADS_STATUS,
                InnsynsdataSti.HENDELSER,
                InnsynsdataSti.VEDLEGG,
                InnsynsdataSti.FORELOPIG_SVAR,
                InnsynsdataSti.KOMMUNE,
            ].map((restDataSti: InnsynsdataSti) => dispatch(hentInnsynsdata(fiksDigisosId, restDataSti)));
        }
    }, [dispatch, fiksDigisosId, innsynsdata.restStatus.saksStatus]);

    const leserData = (restStatus: REST_STATUS): boolean => {
        return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    };

    const statusTittel = soknadsStatusTittel(innsynsdata.soknadsStatus.status, intl);
    document.title = statusTittel;

    return (
        <>
            <Brodsmulesti
                foreldreside={{
                    tittel: "Økonomisk sosialhjelp",
                    path: "/sosialhjelp/innsyn/",
                    urlType: UrlType.ABSOLUTE_PATH,
                }}
                tittel={statusTittel}
                tilbakePilUrlType={UrlType.ABSOLUTE_PATH}
                className="breadcrumbs__luft_rundt"
            />

            <DriftsmeldingAlertstripe />

            {isKommuneMedInnsynUtenBergen(kommuneResponse, restStatus.kommune) && (
                <SoknadMedInnsynHotjarTrigger>
                    <ForelopigSvarAlertstripe />
                </SoknadMedInnsynHotjarTrigger>
            )}

            {isKommuneBergen(kommuneResponse) && (
                <SoknadFraBergenHotjarTrigger>
                    <ForelopigSvarAlertstripe />
                </SoknadFraBergenHotjarTrigger>
            )}

            {isKommuneUtenInnsynUtenBergen(kommuneResponse, restStatus.kommune) && (
                <SoknadUtenInnsynHotjarTrigger>
                    <ForelopigSvarAlertstripe />
                </SoknadUtenInnsynHotjarTrigger>
            )}

            <SoknadsStatus
                status={innsynsdata.soknadsStatus.status}
                sak={innsynsdata.saksStatus}
                leserData={leserData(restStatus.saksStatus)}
            />

            <Oppgaver oppgaver={innsynsdata.oppgaver} leserData={leserData(restStatus.oppgaver)} />

            {kommuneResponse != null && kommuneResponse.erInnsynDeaktivert && (
                <>
                    <Panel className="panel-luft-over">
                        <Systemtittel>
                            <FormattedMessage id="vedlegg.tittel" />
                        </Systemtittel>
                    </Panel>
                    <Panel className="panel-glippe-over">
                        <VedleggView vedlegg={innsynsdata.vedlegg} leserData={leserData(restStatus.saksStatus)} />
                    </Panel>
                </>
            )}
            {(kommuneResponse == null || !kommuneResponse.erInnsynDeaktivert) && (
                <ArkfanePanel
                    className="panel-luft-over"
                    arkfaner={[
                        {
                            tittel: intl.formatMessage({id: "historikk.tittel"}),
                            content: (
                                <Historikk
                                    hendelser={innsynsdata.hendelser}
                                    leserData={leserData(restStatus.hendelser)}
                                />
                            ),
                        },
                        {
                            tittel: intl.formatMessage({id: "vedlegg.tittel"}),
                            content: (
                                <VedleggView
                                    vedlegg={innsynsdata.vedlegg}
                                    leserData={leserData(restStatus.saksStatus)}
                                />
                            ),
                        },
                    ]}
                    defaultArkfane={0}
                />
            )}
        </>
    );
};

export default SaksStatusView;
