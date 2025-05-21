import { BodyLong, Heading, Link, Panel } from "@navikt/ds-react";
import * as React from "react";
import { getTranslations } from "next-intl/server";

const SideIkkeFunnet = async () => {
    const t = await getTranslations("common");
    const appTitle = t("app.tittel");
    return (
        <Panel className="my-8 mx-auto">
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
                <Link href={`${process.env.NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/innsyn`}>your applications</Link>, or
                use one of the links in the menu.
            </BodyLong>
        </Panel>
    );
};

export default SideIkkeFunnet;
