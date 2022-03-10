import React, {useEffect, useState} from "react";
import "./oppgaver.less";
import {DokumentasjonEtterspurt, Feilside, visFeilside} from "../../redux/innsynsdata/innsynsdataReducer";
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

    const [sakUtbetalinger, setSakUtbetalinger] = useState<SaksUtbetalingResponse[]>([]);
    const [filtrerteDokumentasjonkrav, setFiltrerteDokumentasjonkrav] = useState(dokumentasjonkrav);
    const [filtrerteVilkar, setFiltrerteVilkar] = useState(vilkar);
    const dispatch = useDispatch();

    useEffect(() => {
        if (fiksDigisosId) {
            fetchToJson<SaksUtbetalingResponse[]>(`/innsyn/${fiksDigisosId}/utbetalinger`)
                .then((response) => {
                    response.map((sakUtbetaling) => {});
                    setSakUtbetalinger(response);
                })
                .catch(() => {
                    dispatch(visFeilside(Feilside.TEKNISKE_PROBLEMER));
                });
        }
    }, [setSakUtbetalinger, dispatch, fiksDigisosId]);

    //useEffect(() => {
    //
    //    dokumentasjonkrav.map((value) => {
    //        const dokumentasjonkravElementer = value.dokumentasjonkravElementer.map((element)=> {
    //            const utbetalingsReferanser = element.utbetalingsReferanse;
    //            const sak = sakUtbetalinger.map((s) => {
    //                s.utbetalinger.filter((utbetaling) =>
    //                    utbetalingsReferanser.includes(utbetaling.utbetlingsreferanse)
    //                ).filter((utbetaling) => {
    //                    const forbigaattUtbetalingsDato = add(new Date (utbetaling.tom),{days : 21});
    //                    return isBefore(forbigaattUtbetalingsDato, new Date());
    //                });
    //            })
    //        });
    //    })
    //
    //}, [sakUtbetalinger, dokumentasjonkrav, setFiltrerteDokumentasjonkrav]);

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
