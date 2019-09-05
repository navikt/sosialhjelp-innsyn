import React from 'react';
import Historikk from "../../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";

const MottattSoknadDemo: React.FC = () => {

	return (
		<>
			<SoknadsStatus
				leserData={false}
				status={SoknadsStatusEnum.MOTTATT}
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
						beskrivelse: "1. Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune",
						filUrl: "filnavn_123"
					},
					{
						tidspunkt: "2018-10-11T13:42:00.134",
						beskrivelse: "2. Søknaden med vedlegg er sendt til videre NAV Vestre Aker, Oslo kommune",
						filUrl: null
					},
					{
						tidspunkt: "2018-10-12T13:37:00.134",
						beskrivelse: "3. Søknaden er mottatt av NAV Vestre Aker, Oslo kommune",
						filUrl: "filnavn_123"
					}
					,{
						tidspunkt: "2018-10-12T13:38:00.134",
						beskrivelse: "4. Søknaden er mottatt av NAV Vestre Aker, Oslo kommune",
						filUrl: "filnavn_123"
					}
					,{
						tidspunkt: "2018-10-12T13:39:00.134",
						beskrivelse: "5. Søknaden er mottatt av NAV Vestre Aker, Oslo kommune",
						filUrl: "filnavn_123"
					}
					,{
						tidspunkt: "2018-10-12T13:42:00.134",
						beskrivelse: "6. Søknaden er mottatt av NAV Vestre Aker, Oslo kommune",
						filUrl: "filnavn_123"
					}
				]}
			/>
		</>
	);
};

export default MottattSoknadDemo;
