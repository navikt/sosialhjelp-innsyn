import styled from "styled-components";
import { Alert, BodyShort, Heading, Panel as NavDsPanel } from "@navikt/ds-react";
import { useTranslation } from "next-i18next";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { logger } from "@navikt/next-logger";
import { QueryClient } from "@tanstack/react-query";

import useFiksDigisosId from "../../hooks/useFiksDigisosId";
import useKommune from "../../hooks/useKommune";
import {
    getHentSaksStatuserQueryKey,
    getHentSaksStatuserUrl,
    useHentSaksStatuser,
} from "../../generated/saks-status-controller/saks-status-controller";
import {
    getGetDokumentasjonkravQueryKey,
    getGetDokumentasjonkravUrl,
    getGetfagsystemHarDokumentasjonkravQueryKey,
    getGetfagsystemHarDokumentasjonkravUrl,
    getGetHarLevertDokumentasjonkravQueryKey,
    getGetHarLevertDokumentasjonkravUrl,
    getGetOppgaverQueryKey,
    getGetOppgaverUrl,
    getGetVilkarQueryKey,
    getGetVilkarUrl,
    useGetOppgaver,
} from "../../generated/oppgave-controller/oppgave-controller";
import {
    getHentSoknadsStatusQueryKey,
    getHentSoknadsStatusUrl,
    useHentSoknadsStatus,
} from "../../generated/soknads-status-controller/soknads-status-controller";
import {
    getHentForelopigSvarStatusQueryKey,
    getHentForelopigSvarStatusUrl,
    useHentForelopigSvarStatus,
} from "../../generated/forelopig-svar-controller/forelopig-svar-controller";
import { logAmplitudeEvent } from "../../utils/amplitude";
import { LoadingResourcesFailedAlert } from "../../innsyn/LoadingResourcesFailedAlert";
import { DriftsmeldingKommune } from "../../components/driftsmelding/DriftsmeldingKommune";
import ForelopigSvarAlertstripe from "../../components/forelopigSvar/ForelopigSvar";
import SoknadsStatus from "../../components/soknadsStatus/SoknadsStatus";
import Oppgaver from "../../components/oppgaver/Oppgaver";
import VedleggView from "../../components/vedlegg/VedleggView";
import Historikk from "../../components/historikk/Historikk";
import MainLayout from "../../components/MainLayout";
import useUpdateBreadcrumbs from "../../hooks/useUpdateBreadcrumbs";
import { FilUploadSuccesfulProvider } from "../../components/filopplasting/FilUploadSuccessfulContext";
import KlageSection from "../../components/klage/KlageSection";
import { SaksStatusResponseStatus, SoknadsStatusResponseStatus } from "../../generated/model";
import pageHandler, { buildUrl } from "../../pagehandler/pageHandler";
import Panel from "../../components/panel/Panel";
import EttersendelseView from "../../components/ettersendelse/EttersendelseView";
import { useHentVedlegg } from "../../generated/vedlegg-controller/vedlegg-controller";
import ArkfanePanel from "../../components/arkfanePanel/ArkfanePanel";
import UxSignalsWidget from "../../components/widgets/UxSignalsWidget";
import { customFetch } from "../../custom-fetch";
import { extractAuthHeader } from "../../utils/authUtils";
import {
    getHentUtbetalingerQueryKey,
    getHentUtbetalingerUrl,
} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import { getHentHendelserQueryKey, getHentHendelserUrl } from "../../generated/hendelse-controller/hendelse-controller";
import { getHentVedleggQueryKey, getHentVedleggUrl } from "../../generated/vedlegg-controller/vedlegg-controller";
import {
    getHentKommuneInfoQueryKey,
    getHentKommuneInfoUrl,
} from "../../generated/kommune-controller/kommune-controller";
import {
    getHentAlleSakerQueryKey,
    getHentAlleSakerUrl,
} from "../../generated/saks-oversikt-controller/saks-oversikt-controller";

const StyledPanel = styled(NavDsPanel)`
    @media screen and (min-width: 641px) {
        padding-left: 80px;
        padding-right: 80px;
    }
`;

const StyledSpace = styled.div`
    padding: 2rem 0 2rem 0;
`;

const StyledAlert = styled(Alert)`
    margin-bottom: 3rem;
`;

