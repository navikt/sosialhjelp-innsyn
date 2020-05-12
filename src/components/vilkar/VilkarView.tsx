import * as React from "react";
import {getSkalViseVilkarView} from "./VilkarUtils";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {SaksStatusState} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import {Element, Normaltekst} from "nav-frontend-typografi";
import BinderSmall from "../ikoner/BinderSmall";
import ChecklistSmall from "../ikoner/ChecklistSmall";
import EkspanderbartIkonPanel, {PanelIkon} from "../paneler/EkspanderbartIkonPanel";
import "./vilkar.less";

const VilkarView: React.FC = () => {
    const innsynSaksStatusListe: SaksStatusState[] = useSelector(
        (state: InnsynAppState) => state.innsynsdata.saksStatus
    );
    const skalViseVilkarView = getSkalViseVilkarView(innsynSaksStatusListe);

    // const heading = (
    //     <div className={"vilkarview-heading-wrapper"}>
    //         <DocumentChecklist />
    //         <div className={"vilkar-heading-tekst"}>
    //             <Element>
    //                 <FormattedMessage id={"oppgaver.vilkar.tittel"} />
    //             </Element>
    //             <Normaltekst>
    //                 <FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />
    //             </Normaltekst>
    //         </div>
    //     </div>
    // );

    if (skalViseVilkarView) {
        return (
            <EkspanderbartIkonPanel
                tittel={<FormattedMessage id={"oppgaver.vilkar.tittel"} />}
                underTittel={<FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />}
                ikon={PanelIkon.CHECKLIST}
                defaultAapen={false}
            >
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
            </EkspanderbartIkonPanel>
        );

        // return (
        //     <div style={{border: "2px dotted purple"}}>
        //         <EkspanderbartIkonPanel
        //             tittel={<FormattedMessage id={"oppgaver.vilkar.tittel"} />}
        //             underTittel={<FormattedMessage id={"oppgaver.vilkar.tittel.tekst"} />}
        //             ikon={PanelIkon.CHECKLIST}
        //             defaultAapen={false}
        //         >
        //             <>
        //                 <div className={"vilkar-bolk-med-symbol-wrapper space-below"}>
        //                     <div className={"vilkar-bolk-symbol-wrapper svg-width-addition"}>
        //                         <ChecklistSmall />
        //                     </div>
        //                     <div className={"vilkar-bolk-tekst-wrapper"}>
        //                         <Element>
        //                             <FormattedMessage id={"oppgaver.vilkar"} />
        //                         </Element>
        //                         <Normaltekst>
        //                             <FormattedMessage id={"oppgaver.vilkar.beskrivelse"} />
        //                         </Normaltekst>
        //                     </div>
        //                 </div>
        //                 <div className={"vilkar-bolk-med-symbol-wrapper"}>
        //                     <div className={"vilkar-bolk-symbol-wrapper"}>
        //                         <BinderSmall />
        //                     </div>
        //                     <div className={"vilkar-bolk-tekst-wrapper"}>
        //                         <Element>
        //                             <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav"} />
        //                         </Element>
        //                         <Normaltekst>
        //                             <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav.beskrivelse"} />
        //                         </Normaltekst>
        //                     </div>
        //                 </div>
        //             </>
        //         </EkspanderbartIkonPanel>
        //
        //         <EkspanderbartIkonPanel
        //             tittel={"Vedtakter ditt"}
        //             underTittel={"blatti blai"}
        //             ikon={PanelIkon.BINDERS}
        //             defaultAapen={false}
        //         >
        //             <>
        //                 Her var det ikke stort
        //             </>
        //         </EkspanderbartIkonPanel>
        //
        //
        //
        //         <Panel className={"panel-glippe-over vilkar_panel"}>
        //             <EkspanderbartpanelBase apen={true} heading={heading} className={"react-collapse-animation"}>
        //                 <Panel className={"vilkar-ekspanderbart-panel-innhold-wrapper"}>
        //                     <div className={"vilkar-bolk-med-symbol-wrapper space-below"}>
        //                         <div className={"vilkar-bolk-symbol-wrapper svg-width-addition"}>
        //                             <ChecklistSmall />
        //                         </div>
        //                         <div className={"vilkar-bolk-tekst-wrapper"}>
        //                             <Element>
        //                                 <FormattedMessage id={"oppgaver.vilkar"} />
        //                             </Element>
        //                             <Normaltekst>
        //                                 <FormattedMessage id={"oppgaver.vilkar.beskrivelse"} />
        //                             </Normaltekst>
        //                         </div>
        //                     </div>
        //                     <div className={"vilkar-bolk-med-symbol-wrapper"}>
        //                         <div className={"vilkar-bolk-symbol-wrapper"}>
        //                             <BinderSmall />
        //                         </div>
        //                         <div className={"vilkar-bolk-tekst-wrapper"}>
        //                             <Element>
        //                                 <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav"} />
        //                             </Element>
        //                             <Normaltekst>
        //                                 <FormattedMessage id={"oppgaver.vilkar.dokumentasjonskrav.beskrivelse"} />
        //                             </Normaltekst>
        //                         </div>
        //                     </div>
        //                 </Panel>
        //             </EkspanderbartpanelBase>
        //         </Panel>
        //     </div>
        // );
    } else {
        return null;
    }
};

export default VilkarView;
