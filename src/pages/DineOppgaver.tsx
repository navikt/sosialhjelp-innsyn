import React from 'react';
import Historikk from "../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";
import Lenke from "nav-frontend-lenker";

const DineOppgaver: React.FC = () => {

    return (
        <>
            <SoknadsStatus
                status={SoknadsStatusEnum.UNDER_BEHANDLING}
                statusdetaljer={[
                    {
                        beskrivelse: "Nødhjelp",
                        status: "innvilget",
                        kommentarer: <Lenke href="todo">Vedtakstbrev (12.03.2019)</Lenke>
                    },
                    {
                        beskrivelse: "Livsopphold og husleie",
                        status: "under behandling"
                    }
                ]}
            />

            <Oppgaver/>

            <VedleggUtbetalingerLenker />

            <Historikk
                historikk={[
                    {
                        tittel: "19.06.2019 klokken 17:56",
                        innhold: <span>Søknaden med vedlegg er sendt til NAV Sagene, Oslo kommune</span>
                    },
                    {
                        tittel: "20.06.2019 klokken 20:19",
                        innhold: <span>Søknaden med vedlegg er sendt til videre NAV Vestre Aker, Oslo kommune</span>
                    },
                    {
                        tittel: "21.06.2019 klokken 12:02",
                        innhold: <span>Søknaden er mottatt av NAV Vestre Aker, Oslo kommune</span>
                    }


                ]}
            />
        </>
    );
};

export default DineOppgaver;
