import React from 'react';
import Historikk from "../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";

const SendtSoknad: React.FC = () => {
	return (
		<>
			<SoknadsStatus status={SoknadsStatusEnum.SENDT}/>

			<Oppgaver oppgaver={[]}/>

			<VedleggUtbetalingerLenker />

			<Historikk
				hendelser={[
					{
						tidspunkt: "19.06.2019 klokken 17:56",
						beskrivelse: "Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune",
						filUrl: null
					}
				]}
			/>


		</>
	);
};

export default SendtSoknad;


