import React, {useState} from "react";
import {formatBytes} from "../../utils/formatting";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Paginering from "../paginering/Paginering";
import EttersendelseView from "../ettersendelse/EttersendelseView";
import {getVisningstekster} from "../../utils/vedleggUtils";
import {Alert, Link, Select, SortState, Table} from "@navikt/ds-react";
import styled from "styled-components";
import {useHentVedlegg} from "../../../generated/vedlegg-controller/vedlegg-controller";
import {VedleggResponse} from "../../../generated/model";
import Lastestriper from "../lastestriper/Lasterstriper";
import {useTranslation} from "next-i18next";
import {FileCheckmarkIcon} from "@navikt/aksel-icons";

const Vedleggliste = styled.div`
    margin-top: 1rem;
    margin-bottom: 3rem;
`;

const SorteringListeboks = styled.div`
    @media screen and (max-width: 640px) {
        a {
            margin-top: 2.5rem;
            float: right;
        }
    }

    @media screen and (min-width: 640px) {
        display: none;
    }
`;

const StyledTable = styled(Table)`
    .navds-table__sort-button {
        white-space: nowrap;
    }
    @media screen and (max-width: 640px) {
        thead {
            display: none;
        }

        tr {
            display: flex;
            flex-direction: column;
            border-bottom: 1px solid rgba(0, 0, 0, 0.15);
            margin-bottom: 1rem;

            td {
                width: 100%;
                text-align: left;
                border-bottom: none;
                line-height: 1rem;
                padding: 0.4rem;
            }
            td:not(:first-child) {
                padding-left: 2rem;
            }
        }

        tr:first-child {
            padding-top: 1rem;
        }
    }

    a.filnavn {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: 20rem;
    }
`;

const StyledFileCheckmark = styled(FileCheckmarkIcon)`
    float: left;
    margin-right: 0.5rem;
    height: 1.5rem;
    width: 1.5rem;
`;

const NoWrap = styled.div`
    white-space: nowrap;
`;

const FilnavnHeader = styled.span`
    padding-left: 1.5rem;
`;

interface Props {
    fiksDigisosId: string;
}

const LastestripeRad = () => (
    <Table.Row>
        <Table.DataCell>
            <span className="lastestriper">
                <span aria-label="laster innhold" className="lastestripe lastestripe__kort_forsinkelse" />
            </span>
        </Table.DataCell>
        <Table.DataCell>
            <span className="lastestriper">
                <span aria-label="laster innhold" className="lastestripe" />
            </span>
        </Table.DataCell>
        <Table.DataCell>
            <span className="lastestriper">
                <span aria-label="laster innhold" className="lastestripe lastestripe__lang_forsinkelse" />
            </span>
        </Table.DataCell>
    </Table.Row>
);

enum Kolonne {
    FILNAVN = "filnavn",
    BESKRIVELSE = "beskrivelse",
    DATO = "dato",
}

const strCompare = (a: string, b: string) => {
    if (a.toLocaleUpperCase() < b.toLocaleUpperCase()) {
        return 1;
    }
    if (a.toLocaleUpperCase() > b.toLocaleUpperCase()) {
        return -1;
    }
    return 0;
};

const sorterVedlegg = (vedlegg: VedleggResponse[], kolonne: string, descending: boolean) => {
    switch (kolonne) {
        case Kolonne.DATO:
            return [].slice.call(vedlegg).sort((a: VedleggResponse, b: VedleggResponse) => {
                return descending
                    ? Date.parse(b.datoLagtTil) - Date.parse(a.datoLagtTil)
                    : Date.parse(a.datoLagtTil) - Date.parse(b.datoLagtTil);
            });
        case Kolonne.FILNAVN:
            return [].slice.call(vedlegg).sort((a: VedleggResponse, b: VedleggResponse) => {
                return descending ? strCompare(a.filnavn, b.filnavn) : strCompare(b.filnavn, a.filnavn);
            });
        case Kolonne.BESKRIVELSE:
            return [].slice.call(vedlegg).sort((a: VedleggResponse, b: VedleggResponse) => {
                return descending ? strCompare(a.type, b.type) : strCompare(b.type, a.type);
            });
        default:
            return vedlegg;
    }
};

const defaultSortState: SortState = {orderBy: Kolonne.DATO, direction: "descending"};

const StyledTextPlacement = styled.div`
    margin-bottom: 1rem;
    @media screen and (max-width: 640px) {
        margin-left: 2rem;
    }
`;

