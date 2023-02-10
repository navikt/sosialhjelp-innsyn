import React, {useState} from "react";
import "./saksoversikt.css";
import {isAfter, isBefore} from "date-fns";
import Subheader from "../components/subheader/Subheader";
import InfoPanel, {InfoPanelWrapper} from "../components/Infopanel/InfoPanel";
import SakPanel from "./sakpanel/SakPanel";
import Paginering from "../components/paginering/Paginering";
import {parse} from "query-string";
import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import {logAmplitudeEvent, logButtonOrLinkClick} from "../utils/amplitude";
import {Button, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components/macro";
import {SakspanelMaxBreakpoint} from "../styles/constants";
import {useLocation, useNavigate} from "react-router-dom";
import {SaksListeResponse} from "../generated/model";
import {useGetUtbetalingExists} from "../generated/utbetalinger-controller/utbetalinger-controller";
import {logWarningMessage} from "../redux/innsynsdata/loggActions";

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
    const navigate = useNavigate();
    const location = useLocation();
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const {data} = useGetUtbetalingExists(
        {month: 15},
        {
            query: {
                onError: (error) => {
                    logWarningMessage(error.message, error.navCallId);
                },
                onSuccess: (data) => {
                    if (!pageLoadIsLogged) {
                        logAmplitudeEvent("Hentet innsynsdata", {
                            harUtbetalinger: data,
                        });
                        setPageLoadIsLogged(true);
                    }
                },
            },
        }
    );

    const utbetalingerExists = !!data;

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
    const pageParam = parse(location.search)["side"];
    if (pageParam) {
        let parsedPageNumber = parseInt(pageParam.toString(), 10);
        if (!isNaN(parsedPageNumber)) {
            currentPage = parsedPageNumber - 1;
        }
    }
    const lastPage = Math.ceil(saker.length / itemsPerPage);
    if (currentPage >= lastPage) {
        navigate({search: "?side=" + lastPage});
    }
    const paginerteSaker: SaksListeResponse[] = saker.slice(
        currentPage * itemsPerPage,
        currentPage * itemsPerPage + itemsPerPage
    );

    const handlePageClick = (page: number) => {
        navigate({search: "?side=" + (page + 1)});
    };
    // noinspection HtmlUnknownTarget
    return (
        <>
            <section aria-labelledby="dine-soknader">
                <StyledDineSoknaderPanel>
                    <StyledHeading level="2" size="medium" id="dine-soknader">
                        Dine søknader
                    </StyledHeading>
                    <Button
                        onClick={() => logButtonOrLinkClick("Ny søknad")}
                        as="a"
                        variant="primary"
                        href="/sosialhjelp/soknad/informasjon"
                    >
                        Ny søknad
                    </Button>
                </StyledDineSoknaderPanel>
                {paginerteSaker.map((sak: SaksListeResponse) => (
                    <SakPanel
                        fiksDigisosId={sak.fiksDigisosId}
                        tittel={sak.soknadTittel}
                        oppdatert={sak.sistOppdatert}
                        key={sak.fiksDigisosId ?? sak.soknadTittel}
                        url={sak.url}
                        kilde={sak.kilde}
                    />
                ))}
                {saker.length > itemsPerPage && (
                    <Paginering
                        pageCount={lastPage}
                        forcePage={currentPage}
                        onPageChange={(page: number) => handlePageClick(page)}
                    />
                )}
            </section>

            {utbetalingerExists && <DineUtbetalingerPanel />}

            <section aria-labelledby="relatert-informasjon">
                <Subheader className="panel-luft-over">
                    <Heading level="2" size="small" id="relatert-informasjon">
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
            </section>
        </>
    );
};

export default SaksoversiktDineSaker;
