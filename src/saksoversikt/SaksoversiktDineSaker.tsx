import React, {useEffect, useState} from "react";
import "./saksoversikt.css";
import {isAfter, isBefore} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
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
import styled from "styled-components";

const IngenSoknaderPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 4rem;
        padding-right: 4rem;
    }
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
    const itemsPerPage = 1;
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
            <div className="dine_soknader_panel ">
                <Heading level="2" size="medium" className="dine_soknader_panel_overskrift">
                    Dine søknader
                </Heading>
                <div className="knapp_og_periode_container">
                    <Button as="a" variant="primary" href="/sosialhjelp/soknad/informasjon">
                        Ny søknad
                    </Button>
                </div>
            </div>

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

                <InfoPanelContainer>
                    <InfoPanel tittel={"Meld fra om endringer"} href={"https://www.nav.no/sosialhjelp/gi-beskjed"}>
                        Du må melde fra dersom din økonomiske situasjon endres.
                    </InfoPanel>

                    <InfoPanel tittel={"Klagerettigheter"} href={"https://www.nav.no/sosialhjelp/klage"}>
                        Har du fått et vedtak fra oss som du mener er feil, kan du klage.
                    </InfoPanel>

                    <InfoPanel tittel={"Personopplysninger"} href={"https://www.nav.no/sosialhjelp/personopplysninger"}>
                        Hvordan vi behandler dine personopplysninger
                    </InfoPanel>
                </InfoPanelContainer>
            </>
        </>
    );
};

export default SaksoversiktDineSaker;
