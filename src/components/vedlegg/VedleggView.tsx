import React, {useState} from "react";
import Lenke from "nav-frontend-lenker";
import {Select} from "nav-frontend-skjema";
import PaperClipSlanted from "../ikoner/PaperClipSlanted";
import {Vedlegg} from "../../redux/innsynsdata/innsynsdataReducer";
import {formatBytes} from "../../utils/formatting";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import "nav-frontend-tabell-style";
import "./responsiv_tabell.less";
import "../lastestriper/lastestriper.less";
import Paginering from "../paginering/Paginering";
import EttersendelseView from "./EttersendelseView";
import {REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import RemoveCircle from "../ikoner/RemoveCircle";
import {getVisningstekster} from "../../utils/vedleggUtils";

interface Props {
    vedlegg: Vedlegg[];
    restStatus: REST_STATUS;
    className?: string;
}

const LastestripeRad = () => (
    <tr>
        <td>
            <span className="lastestriper">
                <span aria-label="laster innhold" className="lastestripe lastestripe__kort_forsinkelse" />
            </span>
        </td>
        <td>
            <span className="lastestriper">
                <span aria-label="laster innhold" className="lastestripe" />
            </span>
        </td>
        <td>
            <span className="lastestriper">
                <span aria-label="laster innhold" className="lastestripe lastestripe__lang_forsinkelse" />
            </span>
        </td>
    </tr>
);

enum Kolonne {
    FILNAVN = "filnavn",
    BESKRIVELSE = "beskrivelse",
    DATO = "dato",
}

const strCompare = (a: string, b: string) => {
    if (a.toLocaleUpperCase() < b.toLocaleUpperCase()) {
        return -1;
    }
    if (a.toLocaleUpperCase() > b.toLocaleUpperCase()) {
        return 1;
    }
    return 0;
};

const sorterVedlegg = (vedlegg: Vedlegg[], kolonne: Kolonne, descending: boolean) => {
    switch (kolonne) {
        case Kolonne.DATO:
            return [].slice.call(vedlegg).sort((a: Vedlegg, b: Vedlegg) => {
                return descending
                    ? Date.parse(b.datoLagtTil) - Date.parse(a.datoLagtTil)
                    : Date.parse(a.datoLagtTil) - Date.parse(b.datoLagtTil);
            });
        case Kolonne.FILNAVN:
            return [].slice.call(vedlegg).sort((a: Vedlegg, b: Vedlegg) => {
                return descending ? strCompare(a.filnavn, b.filnavn) : strCompare(b.filnavn, a.filnavn);
            });
        case Kolonne.BESKRIVELSE:
            return [].slice.call(vedlegg).sort((a: Vedlegg, b: Vedlegg) => {
                return descending ? strCompare(a.type, b.type) : strCompare(b.type, a.type);
            });
    }
};

const VedleggView: React.FC<Props> = ({vedlegg, restStatus, className}) => {
    const [sortBy, setSortBy] = useState<Kolonne>(Kolonne.DATO);
    const [descending, setDescending] = useState({
        filnavn: true,
        beskrivelse: true,
        dato: true,
    });

    const setSort = (newSortBy: Kolonne, newDescending: boolean, event: any) => {
        setSortBy(newSortBy);
        switch (newSortBy) {
            case Kolonne.FILNAVN:
                setDescending({...descending, filnavn: newDescending});
                break;
            case Kolonne.BESKRIVELSE:
                setDescending({...descending, beskrivelse: newDescending});
                break;
            default:
                setDescending({...descending, dato: newDescending});
        }
        event.preventDefault();
    };

    const selectSort = (event: any) => {
        const newSortBy = event.target.value;
        setSortBy(newSortBy);
        switch (newSortBy) {
            case Kolonne.FILNAVN:
                setDescending({...descending, filnavn: descending[Kolonne.FILNAVN]});
                break;
            case Kolonne.BESKRIVELSE:
                setDescending({...descending, beskrivelse: descending[Kolonne.BESKRIVELSE]});
                break;
            default:
                setDescending({...descending, dato: descending[Kolonne.DATO]});
        }
        event.preventDefault();
    };

    const sorterteVedlegg = sorterVedlegg(vedlegg, sortBy, descending[sortBy]);

    const ariaSort = (kolonne: Kolonne): "descending" | "ascending" | "none" => {
        return kolonne === sortBy ? (descending[kolonne] ? "descending" : "ascending") : "none";
    };

    const classNameAriaSort = (kolonne: Kolonne): string => {
        return kolonne === sortBy ? (descending[kolonne] ? "tabell__th--sortert-desc" : "tabell__th--sortert-asc") : "";
    };

    /* Paginering */
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState<number>(0);
    const lastPage = Math.ceil(sorterteVedlegg.length / itemsPerPage);
    const paginerteVedlegg: Vedlegg[] = sorterteVedlegg.slice(currentPage * 10, currentPage * 10 + 10);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    function harFeilPaVedleggFraServer(vedlegg: Vedlegg) {
        return vedlegg.storrelse === -1 && vedlegg.url.indexOf("/Error?") > -1;
    }

    return (
        <>
            <EttersendelseView restStatus={restStatus} />
            <div className="vedleggliste">
                <div className="sortering_listeboks">
                    <Select value={sortBy} label={"Sorter på"} onChange={(event: any) => selectSort(event)}>
                        <option value={Kolonne.FILNAVN}>filnavn</option>
                        <option value={Kolonne.BESKRIVELSE}>beskrivelse</option>
                        <option value={Kolonne.DATO}>dato</option>
                    </Select>
                </div>
                <table className={"tabell " + (className ? className : "")}>
                    <thead>
                        <tr>
                            <th
                                role="columnheader"
                                aria-sort={ariaSort(Kolonne.FILNAVN)}
                                className={classNameAriaSort(Kolonne.FILNAVN)}
                            >
                                <Lenke
                                    href="#"
                                    onClick={(event) => setSort(Kolonne.FILNAVN, !descending[Kolonne.FILNAVN], event)}
                                >
                                    <span className="ikon_liten_vedlegg_placeholder_alle">Filnavn</span>
                                </Lenke>
                            </th>
                            <th
                                role="columnheader"
                                aria-sort={ariaSort(Kolonne.BESKRIVELSE)}
                                className={classNameAriaSort(Kolonne.BESKRIVELSE)}
                            >
                                <Lenke
                                    href="#"
                                    onClick={(event) =>
                                        setSort(Kolonne.BESKRIVELSE, !descending[Kolonne.BESKRIVELSE], event)
                                    }
                                >
                                    Beskrivelse
                                </Lenke>
                            </th>
                            <th
                                role="columnheader"
                                aria-sort={ariaSort(Kolonne.DATO)}
                                className={classNameAriaSort(Kolonne.DATO)}
                                align="right"
                            >
                                <Lenke
                                    href="#"
                                    onClick={(event) => setSort(Kolonne.DATO, !descending[Kolonne.DATO], event)}
                                >
                                    Dato lagt til
                                </Lenke>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {skalViseLastestripe(restStatus, true) && <LastestripeRad />}
                        {paginerteVedlegg.map((vedlegg: Vedlegg, index: number) => {
                            return (
                                <tr key={index}>
                                    {harFeilPaVedleggFraServer(vedlegg) && (
                                        <td colSpan={4}>
                                            <div className="file_error_celle">
                                                <div className="file_error_ikon">
                                                    <RemoveCircle />
                                                </div>{" "}
                                                {vedlegg.filnavn} Filen er ikke lastet opp. Prøv å send den på nytt
                                            </div>
                                        </td>
                                    )}
                                    {!harFeilPaVedleggFraServer(vedlegg) && (
                                        <>
                                            <td
                                                className={
                                                    sortBy === Kolonne.FILNAVN
                                                        ? "tabell__td--sortert filnavn_kollonne"
                                                        : "filnavn_kollonne"
                                                }
                                            >
                                                <PaperClipSlanted className="ikon_liten_vedlegg" />
                                                <Lenke
                                                    href={vedlegg.url}
                                                    target="_blank"
                                                    title={
                                                        vedlegg.filnavn + " (" + formatBytes(vedlegg.storrelse, 2) + ")"
                                                    }
                                                >
                                                    {vedlegg.filnavn}
                                                </Lenke>
                                            </td>
                                            <td className={sortBy === Kolonne.BESKRIVELSE ? "tabell__td--sortert" : ""}>
                                                <span className="ikon_liten_vedlegg_placeholder">
                                                    {getVisningstekster(vedlegg.type, vedlegg.tilleggsinfo).typeTekst}
                                                </span>
                                            </td>
                                            <td
                                                align="right"
                                                className={sortBy === Kolonne.DATO ? "tabell__td--sortert" : ""}
                                            >
                                                <div className="dato_lagt_til ikon_liten_vedlegg_placeholder">
                                                    <DatoOgKlokkeslett
                                                        bareDato={true}
                                                        tidspunkt={vedlegg.datoLagtTil}
                                                        brukKortMaanedNavn={true}
                                                    />
                                                </div>
                                            </td>
                                        </>
                                    )}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {sorterteVedlegg.length > itemsPerPage && (
                    <Paginering
                        initialPage={0}
                        pageCount={lastPage}
                        onPageChange={(page: number) => handlePageClick(page)}
                    />
                )}
            </div>
        </>
    );
};

export default VedleggView;
