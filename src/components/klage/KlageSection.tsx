import React from "react";
import * as R from "remeda";
import { NextPage } from "next";
import Link from "next/link";
import { Button, Heading, List, Tag, Link as AkselLink } from "@navikt/ds-react";
import styled from "styled-components";
import { useTranslations } from "next-intl";

import { useHentKlager } from "../../generated/klage-controller/klage-controller";
import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import Panel from "../panel/Panel";
import Lastestriper from "../lastestriper/Lasterstriper";
import { KlageDtoStatus, SaksStatusResponse, SaksStatusResponseStatus } from "../../generated/model";
import { useHentSaksStatuser } from "../../generated/saks-status-controller/saks-status-controller";
import { useFlag } from "../../featuretoggles/context";
import { logBrukerAapnerKlageskjema } from "../../utils/amplitude";
import { browserEnv } from "../../config/env";

const StyledKlageList = styled(List)`
    border-bottom: 2px solid var(--a-border-divider);
    padding-bottom: 1rem;
`;

const InfoBoks = styled("p")`
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
    const t = useTranslations("common");
    const fiksDigisosId = useFiksDigisosId();
    const klageFlag = useFlag("sosialhjelp.innsyn.klage_enabled");

    const { data: saksStatuser, isLoading: saksStatuserIsLoading } = useHentSaksStatuser(fiksDigisosId, {
        query: { enabled: klageFlag.enabled },
    });
    const { data, isLoading } = useHentKlager(fiksDigisosId, {
        query: { enabled: klageFlag.enabled },
    });

    if (!klageFlag.enabled) {
        return (
            <Panel header={t("klage.papirskjema.header")}>
                <p>{t("klage.papirskjema.sammendrag")}</p>
                <p>
                    <span>{t("klage.papirskjema.beskrivelse_1")}</span>
                    <AkselLink
                        href={`${browserEnv.NEXT_PUBLIC_BASE_PATH}/papirskjema_klage.pdf`}
                        onClick={() =>
                            logBrukerAapnerKlageskjema(
                                "Bruker åpner klageskjema: ",
                                t("klage.papirskjema.skjema_url_tekst")
                            )
                        }
                    >
                        {t("klage.papirskjema.skjema_url_tekst")}
                    </AkselLink>
                    <span>{t("klage.papirskjema.beskrivelse_2")}</span>
                </p>
                <p>
                    <AkselLink as={Link} href="https://www.nav.no/okonomisk-sosialhjelp#klage">
                        {t("klage.papirskjema.mer_info_url_tekst")}
                    </AkselLink>
                </p>
            </Panel>
        );
    }

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
                                R.unique()
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
                                        <AkselLink as={Link} href={klage.klageUrl.url}>
                                            Kvittering på klage ({klage.klageUrl.dato})
                                        </AkselLink>
                                        {klage.nyttVedtakUrl && (
                                            <AkselLink as={Link} href={klage.nyttVedtakUrl.url}>
                                                Nytt vedtak ({klage.nyttVedtakUrl.dato})
                                            </AkselLink>
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
            <Link href={{ pathname: "/[id]/klage/skjema", query: { id: fiksDigisosId } }} legacyBehavior>
                <Button variant="secondary" disabled={!kanKlage}>
                    Start klage
                </Button>
            </Link>
        </Panel>
    );
};

const AntallKlagerSendt = ({ antallKlager }: { antallKlager: number }): React.JSX.Element => {
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
