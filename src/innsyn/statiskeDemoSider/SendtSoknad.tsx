import React from 'react';
import Historikk from "../../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";

const SendtSoknad: React.FC = () => {
	return (
		<>
			<SoknadsStatus
				leserData={false}
				status={SoknadsStatusEnum.SENDT}
			/>

			<Oppgaver oppgaver={[]}/>

			<VedleggUtbetalingerLenker
				vedlegg={[]}
			/>

			<Historikk
				leserData={false}
				hendelser={[
					{
						tidspunkt: "2018-10-04T13:42:00.134",
						beskrivelse: "Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune",
						filUrl: null
					}
				]}
			/>


		</>
	);
};

export default SendtSoknad;


