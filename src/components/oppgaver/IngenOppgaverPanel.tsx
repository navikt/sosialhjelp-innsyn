import * as React from 'react';
import TodoList from "../ikoner/TodoList";
import {Element, Normaltekst} from "nav-frontend-typografi";
import {FormattedMessage} from "react-intl";
import PaperClip from "../ikoner/PaperClip";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {Oppgave, SaksStatusState} from "../../redux/innsynsdata/innsynsdataReducer";
import {getSkalViseIngenOppgaverPanel} from "./oppgaverUtilities";
import {Panel} from "nav-frontend-paneler";

interface Props {
    leserData: boolean | undefined
}

const IngenOppgaverPanel: React.FC<Props> = (props: Props) => {

    const oppgaver: Oppgave[] = useSelector((state: InnsynAppState) => state.innsynsdata.oppgaver);
    const innsynSaksStatusListe: SaksStatusState[] = useSelector((state: InnsynAppState) => state.innsynsdata.saksStatus);
    const skalViseIngenOppgaverPanel = getSkalViseIngenOppgaverPanel(oppgaver, innsynSaksStatusListe)

    if (skalViseIngenOppgaverPanel && !props.leserData){
        return (
            <Panel
                className={"panel-glippe-over oppgaver_panel "}
            >
                <div>
                    <span style={{float: "left", marginTop: "6px"}}>
                        <TodoList/>
                    </span>
                    <div style={{paddingLeft: "38px"}}>
                        <Element>
                            <FormattedMessage id="oppgaver.ingen_oppgaver"/>
                        </Element>
                        <Normaltekst>
                            <FormattedMessage id="oppgaver.beskjed"/>
                        </Normaltekst>
                    </div>
                </div>
                <div style={{marginTop: "20px"}}>
                    <span style={{float: "left", marginTop: "6px"}}>
                        <PaperClip/>
                    </span>
                    <div style={{paddingLeft: "38px"}}>
                        <Element>
                            <FormattedMessage id="oppgaver.andre_dokumenter"/>
                        </Element>
                        <Normaltekst>
                            <FormattedMessage id="oppgaver.andre_dokumenter_beskjed"/>
                        </Normaltekst>
                    </div>
                </div>
            </Panel>
        )
    }
    return null;
};

export default IngenOppgaverPanel;