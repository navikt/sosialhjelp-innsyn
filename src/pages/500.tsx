import React from "react";
import {UthevetPanel} from "../components/paneler/UthevetPanel";
import styled from "styled-components";
import MainLayout from "../components/MainLayout";
import {BodyLong, Heading} from "@navikt/ds-react";

const FeilsideWrapper = styled.div.attrs({className: "blokk-center"})`
    margin-top: 2rem;
`;

//TODO: i18n?
const ServerError = (): React.JSX.Element => (
    <MainLayout title={"Tekniske problemer"}>
        <div className="informasjon-side">
            <FeilsideWrapper>
                <UthevetPanel>
                    <>
                        <Heading level="1" size="large" spacing>
                            Beklager, vi har dessverre tekniske problemer.
                        </Heading>
                        <BodyLong spacing>Vennligst prøv igjen senere.</BodyLong>
                    </>
                </UthevetPanel>
            </FeilsideWrapper>
        </div>
    </MainLayout>
);

export default ServerError;
