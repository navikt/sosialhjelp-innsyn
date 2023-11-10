import React from "react";
import * as R from "remeda";
import {useHentKlager} from "../../generated/klage-controller/klage-controller";
import {NextPage} from "next";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import Panel from "../panel/Panel";
import Lastestriper from "../lastestriper/Lasterstriper";
import Link from "next/link";
import {Button, Heading, List, Tag} from "@navikt/ds-react";
import styled from "styled-components";
import {KlageDtoStatus, SaksStatusResponse, SaksStatusResponseStatus} from "../../generated/model";
import {useHentSaksStatuser} from "../../generated/saks-status-controller/saks-status-controller";
import {useTranslation} from "next-i18next";
import {useFlag} from "../../featuretoggles/context";

const StyledKlageList = styled(List)`
    border-bottom: 1px solid black;
    padding-bottom: 1rem;
`;

const InfoBoks = styled("p")`
    padding-top: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
`;

const KlageHeader = styled("div")`
    display: flex;
    justify-content: space-between;
`;

const FilUrlBoks = styled("div")`
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
`;

const statusToText: Record<KlageDtoStatus, string> = {
    [KlageDtoStatus.UNDER_BEHANDLING]: "Under behandling",
    [KlageDtoStatus.MOTTATT]: "Mottatt",
    [KlageDtoStatus.FERDIG_BEHANDLET]: "Ferdig behandlet",
    [KlageDtoStatus.SENDT]: "Sendt",
    [KlageDtoStatus.HOS_STATSFORVALTER]: "Hos statsforvalter",
};

const sakHasMatchingVedtak = (a: SaksStatusResponse, b: string): boolean =>
    Boolean(a.vedtaksfilUrlList?.some((it) => it.id === b));

const KlageSection: NextPage = (): React.JSX.Element => {
    const klageFlag = useFlag("sosialhjelp.innsyn.klage_enabled");
    const {t} = useTranslation();
    if (!klageFlag.enabled) {
        return (
            <Panel header={t("klage.papirskjema.header")}>
                <p>{t("klage.papirskjema.sammendrag")}</p>
                <p>
                    <span>{t("klage.papirskjema.beskrivelse_1")}</span>
                    <Link href="/papirskjema_klage.pdf">{t("klage.papirskjema.skjema_url_tekst")}</Link>
                    <span>{t("klage.papirskjema.beskrivelse_2")}</span>
                </p>
                <p>
                    <Link href="https://www.nav.no/okonomisk-sosialhjelp#klage">
                        {t("klage.papirskjema.mer_info_url_tekst")}
                    </Link>
                </p>
            </Panel>
        );
    }

    const fiksDigisosId = useFiksDigisosId();

    const {data: saksStatuser, isLoading: saksStatuserIsLoading} = useHentSaksStatuser(fiksDigisosId);

    const {data, isLoading, error} = useHentKlager(fiksDigisosId);
    if (isLoading || saksStatuserIsLoading) {
        return (
            <Panel header="Dine klager">
                <Lastestriper />
            </Panel>
        );
    }

    const vedtak =
        saksStatuser
            ?.filter((status) => status.status === SaksStatusResponseStatus.FERDIGBEHANDLET)
            ?.flatMap((saksStatus) => saksStatus.vedtaksfilUrlList) ?? [];
    const kanKlage = vedtak.length > 0;
    return (
        <Panel header="Dine klager">
            {data && data.length > 0 && (
                <>
                    <StyledKlageList as="ul">
                        {data.map((klage) => {
                            const paaklagetSaker = R.pipe(
                                saksStatuser ?? [],
                                R.intersectionWith(klage.paaklagetVedtakRefs, sakHasMatchingVedtak),
                                R.map((it) => it.tittel),
                                R.uniq()
                            );
                            return (
                                <React.Fragment key={klage.klageUrl.id}>
                                    <KlageHeader>
                                        <Heading level="4" size="small">
                                            {paaklagetSaker.join(", ")}
                                        </Heading>
                                        <Tag variant="info">{statusToText[klage.status]}</Tag>
                                    </KlageHeader>
                                    <FilUrlBoks>
                                        <Link href={klage.klageUrl.url}>
                                            Kvittering på klage ({klage.klageUrl.dato})
                                        </Link>
                                        {klage.nyttVedtakUrl && (
                                            <Link href={klage.nyttVedtakUrl.url}>
                                                Nytt vedtak ({klage.nyttVedtakUrl.dato})
                                            </Link>
                                        )}
                                    </FilUrlBoks>
                                </React.Fragment>
                            );
                        })}
                    </StyledKlageList>
                    {data.some((klage) => klage.status === KlageDtoStatus.UNDER_BEHANDLING) && (
                        <p>Kommunene kan ha ulik svartid, men du skal få svar innen rimelig tid.</p>
                    )}
                </>
            )}
            <InfoBoks>
                <AntallKlagerSendt antallKlager={data?.length ?? 0} />
                <Link href="https://www.nav.no/okonomisk-sosialhjelp#klage">Les mer om klageprosessen her</Link>
            </InfoBoks>
            <Link href={{pathname: "/[id]/klage/skjema", query: {id: fiksDigisosId}}}>
                <Button variant="secondary" disabled={!kanKlage}>
                    Start klage
                </Button>
            </Link>
        </Panel>
    );
};

const AntallKlagerSendt = ({antallKlager}: {antallKlager: number}): React.JSX.Element => {
    let tekst: string;
    if (antallKlager === 0) {
        tekst = "Ingen klage sendt";
    } else if (antallKlager === 1) {
        tekst = "1 klage er sendt";
    } else {
        tekst = `${antallKlager} klager er sendt`;
    }
    return <>{tekst}, du har tre uker klagefrist på vedtak.</>;
};

export default KlageSection;
