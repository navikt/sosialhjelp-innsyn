import React, { useState } from "react";
import { BodyShort, Button, Label, Link as AkselLink } from "@navikt/ds-react";
import { UnmountClosed } from "react-collapse";
import styled from "styled-components";
import { ChevronUpIcon, ChevronDownIcon } from "@navikt/aksel-icons";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import EksternLenke from "../eksternLenke/EksternLenke";
import DatoOgKlokkeslett from "../tidspunkt/DatoOgKlokkeslett";
import Lastestriper from "../lastestriper/Lasterstriper";
import { logButtonOrLinkClick } from "../../utils/amplitude";
import { useHentHendelser } from "../../generated/hendelse-controller/hendelse-controller";
import { HendelseResponse } from "../../generated/model";

import { HistorikkTekstEnum } from "./HistorikkTekstEnum";

const MAX_ANTALL_KORT_LISTE = 3;

interface Props {
    fiksDigisosId: string;
}

const CenteredButton = styled(Button)`
    margin: 20px 0 0 -5.5px;
    width: fit-content;
    align-self: left;
`;

const FlexContainer = styled.div`
    display: flex;
    flex-direction: column;
`;

function sorterHendelserKronologisk(hendelser: HendelseResponse[]): HendelseResponse[] {
    return hendelser.sort((a: HendelseResponse, b: HendelseResponse) => {
        const c = new Date(a.tidspunkt);
        const d = new Date(b.tidspunkt);
        return c > d ? -1 : c < d ? 1 : 0;
    });
}

interface HistorikkListeProps {
    hendelser: HendelseResponse[];
    className: string;
    leserData: boolean;
}

const HistorikkListe = ({ hendelser, className, leserData }: HistorikkListeProps) => {
    const t = useTranslations("common");
    const locale = useLocale();
    if (leserData) {
        return <Lastestriper linjer={3} />;
    }
    const onClickHendelseLenke = (beskrivelse: string, lenketekst?: string) => {
        if (beskrivelse === "BREV_OM_SAKSBEANDLINGSTID") {
            logButtonOrLinkClick(`Historikk: åpnet foreløpig svar`);
        } else if (beskrivelse === "ETTERSPOR_MER_DOKUMENTASJON") {
            logButtonOrLinkClick(`Historikk: åpnet etterspørsel av dokumentasjon`);
        } else if (lenketekst === "SOKNAD_SEND_TIL_KONTOR_LENKETEKST") {
            logButtonOrLinkClick(`Historikk: åpnet søknaden`);
        } else if (
            (beskrivelse === "SOKNAD_FERDIGBEHADNLET" ||
                beskrivelse === "SAK_FERDIGBEHANDLET_MED_TITTEL" ||
                beskrivelse === "SAK_FERDIGBEHANDLET_UTEN_TITTEL") &&
            lenketekst === "VIS_BREVET_LENKETEKST"
        ) {
            logButtonOrLinkClick(`Historikk: åpnet vedtak fattet`);
        } else {
            logButtonOrLinkClick(`Historikk: ukjent hendelse`);
        }
    };

    const getBeskrivelse = (historikkEnumKey: keyof typeof HistorikkTekstEnum, tekstArgument?: string) => {
        const enumValue = HistorikkTekstEnum[historikkEnumKey];
        if (enumValue === HistorikkTekstEnum.UTBETALINGER_OPPDATERT) {
            return (
                <BodyShort weight="semibold">
                    {t.rich(enumValue, {
                        utbetalinger: (chunks) => (
                            <AkselLink as={Link} href={`/${locale}/utbetaling`}>
                                {chunks}
                            </AkselLink>
                        ),
                    })}
                </BodyShort>
            );
        }

        if (enumValue === HistorikkTekstEnum.ANTALL_SENDTE_VEDLEGG && tekstArgument) {
            return (
                <BodyShort weight="semibold">
                    {t("hendelse.antalle_sendte_vedlegg", { count: tekstArgument })}
                </BodyShort>
            );
        }

        if (
            (enumValue === HistorikkTekstEnum.SAK_UNDER_BEHANDLING_MED_TITTEL ||
                enumValue === HistorikkTekstEnum.SAK_FERDIGBEHANDLET_MED_TITTEL) &&
            tekstArgument
        ) {
            return (
                <BodyShort weight="semibold">
                    {t.rich(enumValue, {
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                        arg: tekstArgument,
                    })}
                </BodyShort>
            );
        } else if (
            [
                HistorikkTekstEnum.SOKNAD_SEND_TIL_KONTOR,
                HistorikkTekstEnum.SOKNAD_MOTTATT_MED_KOMMUNENAVN,
                HistorikkTekstEnum.SOKNAD_VIDERESENDT_MED_NORG_ENHET,
                HistorikkTekstEnum.SOKNAD_VIDERESENDT_PAPIRSOKNAD_MED_NORG_ENHET,
                HistorikkTekstEnum.SOKNAD_KAN_IKKE_VISE_STATUS_MED_TITTEL,
                HistorikkTekstEnum.SAK_KAN_IKKE_VISE_STATUS_MED_TITTEL,
            ].includes(enumValue)
        ) {
            return (
                <BodyShort weight="semibold">
                    {t.rich(enumValue, {
                        norsk: (chunks) => <span lang="no">{chunks}</span>,
                        arg: tekstArgument!,
                    })}
                </BodyShort>
            );
        }
        return <BodyShort weight="semibold">{t(enumValue, { arg: tekstArgument! })}</BodyShort>;
    };

    return (
        <ul className={className}>
            {hendelser.map((hendelse: HendelseResponse, index: number) => {
                return (
                    <li key={index}>
                        <Label as="div">
                            {getBeskrivelse(
                                hendelse.hendelseType as keyof typeof HistorikkTekstEnum,
                                hendelse.tekstArgument
                            )}
                            {hendelse.filUrl && (
                                <EksternLenke
                                    href={hendelse.filUrl.link}
                                    onClick={() => {
                                        onClickHendelseLenke(hendelse.hendelseType, hendelse?.filUrl?.linkTekst);
                                    }}
                                >
                                    {t(HistorikkTekstEnum[hendelse.filUrl.linkTekst])}
                                </EksternLenke>
                            )}
                        </Label>
                        <DatoOgKlokkeslett tidspunkt={hendelse.tidspunkt} />
                    </li>
                );
            })}
        </ul>
    );
};

