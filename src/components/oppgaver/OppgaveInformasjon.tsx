import * as React from "react";
import {useTranslation} from "react-i18next";
import EkspanderbartIkonPanel from "../paneler/EkspanderbartIkonPanel";
import {BodyShort, Label} from "@navikt/ds-react";
import {Attachment, List} from "@navikt/ds-icons";
import styled from "styled-components";
import {harSakMedInnvilgetEllerDelvisInnvilget} from "./vilkar/VilkarUtils";
import {useHentSaksStatuser} from "../../generated/saks-status-controller/saks-status-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import {
    useGetfagsystemHarDokumentasjonkrav,
    useGetHarLevertDokumentasjonkrav,
} from "../../generated/oppgave-controller/oppgave-controller";
import {DokumentasjonkravResponse, VilkarResponse} from "../../generated/model";

const StyledContainer = styled.div`
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    gap: 20px 12px;
`;

interface Props {
    dokumentasjonkrav: DokumentasjonkravResponse[] | undefined;
    vilkar: VilkarResponse[] | undefined;
}

const OppgaveInformasjon: React.FC<Props> = ({dokumentasjonkrav, vilkar}) => {
    const {t} = useTranslation();

    const fiksDigisosId = useFiksDigisosId();

    const {data: innsynSaksStatusListe} = useHentSaksStatuser(fiksDigisosId);

    const {data: harLevertDokumentasjonkrav} = useGetHarLevertDokumentasjonkrav(fiksDigisosId);

    const {data: fagsystemHarDokumentasjonkrav} = useGetfagsystemHarDokumentasjonkrav(fiksDigisosId);

    const harSakInnvilgetEllerDelvisInnvilget = harSakMedInnvilgetEllerDelvisInnvilget(innsynSaksStatusListe);
    const harSaker = innsynSaksStatusListe && innsynSaksStatusListe.length > 0;

    if (
        harSakInnvilgetEllerDelvisInnvilget &&
        vilkar?.length === 0 &&
        dokumentasjonkrav?.length === 0 &&
        harSaker &&
        !fagsystemHarDokumentasjonkrav &&
        !harLevertDokumentasjonkrav
    ) {
        return (
            <EkspanderbartIkonPanel
                tittel={t("oppgaver.vilkar.tittel")}
                underTittel={t("oppgaver.vilkar.tittel.tekst")}
            >
                <StyledContainer>
                    <>
                        <List width="1.5rem" height="1.5rem" style={{marginTop: "6px"}} aria-hidden title="liste" />
                        <div>
                            <Label as="p">{t("oppgaver.vilkar")}</Label>
                            <BodyShort>{t("oppgaver.vilkar.beskrivelse")}</BodyShort>
                        </div>
                    </>
                    <>
                        <Attachment
                            width="1.5rem"
                            height="1.5rem"
                            style={{marginTop: "6px"}}
                            aria-hidden
                            title="vedlegg"
                        />
                        <div>
                            <Label as="p">{t("oppgaver.vilkar.dokumentasjonskrav")}</Label>
                            <BodyShort>{t("oppgaver.vilkar.dokumentasjonskrav.beskrivelse")}</BodyShort>
                        </div>
                    </>
                </StyledContainer>
            </EkspanderbartIkonPanel>
        );
    } else {
        return null;
    }
};

export default OppgaveInformasjon;
