import React, {useMemo} from "react";
import {isAfter, isBefore} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import InfoPanel, {InfoPanelWrapper} from "../components/Infopanel/InfoPanel";
import SakPanel from "./sakpanel/SakPanel";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import {logButtonOrLinkClick} from "../utils/amplitude";
import {Alert, Button, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {SakspanelMaxBreakpoint} from "../styles/constants";
import {SaksListeResponse} from "../generated/model";
import {useTranslation} from "next-i18next";
import useIsMobile from "../utils/useIsMobile";
import PaginertListe from "../components/paginering/PaginertListe";
import {sort} from "remeda";

const StyledDineSoknaderPanel = styled(Panel)`
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding-left: 64px; /* Tar høyde for bredden på svg-ikon i SaksPanel */

    @media screen and (max-width: ${SakspanelMaxBreakpoint}) {
        padding-left: var(--a-spacing-4);
    }
`;

const StyledHeading = styled(Heading)`
    white-space: nowrap;
`;

const itemsPerPage = 10;

const sammenlignSaksTidspunkt = (a: SaksListeResponse, b: SaksListeResponse) => {
    if (isAfter(Date.parse(a.sistOppdatert), Date.parse(b.sistOppdatert))) {
        return -1;
    }
    if (isBefore(Date.parse(a.sistOppdatert), Date.parse(b.sistOppdatert))) {
        return 1;
    }
    return 0;
};

const SaksoversiktDineSaker: React.FC<{saker: SaksListeResponse[]}> = ({saker}) => {
    const {t} = useTranslation();

    // En kjappere måte å finne ut om vi skal vise utbetalinger... Desverre så støtter ikke alle fagsystemene utbetalinger ennå.
    // Vi ønsker å gå over til denne med tanke på ytelse...

    // const harInnsysnssaker = saker.filter(sak => sak.kilde === "innsyn-api").length > 0;

    const sorterteSaker = useMemo(() => sort(saker, sammenlignSaksTidspunkt), [saker]);
    /* Paginering */
    const isMobile = useIsMobile();
    return (
        <>
            <Alert variant={"warning"} style={{marginBottom: "2rem"}}>
                {t("varsling.kommende.utbetalinger")}
            </Alert>
            <DineUtbetalingerPanel />
            <section aria-labelledby="dine-soknader">
                <StyledDineSoknaderPanel>
                    <StyledHeading level="2" size="medium" id="dine-soknader">
                        {t("dineSoknader")}
                    </StyledHeading>
                    <Button
                        onClick={() => logButtonOrLinkClick("Ny søknad")}
                        as="a"
                        variant="primary"
                        href="/sosialhjelp/soknad/informasjon"
                    >
                        {t("nySoknad")}
                    </Button>
                </StyledDineSoknaderPanel>
                <PaginertListe countPerPage={itemsPerPage} variant={isMobile ? "last_flere" : "paginert"}>
                    {sorterteSaker.map((sak: SaksListeResponse) => (
                        <li key={sak.fiksDigisosId ?? sak.soknadTittel}>
                            <SakPanel
                                fiksDigisosId={sak.fiksDigisosId}
                                tittel={sak.soknadTittel}
                                oppdatert={sak.sistOppdatert}
                                url={sak.url}
                                kilde={sak.kilde}
                            />
                        </li>
                    ))}
                </PaginertListe>
            </section>

            <section aria-labelledby="relatert-informasjon">
                <Subheader className="panel-luft-over">
                    <Heading level="2" size="small" id="relatert-informasjon">
                        {t("relatertInfo")}
                    </Heading>
                </Subheader>

                <InfoPanelWrapper>
                    <InfoPanel
                        tittel={t("endringer.tittel")}
                        href={"https://www.nav.no/okonomisk-sosialhjelp#meld-fra-ved-endring"}
                    >
                        {t("endringer.detaljer")}
                    </InfoPanel>
                    <InfoPanel tittel={t("klage.tittel")} href={"https://www.nav.no/okonomisk-sosialhjelp#klage"}>
                        {t("klage.detaljer")}
                    </InfoPanel>
                    <InfoPanel
                        tittel={t("personopplysninger.tittel")}
                        href={"https://www.nav.no/personopplysninger-sosialhjelp"}
                    >
                        {t("personopplysninger.detaljer")}
                    </InfoPanel>
                </InfoPanelWrapper>
            </section>
        </>
    );
};

export default SaksoversiktDineSaker;
