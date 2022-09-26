import React from "react";
import {Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";
import {BodyShort, Label} from "@navikt/ds-react";
import styled from "styled-components/macro";

interface Props {
    vilkar: Vilkar;
}

const VilkarWrapper = styled.div`
    word-wrap: break-word;

    &:not(:first-of-type) {
        margin-top: 1rem;
    }
`;
export const VilkarView: React.FC<Props> = ({vilkar}) => {
    return (
        <VilkarWrapper className={"oppgaver_detaljer"}>
            <Label as="p">{vilkar.tittel}</Label>
            {vilkar.beskrivelse && <BodyShort>{vilkar.beskrivelse}</BodyShort>}
        </VilkarWrapper>
    );
};
