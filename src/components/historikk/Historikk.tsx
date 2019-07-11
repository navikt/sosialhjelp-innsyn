import React from 'react';
import {Panel} from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import "./historikk.less";
import {Hendelse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedMessage} from "react-intl";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";

interface Props {
    hendelser: null | Hendelse[];
}

function sorterHendelserKronologisk(hendelser: Hendelse[]): Hendelse[] {
    return hendelser.sort((a: Hendelse, b: Hendelse) => {
        let c = new Date(a.tidspunkt);
        let d = new Date(b.tidspunkt);
        return c > d ? -1 : c < d ? 1 : 0;
    });
}

const Historikk: React.FC<Props> = ({hendelser}) => {
    if (hendelser === null) {
        return null;
    }
    const sorterteHendelser = sorterHendelserKronologisk(hendelser);
    return (<>
            <Panel className="panel-luft-over">
                <Systemtittel><FormattedMessage id="historikk.tittel"/></Systemtittel>
            </Panel>
            <Panel className="panel-glippe-over">
                <ul className="historikk">
                    {sorterteHendelser.map((hendelse: Hendelse, index: number) => {
                        return (
                            <li key={index}>
                                <Element>
                                    <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt}/>
                                </Element>
                                <Normaltekst>{hendelse.beskrivelse}</Normaltekst>
                                {hendelse.filUrl && (
                                    <EksternLenke href={"url_todo_" + hendelse.filUrl}>Se vedtaksbrev</EksternLenke>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </Panel>
        </>
    );
};

export default Historikk;
