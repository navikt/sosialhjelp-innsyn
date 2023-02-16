import React, {useEffect, useState} from "react";
import "./oppgaver.css";
import {
    DokumentasjonEtterspurt,
    hentHarLevertDokumentasjonkrav,
    settFagsystemHarDokumentasjonkrav,
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import OppgaveInformasjon from "../vilkar/OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {fetchToJson, REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {Alert, BodyShort, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./accordions/VilkarAccordion";
import {DokumentasjonkravAccordion} from "./accordions/DokumentasjonkravAccordion";
import {DokumentasjonEtterspurtAccordion} from "./accordions/DokumentasjonEtterspurtAccordion";
import {add, isBefore} from "date-fns";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";
import {ErrorColored} from "@navikt/ds-icons";

const StyledPanelHeader = styled.div`
    border-bottom: 2px solid var(--a-border-default);
`;

const StyledContainer = styled.div<{hasError?: boolean}>`
    gap: ${(props) => (props.hasError ? "1rem" : "0rem")};
    margin-left: ${(props) => (props.hasError ? "-1.375rem" : "0rem")};
    padding-left: ${(props) => (props.hasError ? "0rem" : "0.75rem")};
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    word-break: break-word;
`;

const StyledAlert = styled(Alert)`
    margin-top: 0.5rem;
`;

const StyledPanel = styled(Panel)<{hasError?: boolean}>`
   border-color: ${(props) => (props.hasError ? "var(--a-red-500)" : "transparent")};
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 4rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
        margin-top: 2rem;
`;

function foersteInnsendelsesfrist(dokumentasjonEtterspurt: null | DokumentasjonEtterspurt[]): Date | null {
    if (dokumentasjonEtterspurt === null) {
        return null;
    }
    if (dokumentasjonEtterspurt.length > 0) {
        const innsendelsesfrister = dokumentasjonEtterspurt.map(
            (dokumentasjon: DokumentasjonEtterspurt) => new Date(dokumentasjon.innsendelsesfrist!!)
        );
        return innsendelsesfrister[0];
    }
    return null;
}

export const antallDagerEtterFrist = (innsendelsesfrist: null | Date): number => {
    if (!innsendelsesfrist) {
        return 0;
    }
    let now = Math.floor(new Date().getTime() / (3600 * 24 * 1000)); //days as integer from..
    let frist = Math.floor(innsendelsesfrist.getTime() / (3600 * 24 * 1000)); //days as integer from..
    return now - frist;
};

interface SaksUtbetalingResponse {
    utbetalinger: UtbetalingerResponse[];
}

export interface UtbetalingerResponse {
    tom: string;
    status: "STOPPET" | "ANNULLERT" | "PLANLAGT_UTBETALING" | "UTBETALT";
}
/* Alle vilkår og dokumentasjonskrav fjernes hvis alle utbetalinger har status utbetalt/annullert
 og er forbigått utbetalingsperioden med 21 dager */
export const filterUtbetalinger = (utbetalinger: UtbetalingerResponse[], todaysDate: Date) => {
    return utbetalinger
        .filter((utbetaling) => utbetaling.status === "UTBETALT" || utbetaling.status === "ANNULLERT")
        .filter((utbetaling) => {
            const forbigattUtbetalingsDato = add(new Date(utbetaling.tom), {
                days: DAGER_SIDEN_UTBETALINGSPERIODEN_ER_FORBIGAATT,
            });
            return isBefore(forbigattUtbetalingsDato, todaysDate);
        });
};

export const skalSkjuleVilkarOgDokKrav = (
    utbetalinger: UtbetalingerResponse[],
    filtrerteUtbetalinger: UtbetalingerResponse[]
) => {
    return utbetalinger.length > 0 && filtrerteUtbetalinger.length === utbetalinger.length;
};

const DAGER_SIDEN_UTBETALINGSPERIODEN_ER_FORBIGAATT = 21;

const Feilmelding = ({fetchError}: {fetchError: boolean}) => {
    return fetchError ? (
        <StyledAlert variant="error">
            <BodyShort>Vi klarte ikke å hente oppdatert informasjon.</BodyShort>
            <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
        </StyledAlert>
    ) : null;
};

const leserData = (restStatus: REST_STATUS): boolean => {
    return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
};

const Oppgaver = () => {
    const {dokumentasjonkrav, vilkar, restStatus, fiksDigisosId} = useSelector(
        (state: InnsynAppState) => state.innsynsdata
    );
    const dokumentasjonEtterspurt = useSelector((state: InnsynAppState) => state.innsynsdata.oppgaver);

    const [sakUtbetalinger, setSakUtbetalinger] = useState<UtbetalingerResponse[]>([]);
    const [filtrerteDokumentasjonkrav, setFiltrerteDokumentasjonkrav] = useState(dokumentasjonkrav);
    const [filtrerteVilkar, setFiltrerteVilkar] = useState(vilkar);
    const [fetchError, setFetchError] = useState(false);
    const [restStatusError, setRestStatusError] = useState(false);

    const dispatch = useDispatch();

    const brukerHarDokumentasjonEtterspurt: boolean =
        dokumentasjonEtterspurt !== null && dokumentasjonEtterspurt.length > 0;
    const dokumentasjonEtterspurtErFraInnsyn: boolean =
        brukerHarDokumentasjonEtterspurt && dokumentasjonEtterspurt!![0].oppgaveElementer!![0].erFraInnsyn;
    const innsendelsesfrist = dokumentasjonEtterspurtErFraInnsyn
        ? foersteInnsendelsesfrist(dokumentasjonEtterspurt)
        : null;
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);
    const skalViseOppgaver = brukerHarDokumentasjonEtterspurt || filtrerteDokumentasjonkrav || filtrerteVilkar;

    useEffect(() => {
        if (fiksDigisosId) {
            fetchToJson(`/innsyn/${fiksDigisosId}/harLeverteDokumentasjonkrav`).then((verdi: any) =>
                dispatch(hentHarLevertDokumentasjonkrav(verdi))
            );
        }
    }, [dispatch, fiksDigisosId, filtrerteDokumentasjonkrav]);

    useEffect(() => {
        if (fiksDigisosId) {
            fetchToJson(`/innsyn/${fiksDigisosId}/fagsystemHarDokumentasjonkrav`).then((verdi: any) =>
                dispatch(settFagsystemHarDokumentasjonkrav(verdi))
            );
        }
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        if (fiksDigisosId) {
            setFetchError(false);
            fetchToJson<SaksUtbetalingResponse[]>(`/innsyn/${fiksDigisosId}/utbetalinger`)
                .then((response) => {
                    const utbetalinger = response.reduce((acc: UtbetalingerResponse[], utbetaling) => {
                        if (utbetaling.utbetalinger && utbetaling.utbetalinger.length > 0) {
                            const mappedUtbetalinger = utbetaling.utbetalinger.map((value) => {
                                return {tom: value.tom, status: value.status};
                            });
                            acc = acc.concat(mappedUtbetalinger);
                        }
                        return acc;
                    }, []);
                    setSakUtbetalinger(utbetalinger);
                })
                .catch((reason) => {
                    logWarningMessage(reason.message, reason.navCallId);
                    setFetchError(true);
                });
        }
    }, [setSakUtbetalinger, fiksDigisosId, setFetchError]);

    useEffect(() => {
        const todaysDate = new Date();
        setFiltrerteVilkar(vilkar);
        setFiltrerteDokumentasjonkrav(dokumentasjonkrav);
        const filtrerteUtbetalinger = filterUtbetalinger(sakUtbetalinger, todaysDate);
        if (skalSkjuleVilkarOgDokKrav(sakUtbetalinger, filtrerteUtbetalinger)) {
            setFiltrerteDokumentasjonkrav([]);
            setFiltrerteVilkar([]);
        }
    }, [sakUtbetalinger, dokumentasjonkrav, vilkar]);

    useEffect(() => {
        if (
            !leserData(restStatus.oppgaver) ||
            !leserData(restStatus.dokumentasjonkrav) ||
            !leserData(restStatus.vilkar)
        ) {
            if (
                restStatus.oppgaver === REST_STATUS.FEILET ||
                restStatus.dokumentasjonkrav === REST_STATUS.FEILET ||
                restStatus.vilkar === REST_STATUS.FEILET
            ) {
                setRestStatusError(true);
            }
        }
    }, [restStatus.oppgaver, restStatus.dokumentasjonkrav, restStatus.vilkar, restStatusError]);

    return (
        <StyledPanel hasError={restStatusError}>
            <StyledPanelHeader>
                <StyledContainer hasError={restStatusError}>
                    {restStatusError && <ErrorColored />}
                    <Heading level="2" size="medium">
                        <FormattedMessage id="oppgaver.dine_oppgaver" />
                    </Heading>
                </StyledContainer>
            </StyledPanelHeader>

            {skalViseLastestripe(restStatus.oppgaver, true) && (
                <Lastestriper linjer={1} style={{paddingTop: "1.5rem"}} />
            )}

            <IngenOppgaverPanel
                dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                dokumentasjonkrav={filtrerteDokumentasjonkrav}
                vilkar={filtrerteVilkar}
                leserData={skalViseLastestripe(restStatus.oppgaver)}
            />
            {skalViseOppgaver && (
                <>
                    {brukerHarDokumentasjonEtterspurt && (
                        <DokumentasjonEtterspurtAccordion
                            dokumentasjonEtterspurtErFraInnsyn={dokumentasjonEtterspurtErFraInnsyn}
                            antallDagerSidenFristBlePassert={antallDagerSidenFristBlePassert}
                            innsendelsesfrist={innsendelsesfrist}
                            restStatus_oppgaver={restStatus.oppgaver}
                            dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                        />
                    )}

                    {filtrerteVilkar?.length > 0 && (
                        <VilkarAccordion
                            vilkar={filtrerteVilkar}
                            feilmelding={<Feilmelding fetchError={fetchError} />}
                        />
                    )}

                    {filtrerteDokumentasjonkrav?.length > 0 && (
                        <DokumentasjonkravAccordion
                            dokumentasjonkrav={filtrerteDokumentasjonkrav}
                            feilmelding={<Feilmelding fetchError={fetchError} />}
                        />
                    )}
                </>
            )}
            <OppgaveInformasjon dokumentasjonkrav={filtrerteDokumentasjonkrav} vilkar={filtrerteVilkar} />
        </StyledPanel>
    );
};

export default Oppgaver;
