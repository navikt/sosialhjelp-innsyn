import React, {useEffect} from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import Subheader from "../components/subheader/Subheader";
import {Normaltekst, Systemtittel, Undertittel} from "nav-frontend-typografi";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
import Veilederpanel from 'nav-frontend-veilederpanel';
import {Knapp} from "nav-frontend-knapper";
import {Select} from 'nav-frontend-skjema';
import SakPanel from "./sakpanel/SakPanel";
import {InnsynsdataSti} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import DetteKanDuSokeOm from "../components/ikoner/DetteKanDuSokeOm";
import SlikSokerDu from "../components/ikoner/SlikSokerDu";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";

export interface SakslisteProps {
    periode: string;
    restStatus?: REST_STATUS;
}

type Props = SakslisteProps & DispatchProps;

const Saksoversikt: React.FC<Props> = ({periode}) => {
    let sokePeriode: string = periode === undefined ? "siste4uker" : periode;
    // const leserData = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const dispatch = useDispatch();
    const saker = useSelector((state: InnsynAppState) => state.innsynsdata.saker);

    useEffect(() => {
        dispatch(hentSaksdata(sokePeriode, InnsynsdataSti.SAKER))
    }, [dispatch, sokePeriode]);

    const velgPeriode = (value: any) => {
        sokePeriode = value.target.value;
        // useEffect(() => {
        //     dispatch(hentSaksdata(sokePeriode, InnsynsdataSti.SAKER))
        // }, [dispatch]);
    };

    return (
        <>
            {saker.length === 0 &&
            <div className="soknadsOversiktSide">
                <Veilederpanel veilederProps={{className: "soknadsOversiktVeilederpanelIkon"}} kompakt type={"plakat"} svg={<IngenSoknaderFunnet/>}>
                    <div>
                        <Systemtittel className="ingenSoknaderFunnetText">Vi finner ingen digitale søknader fra deg</Systemtittel>
                        <Normaltekst className="ingenSoknaderFunnetText">Har du søkt på papir, har vi dessverre ikke mulighet til å vise den her.</Normaltekst>
                    </div>
                </Veilederpanel>
                <div className={"soknadsOversiktLenkePanel"}>
                    <LenkepanelBase className={"soknadsOversiktLenker"} href={"./slik-soker-du"}>
                        <div className={"soknadsOversiktLenkerAlign"}>
                            <SlikSokerDu/>
                            <Systemtittel className="lenkepanel__heading lenkepanelResenter">Slik søker du</Systemtittel>
                        </div>
                    </LenkepanelBase>
                    <LenkepanelBase className={"soknadsOversiktLenker"} href={"./dette-kan-du-soke-om"}>
                        <div className={"soknadsOversiktLenkerAlign"}>
                            <DetteKanDuSokeOm/>
                            <Systemtittel className="lenkepanel__heading lenkepanelResenter">Dette kan du søke om</Systemtittel>
                        </div>
                    </LenkepanelBase>
                </div>
            </div>
            }
            {saker.length > 0 &&
            <Panel className="panel panel-luft-over dine_soknader_panel">
                <div className="tittel_og_knapp_container">
                    <Systemtittel>Dine søknader</Systemtittel>
                    <Knapp type="standard">Ny søknad</Knapp>
                </div>
                <div className="periodevelger_container">
                    <Select onChange={(value: any) => velgPeriode(value)} label='Vis for' className="periode_velger">
                        <option value='siste4uker'>Siste 4 uker</option>
                        <option value='siste3mnd'>Siste 3 måneder</option>
                        <option value='sisteaar'>Siste år</option>
                        <option value='alle'>Alle</option>
                    </Select>
                </div>
            </Panel>
            }
            {
                saker.map((sak) => {
                    return <SakPanel fiksDigisosId={sak.fiksDigisosId} tittel={sak.soknadTittel} status={sak.status}
                                     oppdatert={sak.sistOppdatert} key={sak.fiksDigisosId} antalNyeOppgaver={sak.antallNyeOppgaver}/>
                })
            }

            <DineUtbetalingerPanel/>

            <Subheader className="panel-luft-over">
                <Undertittel>Relatert informasjon</Undertittel>
            </Subheader>

            <InfoPanelContainer>
                <InfoPanel tittel={"Meld fra om endringer"} href={"todo"}>
                    Du må melde fra dersom din økonomiske situasjon endres.
                </InfoPanel>

                <InfoPanel tittel={"Klagerettigheter"} href={"todo"}>
                    Har du fått et vedtak fra oss som du mener er feil, kan du klage.
                </InfoPanel>

                <InfoPanel tittel={"Mer om sosialhjelp"} href={"todo"}>
                    Lær mer om økonomisk sosialhjelp på nav.no
                </InfoPanel>
            </InfoPanelContainer>
        </>
    )
};

export default Saksoversikt;
