import * as React from "react";
import {getSkalViseVilkarView} from "./VilkarUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {SaksStatusState} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import BinderSmall from "../ikoner/BinderSmall";
import ChecklistSmall from "../ikoner/ChecklistSmall";
import EkspanderbartIkonPanel, {PanelIkon} from "../paneler/EkspanderbartIkonPanel";
import "./vilkar.less";
import {BodyShort, Label} from "@navikt/ds-react";

const OppgaveInformasjon: React.FC = () => {
    const innsynSaksStatusListe: SaksStatusState[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.saksStatus
    );
    const skalViseVilkarView = getSkalViseVilkarView(innsynSaksStatusListe);

    if (!skalViseVilkarView) {
        return (
            <EkspanderbartIkonPanel
                tittel={<FormattedMessage id={"oppgaver.vilkar.tittel"} />}
                underTittel={<FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />}
                ikon={PanelIkon.CHECKLIST}
            >
                <div className={"vilkar-bolk-med-symbol-wrapper space-below"}>
                    <div className={"vilkar-bolk-symbol-wrapper svg-width-addition"}>
                        <ChecklistSmall />
                    </div>
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
                    <div className={"vilkar-bolk-symbol-wrapper"}>
                        <BinderSmall />
                    </div>
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
