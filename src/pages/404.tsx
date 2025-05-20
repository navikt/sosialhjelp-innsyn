import styled from "styled-components";
import { BodyLong, Heading, Link, Panel } from "@navikt/ds-react";
import * as React from "react";
import { useTranslations } from "next-intl";
import { GetStaticProps } from "next";

import MainLayout from "../components/MainLayout";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";

const PageWrapper = styled(Panel)`
    margin: 2rem auto;

    h2 {
        margin: 0.5rem 0 1.5rem;
    }
`;

const SideIkkeFunnet = () => {
    const t = useTranslations("common");
    useUpdateBreadcrumbs(() => [{ title: "Feil: Fant ikke siden  ", url: "/" }]);

    const appTitle = t("app.tittel");
    return (
        <MainLayout title={appTitle} bannerTitle={appTitle}>
            <PageWrapper>
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
            </PageWrapper>
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
    return {
        props: {
            messages: await import(`../../messages/${params?.locale ?? "nb"}.json`),
        },
    };
};

export default SideIkkeFunnet;
