import React from "react";
import styled from "styled-components";
import {BodyLong, Heading} from "@navikt/ds-react";

import {UthevetPanel} from "../components/paneler/UthevetPanel";
import MainLayout from "../components/MainLayout";

const FeilsideWrapper = styled.div.attrs({className: "blokk-center"})`
    margin-top: 2rem;
`;

//TODO: i18n?
const ServerError = (): React.JSX.Element => (
    <MainLayout title="Tekniske problemer">
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
