import * as React from "react";
import UtropstegnSirkelGraIkon from "./UtropstegnSirkelGraIkon";
import "./SideIkkeFunnet.less";
import {BodyShort, Heading, Link} from "@navikt/ds-react";

const SideIkkeFunnet: React.FC<{}> = () => {
    return (
        <div className="sideIkkeFunnet skjema-content">
            <div className="sideIkkeFunnet__ikon">
                <UtropstegnSirkelGraIkon />
            </div>
            <Heading level="1" size="large" spacing>
                OOPS, NOE GIKK GALT
            </Heading>
            <BodyShort spacing>Vi fant ikke siden du prøvde å åpne</BodyShort>

            <ul>
                <li>
                    <Link href="https://www.nav.no">Gå til forsiden nav.no</Link>
                </li>
                <li>
                    <Link href="https://www.nav.no/no/Ditt+NAV">Gå til Ditt NAV</Link>
                </li>
                <li>
                    <Link href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">
                        Meld fra om feil
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideIkkeFunnet;
