import React, {useState} from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import {isAfter, subMonths} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import {Normaltekst, Systemtittel, Undertittel} from "nav-frontend-typografi";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
import {Select} from 'nav-frontend-skjema';
import SakPanel from "./sakpanel/SakPanel";
import Paginering from "../components/paginering/Paginering";
import {Sakstype} from "../redux/innsynsdata/innsynsdataReducer";
import {parse} from "query-string";
import {history} from "../configureStore";

const SaksoversiktDineSaker: React.FC<{saker: Sakstype[]}> = ({saker}) => {
    const [periode, setPeriode] = useState<string>("alle");

    let filtrerteSaker:Sakstype[];

    const tolkPeriode = (periode: string) =>{
        return Number(periode);
    };

    const velgPeriode = (value: any) => {
        setPeriode(value.target.value);
    };

    if (periode === "alle")
        filtrerteSaker = saker;
    else {
        const periodeLengde = tolkPeriode(periode);
        filtrerteSaker = saker.filter(sak => isAfter(Date.parse(sak.sistOppdatert), subMonths(new Date(), periodeLengde)));
    }

    /* Paginering */
    const itemsPerPage = 10;
    let currentPage = 0;
    const pageParam = parse(history.location.search)["side"];
    if(pageParam) {
        let parsedPageNumber = parseInt(pageParam.toString(), 10);
        if(!isNaN(parsedPageNumber)) {
            currentPage = parsedPageNumber - 1;
        }
    }
    const lastPage = Math.ceil(filtrerteSaker.length / itemsPerPage);
    if(currentPage >= lastPage) {
        history.push({search: "?side=" + (lastPage)})
    }
    const paginerteSaker:Sakstype[] = filtrerteSaker.slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage);

    const handlePageClick = (page: number) => {
        history.push({search: "?side=" + (page + 1)})
    };

    return (
        <>
            <div className="dine_soknader_panel ">
                <div className="tittel_og_knapp_container">
                    <Systemtittel className="dine_soknader_panel_overskrift">Dine søknader</Systemtittel>
                    <a href="/sosialhjelp/soknad/informasjon" className="knapp">
                        Ny søknad
                    </a>
                </div>
                <div className="periodevelger_container">
                    <Select onChange={(value: any) => velgPeriode(value)} label='Vis for'
                            className="periode_velger">
                        <option value='alle'>Alle</option>
                        <option value='12'>Siste år</option>
                        <option value='6'>Siste 6 måneder&nbsp;</option>
                        <option value='3'>Siste 3 måneder&nbsp;</option>
                        <option value='1'>Siste måned</option>
                    </Select>
                </div>
            </div>

        { paginerteSaker.map((sak:Sakstype) => {
                let key = sak.fiksDigisosId;

                if(sak.fiksDigisosId == null) {
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
                        antallNyeOppgaver={sak.antallNyeOppgaver}
                        harBlittLastetInn={sak.harBlittLastetInn}
                    />
                )
            })
        }

        { filtrerteSaker.length > itemsPerPage && (
            <Paginering
                pageCount={lastPage}
                forcePage={currentPage}
                onPageChange={(page: number) => handlePageClick(page)}
            />
        )}

        {filtrerteSaker.length === 0 && (
            <Panel className="panel-glippe-over">
                <Normaltekst>Vi finner ingen søknader for denne perioden.</Normaltekst>
                <Normaltekst>
                    Har du søkt på papir, har vi dessverre ikke mulighet til å
                    vise den her.
                </Normaltekst>
            </Panel>
        )}

        <>
            {/*<DineUtbetalingerPanel/>*/}

            <Subheader className="panel-luft-over">
                <Undertittel>Relatert informasjon</Undertittel>
            </Subheader>

            <InfoPanelContainer>
                <InfoPanel tittel={"Meld fra om endringer"} href={"https://www.nav.no/sosialhjelp/artikkel/124876"}>
                    Du må melde fra dersom din økonomiske situasjon endres.
                </InfoPanel>

                <InfoPanel tittel={"Klagerettigheter"}
                           href={"https://www.nav.no/sosialhjelp/artikkel/124875"}>
                    Har du fått et vedtak fra oss som du mener er feil, kan du klage.
                </InfoPanel>

                <InfoPanel tittel={"Mer om sosialhjelp"} href={"https://www.nav.no/sosialhjelp/"}>
                    Lær mer om økonomisk sosialhjelp på nav.no
                </InfoPanel>
            </InfoPanelContainer>
        </>
    </>
    )
};

export default SaksoversiktDineSaker;
