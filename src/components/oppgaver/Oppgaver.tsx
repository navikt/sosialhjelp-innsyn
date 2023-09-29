import React, {useMemo} from "react";
import Lastestriper from "../lastestriper/Lasterstriper";
import {useTranslation} from "next-i18next";
import OppgaveInformasjon from "./OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {Accordion, Alert} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./vilkar/VilkarAccordion";
import {DokumentasjonEtterspurtAccordion} from "./dokumentasjonEtterspurt/DokumentasjonEtterspurtAccordion";
import {add, isBefore} from "date-fns";
import {
    useGetDokumentasjonkrav,
    useGetfagsystemHarDokumentasjonkrav,
    useGetHarLevertDokumentasjonkrav,
    useGetVilkar,
} from "../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {useHentUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {harSakMedInnvilgetEllerDelvisInnvilget} from "./vilkar/VilkarUtils";
import {useHentSaksStatuser} from "../../generated/saks-status-controller/saks-status-controller";
import DokumentasjonkravAccordion from "./dokumentasjonkrav/DokumentasjonkravAccordion";
import OppgaverPanel from "./OppgaverPanel";
import useDokumentasjonEtterspurt from "../../hooks/useDokumentasjonEtterspurt";
import DriftsmeldingVedlegg from "../driftsmelding/DriftsmeldingVedlegg";
import styles from "./oppgaver.module.css";
import VedleggSuccess from "../filopplasting/VedleggSuccess";
import {useFilUploadSuccessful} from "../filopplasting/FilUploadSuccessfulContext";
import {logger} from "@navikt/next-logger";

const StyledAlert = styled(Alert)`
    margin-top: 1rem;
`;

type Status = "STOPPET" | "ANNULLERT" | "PLANLAGT_UTBETALING" | "UTBETALT";

export interface UtbetalingerResponse {
    tom: string | undefined;
    status: Status;
}
/* Alle vilkår og dokumentasjonskrav fjernes hvis alle utbetalinger har status utbetalt/annullert
 og er forbigått utbetalingsperioden med 21 dager */
