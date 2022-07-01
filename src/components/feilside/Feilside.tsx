import * as React from "react";
import "./Feilside.less";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AppBanner from "../appBanner/AppBanner";
import Brodsmulesti from "../brodsmuleSti/BrodsmuleSti";
import {BodyLong, Heading, Link} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";
import {Feilside as FeilsideEnum} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";

export interface FeilsideProps {
    children: React.ReactNode;
}

const Feilside: React.FC<FeilsideProps> = ({children}) => {
    const feilside = useSelector((state: InnsynAppState) => state.innsynsdata.feilside);

    if (feilside) {
        return (
            <div className="informasjon-side">
                <AppBanner />
                <div className="feilside blokk-center">
                    <Brodsmulesti tittel="Innsyn" foreldreside={{tittel: "Økonomisk sosialhjelp", path: "/"}} />
                    <UthevetPanel className="panel-uthevet-luft-under">
                        {feilside === FeilsideEnum.FINNES_IKKE && (
                            <>
                                <Heading level="1" size="large" spacing>
                                    <FormattedMessage id="feilside.finnes_ikke_overskrift" />
                                </Heading>
                                <BodyLong>
                                    Vennligst gå tilbake til <Link href="/sosialhjelp/innsyn">Dine søknader</Link>
                                </BodyLong>
                            </>
                        )}
                    </UthevetPanel>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default Feilside;
