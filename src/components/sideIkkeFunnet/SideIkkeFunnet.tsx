import * as React from "react";
import {Panel, BodyLong, Heading, Link} from "@navikt/ds-react";
import styled from "styled-components";
import {useEffect} from "react";
import {setBreadcrumbs} from "../../utils/breadcrumbs";

const PageWrapper = styled(Panel)`
    margin: 2rem auto;

    h2 {
        margin: 0.5rem 0 1.5rem;
    }
`;

const SideIkkeFunnet: React.FC<{}> = () => {
    useEffect(() => {
        setBreadcrumbs({title: "Feil: Fant ikke siden  ", url: "/"});
    }, []);

    return (
        <PageWrapper>
            <Heading level="1" size="large" spacing>
                Fant ikke siden
            </Heading>
            <BodyLong spacing>
                Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
            </BodyLong>
            <BodyLong spacing>
                Du kan <Link href="https://www.nav.no/">gå til forsiden nav.no</Link>, eller{" "}
                <Link href="https://www.nav.no/no/Ditt+NAV">gå til Ditt NAV</Link>.
            </BodyLong>

            <BodyLong spacing>
                <Link href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">
                    Meld gjerne fra om denne lenken.
                </Link>
                .
            </BodyLong>

            <Heading level="2" size="medium" spacing>
                In English
            </Heading>
            <BodyLong spacing>The page you requested cannot be found.</BodyLong>
            <BodyLong spacing>
                Go to the <Link href="https://www.nav.no/">front page</Link>, or use one of the links in the menu.
            </BodyLong>
        </PageWrapper>
    );
};

export default SideIkkeFunnet;
