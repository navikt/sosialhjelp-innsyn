import * as React from "react";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {DokumentasjonKrav, SaksStatusState, Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import EkspanderbartIkonPanel from "../paneler/EkspanderbartIkonPanel";
import {BodyShort, Label} from "@navikt/ds-react";
import {Attachment, List} from "@navikt/ds-icons";
import styled from "styled-components";
import {harSakMedInnvilgetEllerDelvisInnvilget} from "./vilkar/VilkarUtils";

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 20px 12px;
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

    const fagsystemHarDokumentasjonkrav: Boolean = useSelector(
        (state: InnsynAppState) => state.innsynsdata.fagsystemHarDokumentasjonkrav
    );

    const harSakInnvilgetEllerDelvisInnvilget = harSakMedInnvilgetEllerDelvisInnvilget(innsynSaksStatusListe);
    const harSaker = innsynSaksStatusListe && innsynSaksStatusListe.length > 0;

    if (
        harSakInnvilgetEllerDelvisInnvilget &&
        vilkar.length === 0 &&
        dokumentasjonkrav.length === 0 &&
        harSaker &&
        !fagsystemHarDokumentasjonkrav &&
        !harLevertDokumentasjonkrav
    ) {
        return (
            <EkspanderbartIkonPanel
                tittel={<FormattedMessage id={"oppgaver.vilkar.tittel"} />}
                underTittel={<FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />}
            >
                <StyledContainer>
                    <>
                        <List width="1.5rem" height="1.5rem" style={{marginTop: "6px"}} aria-hidden title="liste" />
                        <div>
                            <Label as="p">
                                <FormattedMessage id={"oppgaver.vilkar"} />
                            </Label>
                            <BodyShort>
                                <FormattedMessage id={"oppgaver.vilkar.beskrivelse"} />
                            </BodyShort>
                        </div>
                    </>
                    <>
                        <Attachment
                            width="1.5rem"
                            height="1.5rem"
                            style={{marginTop: "6px"}}
                            aria-hidden
                            title="vedlegg"
                        />
                        <div>
                            <Label as="p">
                                <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav"} />
                            </Label>
                            <BodyShort>
                                <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav.beskrivelse"} />
                            </BodyShort>
                        </div>
                    </>
                </StyledContainer>
            </EkspanderbartIkonPanel>
        );
    } else {
        return null;
    }
};

export default OppgaveInformasjon;
