import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {Hovedknapp} from "nav-frontend-knapper";
import {AvsnittBoks} from "../../components/paneler/layoutKomponenter";
import VedleggView from "../../components/vedlegg/VedleggView";
import {FormattedMessage} from "react-intl";
// import mockVedlegg from "./mockVedlegg";
import mockVedleggMange from "./mockVedlegg_mange";

const DineVedlegg: React.FC = () => {
    return (

        <Panel className="vedlegg_liste_panel">
            <Innholdstittel className="layout_overskriftboks"><FormattedMessage id="vedlegg.tittel" /></Innholdstittel>
            <Normaltekst>
                <FormattedMessage id="vedlegg.ingress" />
            </Normaltekst>
            <AvsnittBoks>
                <Hovedknapp type="hoved"><FormattedMessage id="vedlegg.ettersend_knapptekst" /></Hovedknapp>
            </AvsnittBoks>
            <VedleggView vedlegg={ mockVedleggMange } leserData={false}/>
        </Panel>

    );
};

export default DineVedlegg;


