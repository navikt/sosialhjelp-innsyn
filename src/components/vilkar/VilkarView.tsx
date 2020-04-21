import * as React from "react";
import {Panel} from "nav-frontend-paneler";
import DocumentChecklist from "../ikoner/DocumentChecklist";
import {getSkalViseVilkarView} from "./VilkarUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {SaksStatusState} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {EkspanderbartpanelBase} from "nav-frontend-ekspanderbartpanel";
import {Element, Normaltekst} from "nav-frontend-typografi";
import BinderSmall from "../ikoner/BinderSmall";
import ChecklistSmall from "../ikoner/ChecklistSmall";
import "./vilkar.less";

const VilkarView: React.FC = () => {
    const innsynSaksStatusListe: SaksStatusState[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.saksStatus
    );
    const skalViseVilkarView = getSkalViseVilkarView(innsynSaksStatusListe);

    const heading = (
        <div className={"vilkarview-heading-wrapper"}>
            <div>
                <DocumentChecklist />
            </div>
            <div className={"vilkar-heading-tekst"}>
                <Element>
                    <FormattedMessage id={"oppgaver.vilkar.tittel"} />
                </Element>
                <Normaltekst>
                    <FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />
                </Normaltekst>
            </div>
        </div>
    );

    if (skalViseVilkarView) {
        return (
            <Panel className={"panel-glippe-over"}>
                <EkspanderbartpanelBase apen={true} heading={heading} className={"react-collapse-animation"}>
                    <Panel className={"vilkar-ekspanderbart-panel-innhold-wrapper"}>
                        <div className={"vilkar-bolk-med-symbol-wrapper space-below"}>
                            <div className={"vilkar-bolk-symbol-wrapper svg-width-addition"}>
                                <ChecklistSmall />
                            </div>
                            <div className={"vilkar-bolk-tekst-wrapper"}>
                                <Element>
                                    <FormattedMessage id={"oppgaver.vilkar"} />
                                </Element>
                                <Normaltekst>
                                    <FormattedMessage id={"oppgaver.vilkar.beskrivelse"} />
                                </Normaltekst>
                            </div>
                        </div>
                        <div className={"vilkar-bolk-med-symbol-wrapper"}>
                            <div className={"vilkar-bolk-symbol-wrapper"}>
                                <BinderSmall />
                            </div>
                            <div className={"vilkar-bolk-tekst-wrapper"}>
                                <Element>
                                    <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav"} />
                                </Element>
                                <Normaltekst>
                                    <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav.beskrivelse"} />
                                </Normaltekst>
                            </div>
                        </div>
                    </Panel>
                </EkspanderbartpanelBase>
            </Panel>
        );
    } else {
        return null;
    }
};

export default VilkarView;
