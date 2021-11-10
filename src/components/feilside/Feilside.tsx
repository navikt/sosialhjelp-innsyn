import * as React from "react";
import "./Feilside.less";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AppBanner from "../appBanner/AppBanner";
import Brodsmulesti from "../brodsmuleSti/BrodsmuleSti";
import {BodyShort, Heading} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";

export interface FeilsideProps {
    children: React.ReactNode;
}

const Feilside: React.FC<FeilsideProps> = ({children}) => {
    let skalViseFeilside = useSelector((state: InnsynAppState) => state.innsynsdata.skalViseFeilside);

    if (skalViseFeilside) {
        return (
            <div className="informasjon-side">
                <AppBanner />
                <div className="feilside blokk-center">
                    <Brodsmulesti tittel="Innsyn" foreldreside={{tittel: "Økonomisk sosialhjelp", path: "/"}} />
                    <UthevetPanel className="panel-uthevet-luft-under">
                        <Heading level="1" size="xlarge" spacing>
                            Beklager. Tekniske problemer
                        </Heading>
                        <BodyShort spacing>Vennligst prøv igjen senere.</BodyShort>
                    </UthevetPanel>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default Feilside;
