import React, {useEffect, useState} from "react";
import "./saksoversikt.less";
import {isAfter, isBefore, subMonths} from "date-fns";
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
import {BodyShort, Button, Heading, Panel, Select} from "@navikt/ds-react";
import styled from "styled-components";

const IngenSoknaderPanel = styled(Panel)`
    @media screen and (min-width: 641px) {
        padding-left: 4rem;
        padding-right: 4rem;
    }
`;

const SaksoversiktDineSaker: React.FC<{saker: Sakstype[]}> = ({saker}) => {
    const [periode, setPeriode] = useState<string>("alle");
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

    const utbetalingerExistsService = useUtbetalingerExistsService(12);
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

    let filtrerteSaker: Sakstype[];

    const tolkPeriode = (periode: string) => {
        return Number(periode);
    };

    const velgPeriode = (value: any) => {
        setPeriode(value.target.value);
        logAmplitudeEvent("Søknadsoversikt: Filtrer søknader etter periode", {valgtPeriode: value});
    };

    if (periode === "alle") filtrerteSaker = saker;
    else {
        const periodeLengde = tolkPeriode(periode);
        filtrerteSaker = saker.filter((sak) =>
            isAfter(Date.parse(sak.sistOppdatert), subMonths(new Date(), periodeLengde))
        );
    }
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
    filtrerteSaker.sort(sammenlignSaksTidspunkt);

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
    const lastPage = Math.ceil(filtrerteSaker.length / itemsPerPage);
    if (currentPage >= lastPage) {
        history.push({search: "?side=" + lastPage});
    }
    const paginerteSaker: Sakstype[] = filtrerteSaker.slice(
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
                    <div className="periodevelger_container">
                        <Select
                            onChange={(value: any) => velgPeriode(value)}
                            label="Vis for"
                            className="periode_velger"
                        >
                            <option value="alle">Alle</option>
                            <option value="12">Siste år</option>
                            <option value="6">Siste 6 måneder&nbsp;</option>
                            <option value="3">Siste 3 måneder&nbsp;</option>
                            <option value="1">Siste måned</option>
                        </Select>
                    </div>
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

            {filtrerteSaker.length > itemsPerPage && (
                <Paginering
                    pageCount={lastPage}
                    forcePage={currentPage}
                    onPageChange={(page: number) => handlePageClick(page)}
                />
            )}

            {filtrerteSaker.length === 0 && (
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

                    <InfoPanel tittel={"Mer om sosialhjelp"} href={"https://www.nav.no/sosialhjelp/"}>
                        Lær mer om økonomisk sosialhjelp på nav.no
                    </InfoPanel>
                </InfoPanelContainer>
            </>
        </>
    );
};

export default SaksoversiktDineSaker;
