import React from "react";
import {UrlResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import {REST_STATUS} from "../../utils/restUtils";
import DokumentSendt from "../ikoner/DokumentSendt";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {Alert, BodyLong, Heading} from "@navikt/ds-react";
import {UthevetPanelEkstraPadding} from "../paneler/UthevetPanel";
import {TittelOgIkon} from "./TittelOgIkon";
import SoknadsStatusLenke from "./SoknadsStatusLenke";
import {SoknadsStatusEnum} from "./soknadsStatusUtils";
import styled from "styled-components";

const StyledDetaljer = styled(BodyLong)`
    margin-bottom: 4px;
    margin-top: 1rem;
`;

const StyledAlert = styled(Alert)`
    margin-top: 1rem;
`;

const SoknadsStatusUtenInnsyn = (props: {
    restStatus: REST_STATUS;
    tidspunktSendt: string | null;
    navKontor: string | null;
    filUrl: UrlResponse | null;
}) => {
    return (
        <>
            {props.restStatus === REST_STATUS.FEILET && (
                <StyledAlert variant="warning">
                    Vi klarte ikke å hente inn all informasjon om status på søknaden din. Du kan forsøke å oppdatere
                    siden, eller prøve igjen senere.
                </StyledAlert>
            )}
            <UthevetPanelEkstraPadding>
                <TittelOgIkon>
                    <Heading level="2" size="large">
                        Søknaden er sendt
                    </Heading>
                    <DokumentSendt />
                </TittelOgIkon>
                <SoknadsStatusLenke status={SoknadsStatusEnum.SENDT} />

                {props.tidspunktSendt && props.navKontor && props.filUrl && (
                    <StyledDetaljer>
                        {`Sendt den `}
                        <DatoOgKlokkeslett bareDato={true} tidspunkt={props.tidspunktSendt} brukKortMaanedNavn={true} />
                        {` til ${props.navKontor} `}
                        <EksternLenke href={props.filUrl.link}>{props.filUrl.linkTekst}</EksternLenke>
                    </StyledDetaljer>
                )}
            </UthevetPanelEkstraPadding>
        </>
    );
};

export default SoknadsStatusUtenInnsyn;
