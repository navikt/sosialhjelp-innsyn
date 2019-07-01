import React from 'react';
import { Panel } from "nav-frontend-paneler";
import {Normaltekst, Systemtittel, Element} from "nav-frontend-typografi";
import "./historikk.less";

interface HistorikkElement {
	tittel: string;
	innhold: React.ReactNode;
}
interface Props {
	historikk: HistorikkElement[];
}

const Historikk: React.FC<Props> = ({historikk}) => {
	return (<>
			<Panel className="panel-luft-over">
				<Systemtittel>Historikk</Systemtittel>
			</Panel>
			<Panel className="panel-glippe-over">
				<ul className="historikk">
					{historikk.map((element: HistorikkElement, index) => {
						return (
							<li key={index}>
								<Element>{element.tittel}</Element>
								<Normaltekst>{element.innhold}</Normaltekst>
							</li>
						);
					})}
				</ul>
			</Panel>
		</>
	);
};

export default Historikk;
