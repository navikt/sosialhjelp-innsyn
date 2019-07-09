import React from 'react';
import { Panel } from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import "./historikk.less";
import {Hendelse} from "../../redux/innsynsdata/innsynsdataReducer";
import Lenke from "nav-frontend-lenker";

interface Props {
	hendelser: null|Hendelse[];
}

const Historikk: React.FC<Props> = ({hendelser}) => {
	if (hendelser === null) {
		return null;
	}
	return (<>
			<Panel className="panel-luft-over">
				<Systemtittel>Historikk</Systemtittel>
			</Panel>
			<Panel className="panel-glippe-over">
				<ul className="historikk">
					{hendelser.map((hendelse: Hendelse, index) => {
						const tidspunkt = new Date(hendelse.tidspunkt).toLocaleDateString();
						return (
							<li key={index}>
								<Element>{tidspunkt}</Element>
								<Normaltekst>{hendelse.beskrivelse}</Normaltekst>
								{hendelse.filUrl && (
									<Lenke href={"url_todo_" + hendelse.filUrl}>Se vedtaksbrev</Lenke>
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
