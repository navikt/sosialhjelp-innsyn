import React, {useEffect, useState} from "react";
import "./oppgaver.less";
import {
    DokumentasjonEtterspurt,
    DokumentasjonKrav,
    Feilside,
    Vilkar,
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
import {add, isAfter} from "date-fns";

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

const DAGER_SIDEN_UTBETALINGSPERIODE_ER_FORBIGAATT = 21;

export const skalViseAlleHvisUtbetalingIkkeUtgaatt = (
    utbetalingsReferanser: string[],
    sakUtbetalinger: SaksUtbetaling,
    currentDate: Date
) => {
    if (utbetalingsReferanser.length === 0) {
        return true;
    }
    for (const utbetalingsReferanse of utbetalingsReferanser) {
        const utbetaling = sakUtbetalinger[utbetalingsReferanse];
        if (utbetaling) {
            const forbigaattUtbetalingsDato = add(new Date(utbetaling.tom), {
                days: DAGER_SIDEN_UTBETALINGSPERIODE_ER_FORBIGAATT,
            });

            const isAfterDate = isAfter(forbigaattUtbetalingsDato, currentDate);
            if (isAfterDate) {
                return true;
            }
        }
    }
    return false;
};

export const filterDokumentasjonkrav = (
    dokumentasjonkrav: DokumentasjonKrav[],
    sakUtbetalinger: SaksUtbetaling,
    currentDate: Date
) => {
    for (const dokkrav of dokumentasjonkrav) {
        for (const element of dokkrav.dokumentasjonkravElementer) {
            const skalVise = skalViseAlleHvisUtbetalingIkkeUtgaatt(
                element.utbetalingsReferanse,
                sakUtbetalinger,
                currentDate
            );
            if (skalVise) {
                return dokumentasjonkrav;
            }
        }
    }

    return [];
};

export const filterVilkar = (vilkar: Vilkar[], sakUtbetalinger: SaksUtbetaling, currentDate: Date) => {
    for (const value of vilkar) {
        if (skalViseAlleHvisUtbetalingIkkeUtgaatt(value.utbetalingsReferanse, sakUtbetalinger, currentDate)) {
            return vilkar;
        }
    }
    return [];
};

interface SaksUtbetalingResponse {
    utbetalinger: UtbetalingerResponse[];
}

export interface SaksUtbetaling {
    [key: string]: UtbetalingerResponse;
}

interface UtbetalingerResponse {
    fom: string;
    tom: string;
    utbetlingsreferanse: string;
    status: "STOPPET" | "ANNULLERT" | "PLANLAGT_UTBETALING" | "UTBETALT";
}

const Oppgaver = () => {
    const {dokumentasjonkrav, vilkar, restStatus, fiksDigisosId} = useSelector(
        (state: InnsynAppState) => state.innsynsdata
    );

    const dokumentasjonEtterspurt = useSelector((state: InnsynAppState) => state.innsynsdata.oppgaver);

    const brukerHarDokumentasjonEtterspurt: boolean =
        dokumentasjonEtterspurt !== null && dokumentasjonEtterspurt.length > 0;
    const dokumentasjonEtterspurtErFraInnsyn: boolean =
        brukerHarDokumentasjonEtterspurt && dokumentasjonEtterspurt!![0].oppgaveElementer!![0].erFraInnsyn;
    const innsendelsesfrist = dokumentasjonEtterspurtErFraInnsyn
        ? foersteInnsendelsesfrist(dokumentasjonEtterspurt)
        : null;
    const antallDagerSidenFristBlePassert = antallDagerEtterFrist(innsendelsesfrist);
    const skalViseOppgaver = brukerHarDokumentasjonEtterspurt || dokumentasjonkrav || vilkar;

    const [sakUtbetalinger, setSakUtbetalinger] = useState<SaksUtbetaling>({});

    const [filtrerteDokumentasjonkrav, setFiltrerteDokumentasjonkrav] = useState(dokumentasjonkrav);
    const [filtrerteVilkar, setFiltrerteVilkar] = useState(vilkar);
    const dispatch = useDispatch();

    useEffect(() => {
        if (fiksDigisosId) {
            fetchToJson<SaksUtbetalingResponse[]>(`/innsyn/${fiksDigisosId}/utbetalinger`)
                .then((response) => {
                    const flattenedUtbetalinger: SaksUtbetaling = {};
                    response.forEach((saksUtbetaling) => {
                        saksUtbetaling.utbetalinger.forEach((utbetaling) => {
                            flattenedUtbetalinger[utbetaling.utbetlingsreferanse] = utbetaling;
                        });
                    });
                    setSakUtbetalinger(flattenedUtbetalinger);
                })
                .catch(() => {
                    dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
                });
        }
    }, [setSakUtbetalinger, dispatch, fiksDigisosId]);

    useEffect(() => {
        setFiltrerteDokumentasjonkrav(dokumentasjonkrav);
        const utbetalingerSomIkkeErUtbetalt = Object.values(sakUtbetalinger).filter(
            (utbetaling) => utbetaling.status !== "UTBETALT" && utbetaling.status !== "ANNULLERT"
        );
        if (utbetalingerSomIkkeErUtbetalt.length === 0) {
            const currentDate = new Date();
            const filtrerteKrav = filterDokumentasjonkrav(dokumentasjonkrav, sakUtbetalinger, currentDate);
            setFiltrerteDokumentasjonkrav(filtrerteKrav);
        }
    }, [sakUtbetalinger, dokumentasjonkrav, setFiltrerteDokumentasjonkrav]);

    useEffect(() => {
        setFiltrerteVilkar(vilkar);
        const utbetalingerSomIkkeErUtbetalt = Object.values(sakUtbetalinger).filter(
            (utbetaling) => utbetaling.status !== "UTBETALT" && utbetaling.status !== "ANNULLERT"
        );

        if (utbetalingerSomIkkeErUtbetalt.length === 0) {
            const currentDate = new Date();
            setFiltrerteVilkar(filterVilkar(vilkar, sakUtbetalinger, currentDate));
        }
    }, [sakUtbetalinger, vilkar, setFiltrerteVilkar]);

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
