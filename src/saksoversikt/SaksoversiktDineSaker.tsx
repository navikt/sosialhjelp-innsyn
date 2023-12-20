import React from "react";
import {isAfter, isBefore} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import InfoPanel, {InfoPanelWrapper} from "../components/Infopanel/InfoPanel";
import SakPanel from "./sakpanel/SakPanel";
import Paginering from "../components/paginering/Paginering";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import {logButtonOrLinkClick} from "../utils/amplitude";
import {Button, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {SakspanelMaxBreakpoint} from "../styles/constants";
import {SaksListeResponse} from "../generated/model";
import styles from "../styles/lists.module.css";
import {useTranslation} from "next-i18next";
import {useRouter} from "next/router";
import Link from "next/link";

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

const SaksoversiktDineSaker: React.FC<{saker: SaksListeResponse[]}> = ({saker}) => {
    const router = useRouter();
    const {t} = useTranslation();

    // En kjappere måte å finne ut om vi skal vise utbetalinger... Desverre så støtter ikke alle fagsystemene utbetalinger ennå.
    // Vi ønsker å gå over til denne med tanke på ytelse...
    // const harInnsysnssaker = saker.filter(sak => sak.kilde === "innsyn-api").length > 0;

    function sammenlignSaksTidspunkt(a: SaksListeResponse, b: SaksListeResponse) {
        if (isAfter(Date.parse(a.sistOppdatert), Date.parse(b.sistOppdatert))) {
            return -1;
        }
        if (isBefore(Date.parse(a.sistOppdatert), Date.parse(b.sistOppdatert))) {
            return 1;
        }
        return 0;
    }
    saker.sort(sammenlignSaksTidspunkt);

    /* Paginering */
    const itemsPerPage = 10;
    let currentPage = 0;
    const pageParam = router.query["side"];
    if (pageParam) {
        let parsedPageNumber = parseInt(pageParam.toString(), 10);
        if (!isNaN(parsedPageNumber)) {
            currentPage = parsedPageNumber - 1;
        }
    }
    const lastPage = Math.ceil(saker.length / itemsPerPage);
    if (currentPage >= lastPage) {
        router.push({search: "?side=" + lastPage});
    }
    const paginerteSaker: SaksListeResponse[] = saker.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageClick = (page: number) => {
        router.push({search: "?side=" + (page + 1)});
    };
    // noinspection HtmlUnknownTarget
    return (
        <>
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
                <ul className={styles.unorderedList}>
                    {paginerteSaker.map((sak: SaksListeResponse) => (
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
                </ul>
                {saker.length > itemsPerPage && (
                    <Paginering
                        pageCount={lastPage}
                        forcePage={currentPage}
                        onPageChange={(page: number) => handlePageClick(page)}
                    />
                )}
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