export const filterUtbetalinger = (utbetalinger: UtbetalingerResponse[], todaysDate: Date) => {
    return utbetalinger.filter((utbetaling) => {
        if ((utbetaling.status !== "UTBETALT" && utbetaling.status !== "ANNULLERT") || !utbetaling.tom) {
            return false;
        }
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

const Oppgaver = () => {
    const {t} = useTranslation();
    const fiksDigisosId = useFiksDigisosId();
    const vilkarQuery = useGetVilkar(fiksDigisosId);
    const dokumentasjonskravQuery = useGetDokumentasjonkrav(fiksDigisosId);
    const {dokumentasjonEtterspurt, ...oppgaverQuery} = useDokumentasjonEtterspurt(fiksDigisosId);
    const {data: harLevertDokumentasjonskrav, ...harLevertDokumentasjonskravQuery} =
        useGetHarLevertDokumentasjonkrav(fiksDigisosId);
    const {data: fagsystemHarDokumentasjonkrav, ...fagsystemHarDokumentasjonkravQuery} =
        useGetfagsystemHarDokumentasjonkrav(fiksDigisosId);

    const {data: saksStatuser, ...saksStatusQuery} = useHentSaksStatuser(fiksDigisosId);
    const utbetalingerQuery = useHentUtbetalinger({}, {query: {onError: (e) => logger.warn(e.message, e.navCallId)}});
    const {oppgaverUploadSuccess} = useFilUploadSuccessful();

    const hasError =
        vilkarQuery.isError ||
        dokumentasjonskravQuery.isError ||
        oppgaverQuery.isError ||
        harLevertDokumentasjonskravQuery.isError ||
        fagsystemHarDokumentasjonkravQuery.isError ||
        saksStatusQuery.isError;

    const isLoading =
        vilkarQuery.isLoading ||
        dokumentasjonskravQuery.isLoading ||
        oppgaverQuery.isLoading ||
        harLevertDokumentasjonskravQuery.isLoading ||
        fagsystemHarDokumentasjonkravQuery.isLoading ||
        saksStatusQuery.isLoading;

    const sakUtbetalinger = useMemo(
        () =>
            utbetalingerQuery.data?.flatMap((utbetaling) =>
                utbetaling.utbetalinger.map((manedUtbetaling) => ({
                    tom: manedUtbetaling.tom,
                    status: manedUtbetaling.status as Status,
                }))
            ) ?? [],
        [utbetalingerQuery.data]
    );

    const filtrerteUtbetalinger = useMemo(() => filterUtbetalinger(sakUtbetalinger, new Date()), [sakUtbetalinger]);

    const filtrerteVilkar = useMemo(
        () => (skalSkjuleVilkarOgDokKrav(sakUtbetalinger, filtrerteUtbetalinger) ? [] : vilkarQuery.data),
        [filtrerteUtbetalinger, vilkarQuery.data, sakUtbetalinger]
    );
    const filtrerteDokumentasjonkrav = useMemo(
        () => (skalSkjuleVilkarOgDokKrav(sakUtbetalinger, filtrerteUtbetalinger) ? [] : dokumentasjonskravQuery.data),
        [sakUtbetalinger, filtrerteUtbetalinger, dokumentasjonskravQuery.data]
    );

    const brukerHarDokumentasjonEtterspurt =
        Array.isArray(dokumentasjonEtterspurt) && dokumentasjonEtterspurt.length > 0;

    const skalViseOppgaver = brukerHarDokumentasjonEtterspurt || filtrerteDokumentasjonkrav || filtrerteVilkar;

    const [skalViseIngenOppgaverPanel, skalViseOppgaveInformasjon] = useMemo(() => {
        const harOppgaver = Boolean(
            dokumentasjonEtterspurt?.length || filtrerteDokumentasjonkrav?.length || filtrerteVilkar?.length
        );
        const harSaker = Array.isArray(saksStatuser) && saksStatuser.length > 0;
        const _harSakMedInnvilgetEllerDelvisInnvilget = harSakMedInnvilgetEllerDelvisInnvilget(saksStatuser);

        const skalViseOppgaveInformasjon =
            _harSakMedInnvilgetEllerDelvisInnvilget &&
            filtrerteVilkar?.length === 0 &&
            filtrerteDokumentasjonkrav?.length === 0 &&
            !fagsystemHarDokumentasjonkrav &&
            !harLevertDokumentasjonskrav;

        const skalViseIngenOppgaverPanel =
            !harOppgaver &&
            ((harLevertDokumentasjonskrav && _harSakMedInnvilgetEllerDelvisInnvilget) ||
                (fagsystemHarDokumentasjonkrav && _harSakMedInnvilgetEllerDelvisInnvilget) ||
                !_harSakMedInnvilgetEllerDelvisInnvilget ||
                !harSaker);
        return [skalViseIngenOppgaverPanel, skalViseOppgaveInformasjon];
    }, [
        dokumentasjonEtterspurt,
        filtrerteDokumentasjonkrav,
        filtrerteVilkar,
        saksStatuser,
        fagsystemHarDokumentasjonkrav,
        harLevertDokumentasjonskrav,
    ]);

    if (isLoading) {
        return (
            <OppgaverPanel hasError={hasError}>
                <Lastestriper linjer={1} style={{paddingTop: "1.5rem"}} />
            </OppgaverPanel>
        );
    }

    if (hasError) {
        return (
            <OppgaverPanel hasError={true}>
                <StyledAlert variant="error" inline>
                    {t("feilmelding.dineOppgaver_innlasting")}
                </StyledAlert>
            </OppgaverPanel>
        );
    }

    return (
        <OppgaverPanel hasError={false}>
            {skalViseIngenOppgaverPanel && <IngenOppgaverPanel leserData={oppgaverQuery.isLoading} />}
            {(skalViseOppgaver || skalViseOppgaveInformasjon) && (
                <Accordion>
                    {skalViseOppgaver && (
                        <>
                            <DriftsmeldingVedlegg className={styles.driftsmelding} />
                            <DokumentasjonEtterspurtAccordion dokumentasjonEtterspurt={dokumentasjonEtterspurt} />
                            <VilkarAccordion vilkar={filtrerteVilkar} />
                            <DokumentasjonkravAccordion dokumentasjonkrav={filtrerteDokumentasjonkrav} />
                        </>
                    )}
                    {skalViseOppgaveInformasjon && <OppgaveInformasjon />}
                </Accordion>
            )}
            <VedleggSuccess show={oppgaverUploadSuccess} />
        </OppgaverPanel>
    );
};

export default Oppgaver;
