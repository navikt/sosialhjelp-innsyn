import React, {useEffect, useState} from "react";
import "./oppgaver.css";
import {
    DokumentasjonEtterspurt,
    Feilside,
    hentFagsystemHarDokumentasjonkrav,
    hentHarLevertDokumentasjonkrav,
    visFeilside,
} from "../../redux/innsynsdata/innsynsdataReducer";
import Lastestriper from "../lastestriper/Lasterstriper";
import {FormattedMessage} from "react-intl";
import OppgaveInformasjon from "../vilkar/OppgaveInformasjon";
import IngenOppgaverPanel from "./IngenOppgaverPanel";
import {fetchToJson, skalViseLastestripe} from "../../utils/restUtils";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../../redux/reduxTypes";
import {Heading, Panel} from "@navikt/ds-react";
import styled from "styled-components";
import {VilkarAccordion} from "./accordions/VilkarAccordion";
import {DokumentasjonkravAccordion} from "./accordions/DokumentasjonkravAccordion";
import {DokumentasjonEtterspurtAccordion} from "./accordions/DokumentasjonEtterspurtAccordion";
import {add, isBefore} from "date-fns";

const StyledPanelHeader = styled.div`
    border-bottom: 2px solid var(--navds-semantic-color-border-muted);
    padding-left: 0.75rem;
`;

const StyledPanel = styled(Panel)`
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

const Oppgaver = () => {
    const {dokumentasjonkrav, vilkar, restStatus, fiksDigisosId} = useSelector(
        (state: InnsynAppState) => state.innsynsdata
    );
    const dokumentasjonEtterspurt = useSelector((state: InnsynAppState) => state.innsynsdata.oppgaver);

    const [sakUtbetalinger, setSakUtbetalinger] = useState<UtbetalingerResponse[]>([]);
    const [filtrerteDokumentasjonkrav, setFiltrerteDokumentasjonkrav] = useState(dokumentasjonkrav);
    const [filtrerteVilkar, setFiltrerteVilkar] = useState(vilkar);

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
                dispatch(hentFagsystemHarDokumentasjonkrav(verdi))
            );
        }
    }, [dispatch, fiksDigisosId]);

    useEffect(() => {
        if (fiksDigisosId) {
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
                .catch(() => {
                    dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
                });
        }
    }, [setSakUtbetalinger, dispatch, fiksDigisosId]);

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
        <StyledPanel>
            <StyledPanelHeader>
                <Heading level="2" size="medium" spacing>
                    <FormattedMessage id="oppgaver.dine_oppgaver" />
                </Heading>
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

                    {filtrerteVilkar?.length > 0 && <VilkarAccordion vilkar={filtrerteVilkar} />}

                    {filtrerteDokumentasjonkrav?.length > 0 && (
                        <DokumentasjonkravAccordion dokumentasjonkrav={filtrerteDokumentasjonkrav} />
                    )}
                </>
            )}
            <OppgaveInformasjon dokumentasjonkrav={filtrerteDokumentasjonkrav} vilkar={filtrerteVilkar} />
        </StyledPanel>
    );
};

export default Oppgaver;
