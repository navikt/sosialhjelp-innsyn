import React, {useEffect} from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import Subheader from "../components/subheader/Subheader";
import {Systemtittel, Undertittel} from "nav-frontend-typografi";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
import {Knapp} from "nav-frontend-knapper";
import {Select} from 'nav-frontend-skjema';
import SakPanel from "./sakpanel/SakPanel";
import {InnsynsdataSti, Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import DetteKanDuSokeOm from "../components/ikoner/DetteKanDuSokeOm";
import SlikSokerDu from "../components/ikoner/SlikSokerDu";

export interface SakslisteProps {
    saker?: Sakstype[];
    restStatus?: REST_STATUS;
}

type Props = SakslisteProps & DispatchProps;

const Saksoversikt: React.FC<Props> = () => {
    // const leserData = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const dispatch = useDispatch();
    const saker = useSelector((state: InnsynAppState) => state.innsynsdata.saker);

    useEffect(() => {
        dispatch(hentInnsynsdata(null, InnsynsdataSti.SAKER))
    }, [dispatch]);

    return (
        <>
            {saker.length === 0 &&
            <div>
                <Panel className="panel panel-luft-over dine_soknader_panel">
                    <div className="tittel_og_knapp_container">
                        <Systemtittel>Vi finner ingen digitale søknader fra deg</Systemtittel>
                    </div>
                </Panel>
                <Panel>
                    <LenkepanelBase href={"./slik-soker-du"} border>
                        <div>
                            <SlikSokerDu/>
                            Slik søker du
                        </div>
                    </LenkepanelBase>
                    <LenkepanelBase href={"./dette-kan-du-soke-om"} border>
                        <div>
                            <DetteKanDuSokeOm />
                            Dette kan du søke om
                        </div>
                    </LenkepanelBase>
                </Panel>
            </div>
            }
            {saker.length > 0 &&
            <Panel className="panel panel-luft-over dine_soknader_panel">
                <div className="tittel_og_knapp_container">
                    <Systemtittel>Dine søknader</Systemtittel>
                    <Knapp type="standard">Ny søknad</Knapp>
                </div>
                <div className="periodevelger_container">
                    <Select label='Vis for' className="periode_velger">
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
                                     oppdatert={sak.sistOppdatert} antalNyeOppgaver={sak.antallNyeOppgaver}/>
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
