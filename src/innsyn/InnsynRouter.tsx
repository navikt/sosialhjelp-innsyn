import React from "react";
import AppBanner from "../components/appBanner/AppBanner";
import {ConnectedRouter} from "connected-react-router";
import {history} from "../configureStore";
import BrodsmuleSti from "../components/brodsmuleSti/BrodsmuleSti";
import {Route, Switch} from "react-router";
import InnsynDemoMeny from "./statiskeDemoSider/InnsynDemoMeny";
import SaksStatus from "./SaksStatus";
import Feilside from "../components/feilside/Feilside";
import VedleggsSide from "./VedleggsSide";
import Linkside from "../components/linkside/Linkside";
import SideIkkeFunnet from "../components/sideIkkeFunnet/SideIkkeFunnet";
import Utbetalinger from "../utbetalinger/Utbetalinger";

const InnsynRouter: React.FC = () => {

    // Utbetalingssiden trenger bredere spaltebredde enn de andre sidene
    const ekstraSpaltebredde: boolean = window.location.pathname.match(/\/utbetaling/) !== null;

    return (
        <div className="informasjon-side">
            <AppBanner/>
            <ConnectedRouter history={history}>
                <div className={"blokk-center " + (ekstraSpaltebredde ? "blokk-center--wide" : "")}>
                    <BrodsmuleSti/>
                    <Switch>
                        <Route exact path="/innsyn/utbetaling" component={Utbetalinger}/>
                        <Route exact path="/innsyn/demo" component={InnsynDemoMeny}/>
                        <Route exact path="/innsyn/:soknadId/status" component={SaksStatus}/>
                        <Route exact path="/innsyn/:soknadId/vedlegg" component={VedleggsSide}/>
                        <Route exact path="/innsyn/feil" component={Feilside}/>
                        <Route exact path="/innsyn/:soknadId/feil" component={Feilside}/>
                        <Route exact path="/innsyn/link" component={Linkside}/>
                        <Route component={SideIkkeFunnet}/>
                    </Switch>
                </div>
            </ConnectedRouter>
        </div>
    );
};

export default InnsynRouter;
