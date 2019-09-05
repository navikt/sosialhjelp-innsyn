import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import React from "react";

const Feilside = () => (
    <Panel className="panel-uthevet panel-uthevet-luft-under">
        <Innholdstittel>Beklager. Tekniske problemer</Innholdstittel>
        <br/>
        <Normaltekst>Vennligst prøv igjen senere.</Normaltekst>
    </Panel>
);

export default Feilside;