const VedleggView: React.FC<Props> = ({fiksDigisosId}) => {
    const {t} = useTranslation();
    const {data: vedlegg, isLoading, isError} = useHentVedlegg(fiksDigisosId);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [sortState, setSortState] = useState<SortState | undefined>(defaultSortState);

    if (isError) {
        return <StyledTextPlacement>{t("feilmelding.vedlegg_innlasting")}</StyledTextPlacement>;
    }
    if (isLoading && !vedlegg) {
        return <Lastestriper />;
    }

    const onSortChange = (sortKey?: string) => {
        if (!sortKey) {
            console.error("should not get here");
            return;
        }

        setSortState(
            sortState && sortKey === sortState.orderBy && sortState.direction === "descending"
                ? undefined
                : {
                      orderBy: sortKey,
                      direction:
                          sortState && sortKey === sortState.orderBy && sortState.direction === "ascending"
                              ? "descending"
                              : "ascending",
                  }
        );
    };

    const selectSort = (event: any) => {
        const sortDirection = event.target.value === Kolonne.DATO ? "descending" : "ascending";
        setSortState({orderBy: event.target.value, direction: sortDirection});
        event.preventDefault();
    };

    const sorterteVedlegg = sortState
        ? sorterVedlegg(vedlegg ?? [], sortState.orderBy, sortState.direction === "descending")
        : sorterVedlegg(vedlegg ?? [], defaultSortState.orderBy, defaultSortState.direction === "descending");

    /* Paginering */
    const itemsPerPage = 10;
    const lastPage = Math.ceil(sorterteVedlegg.length / itemsPerPage);
    const paginerteVedlegg = sorterteVedlegg.slice(currentPage * 10, currentPage * 10 + 10);

    const handlePageClick = (page: number) => {
        setCurrentPage(page);
    };

    function harFeilPaVedleggFraServer(vedlegg: VedleggResponse) {
        return vedlegg.storrelse === -1 && vedlegg.url.indexOf("/Error?") > -1;
    }

    return (
        <>
            <EttersendelseView isLoading={isLoading} />

            <Vedleggliste>
                <SorteringListeboks>
                    <Select
                        value={sortState?.orderBy ?? Kolonne.DATO}
                        label={"Sorter på"}
                        onChange={(event: any) => selectSort(event)}
                    >
                        <option value={Kolonne.FILNAVN}>filnavn</option>
                        <option value={Kolonne.BESKRIVELSE}>beskrivelse</option>
                        <option value={Kolonne.DATO}>dato</option>
                    </Select>
                </SorteringListeboks>
                <StyledTable sort={sortState} onSortChange={onSortChange}>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader sortKey={Kolonne.FILNAVN} sortable>
                                <FilnavnHeader>{t("vedlegg.tabell.filnavn")}</FilnavnHeader>
                            </Table.ColumnHeader>
                            <Table.ColumnHeader sortKey={Kolonne.BESKRIVELSE} sortable>
                                {t("vedlegg.tabell.beskrivelse")}
                            </Table.ColumnHeader>
                            <Table.ColumnHeader sortKey={Kolonne.DATO} sortable>
                                {t("vedlegg.tabell.dato")}
                            </Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {isLoading && <LastestripeRad />}
                        {paginerteVedlegg.map((vedlegg, index: number) => (
                            <Table.Row key={index}>
                                {harFeilPaVedleggFraServer(vedlegg) ? (
                                    <>
                                        <Table.DataCell>
                                            <Alert variant="error" inline>
                                                {vedlegg.filnavn} Filen er ikke lastet opp. Prøv å send den på nytt
                                            </Alert>
                                        </Table.DataCell>
                                        <Table.DataCell></Table.DataCell>
                                        <Table.DataCell></Table.DataCell>
                                    </>
                                ) : (
                                    <>
                                        <Table.DataCell>
                                            <StyledFileCheckmark aria-hidden title="fil" />
                                            <Link
                                                href={vedlegg.url}
                                                target="_blank"
                                                className="filnavn"
                                                title={`${vedlegg.filnavn} (${formatBytes(vedlegg.storrelse, 2)})`}
                                            >
                                                {vedlegg.filnavn}
                                            </Link>
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            {getVisningstekster(vedlegg.type, vedlegg.tilleggsinfo).typeTekst}
                                        </Table.DataCell>
                                        <Table.DataCell>
                                            <NoWrap>
                                                <DatoOgKlokkeslett
                                                    bareDato={true}
                                                    tidspunkt={vedlegg.datoLagtTil}
                                                    brukKortMaanedNavn={true}
                                                />
                                            </NoWrap>
                                        </Table.DataCell>
                                    </>
                                )}
                            </Table.Row>
                        ))}
                    </Table.Body>
                </StyledTable>
                {sorterteVedlegg.length > itemsPerPage && (
                    <Paginering
                        initialPage={0}
                        pageCount={lastPage}
                        onPageChange={(page: number) => handlePageClick(page)}
                    />
                )}
            </Vedleggliste>
        </>
    );
};

export default VedleggView;
