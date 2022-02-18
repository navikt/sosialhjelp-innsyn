import * as React from "react";
import {getSkalViseVilkarView} from "./VilkarUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {DokumentasjonKrav, SaksStatusState, Vilkar} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import EkspanderbartIkonPanel from "../paneler/EkspanderbartIkonPanel";
import "./vilkar.less";
import {BodyShort, Label} from "@navikt/ds-react";

interface Props {
    dokumentasjonkrav: DokumentasjonKrav[];
    vilkar: Vilkar[];
}

const OppgaveInformasjon: React.FC<Props> = ({dokumentasjonkrav, vilkar}) => {
    const innsynSaksStatusListe: SaksStatusState[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.saksStatus
    );

    const skalViseVilkarView = getSkalViseVilkarView(innsynSaksStatusListe);

    if (skalViseVilkarView && !vilkar && !dokumentasjonkrav) {
        return (
            <EkspanderbartIkonPanel
                tittel={<FormattedMessage id={"oppgaver.vilkar.tittel"} />}
                underTittel={<FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />}
            >
                <div className={"vilkar-bolk-med-symbol-wrapper space-below"}>
                    <div>
                        <Label>
                            <FormattedMessage id={"oppgaver.vilkar"} />
                        </Label>
                        <BodyShort>
                            <FormattedMessage id={"oppgaver.vilkar.beskrivelse"} />
                        </BodyShort>
                    </div>
                </div>
                <div className={"vilkar-bolk-med-symbol-wrapper"}>
                    <div>
                        <Label>
                            <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav"} />
                        </Label>
                        <BodyShort>
                            <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav.beskrivelse"} />
                        </BodyShort>
                    </div>
                </div>
            </EkspanderbartIkonPanel>
        );
    } else {
        return null;
    }
};

export default OppgaveInformasjon;
