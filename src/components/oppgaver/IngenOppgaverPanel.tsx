import * as React from "react";
import {FormattedMessage} from "react-intl";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {
    DokumentasjonEtterspurt,
    DokumentasjonKrav,
    SaksStatusState,
    Vilkar,
} from "../../redux/innsynsdata/innsynsdataReducer";
import {getSkalViseVilkarView} from "../vilkar/VilkarUtils";
import {BodyShort, Label, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {Attachment, Task} from "@navikt/ds-icons";

const StyledPanel = styled(Panel)`
    margin: 1.5rem 0;
`;

interface Props {
    dokumentasjonEtterspurt: DokumentasjonEtterspurt[] | null;
    dokumentasjonkrav: DokumentasjonKrav[];
    vilkar: Vilkar[];
    leserData: boolean | undefined;
}

const IngenOppgaverPanel: React.FC<Props> = ({dokumentasjonkrav, vilkar, dokumentasjonEtterspurt, leserData}) => {
    const innsynSaksStatusListe: SaksStatusState[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.saksStatus
    );

    const finnesOppgaver = (oppgaveArray: any) => {
        return oppgaveArray && Array.isArray(oppgaveArray) && oppgaveArray.length > 0;
    };

    const skalViseIngenOppgaverPanel = () => {
        return !(
            getSkalViseVilkarView(innsynSaksStatusListe) ||
            finnesOppgaver(dokumentasjonEtterspurt) ||
            finnesOppgaver(dokumentasjonkrav) ||
            finnesOppgaver(vilkar)
        );
    };

    if (skalViseIngenOppgaverPanel() && !leserData) {
        return (
            <StyledPanel className={"panel-glippe-over oppgaver_panel "}>
                <div>
                    <span style={{float: "left", marginTop: "6px"}}>
                        <Task width="1.5rem" height="1.5rem" />
                    </span>
                    <div style={{paddingLeft: "38px"}}>
                        <Label>
                            <FormattedMessage id="oppgaver.ingen_oppgaver" />
                        </Label>
                        <BodyShort>
                            <FormattedMessage id="oppgaver.beskjed" />
                        </BodyShort>
                    </div>
                </div>
                <div style={{marginTop: "20px"}}>
                    <span style={{float: "left", marginTop: "6px"}}>
                        <Attachment width="1.5rem" height="1.5rem" />
                    </span>
                    <div style={{paddingLeft: "38px"}}>
                        <Label>
                            <FormattedMessage id="oppgaver.andre_dokumenter" />
                        </Label>
                        <BodyShort>
                            <FormattedMessage id="oppgaver.andre_dokumenter_beskjed" />
                        </BodyShort>
                    </div>
                </div>
            </StyledPanel>
        );
    }
    return null;
};

export default IngenOppgaverPanel;
