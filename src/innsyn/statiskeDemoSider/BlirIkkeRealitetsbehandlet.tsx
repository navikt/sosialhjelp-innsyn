import React from 'react';
import Historikk from "../../components/historikk/Historikk";
import SoknadsStatus, { SoknadsStatusEnum } from "../../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../../components/oppgaver/Oppgaver";
import VedleggUtbetalingerLenker from "../../components/vedleggUtbetalingerLenker/VedleggUtbetalingerLenker";
import {Utfall} from "../../redux/innsynsdata/innsynsdataReducer";

const BlirIkkeRealitetsbehandlet: React.FC = () => {
    return (
        <>
            <SoknadsStatus
                leserData={false}
                status={SoknadsStatusEnum.FERDIGBEHANDLET}
                saksStatus={[
                    {
                        tittel: "Livsopphold",
                        status: Utfall.KAN_IKKE_VISES,
                        vedtaksfilUrlList: [],
                        melding: "Vi kan ikke vise behandlingsstatus på nett." +
                            "Dette kan være fordi søknaden behandles sammen med en annen søknad du " +
                            "har sendt inn. Ta kontakt med ditt NAV-kontor dersom du har spørsmål."
                    }
                ]}
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
                        filUrl: "filnavn_123"
                    },
                    {
                        tidspunkt: "2018-10-11T13:42:00.134",
                        beskrivelse: "Søknaden med vedlegg er sendt til videre NAV Vestre Aker, Oslo kommune",
                        filUrl: null
                    },
                    {
                        tidspunkt: "2018-10-12T13:37:00.134",
                        beskrivelse: "Søknaden er mottatt av NAV Vestre Aker, Oslo kommune",
                        filUrl: "filnavn_123"
                    }
                ]}
            />

        </>
    );
};

export default BlirIkkeRealitetsbehandlet;
