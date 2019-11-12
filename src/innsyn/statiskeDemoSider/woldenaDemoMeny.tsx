import * as React from 'react';
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import Lenke from "nav-frontend-lenker";
import {getApiBaseUrlForSwagger} from "../../utils/restUtils";
import {getAbsoluteBasename} from "../../configureStore";

interface Props {
    putPropsHere?: string
}

const woldenaNavn: string = "woldena™";

const WoldenaDemoMeny: React.FC<Props> = (props: Props) => {

    const getWoldenaAdresse = (): string => {
        const url: string = window.location.href;
        if (url.indexOf('q0') > 0){
            return "https://www-q0.nav.no/sosialhjelp/fagsystem-mock/"
        }
        if (url.indexOf('q1') > 0){
            return "https://www-q1.nav.no/sosialhjelp/fagsystem-mock/"
        }
        return "https://www.digisos-test.com/sosialhjelp/fagsystem-mock/"
    };

    return (
        <div>
            <Innholdstittel>Endre innsynsdata med {woldenaNavn}</Innholdstittel>
            <Normaltekst>
                For å teste innsynsløsning, kan man laste bruke {woldenaNavn}:
            </Normaltekst>
            <br/>
            <ol className="typo-normal">
                <li>Gå til <Lenke href={ getWoldenaAdresse() } target={"_blank"}>{woldenaNavn}</Lenke></li>
                <li>Lim inn en gyldig digisos id og trykk opprett</li>
                <li>Trykk på den lenken som du opprettett rett ovenfor i Søknadsvelgeren</li>
                <li>En link vil komme opp i bokesn for <b>Oversikt over Søknader</b>. Trykk på denne for å gå til innsyn-siden.</li>
                <li>Bruk {woldenaNavn} aktivt for å endre på søknadsstatusen, f eks ved å opprette saker og legge til utbetalinger.</li>
                <li>Les mer om {woldenaNavn} på <Lenke href={"http://woldena.com"} target={"_blank"}>woldena.com</Lenke></li>
            </ol>
            <br />
        </div>
    )
};

export default WoldenaDemoMeny;