import React, {useEffect, useState} from "react";
import "./oppgaver.css";
import {
    hentHarLevertDokumentasjonkrav,
    settFagsystemHarDokumentasjonkrav,
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import OppgaveInformasjon from "./OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {fetchToJson, REST_STATUS, skalViseLastestripe} from "../../utils/restUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {Alert, BodyShort, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./vilkar/VilkarAccordion";
import {DokumentasjonEtterspurtAccordion} from "./dokumentasjonEtterspurt/DokumentasjonEtterspurtAccordion";
import {add, isBefore} from "date-fns";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";
import {DokumentasjonkravAccordion} from "./dokumentasjonkrav/DokumentasjonkravAccordion";
import {ErrorColored} from "@navikt/ds-icons";

const StyledPanelHeader = styled.div`
    border-bottom: 2px solid var(--a-border-default);
`;

const StyledAlert = styled(Alert)`
    margin-top: 0.5rem;
`;

const StyledErrorColored = styled(ErrorColored)`
    position: absolute;
    @media screen and (min-width: 641px) {
        top: 5.25rem;
        left: 1.5rem;
    }
    @media screen and (max-width: 640px) {
        top: 4.25rem;
        left: 1rem;
    }
`;

const StyledPanel = styled(Panel)<{error?: boolean}>`
    position: relative;
    border-color: ${(props) => (props.error ? "var(--a-red-500)" : "transparent")};
    @media screen and (min-width: 641px) {
        padding: 2rem 4.25rem;
        margin-top: 4rem;
    }
    @media screen and (max-width: 640px) {
        padding: 1rem;
        margin-top: 2rem;
    }
`;

const StyledTextPlacement = styled.div`
    margin-top: 1rem;
    margin-bottom: 1rem;
    @media screen and (max-width: 640px) {
        margin-left: 2rem;
    }
`;

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
    return (
        restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING || restStatus === REST_STATUS.OK
    );
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
    const hasError =
        !leserData(restStatus.oppgaver) || !leserData(restStatus.vilkar) || !leserData(restStatus.dokumentasjonkrav);

    const dispatch = useDispatch();

    const brukerHarDokumentasjonEtterspurt = dokumentasjonEtterspurt && dokumentasjonEtterspurt.length > 0;

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

    return (
        <StyledPanel error={+hasError}>
            <StyledPanelHeader>
                {hasError && <StyledErrorColored />}
                <Heading level="2" size="medium">
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Heading>
            </StyledPanelHeader>

            {skalViseLastestripe(restStatus.oppgaver, true) && (
                <Lastestriper linjer={1} style={{paddingTop: "1.5rem"}} />
            )}
            {!hasError && (
                <IngenOppgaverPanel
                    dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                    dokumentasjonkrav={filtrerteDokumentasjonkrav}
                    vilkar={filtrerteVilkar}
                    leserData={skalViseLastestripe(restStatus.oppgaver, true)}
                />
            )}
            {skalViseOppgaver && (
                <>
                    {hasError && (
                        <StyledTextPlacement>
                            <FormattedMessage id="feilmelding.dineOppgaver_innlasting" />
                        </StyledTextPlacement>
                    )}
                    <DokumentasjonEtterspurtAccordion
                        restStatus_oppgaver={restStatus.oppgaver}
                        dokumentasjonEtterspurt={dokumentasjonEtterspurt}
                    />

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
