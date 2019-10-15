import React, {useEffect, useState} from "react";
import {Panel} from "nav-frontend-paneler";
import "./saksoversikt.less";
import {isAfter, subMonths} from "date-fns";
// import DineUtbetalingerPanel from "./dineUtbetalinger/DineUtbetalingerPanel";
import Subheader from "../components/subheader/Subheader";
import {Normaltekst, Systemtittel, Undertittel} from "nav-frontend-typografi";
import InfoPanel, {InfoPanelContainer} from "../components/Infopanel/InfoPanel";
import Veilederpanel from 'nav-frontend-veilederpanel';
import {Knapp} from "nav-frontend-knapper";
import {Select} from 'nav-frontend-skjema';
import SakPanel from "./sakpanel/SakPanel";
import {InnsynsdataSti} from "../redux/innsynsdata/innsynsdataReducer";
import {REST_STATUS} from "../utils/restUtils";
import {DispatchProps, InnsynAppState} from "../redux/reduxTypes";
import {useDispatch, useSelector} from "react-redux";
import {hentSaksdata} from "../redux/innsynsdata/innsynsDataActions";
import {LenkepanelBase} from "nav-frontend-lenkepanel/lib";
import DetteKanDuSokeOm from "../components/ikoner/DetteKanDuSokeOm";
import SlikSokerDu from "../components/ikoner/SlikSokerDu";
import IngenSoknaderFunnet from "../components/ikoner/IngenSoknaderFunnet";
import Paginering from "../components/paginering/Paginering";

export interface SakslisteProps {
    restStatus?: REST_STATUS;
}

type Props = SakslisteProps & DispatchProps;

const Saksoversikt: React.FC<REST_STATUS> = (restStatus:REST_STATUS) => {
    //const leserData = restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
    const dispatch = useDispatch();
    const saker = useSelector((state: InnsynAppState) => state.innsynsdata.saker);
    const harSaker = saker.length > 0;

    const [periode, setPeriode] = useState<string>("alle");
    var filtrerteSaker;

    function tolkPeriode(periode: string) {
        return Number(periode);
    }

    if(periode === "alle")
        filtrerteSaker = saker;
    else {
        const periodeLengde = tolkPeriode(periode);
        filtrerteSaker = saker.filter(sak => isAfter(Date.parse(sak.sistOppdatert), subMonths(new Date(), periodeLengde)));
    }

    useEffect(() => {
        dispatch(hentSaksdata(InnsynsdataSti.SAKER))
    }, [dispatch]);

    const velgPeriode = (value: any) => {
        setPeriode(value.target.value);
        setCurrentPage(0);
    };

    /* Paginering */
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState<number>(0);
    const lastPage = Math.ceil(filtrerteSaker.length / itemsPerPage);
    const paginerteSaker = filtrerteSaker.slice(currentPage * itemsPerPage, (currentPage * itemsPerPage) + itemsPerPage);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            {!harSaker &&
                <div className="soknadsOversiktSide">
                    <Veilederpanel veilederProps={{className: "soknadsOversiktVeilederpanelIkon"}} kompakt type={"plakat"} svg={<IngenSoknaderFunnet/>}>
                        <>
                            <Systemtittel className="ingenSoknaderFunnetText">Vi finner ingen digitale søknader fra deg</Systemtittel>
                            <Normaltekst className="ingenSoknaderFunnetText">Har du søkt på papir, har vi dessverre ikke mulighet til å vise den her.</Normaltekst>
                        </>
                    </Veilederpanel>
                    <div className={"soknadsOversiktLenkePanel"}>
                        <LenkepanelBase className={"soknadsOversiktLenker"} href={"./slik-soker-du"}>
                            <div className={"soknadsOversiktLenkerAlign"}>
                                <SlikSokerDu/>
                                <Systemtittel className="lenkepanel__heading lenkepanelResenter">Slik søker du</Systemtittel>
                            </div>
                        </LenkepanelBase>
                        <LenkepanelBase className={"soknadsOversiktLenker"} href={"./dette-kan-du-soke-om"}>
                            <div className={"soknadsOversiktLenkerAlign"}>
                                <DetteKanDuSokeOm/>
                                <Systemtittel className="lenkepanel__heading lenkepanelResenter">Dette kan du søke om</Systemtittel>
                            </div>
                        </LenkepanelBase>
                    </div>
                </div>
            }
            {harSaker &&
                <Panel className="panel panel-luft-over dine_soknader_panel">
                    <div className="tittel_og_knapp_container">
                        <Systemtittel>Dine søknader</Systemtittel>
                        <Knapp type="standard">Ny søknad</Knapp>
                    </div>
                    <div className="periodevelger_container">
                        <Select onChange={(value: any) => velgPeriode(value)} label='Vis for' className="periode_velger">
                            <option value='alle'>Alle</option>
                            <option value='12'>Siste år</option>
                            <option value='6'>Siste 6 måneder&nbsp;</option>
                            <option value='3'>Siste 3 måneder&nbsp;</option>
                            <option value='1'>Siste måned</option>
                        </Select>
                    </div>
                </Panel>
            }
            {
                paginerteSaker.map((sak) => {
                            return <SakPanel fiksDigisosId={sak.fiksDigisosId} tittel={sak.soknadTittel} status={sak.status}
                                             oppdatert={sak.sistOppdatert} key={sak.fiksDigisosId}
                                             antalNyeOppgaver={sak.antallNyeOppgaver}/>
                })
            }
            {filtrerteSaker.length > itemsPerPage && (
                <Paginering
                    // initialPage={currentPage}
                    pageCount={lastPage}
                    forcePage={currentPage}
                    onPageChange={(page: number) => handlePageClick(page)}
                />
            ) }
            {harSaker && filtrerteSaker.length === 0 &&
                <Panel className="panel-glippe-over">
                    <Normaltekst>Vi finner ingen søknader for denne perioden.</Normaltekst>
                    <Normaltekst>Har du søkt på papir, har vi dessverre ikke mulighet til å vise den her.</Normaltekst>
                </Panel>
            }

            {harSaker &&
                <>
                    {/*<DineUtbetalingerPanel/>*/}

                    <Subheader className="panel-luft-over">
                        <Undertittel>Relatert informasjon</Undertittel>
                    </Subheader>

                    <InfoPanelContainer>
                        <InfoPanel tittel={"Meld fra om endringer"} href={"todo"}>
                            Du må melde fra dersom din økonomiske situasjon endres.
                        </InfoPanel>

                        <InfoPanel tittel={"Klagerettigheter"} href={"https://www.nav.no/no/NAV+og+samfunn/Kontakt+NAV/Klage+ris+og+ros/Klagerettigheter#hvordanklagerdu"}>
                            Har du fått et vedtak fra oss som du mener er feil, kan du klage.
                        </InfoPanel>

                        <InfoPanel tittel={"Mer om sosialhjelp"} href={"https://www.nav.no/sosialhjelp/"}>
                            Lær mer om økonomisk sosialhjelp på nav.no
                        </InfoPanel>
                    </InfoPanelContainer>
                </>
            }
        </>
    )
};

export default Saksoversikt;
