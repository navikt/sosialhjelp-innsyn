import * as React from "react";
import {harSakMedInnvilgetEllerDelvisInnvilget} from "./VilkarUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {DokumentasjonKrav, SaksStatusState, Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import EkspanderbartIkonPanel from "../paneler/EkspanderbartIkonPanel";
import {BodyShort, Label} from "@navikt/ds-react";
import {Attachment, List} from "@navikt/ds-icons";
import styled from "styled-components";

const StyledContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const StyledIconWithText = styled.div`
    display: flex;
    align-items: normal;
    flex-direction: row;
`;

const StyledIcon = styled.div`
    margin-right: 1rem;
`;

interface Props {
    dokumentasjonkrav: DokumentasjonKrav[];
    vilkar: Vilkar[];
}

const OppgaveInformasjon: React.FC<Props> = ({dokumentasjonkrav, vilkar}) => {
    const innsynSaksStatusListe: SaksStatusState[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.saksStatus
    );

    const harLevertDokumentasjonkrav: Boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.harLevertTidligereDokumentasjonkrav
    );

    const harSakInnvilgetEllerDelvisInnvilget = harSakMedInnvilgetEllerDelvisInnvilget(innsynSaksStatusListe);
    const harSaker = innsynSaksStatusListe && innsynSaksStatusListe.length > 0;

    if (
        harSakInnvilgetEllerDelvisInnvilget &&
        vilkar.length === 0 &&
        dokumentasjonkrav.length === 0 &&
        harSaker &&
        !harLevertDokumentasjonkrav
    ) {
        return (
            <EkspanderbartIkonPanel
                tittel={<FormattedMessage id={"oppgaver.vilkar.tittel"} />}
                underTittel={<FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />}
            >
                <StyledContainer>
                    <StyledIconWithText>
                        <StyledIcon>
                            <List width="1.5rem" height="1.5rem" />
                        </StyledIcon>
                        <div>
                            <Label>
                                <FormattedMessage id={"oppgaver.vilkar"} />
                            </Label>
                            <BodyShort>
                                <FormattedMessage id={"oppgaver.vilkar.beskrivelse"} />
                            </BodyShort>
                        </div>
                    </StyledIconWithText>
                    <StyledIconWithText>
                        <StyledIcon>
                            <Attachment width="1.5rem" height="1.5rem" />
                        </StyledIcon>
                        <div>
                            <Label>
                                <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav"} />
                            </Label>
                            <BodyShort>
                                <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav.beskrivelse"} />
                            </BodyShort>
                        </div>
                    </StyledIconWithText>
                </StyledContainer>
            </EkspanderbartIkonPanel>
        );
    } else {
        return null;
    }
};

export default OppgaveInformasjon;
