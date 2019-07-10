import React from 'react';
import { Panel } from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import "./historikk.less";
import {Hendelse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {FormattedDate, FormattedTime, FormattedMessage} from "react-intl";

interface Props {
	hendelser: null|Hendelse[];
}

const Historikk: React.FC<Props> = ({hendelser}) => {
	if (hendelser === null) {
		return null;
	}
	return (<>
			<Panel className="panel-luft-over">
				<Systemtittel><FormattedMessage id="historikk.tittel" /></Systemtittel>
			</Panel>
			<Panel className="panel-glippe-over">
				<ul className="historikk">
					{hendelser.map((hendelse: Hendelse, index) => {
						const tidspunkt = new Date(hendelse.tidspunkt).toLocaleDateString();
						return (
							<li key={index}>
								<Element>
									<FormattedDate value={new Date(hendelse.tidspunkt)}/>
									&nbsp;klokken&nbsp;
									<FormattedTime value={new Date(hendelse.tidspunkt)}/>
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
