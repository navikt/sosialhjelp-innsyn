import React, {useEffect, useState} from "react";
import "./saksoversikt.css";
import {isAfter, isBefore} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import InfoPanel, {InfoPanelWrapper} from "../components/Infopanel/InfoPanel";
import SakPanel from "./sakpanel/SakPanel";
import Paginering from "../components/paginering/Paginering";
import {Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {parse} from "query-string";
import {history} from "../configureStore";
import {REST_STATUS} from "../utils/restUtils";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import useUtbetalingerExistsService from "../utbetalinger/service/useUtbetalingerExistsService";
import {logAmplitudeEvent} from "../utils/amplitude";
import {BodyShort, Button, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components/macro";
import {SakspanelMaxBreakpoint} from "../styles/constants";

const IngenSoknaderPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 4rem;
        padding-right: 4rem;
    }
`;

const StyledDineSoknaderPanel = styled(Panel)`
    margin-top: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
    padding-left: 64px; /* Tar høyde for bredden på svg-ikon i SaksPanel */

    @media screen and (max-width: ${SakspanelMaxBreakpoint}) {
        padding-left: var(--navds-spacing-4);
    }
`;

const StyledHeading = styled(Heading)`
    white-space: nowrap;
`;

const SaksoversiktDineSaker: React.FC<{saker: Sakstype[]}> = ({saker}) => {
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

    const utbetalingerExistsService = useUtbetalingerExistsService(15);
    const utbetalingerExists: boolean =
        utbetalingerExistsService.restStatus === REST_STATUS.OK ? utbetalingerExistsService.payload : false;

    useEffect(() => {
        if (!pageLoadIsLogged && utbetalingerExistsService.restStatus === REST_STATUS.OK) {
            logAmplitudeEvent("Hentet innsynsdata", {
                harUtbetalinger: utbetalingerExists,
            });
            //Ensure only one logging to amplitude
            setPageLoadIsLogged(true);
        }
    }, [utbetalingerExists, pageLoadIsLogged, utbetalingerExistsService.restStatus]);

    // En kjappere måte å finne ut om vi skal vise utbetalinger... Desverre så støtter ikke alle fagsystemene utbetalinger ennå.
    // Vi ønsker å gå over til denne med tanke på ytelse...
    // const harInnsysnssaker = saker.filter(sak => sak.kilde === "innsyn-api").length > 0;

    function sammenlignSaksTidspunkt(a: Sakstype, b: Sakstype) {
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
    const pageParam = parse(history.location.search)["side"];
    if (pageParam) {
        let parsedPageNumber = parseInt(pageParam.toString(), 10);
        if (!isNaN(parsedPageNumber)) {
            currentPage = parsedPageNumber - 1;
        }
    }
    const lastPage = Math.ceil(saker.length / itemsPerPage);
    if (currentPage >= lastPage) {
        history.push({search: "?side=" + lastPage});
    }
    const paginerteSaker: Sakstype[] = saker.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageClick = (page: number) => {
        history.push({search: "?side=" + (page + 1)});
    };

    // noinspection HtmlUnknownTarget
    return (
        <>
            <StyledDineSoknaderPanel>
                <StyledHeading level="2" size="medium">
                    Dine søknader
                </StyledHeading>
                <Button as="a" variant="primary" href="/sosialhjelp/soknad/informasjon">
                    Ny søknad
                </Button>
            </StyledDineSoknaderPanel>

            {paginerteSaker.map((sak: Sakstype) => {
                let key = sak.fiksDigisosId;

                if (sak.fiksDigisosId == null) {
                    key = sak.soknadTittel;
                }
                return (
                    <SakPanel
                        fiksDigisosId={sak.fiksDigisosId}
                        tittel={sak.soknadTittel}
                        status={sak.status}
                        oppdatert={sak.sistOppdatert}
                        key={key}
                        url={sak.url}
                        kilde={sak.kilde}
                        antallNyeOppgaver={sak.antallNyeOppgaver}
                        harBlittLastetInn={sak.harBlittLastetInn}
                        border={false}
                    />
                );
            })}

            {saker.length > itemsPerPage && (
                <Paginering
                    pageCount={lastPage}
                    forcePage={currentPage}
                    onPageChange={(page: number) => handlePageClick(page)}
                />
            )}

            {saker.length === 0 && (
                <IngenSoknaderPanel className="panel-glippe-over">
                    <BodyShort spacing>Vi finner ingen søknader for denne perioden.</BodyShort>
                    <BodyShort spacing>
                        Har du søkt på papir, har vi dessverre ikke mulighet til å vise den her.
                    </BodyShort>
                </IngenSoknaderPanel>
            )}

            <>
                {utbetalingerExists && <DineUtbetalingerPanel />}

                <Subheader className="panel-luft-over">
                    <Heading level="2" size="small">
                        Relatert informasjon
                    </Heading>
                </Subheader>

                <InfoPanelWrapper>
                    <InfoPanel
                        tittel={"Meld fra om endringer"}
                        href={"https://www.nav.no/okonomisk-sosialhjelp#meld-fra-ved-endring"}
                    >
                        Du må melde fra dersom din økonomiske situasjon endres.
                    </InfoPanel>

                    <InfoPanel tittel={"Klagerettigheter"} href={"https://www.nav.no/okonomisk-sosialhjelp#klage"}>
                        Har du fått et vedtak fra oss som du mener er feil, kan du klage.
                    </InfoPanel>

                    <InfoPanel tittel={"Personopplysninger"} href={"https://www.nav.no/personopplysninger-sosialhjelp"}>
                        Hvordan vi behandler dine personopplysninger
                    </InfoPanel>
                </InfoPanelWrapper>
            </>
        </>
    );
};

export default SaksoversiktDineSaker;
