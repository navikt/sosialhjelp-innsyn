import React, {useState} from "react";
import Panel from "nav-frontend-paneler";
import "./saksoversikt.less";
import {isAfter, isBefore, subMonths} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import {Normaltekst, Systemtittel, Undertittel} from "nav-frontend-typografi";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
import {Select} from "nav-frontend-skjema";
import SakPanel from "./sakpanel/SakPanel";
import Paginering from "../components/paginering/Paginering";
import {Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {parse} from "query-string";
import {history} from "../configureStore";
import {REST_STATUS} from "../utils/restUtils";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import useUtbetalingerExistsService from "../utbetalinger/service/useUtbetalingerExistsService";

const SaksoversiktDineSaker: React.FC<{saker: Sakstype[]}> = ({saker}) => {
    const [periode, setPeriode] = useState<string>("alle");

    const utbetalingerExistsService = useUtbetalingerExistsService(12);
    let utbetalingerExists: boolean =
        utbetalingerExistsService.restStatus === REST_STATUS.OK ? utbetalingerExistsService.payload : false;

    let filtrerteSaker: Sakstype[];

    const tolkPeriode = (periode: string) => {
        return Number(periode);
    };

    const velgPeriode = (value: any) => {
        setPeriode(value.target.value);
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
                <Systemtittel className="dine_soknader_panel_overskrift">Dine søknader</Systemtittel>
                <div className="knapp_og_periode_container">
                    <a href="/sosialhjelp/soknad/informasjon" className="knapp">
                        Ny søknad
                    </a>
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
                <Panel className="panel-glippe-over">
                    <Normaltekst>Vi finner ingen søknader for denne perioden.</Normaltekst>
                    <Normaltekst>Har du søkt på papir, har vi dessverre ikke mulighet til å vise den her.</Normaltekst>
                </Panel>
            )}

            <>
                {utbetalingerExists && <DineUtbetalingerPanel />}

                <Subheader className="panel-luft-over">
                    <Undertittel>Relatert informasjon</Undertittel>
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
