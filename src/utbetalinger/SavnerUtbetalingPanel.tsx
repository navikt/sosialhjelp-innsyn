import React from "react";
import InfoIkon from "../components/ikoner/InfoIkon";
import {BodyShort, Label, Link} from "@navikt/ds-react";

const SavnerUtbetalingPanel: React.FC = () => {
    return (
        <div className="savner_utbetaling_panel">
            <span className="infoIkon">
                <InfoIkon />
            </span>
            <Label as="p" spacing>
                Er det en utbetaling du savner?
            </Label>
            <BodyShort>Oversikten over utbetalinger for økonomisk sosialhjelp er under utvikling.</BodyShort>
            <BodyShort style={{marginTop: "18px"}}>For øyeblikket kan vi kun vise</BodyShort>
            <ul style={{marginTop: "0px"}}>
                <li>
                    <BodyShort>utbetalinger for dine digitale søknader, ikke dine søknader på papir.</BodyShort>
                </li>
                <li>
                    <BodyShort>utbetalinger som er opp til 15 måneder gamle.</BodyShort>
                </li>
                <li>
                    <BodyShort>
                        utbetalinger for økonomisk sosialhjelp.{" "}
                        <Link href="https://tjenester.nav.no/utbetalingsoversikt">
                            Andre utbetalinger finner du her.
                        </Link>
                    </BodyShort>
                </li>
            </ul>
            <BodyShort>
                Du kan se utbetalinger du skal få fremover i brevet med svar på søknaden din. Du finner dette under{" "}
                <Link href="https://www.nav.no/sosialhjelp/innsyn">dine søknader.</Link>
            </BodyShort>
        </div>
    );
};

export default SavnerUtbetalingPanel;
