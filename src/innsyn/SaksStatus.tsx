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
import Panel from "nav-frontend-paneler";
import {Normaltekst, Systemtittel} from "nav-frontend-typografi";
import {SoknadMedInnsynHotjarTrigger, SoknadUtenInnsynHotjarTrigger} from "../components/hotjarTrigger/HotjarTrigger";
import {isKommuneMedInnsyn, isKommuneUtenInnsyn} from "./saksStatusUtils";
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import NavFrontendSpinner from "nav-frontend-spinner";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import SoknadsStatusUtenInnsyn from "../components/soknadsStatus/SoknadsStatusUtenInnsyn";

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
    const innsynRestStatus = innsynsdata.restStatus.saksStatus;

    let kommuneResponse: KommuneResponse | undefined = useSelector(
        (state: InnsynAppState) => state.innsynsdata.kommune
    );
    const erPaInnsyn = !kommuneResponse?.erInnsynDeaktivert && !kommuneResponse?.erInnsynMidlertidigDeaktivert;
    const restStatus = innsynsdata.restStatus;
    const dispatch = useDispatch();
    const intl: IntlShape = useIntl();

    useEffect(() => {
        dispatch({
            type: InnsynsdataActionTypeKeys.SETT_FIKSDIGISOSID,
            fiksDigisosId: fiksDigisosId,
        });
        dispatch(hentInnsynsdata(fiksDigisosId, InnsynsdataSti.SAKSSTATUS, false));
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        if (innsynsdata.restStatus.saksStatus !== REST_STATUS.PENDING) {
            [
                InnsynsdataSti.OPPGAVER,
                InnsynsdataSti.SOKNADS_STATUS,
                InnsynsdataSti.HENDELSER,
                InnsynsdataSti.VEDLEGG,
                InnsynsdataSti.FORELOPIG_SVAR,
                InnsynsdataSti.KOMMUNE,
            ].map((restDataSti: InnsynsdataSti) => dispatch(hentInnsynsdata(fiksDigisosId, restDataSti, false)));
        }
    }, [dispatch, fiksDigisosId, innsynsdata.restStatus.saksStatus]);

    const leserData = (restStatus: REST_STATUS): boolean => {
        return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    };

    const mustLogin: boolean = innsynRestStatus === REST_STATUS.UNAUTHORIZED;

    const sakStatusHarFeilet = innsynsdata.restStatus.saksStatus === REST_STATUS.FEILET;
    const statusTittel = "Søknadsstatus";
    document.title = `${statusTittel} - Økonomisk sosialhjelp`;

    useBannerTittel(statusTittel);

    const shouldShowHotjarTrigger = () => {
        return (
            restStatus.soknadsStatus === REST_STATUS.OK &&
            restStatus.kommune === REST_STATUS.OK &&
            (innsynsdata.soknadsStatus.tidspunktSendt == null || innsynsdata.soknadsStatus.soknadsalderIMinutter > 60)
        );
    };

    return (
        <>
            {!leserData(restStatus.saksStatus) && sakStatusHarFeilet && (
                <AlertStripeAdvarsel className="luft_over_16px">
                    <Normaltekst>Vi klarte ikke å hente inn all informasjonen på siden.</Normaltekst>
                    <Normaltekst>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</Normaltekst>
                </AlertStripeAdvarsel>
            )}
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

            {shouldShowHotjarTrigger() && isKommuneMedInnsyn(kommuneResponse, innsynsdata.soknadsStatus.status) && (
                <SoknadMedInnsynHotjarTrigger>
                    <div />
                </SoknadMedInnsynHotjarTrigger>
            )}

            {shouldShowHotjarTrigger() && isKommuneUtenInnsyn(kommuneResponse) && (
                <SoknadUtenInnsynHotjarTrigger>
                    <div />
                </SoknadUtenInnsynHotjarTrigger>
            )}

            {mustLogin && (
                <div className="application-spinner">
                    <NavFrontendSpinner type="XL" />
                </div>
            )}

            {!mustLogin && (
                <>
                    <DriftsmeldingAlertstripe />

                    <ForelopigSvarAlertstripe />

                    {!erPaInnsyn && (
                        <SoknadsStatusUtenInnsyn
                            restStatus={restStatus.soknadsStatus}
                            tidspunktSendt={innsynsdata.soknadsStatus.tidspunktSendt}
                            navKontor={innsynsdata.soknadsStatus.navKontor}
                            filUrl={innsynsdata.soknadsStatus.filUrl}
                        />
                    )}

                    {erPaInnsyn && (
                        <SoknadsStatus
                            status={innsynsdata.soknadsStatus.status}
                            sak={innsynsdata.saksStatus}
                            restStatus={restStatus.soknadsStatus}
                        />
                    )}

                    {(erPaInnsyn || innsynsdata.oppgaver.length > 0) && (
                        <Oppgaver oppgaver={innsynsdata.oppgaver} restStatus={restStatus.oppgaver} />
                    )}

                    {kommuneResponse != null && kommuneResponse.erInnsynDeaktivert && (
                        <>
                            <Panel className="panel-luft-over">
                                <Systemtittel>
                                    <FormattedMessage id="vedlegg.tittel" />
                                </Systemtittel>
                            </Panel>
                            <Panel className="panel-glippe-over">
                                <VedleggView vedlegg={innsynsdata.vedlegg} restStatus={restStatus.vedlegg} />
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
                                            restStatus={restStatus.hendelser}
                                        />
                                    ),
                                },
                                {
                                    tittel: intl.formatMessage({id: "vedlegg.tittel"}),
                                    content: (
                                        <VedleggView vedlegg={innsynsdata.vedlegg} restStatus={restStatus.vedlegg} />
                                    ),
                                },
                            ]}
                            defaultArkfane={0}
                        />
                    )}
                </>
            )}
        </>
    );
};

export default SaksStatusView;
