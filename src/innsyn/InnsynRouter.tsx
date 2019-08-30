import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import BrodsmuleSti from "../components/brodsmuleSti/BrodsmuleSti";
import {Route, Switch} from "react-router";
import InnsynTestMeny from "./InnsynTestMeny";
import SaksStatus from "../pages/SaksStatus";
import Feilside from "../pages/Feilside";
import DebugSide from "../pages/DebugSide";
import SendtSoknad from "../pages/SendtSoknad";
import MottattSoknad from "../pages/MottattSoknad";
import UnderBehandling from "../pages/UnderBehandling";
import FerdigBehandlet from "../pages/FerdigBehandlet";
import VedleggsPage from "../pages/VedleggsPage";
import DineVedlegg from "../pages/DineVedlegg";
import DineOppgaver from "../pages/DineOppgaver";
import LangHistorikk from "../pages/LangHistorikk";

const InnsynRouter: React.FC = () => {
    return (
        <div className="informasjon-side">
            <AppBanner/>
            <ConnectedRouter history={history}>
                <div className="blokk-center">
                    <BrodsmuleSti/>
                    <Switch>
                        <Route exact path="/innsyn/" component={InnsynTestMeny} />
                        <Route exact path="/innsyn/status" component={SaksStatus} />
                        <Route exact path="/innsyn/:soknadId/status" component={SaksStatus} />
                        <Route exact path="/innsyn/feil" component={Feilside} />
                        <Route exact path="/innsyn/debug" component={DebugSide} />
                        <Route exact path="/innsyn/sendt" component={SendtSoknad} />
                        <Route exact path="/innsyn/mottatt" component={MottattSoknad} />
                        <Route exact path="/innsyn/behandling" component={UnderBehandling} />
                        <Route exact path="/innsyn/behandlet" component={FerdigBehandlet} />
                        <Route exact path="/innsyn/vedlegg" component={VedleggsPage} />
                        <Route exact path="/innsyn/dineVedlegg" component={DineVedlegg} />
                        <Route exact path="/innsyn/oppgaver" component={DineOppgaver} />
                        <Route exact path="/innsyn/historikk" component={LangHistorikk} />
                    </Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default InnsynRouter;
