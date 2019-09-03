import React from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import Subheader from "../components/subheader/Subheader";
import {Systemtittel, Undertittel} from "nav-frontend-typografi";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
import {Knapp} from "nav-frontend-knapper";
import { Select } from 'nav-frontend-skjema';
import SakPanel from "./sakpanel/SakPanel";

const Saksoversikt: React.FC = () => {
    return (
        <>
            <Panel className="panel panel-luft-over dine_soknader_panel">
                <div className="tittel_og_knapp_container">
                    <Systemtittel>Dine søknader</Systemtittel>
                    <Knapp type="standard" >+ Ny søknad</Knapp>
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
            <SakPanel
                tittel="Økonomisk sosialhjelp"
                etikett="Du har en oppgave"
                status="Sendt"
                oppdatert={"2018-10-04T13:42:00.134"}
            />
            <SakPanel
                tittel="Livsopphold og strøm"
                status="Ferdig behandlet"
                oppdatert={"2018-10-04T13:42:00.134"}
            />

            <DineUtbetalingerPanel />

            <Subheader className="panel-luft-over">
                <Undertittel>Relatert informasjon</Undertittel>
            </Subheader>

            <InfoPanelContainer>
                <InfoPanel tittel={"Meld fra om endringer"} href={"todo"}>
                    Du må melde fra desom din økonomiske situasjon endres.
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
