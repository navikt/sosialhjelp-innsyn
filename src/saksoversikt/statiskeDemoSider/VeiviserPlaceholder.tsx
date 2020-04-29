import React from "react";
import AppBanner from "../../components/appBanner/AppBanner";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import Brodsmulesti from "../../components/brodsmuleSti/BrodsmuleSti";

const VeiviserPlaceholder: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner />
            <div className="blokk-center">
                <Brodsmulesti tittel="Innsyn" foreldreside={{tittel: "Økonomisk sosialhjelp", path: "/"}} />
                <Panel>
                    <Innholdstittel>Veiviser</Innholdstittel>
                    <br />
                    <Normaltekst>På denne plassen skal veiviseren være.</Normaltekst>
                    <br />
                    <div>
                        Ta en titt på disse sidene:
                        <ul>
                            <li>
                                <Lenke href="/sosialhjelp/innsyn/demo">Demoside for innsyn</Lenke>
                            </li>
                            <li>
                                <Lenke href="/sosialhjelp/innsyn/">Saksoversikt</Lenke>
                            </li>
                        </ul>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default VeiviserPlaceholder;
