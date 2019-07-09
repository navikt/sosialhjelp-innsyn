import React from 'react';
import Historikk from "../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";

const MottattSoknad: React.FC = () => {

	return (
		<>
			<SoknadsStatus status={SoknadsStatusEnum.MOTTATT}/>

			<Oppgaver oppgaver={[]}/>

			<VedleggUtbetalingerLenker />

			<Historikk
				hendelser={[
					{
						tidspunkt: "19.06.2019 klokken 17:56",
						beskrivelse: "Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune",
						filUrl: "filnavn_123"
					},
					{
						tidspunkt: "20.06.2019 klokken 20:19",
						beskrivelse: "Søknaden med vedlegg er sendt til videre NAV Vestre Aker, Oslo kommune",
						filUrl: null
					},
					{
						tidspunkt: "21.06.2019 klokken 12:02",
						beskrivelse: "Søknaden er mottatt av NAV Vestre Aker, Oslo kommune",
						filUrl: "filnavn_123"
					}
				]}
			/>
		</>
	);
};

export default MottattSoknad;
