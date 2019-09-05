import React from "react";
import AppBanner from "../../components/appBanner/AppBanner";
import BrodsmuleSti from "../../components/brodsmuleSti/BrodsmuleSti";
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";

const VeiviserPlaceholder: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner/>
            <div className="blokk-center">
                <BrodsmuleSti/>
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
                            <li><Lenke href="/sosialhjelp/innsyn/demo">Demoside for innsyn</Lenke></li>
                            <li><Lenke href="/sosialhjelp/innsyn/">Saksoversikt</Lenke></li>
                        </ul>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default VeiviserPlaceholder;
