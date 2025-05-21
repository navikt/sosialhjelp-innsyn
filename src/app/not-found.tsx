import { BodyLong, Box, Heading, Link } from "@navikt/ds-react";

import Dekoratoren from "./Dekoratoren";

const SideIkkeFunnet = async () => {
    return (
        <Dekoratoren>
            <Box padding="4" borderRadius="small" className="max-w-3xl mx-auto bg-surface-action-subtle">
                <Heading level="1" size="large" spacing>
                    Fant ikke siden
                </Heading>
                <BodyLong spacing>
                    Beklager, siden kan være slettet eller flyttet, eller det var en feil i lenken som førte deg hit.
                </BodyLong>
                <BodyLong spacing>
                    Bruk gjerne søket, menyen eller{" "}
                    <Link href={`${process.env.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/innsyn`}>
                        gå til søknadsoversikten din
                    </Link>
                    .
                </BodyLong>

                <Heading level="2" size="medium" spacing>
                    In English
                </Heading>
                <BodyLong spacing>The page you requested cannot be found.</BodyLong>
                <BodyLong spacing>
                    Go to{" "}
                    <Link href={`${process.env.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/innsyn`}>your applications</Link>,
                    or use one of the links in the menu.
                </BodyLong>
            </Box>
        </Dekoratoren>
    );
};

export default SideIkkeFunnet;
