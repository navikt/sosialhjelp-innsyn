import React from "react";
import AppBanner from "../../components/appBanner/AppBanner";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst, Undertittel} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import Brodsmulesti from "../../components/brodsmuleSti/BrodsmuleSti";
import {history} from "../../configureStore";
import DineUtbetalingerPanel from "../dineUtbetalinger/DineUtbetalingerPanel";
import Subheader from "../../components/subheader/Subheader";
import InfoPanel, {InfoPanelContainer} from "../../components/Infopanel/InfoPanel";
import SakPanel from "../sakpanel/SakPanel";

const VeiviserPlaceholder: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner/>
            <div className="blokk-center">
                <br/>
                <Brodsmulesti tittel="Innsyn" foreldreside={{tittel: "Økonomisk sosialhjelp", path: "/"}}/>
                <br/>
                <Panel>
                    <Innholdstittel>Veiviser</Innholdstittel>
                    <br/>
                    <Normaltekst>
                        På denne plassen skal veiviseren være.
                    </Normaltekst>
                    <br/>
                    <div>
                        Ta en titt på disse sidene:
                        <ul>
                            <li>
                                <Lenke
                                    href="/sosialhjelp/innsyn/demo"
                                    onClick={(event) => {
                                        history.push({pathname: "/sosialhjelp/innsyn/demo"});
                                        event.preventDefault();
                                    }}
                                >
                                    Demoside for innsyn
                                </Lenke>
                            </li>
                            <li>
                                <Lenke
                                    href="/sosialhjelp/innsyn/"
                                    onClick={(event) => {
                                        history.push({pathname: "/innsyn/"});
                                        event.preventDefault();
                                    }}
                                >
                                    Saksoversikt
                                </Lenke>
                            </li>
                        </ul>
                    </div>
                </Panel>
                <br/>
                <br/>

                <>

                    <SakPanel
                        fiksDigisosId={"fiksDigisosId"}
                        tittel={"oknadTittel"}
                        status={"sakstatus"}
                        oppdatert={"sistOppdatert"}
                        key={"key"}
                        url={"sak.url"}
                        kilde={"sak.kilde"}
                        antallNyeOppgaver={0}
                        harBlittLastetInn={true}
                    />


                    <DineUtbetalingerPanel/>

                    <Subheader className="panel-luft-over">
                        <Undertittel>Relatert informasjon</Undertittel>
                    </Subheader>

                    <InfoPanelContainer>
                        <InfoPanel tittel={"Meld fra om endringer"} href={"https://www.nav.no/sosialhjelp/artikkel/124876"}>
                            Du må melde fra dersom din økonomiske situasjon endres.
                        </InfoPanel>

                        <InfoPanel tittel={"Klagerettigheter"}
                                   href={"https://www.nav.no/sosialhjelp/artikkel/124875"}>
                            Har du fått et vedtak fra oss som du mener er feil, kan du klage.
                        </InfoPanel>

                        <InfoPanel tittel={"Mer om sosialhjelp"} href={"https://www.nav.no/sosialhjelp/"}>
                            Lær mer om økonomisk sosialhjelp på nav.no
                        </InfoPanel>
                    </InfoPanelContainer>
                </>
            </div>
        </div>
    );
};

export default VeiviserPlaceholder;
