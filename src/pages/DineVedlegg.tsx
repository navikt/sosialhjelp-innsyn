import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import {Hovedknapp} from "nav-frontend-knapper";
import {AvsnittBoks} from "../components/paneler/layoutKomponenter";
import {Vedlegg} from "../redux/innsynsdata/innsynsdataReducer";
import VedleggView from "../components/vedlegg/VedleggView";

const DineVedlegg: React.FC = () => {
    const mockVedlegg: Vedlegg[] = [
        {
            filnavn: "filnavn 1",
            url: "http://todo1",
            storrelse: 2342,
            beskrivelse: "besrkivelse",
            datoLagtTil: "2018-10-11T13:42:00.134"
        },
        {
            filnavn: "filnavn 2",
            url: "http://todo2",
            storrelse: 23422,
            beskrivelse: "besrkivelse",
            datoLagtTil: "2018-10-11T13:42:00.134"
        },
        {
            filnavn: "filnavn 3",
            url: "http://todo3",
            storrelse: 232,
            beskrivelse: "besrkivelse",
            datoLagtTil: "2018-10-11T13:42:00.134"
        },
    ];
    return (
        <Panel className="vedlegg_liste_panel">
            <Innholdstittel className="layout_overskriftboks">Dine vedlegg</Innholdstittel>
            <Normaltekst>
                Hvis du har andre vedlegg du ønsker å gi oss, kan de lastes opp her.
            </Normaltekst>
            <AvsnittBoks>
                <Hovedknapp>Ettersend vedlegg</Hovedknapp>
            </AvsnittBoks>
            <VedleggView vedlegg={ mockVedlegg } leserData={false}/>
        </Panel>
    );
};

export default DineVedlegg;


