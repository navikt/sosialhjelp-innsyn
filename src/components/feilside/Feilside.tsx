import * as React from "react";
import "./Feilside.less";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AppBanner from "../appBanner/AppBanner";
import Brodsmulesti from "../brodsmuleSti/BrodsmuleSti";
import {BodyShort, Heading} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";
import {Feilside as FeilsideEnum} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import EksternLenke from "../eksternLenke/EksternLenke";

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
                        {feilside === FeilsideEnum.TEKNISKE_PROBLEMER && (
                            <>
                                <Heading level="1" size="xlarge" spacing>
                                    Beklager, vi har dessverre tekniske problemer.
                                </Heading>
                                <BodyShort spacing>Vennligst prøv igjen senere.</BodyShort>
                            </>
                        )}
                        {feilside === FeilsideEnum.FINNES_IKKE && (
                            <>
                                <Heading level="1" size="xlarge" spacing>
                                    <FormattedMessage id="feilside.finnes_ikke_overskrift" />
                                </Heading>
                                <BodyShort>
                                    Vennligst gå tilbake til{" "}
                                    <EksternLenke href="/sosialhjelp/innsyn">Dine søknader</EksternLenke>
                                </BodyShort>
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
