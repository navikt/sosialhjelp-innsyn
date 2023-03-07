import * as React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AppBanner from "../appBanner/AppBanner";
import {BodyLong, Heading, Link} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";
import {Feilside as FeilsideEnum} from "../../redux/innsynsdata/innsynsdataReducer";
import {useTranslation} from "react-i18next";
import styled from "styled-components/macro";
import {setBreadcrumbs} from "../../utils/breadcrumbs";

const FeilsideWrapper = styled.div.attrs({className: "blokk-center"})`
    margin-top: 2rem;
`;
export interface FeilsideProps {
    children: React.ReactNode;
}

const getFeilType = (feilside: FeilsideEnum) => {
    switch (feilside) {
        case FeilsideEnum.FINNES_IKKE:
            return "Siden finnes ikke";
        case FeilsideEnum.TEKNISKE_PROBLEMER:
            return "Tekniske problemer";
        case FeilsideEnum.IKKE_TILGANG:
            return "Ingen tilgang";
    }
};

const Feilside: React.FC<FeilsideProps> = ({children}) => {
    const feilside = useSelector((state: InnsynAppState) => state.innsynsdata.feilside);
    const {t} = useTranslation();

    useEffect(() => {
        if (feilside) {
            setBreadcrumbs({title: `Feil: ${getFeilType(feilside)}`, url: "/"});
        }
    }, [feilside]);

    if (feilside) {
        return (
            <div className="informasjon-side">
                <AppBanner />
                <FeilsideWrapper>
                    <UthevetPanel>
                        {feilside === FeilsideEnum.TEKNISKE_PROBLEMER && (
                            <>
                                <Heading level="1" size="large" spacing>
                                    Beklager, vi har dessverre tekniske problemer.
                                </Heading>
                                <BodyLong spacing>Vennligst prøv igjen senere.</BodyLong>
                            </>
                        )}
                        {feilside === FeilsideEnum.FINNES_IKKE && (
                            <>
                                <Heading level="1" size="large" spacing>
                                    {t("feilside.finnes_ikke_overskrift")}
                                </Heading>
                                <BodyLong>
                                    Vennligst gå tilbake til <Link href="/sosialhjelp/innsyn">Dine søknader</Link>
                                </BodyLong>
                            </>
                        )}
                    </UthevetPanel>
                </FeilsideWrapper>
            </div>
        );
    }

    return <>{children}</>;
};

export default Feilside;
