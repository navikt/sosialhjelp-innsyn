import * as React from "react";
import {Innholdstittel, Normaltekst} from "nav-frontend-typografi";
import "./Feilside.less";
import {useSelector} from "react-redux";
import {Panel} from "nav-frontend-paneler";
import {InnsynAppState} from "../../redux/reduxTypes";
import AppBanner from "../appBanner/AppBanner";
import Brodsmulesti from "../brodsmuleSti/BrodsmuleSti";

export interface FeilsideProps {
    children: React.ReactNode;
}

const Feilside: React.FC<FeilsideProps> = ({children}) => {
    let skalViseFeilside = useSelector((state: InnsynAppState) => state.innsynsdata.skalViseFeilside);

    if (skalViseFeilside) {
        return (
            <div className="informasjon-side">
                <AppBanner />
                <div className={"blokk-center"}>
                    <Brodsmulesti tittel="Innsyn" foreldreside={{tittel: "Økonomisk sosialhjelp", path: "/"}} />
                    <Panel className="panel-uthevet panel-uthevet-luft-under">
                        <Innholdstittel>Beklager. Tekniske problemer</Innholdstittel>
                        <br />
                        <Normaltekst>Vennligst prøv igjen senere.</Normaltekst>
                    </Panel>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default Feilside;
