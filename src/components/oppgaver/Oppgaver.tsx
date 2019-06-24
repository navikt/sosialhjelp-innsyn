import { Panel } from "nav-frontend-paneler";
import { Systemtittel } from "nav-frontend-typografi";
import React from "react";

interface Props {
	children: string|React.ReactChildren;
}

const Oppgaver: React.FC<Props> = ({children}) => {
	return (
		<>
			<Panel className="panel-luft-over">
				<Systemtittel>Dine oppgaver</Systemtittel>
			</Panel>
			<Panel className="panel-glippe-over">
				{children}
			</Panel>
		</>
	);
};

export default Oppgaver;