const KortHistorikk = ({ hendelser, leserData }: { hendelser: HendelseResponse[]; leserData: boolean }) => {
    return <HistorikkListe hendelser={hendelser} className="historikk" leserData={leserData} />;
};

const LangHistorikk = ({ hendelser }: { hendelser: HendelseResponse[] }) => {
    const [apen, setApen] = useState(false);
    const historikkListeClassname = apen ? "historikk_start" : "historikk_start_lukket";
    const t = useTranslations("common");
    const toggleOpen = () => {
        setApen(!apen);
    };

    return (
        <FlexContainer>
            {apen ? (
                <UnmountClosed isOpened={apen}>
                    <HistorikkListe hendelser={hendelser} className="historikk" leserData={false} />
                </UnmountClosed>
            ) : (
                <HistorikkListe
                    hendelser={hendelser.slice(0, MAX_ANTALL_KORT_LISTE)}
                    className={"historikk " + historikkListeClassname}
                    leserData={false}
                />
            )}

            <CenteredButton
                variant="tertiary"
                onClick={toggleOpen}
                size="xsmall"
                iconPosition="left"
                icon={
                    apen ? <ChevronUpIcon aria-hidden title="Lukk" /> : <ChevronDownIcon aria-hidden title="Vis alle" />
                }
            >
                {apen ? t("historikk.lukk") : `${t("historikk.se_hele_prosessen")}`}
            </CenteredButton>
        </FlexContainer>
    );
};

const StyledTextPlacement = styled.div`
    margin-bottom: 1rem;
    @media screen and (max-width: 640px) {
        margin-left: 2rem;
    }
`;

const Historikk = ({ fiksDigisosId }: Props) => {
    const { data: hendelser, isLoading, isError } = useHentHendelser(fiksDigisosId);
    const t = useTranslations("common");

    if (isError) {
        return <StyledTextPlacement>{t("feilmelding.historikk_innlasting")}</StyledTextPlacement>;
    }
    if (isLoading && !hendelser) {
        return <Lastestriper />;
    }
    if (!hendelser) {
        return null;
    }
    const sorterteHendelser = sorterHendelserKronologisk(hendelser);
    if (sorterteHendelser.length < MAX_ANTALL_KORT_LISTE + 1) {
        return <KortHistorikk hendelser={sorterteHendelser} leserData={isLoading} />;
    }
    if (sorterteHendelser.length > MAX_ANTALL_KORT_LISTE) {
        return <LangHistorikk hendelser={sorterteHendelser} />;
    }
    return null;
};

export default Historikk;
