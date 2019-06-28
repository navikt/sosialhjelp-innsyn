import React from 'react';
import { Panel } from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
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
							<b>{element.tittel}</b>
							<br/>
							{element.innhold}
						</li>
					);
				})}
				</ul>
			</Panel>
		</>
	);
};

export default Historikk;
