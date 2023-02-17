import React, {useMemo} from "react";
import "./oppgaver.css";
import Lastestriper from "../lastestriper/Lasterstriper";
import {useTranslation} from "react-i18next";
import OppgaveInformasjon from "./OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {Alert, BodyShort, Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./vilkar/VilkarAccordion";
import {DokumentasjonEtterspurtAccordion} from "./dokumentasjonEtterspurt/DokumentasjonEtterspurtAccordion";
import {add, isBefore} from "date-fns";
import {logWarningMessage} from "../../redux/innsynsdata/loggActions";
import {
    useGetDokumentasjonkrav,
    useGetfagsystemHarDokumentasjonkrav,
    useGetHarLevertDokumentasjonkrav,
    useGetOppgaver,
    useGetVilkar,
} from "../../generated/oppgave-controller/oppgave-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {useHentUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {harSakMedInnvilgetEllerDelvisInnvilget} from "./vilkar/VilkarUtils";
import {useHentSaksStatuser} from "../../generated/saks-status-controller/saks-status-controller";
import DokumentasjonkravAccordion from "./dokumentasjonkrav/DokumentasjonkravAccordion";
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

const Feilmelding = ({fetchError}: {fetchError: boolean}) => {
    return fetchError ? (
        <StyledAlert variant="error">
            <BodyShort>Vi klarte ikke å hente oppdatert informasjon.</BodyShort>
            <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
        </StyledAlert>
    ) : null;
};

const Oppgaver = () => {
    const {t} = useTranslation();
    const fiksDigisosId = useFiksDigisosId();
    const vilkarQuery = useGetVilkar(fiksDigisosId);
    const dokumentasjonskravQuery = useGetDokumentasjonkrav(fiksDigisosId);
    const oppgaverQuery = useGetOppgaver(fiksDigisosId);
    const harLevertDokumentasjonskravQuery = useGetHarLevertDokumentasjonkrav(fiksDigisosId);
    const fagsystemHarDokumentasjonkravQuery = useGetfagsystemHarDokumentasjonkrav(fiksDigisosId);
    const saksStatusQuery = useHentSaksStatuser(fiksDigisosId);
    const hasError =
        vilkarQuery.isError ||
        dokumentasjonskravQuery.isError ||
        oppgaverQuery.isError ||
        harLevertDokumentasjonskravQuery.isError ||
        fagsystemHarDokumentasjonkravQuery.isError ||
        saksStatusQuery.isError;
    const utbetalingerQuery = useHentUtbetalinger(
        {},
        {query: {onError: (e) => logWarningMessage(e.message, e.navCallId)}}
    );
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

    const brukerHarDokumentasjonEtterspurt = oppgaverQuery.data && oppgaverQuery.data.length > 0;

    const skalViseOppgaver = brukerHarDokumentasjonEtterspurt || filtrerteDokumentasjonkrav || filtrerteVilkar;

    const skalViseIngenOppgaverPanel = useMemo(() => {
        const harOppgaver = Boolean(
            oppgaverQuery.data?.length || filtrerteDokumentasjonkrav?.length || filtrerteVilkar?.length
        );
        const harSaker = saksStatusQuery.data && saksStatusQuery.data.length > 0;
        const _harSakMedInnvilgetEllerDelvisInnvilget = harSakMedInnvilgetEllerDelvisInnvilget(saksStatusQuery.data);
        return (
            !harOppgaver &&
            ((harLevertDokumentasjonskravQuery.data && _harSakMedInnvilgetEllerDelvisInnvilget) ||
                (fagsystemHarDokumentasjonkravQuery.data && _harSakMedInnvilgetEllerDelvisInnvilget) ||
                !_harSakMedInnvilgetEllerDelvisInnvilget ||
                !harSaker)
        );
    }, [
        oppgaverQuery.data,
        filtrerteDokumentasjonkrav,
        filtrerteVilkar,
        saksStatusQuery.data,
        fagsystemHarDokumentasjonkravQuery.data,
        harLevertDokumentasjonskravQuery.data,
    ]);

    return (
        <StyledPanel error={+hasError}>
            <StyledPanelHeader>
                {hasError && <StyledErrorColored title="Feil" />}
                <Heading level="2" size="medium">
                    {t("oppgaver.dine_oppgaver")}
                </Heading>
            </StyledPanelHeader>

            {oppgaverQuery.isLoading && <Lastestriper linjer={1} style={{paddingTop: "1.5rem"}} />}

            {skalViseIngenOppgaverPanel && <IngenOppgaverPanel leserData={oppgaverQuery.isLoading} />}
            {skalViseOppgaver && (
                <>
                    {hasError && <StyledTextPlacement>{t("feilmelding.dineOppgaver_innlasting")}</StyledTextPlacement>}
                    <DokumentasjonEtterspurtAccordion
                        isLoading={oppgaverQuery.isLoading}
                        dokumentasjonEtterspurt={oppgaverQuery.data}
                    />

                    {Boolean(filtrerteVilkar?.length) && (
                        <VilkarAccordion
                            vilkar={filtrerteVilkar}
                            feilmelding={<Feilmelding fetchError={vilkarQuery.isError} />}
                        />
                    )}

                    {Boolean(filtrerteDokumentasjonkrav?.length) && (
                        <DokumentasjonkravAccordion
                            dokumentasjonkrav={filtrerteDokumentasjonkrav!}
                            feilmelding={<Feilmelding fetchError={dokumentasjonskravQuery.isError} />}
                        />
                    )}
                </>
            )}
            <OppgaveInformasjon dokumentasjonkrav={filtrerteDokumentasjonkrav} vilkar={filtrerteVilkar} />
        </StyledPanel>
    );
};

export default Oppgaver;
