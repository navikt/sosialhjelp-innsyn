import React from 'react';
import Historikk from "../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";

const SendtSoknad: React.FC = () => {
	return (
		<>
			<SoknadsStatus status={SoknadsStatusEnum.SENDT}/>

			<Oppgaver>
				Du har ingen oppgaver. Du vil få beskjed hvis det er noe du må gjøre.
			</Oppgaver>

			<VedleggUtbetalingerLenker />

			<Historikk
				historikk={[
					{
						tittel: "19.06.2019 klokken 17:56",
						innhold: <span>Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune</span>
					}
				]}
			/>

		</>
	);
};

export default SendtSoknad;


