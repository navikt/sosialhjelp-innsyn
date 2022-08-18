import * as React from "react";
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import AppBanner from "../appBanner/AppBanner";
import {BodyLong, Heading, Link} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";
import {Feilside as FeilsideEnum} from "../../redux/innsynsdata/innsynsdataReducer";
import {FormattedMessage} from "react-intl";
import styled from "styled-components/macro";
import {setBreadcrumbs} from "../../utils/breadcrumbs";

const FeilsideWrapper = styled.div.attrs({className: "blokk-center"})`
    margin-top: 2rem;
`;
export interface FeilsideProps {
    children: React.ReactNode;
}

const Feilside: React.FC<FeilsideProps> = ({children}) => {
    const feilside = useSelector((state: InnsynAppState) => state.innsynsdata.feilside);

    useEffect(() => {
        if (feilside) {
            setBreadcrumbs();
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
                                    <FormattedMessage id="feilside.finnes_ikke_overskrift" />
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
