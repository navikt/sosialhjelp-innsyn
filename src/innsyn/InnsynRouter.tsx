import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import BrodsmuleSti from "../components/brodsmuleSti/BrodsmuleSti";
import {Route, Switch} from "react-router";
import InnsynDemoMeny from "./statiskeDemoSider/InnsynDemoMeny";
import SaksStatus from "./SaksStatus";
import Feilside from "../components/feilside/Feilside";
import DebugSide from "./DebugSide";
import SendtSoknad from "./statiskeDemoSider/SendtSoknad";
import MottattSoknadDemo from "./statiskeDemoSider/MottattSoknadDemo";
import UnderBehandling from "./statiskeDemoSider/UnderBehandling";
import FerdigBehandlet from "./statiskeDemoSider/FerdigBehandlet";
import VedleggsPage from "./VedleggsSide";
import DineVedlegg from "./statiskeDemoSider/DineVedlegg";
import DineOppgaver from "./statiskeDemoSider/DineOppgaver";
import LangHistorikkDemo from "./statiskeDemoSider/LangHistorikkDemo";
import Saksoversikt from "../saksoversikt/Saksoversikt";
import VedtakEtterFerdigBehandlet from "./statiskeDemoSider/VedtakEtterFerdigBehandlet";
import BlirIkkeRealitetsbehandlet from "./statiskeDemoSider/BlirIkkeRealitetsbehandlet";
import Kvalifiseringsprogram from "./statiskeDemoSider/Kvalifiseringsprogram";
import UtbetalingerDemo from "../utbetalinger/statiskeDemoSider/UtbetalingerDemo";
import VedleggsSide from "./VedleggsSide";

const InnsynRouter: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner/>
            <ConnectedRouter history={history}>
                <div className="blokk-center">
                    <BrodsmuleSti/>
                    <Switch>
                        <Route exact path="/innsyn/" component={Saksoversikt} />
                        <Route exact path="/innsyn/demo" component={InnsynDemoMeny} />
                        <Route exact path="/innsyn/status" component={SaksStatus} />
                        <Route exact path="/innsyn/:soknadId/status" component={SaksStatus} />
                        <Route exact path="/innsyn/:soknadId/vedlegg" component={VedleggsSide} />
                        <Route exact path="/innsyn/feil" component={Feilside} />

                        {/* Demo routes: */}
                        <Route exact path="/innsyn/demo/sendt" component={SendtSoknad} />
                        <Route exact path="/innsyn/demo/mottatt" component={MottattSoknadDemo} />
                        <Route exact path="/innsyn/demo/behandling" component={UnderBehandling} />
                        <Route exact path="/innsyn/demo/behandlet" component={FerdigBehandlet} />
                        <Route exact path="/innsyn/demo/vedlegg" component={VedleggsPage} />
                        <Route exact path="/innsyn/demo/dineVedlegg" component={DineVedlegg} />
                        <Route exact path="/innsyn/demo/oppgaver" component={DineOppgaver} />
                        <Route exact path="/innsyn/demo/historikk" component={LangHistorikkDemo} />
                        <Route exact path="/innsyn/demo/vedtakEtterFerdigBehandlet" component={VedtakEtterFerdigBehandlet} />
                        <Route exact path="/innsyn/demo/blirIkkeRealitetsbehandlet" component={BlirIkkeRealitetsbehandlet} />
                        <Route exact path="/innsyn/demo/saksoversikt" component={Saksoversikt} />
                        <Route exact path="/innsyn/demo/kvalifiseringsprogram" component={Kvalifiseringsprogram} />
                        <Route exact path="/innsyn/demo/utbetalinger" component={UtbetalingerDemo} />

                        {/* Debug routes: */}
                        <Route exact path="/innsyn/debug" component={DebugSide} />
                    </Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default InnsynRouter;