const SakStatus = ({ fiksDigisosId }: { fiksDigisosId: string }) => {
    const { t } = useTranslation();
    const pathname = usePathname();
    useUpdateBreadcrumbs(() => [{ title: t("soknadStatus.tittel"), url: `/sosialhjelp${pathname}` }]);

    const { kommune, driftsmelding } = useKommune();

    const erPaInnsyn = !kommune?.erInnsynDeaktivert && !kommune?.erInnsynMidlertidigDeaktivert;
    const { data: saksStatuser } = useHentSaksStatuser(fiksDigisosId);
    const { data: oppgaver } = useGetOppgaver(fiksDigisosId);
    const { data: soknadsStatus } = useHentSoknadsStatus(fiksDigisosId);
    const { data: forelopigSvar } = useHentForelopigSvarStatus(fiksDigisosId);
    const { isLoading } = useHentVedlegg(fiksDigisosId);

    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const dataErKlare = Boolean(
        !pageLoadIsLogged && erPaInnsyn && saksStatuser && oppgaver && soknadsStatus && forelopigSvar
    );

    useEffect(() => {
        function createAmplitudeData() {
            const harVedtaksbrev = saksStatuser && saksStatuser.some((item) => item.vedtaksfilUrlList?.length);

            return {
                antallSaker: saksStatuser!.length,
                harMottattForelopigSvar: forelopigSvar?.harMottattForelopigSvar,
                harEtterspurtDokumentasjon: Boolean(oppgaver?.length),
                harVedtaksbrev: harVedtaksbrev,
                status: soknadsStatus?.status,
            };
        }

        if (dataErKlare) {
            logAmplitudeEvent("Hentet saker for søknad", createAmplitudeData());
            //Ensure only one logging to amplitude
            setPageLoadIsLogged(true);
        }
    }, [dataErKlare, oppgaver?.length, forelopigSvar?.harMottattForelopigSvar, saksStatuser, soknadsStatus?.status]);

    const sakErPaaklagbar =
        soknadsStatus?.status !== SoknadsStatusResponseStatus.BEHANDLES_IKKE &&
        (!saksStatuser ||
            saksStatuser?.some(
                (it) =>
                    it.status !== SaksStatusResponseStatus.BEHANDLES_IKKE &&
                    it.status !== SaksStatusResponseStatus.IKKE_INNSYN
            ));

    return (
        <MainLayout title={t("app.tittel")}>
            <UxSignalsWidget embedCode="panel-0zd044zz4a" />
            <StyledSpace />
            <LoadingResourcesFailedAlert />

            <DriftsmeldingKommune driftsmelding={driftsmelding} />

            {soknadsStatus?.isBroken && (
                <StyledAlert variant="warning">
                    <BodyShort>{t("soknaderUtenVedlegg.statusside")}</BodyShort>
                </StyledAlert>
            )}

            <ForelopigSvarAlertstripe />

            <SoknadsStatus />
            <FilUploadSuccesfulProvider>
                {erPaInnsyn && <Oppgaver />}
                {kommune != null && kommune.erInnsynDeaktivert && (
                    <>
                        <StyledPanel className="panel-luft-over">
                            <Heading level="2" size="medium">
                                {t("vedlegg.tittel")}
                            </Heading>
                        </StyledPanel>
                        <StyledPanel className="panel-glippe-over">
                            <VedleggView fiksDigisosId={fiksDigisosId} />
                        </StyledPanel>
                    </>
                )}
                {sakErPaaklagbar && <KlageSection />}
                {(kommune == null || !kommune.erInnsynDeaktivert) && (
                    <>
                        <Panel header={t("andre_vedlegg.type")}>
                            <EttersendelseView isLoading={isLoading} />
                        </Panel>
                        <ArkfanePanel
                            historikkChildren={<Historikk fiksDigisosId={fiksDigisosId} />}
                            vedleggChildren={<VedleggView fiksDigisosId={fiksDigisosId} />}
                        />
                    </>
                )}
            </FilUploadSuccesfulProvider>
        </MainLayout>
    );
};

/**
 * Dette er en liten hack som forhindrer at en request mot en søknad bruker ikke
 * eier, fører til 20-30 mislykkede kall og loggstøy.
 */
const SaksStatusView: NextPage = () => {
    const fiksDigisosId = useFiksDigisosId();
    const { isPending, error } = useHentSoknadsStatus(fiksDigisosId);
    const router = useRouter();

    useEffect(() => {
        if (!error) return;
        logger.warn("Error fetching soknadsstatus", error);
        router.push("/");
    }, [error, router]);

    if (isPending) return null;

    return error ? null : <SakStatus fiksDigisosId={fiksDigisosId} />;
};

const getQueries = (id: string) => [
    { url: getHentSaksStatuserUrl(id), key: getHentSaksStatuserQueryKey(id) },
    { url: getGetOppgaverUrl(id), key: getGetOppgaverQueryKey(id) },
    { url: getHentSoknadsStatusUrl(id), key: getHentSoknadsStatusQueryKey(id) },
    { url: getHentForelopigSvarStatusUrl(id), key: getHentForelopigSvarStatusQueryKey(id) },
    { url: getGetVilkarUrl(id), key: getGetVilkarQueryKey(id) },
    { url: getGetDokumentasjonkravUrl(id), key: getGetDokumentasjonkravQueryKey(id) },
    { url: getGetHarLevertDokumentasjonkravUrl(id), key: getGetHarLevertDokumentasjonkravQueryKey(id) },
    { url: getGetfagsystemHarDokumentasjonkravUrl(id), key: getGetfagsystemHarDokumentasjonkravQueryKey(id) },
    { url: getHentUtbetalingerUrl(), key: getHentUtbetalingerQueryKey() },
    { url: getHentHendelserUrl(id), key: getHentHendelserQueryKey(id) },
    { url: getHentVedleggUrl(id), key: getHentVedleggQueryKey(id) },
    { url: getHentKommuneInfoUrl(id), key: getHentKommuneInfoQueryKey(id) },
    { url: getHentAlleSakerUrl(), key: getHentAlleSakerQueryKey() },
];

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const { req } = ctx;
    const queryClient = new QueryClient();
    const token = extractAuthHeader(req);
    const headers: HeadersInit = new Headers();
    headers.append("Authorization", token);
    const id = ctx.params?.id as string;
    const promises = getQueries(id).map(({ url, key }) => {
        const path = url.replace("/sosialhjelp/innsyn/api/innsyn-api/api/v1/innsyn", "");
        return queryClient.prefetchQuery({ queryKey: key, queryFn: () => customFetch(buildUrl(path), { headers }) });
    });
    await Promise.all(promises);

    return pageHandler(ctx, ["common"], queryClient);
};

export default SaksStatusView;
