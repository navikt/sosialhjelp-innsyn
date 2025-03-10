import React from "react";
import { BodyLong, Heading } from "@navikt/ds-react";

import { UthevetPanel } from "../components/paneler/UthevetPanel";
import MainLayout from "../components/MainLayout";

//TODO: i18n?
const ServerError = (): React.JSX.Element => (
    <MainLayout title="Tekniske problemer">
        <div className="informasjon-side">
            <div className="blokk-center mt-8">
                <UthevetPanel>
                    <Heading level="1" size="large" spacing>
                        Beklager, vi har dessverre tekniske problemer.
                    </Heading>
                    <BodyLong spacing>Vennligst prøv igjen senere.</BodyLong>
                </UthevetPanel>
            </div>
        </div>
    </MainLayout>
);

export default ServerError;
