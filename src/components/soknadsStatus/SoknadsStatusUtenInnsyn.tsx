import React from "react";
import {UrlResponse} from "../../redux/innsynsdata/innsynsdataReducer";
import EksternLenke from "../eksternLenke/EksternLenke";
import Lastestriper from "../lastestriper/Lasterstriper";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import DokumentSendt from "../ikoner/DokumentSendt";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import {BodyLong, Heading} from "@navikt/ds-react";
import {UthevetPanelEkstraPadding} from "../paneler/UthevetPanel";
import {TittelOgIkon} from "./TittelOgIkon";
import SoknadsStatusLenke from "./SoknadsStatusLenke";
import {SoknadsStatusEnum} from "./soknadsStatusUtils";
import styled from "styled-components";

const StyledDetaljer = styled(BodyLong)`
    margin-bottom: 4px;
    margin-top: 1rem;
`;

const SoknadsStatusUtenInnsyn = (props: {
    restStatus: REST_STATUS;
    tidspunktSendt: string | null;
    navKontor: string | null;
    filUrl: UrlResponse | null;
}) => {
    return (
        <UthevetPanelEkstraPadding>
            <TittelOgIkon>
                {skalViseLastestripe(props.restStatus) && <Lastestriper linjer={1} />}
                {props.restStatus !== REST_STATUS.FEILET && (
                    <>
                        <Heading level="2" size="large">
                            Søknaden er sendt
                        </Heading>
                        <DokumentSendt />
                    </>
                )}
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
    );
};

export default SoknadsStatusUtenInnsyn;
