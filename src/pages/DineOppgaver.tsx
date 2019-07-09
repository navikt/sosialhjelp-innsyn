import React from 'react';
import Historikk from "../components/historikk/Historikk";
import SoknadsStatus, {SoknadsStatusEnum} from "../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";
import {Utfall} from "../redux/innsynsdata/innsynsdataReducer";

const DineOppgaver: React.FC = () => {

    return (
        <>
            <SoknadsStatus
                status={SoknadsStatusEnum.UNDER_BEHANDLING}
                saksStatus={[
                    {
                        tittel: "Nødhjelp",
                        status: Utfall.INNVILGET, // "innvilget",
                        vedtaksfilUrlList: []
                        // kommentarer: <Lenke href="todo">Vedtakstbrev (12.03.2019)</Lenke>
                    },
                    {
                        tittel: "Livsopphold og husleie",
                        status: Utfall.DELVIS_INNVILGET, // "under behandling"
                        vedtaksfilUrlList: []
                    }
                ]}
            />

            <Oppgaver oppgaver={
                [
                    {
                        innsendelsesfrist: "2018-10-20T07:37:00.134",
                        dokumenttype: "Strømfaktura",
                        tilleggsinformasjon: "For periode 01.01.2019 til 01.02.2019",
                        vedlegg: []
                    },
                    {
                        innsendelsesfrist: "2018-10-20T07:37:30",
                        dokumenttype: "Kopi av depositumskonto",
                        tilleggsinformasjon: "Signert av både deg og utleier",
                        vedlegg: [{
                            id: "12345",
                            filnavn: "IMG8232.JPG",
                            filstorrelse: "231 kb"
                        },
                        {
                            id: "1234567",
                            filnavn: "IMG8782.JPG",
                            filstorrelse: "431 kb"
                        }]
                    }
                ]
            }/>

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

export default DineOppgaver;
