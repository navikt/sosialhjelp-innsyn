import styled from "styled-components";
import {BodyLong, Heading, Link, Panel} from "@navikt/ds-react";
import * as React from "react";
import useUpdateBreadcrumbs from "../hooks/useUpdateBreadcrumbs";
import MainLayout from "../components/MainLayout";
import {useTranslation} from "next-i18next";
import {GetStaticProps} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const PageWrapper = styled(Panel)`
    margin: 2rem auto;

    h2 {
        margin: 0.5rem 0 1.5rem;
    }
`;

const SideIkkeFunnet: React.FC<{}> = () => {
    const {t} = useTranslation();
    useUpdateBreadcrumbs(() => [{title: "Feil: Fant ikke siden  ", url: "/"}]);

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
                    Bruk gjerne søket, menyen eller <Link href="https://www.nav.no/">gå til forsiden </Link>.
                </BodyLong>

                <BodyLong spacing>
                    <Link href="https://www.nav.no/person/kontakt-oss/nb/tilbakemeldinger/feil-og-mangler">
                        Meld gjerne fra om denne lenken
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
        </MainLayout>
    );
};

export const getStaticProps: GetStaticProps = async ({locale}) => {
    return {
        props: {
            ...(await serverSideTranslations(locale ?? "nb", ["common"])),
        },
    };
};

export default SideIkkeFunnet;
