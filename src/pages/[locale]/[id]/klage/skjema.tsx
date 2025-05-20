import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { NextPage } from "next";
import styled from "styled-components";
import { Button, Checkbox, CheckboxGroup, Heading, Textarea, Link as AkselLink } from "@navikt/ds-react";
import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/dist/types";

import MainLayout from "../../../../components/MainLayout";
import useUpdateBreadcrumbs from "../../../../hooks/useUpdateBreadcrumbs";
import useFiksDigisosId from "../../../../hooks/useFiksDigisosId";
import Panel from "../../../../components/panel/Panel";
import KlageVedleggBoks from "../../../../components/klage/KlageVedleggBoks";
import { useHentSoknadsStatus } from "../../../../generated/soknads-status-controller/soknads-status-controller";
import Lastestriper from "../../../../components/lastestriper/Lasterstriper";
import { useHentSaksStatuser } from "../../../../generated/saks-status-controller/saks-status-controller";
import { FilUrl, SoknadsStatusResponseStatus } from "../../../../generated/model";
import { getHentKlagerQueryKey, useSendKlage } from "../../../../generated/klage-controller/klage-controller";
import useFilOpplasting, { FancyFile } from "../../../../components/filopplasting/useFilOpplasting";
import pageHandler from "../../../../pagehandler/pageHandler";
import { getFlagsServerSide } from "../../../../featuretoggles/ssr";

const StyledHeading = styled(Heading)`
    //padding-bottom: 5px;
`;

const StyledTextarea = styled(Textarea)`
    margin-bottom: 1.5rem;
`;

const VedtaksListe = styled("ul")`
    margin-bottom: 1.5rem;
    padding: 0;
    margin-top: 0;
`;

const ListItem = styled("li")`
    list-style-type: none;
    display: flex;
    flex-direction: column;
`;

const SendInnKnapp = styled(Button)`
    margin-right: 1rem;
    margin-top: 1.5rem;
`;

const dummyMetadata = [
    {
        type: "dummy",
    },
];

const KlageSkjema: NextPage = () => {
    const fiksDigisosId = useFiksDigisosId();
    const router = useRouter();
    const t = useTranslations("common");
    useUpdateBreadcrumbs(() => [
        { title: t("soknadStatus.tittel"), url: `/${fiksDigisosId}/status` },
        { title: "Send klage" },
    ]);
    const queryClient = useQueryClient();
    const [klageTekst, setKlageTekst] = useState<string>("");
    const [selectedVedtak, setSelectedVedtak] = useState<string[]>([]);
    const { files, removeFil, addFiler, innerErrors, resetStatus } = useFilOpplasting(dummyMetadata);
    const {
        data: soknadsStatus,
        isLoading: soknadsStatusIsLoading,
        error: soknadsStatusError,
    } = useHentSoknadsStatus(fiksDigisosId);
    const {
        data: saksStatuser,
        isLoading: saksStatuserIsLoading,
        error: saksStatuserError,
    } = useHentSaksStatuser(fiksDigisosId);
    const { mutate, isPending: sendKlageIsLoading } = useSendKlage({
        mutation: {
            onSuccess: async () => {
                await queryClient.invalidateQueries({ queryKey: getHentKlagerQueryKey(fiksDigisosId) });
                await router.push({ pathname: "/[id]/status", query: { id: fiksDigisosId } });
            },
        },
    });
    if (soknadsStatusIsLoading || saksStatuserIsLoading) {
        return (
            <MainLayout title="Send klage" bannerTitle="Send klage">
                <Panel header={<StyledHeading size="medium">Send klage</StyledHeading>}>
                    <Lastestriper />
                </Panel>
            </MainLayout>
        );
    }
    if (soknadsStatusError || saksStatuserError) {
        return <></>;
    }
    const vedtak: [string, FilUrl[]][] = saksStatuser
        ? saksStatuser
              .filter((sak) => sak.status === SoknadsStatusResponseStatus.FERDIGBEHANDLET && sak.vedtaksfilUrlList)
              .map((ferdigBehandletSak) => [ferdigBehandletSak.tittel, ferdigBehandletSak.vedtaksfilUrlList ?? []])
        : [];
    return (
        <MainLayout title="Send klage" bannerTitle="Send klage">
            <Panel header={<StyledHeading size="medium">Send klage</StyledHeading>}>
                {soknadsStatus?.navKontor && <p>Klagen sendes til {soknadsStatus.navKontor}</p>}
                <VedtaksListe>
                    {vedtak.map(([tittel, urls], index) => (
                        <ListItem key={`${tittel}-${index}`}>
                            <p>{tittel}</p>
                            <CheckboxGroup
                                legend="Hvilke vedtak ønsker du å klage på?"
                                onChange={(value: string[]) => setSelectedVedtak(value)}
                            >
                                {urls.map((url) => (
                                    <Checkbox key={url.id} value={url.id}>
                                        {url.url ? (
                                            <AkselLink as={Link} href={url.url}>
                                                Vedtaksbrev{url.dato ? ` (${url.dato})` : ""}
                                            </AkselLink>
                                        ) : (
                                            <div>Vedtaksbrev{url.dato ? ` (${url.dato})` : ""}</div>
                                        )}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </ListItem>
                    ))}
                </VedtaksListe>
                <StyledTextarea
                    label={
                        <div>
                            <StyledHeading size="small">Hva er du uenig med i vedtaket?</StyledHeading>
                            Forklar hva som gjør at du er uenig og hva du ønsker endret.
                        </div>
                    }
                    onChange={(event) => setKlageTekst(event.currentTarget.value)}
                    value={klageTekst}
                />
                <KlageVedleggBoks
                    resetStatus={resetStatus}
                    errors={innerErrors[0]}
                    removeFil={(fil: FancyFile) => removeFil(0, fil)}
                    files={files[0]}
                    addFiler={(files: File[]) => addFiler(0, files)}
                />
                <SendInnKnapp
                    onClick={() => {
                        mutate({
                            fiksDigisosId: fiksDigisosId,
                            data: { fiksDigisosId, klageTekst, vedtaksIds: selectedVedtak },
                        });
                    }}
                    disabled={sendKlageIsLoading}
                >
                    Send klage
                </SendInnKnapp>
                <Button variant="secondary">Avbryt</Button>
            </Panel>
        </MainLayout>
    );
};

export const getServerSideProps = async (context: GetServerSidePropsContext<{ locale: "nb" | "nn" | "en" }>) => {
    const flags = await getFlagsServerSide(context.req, context.res);
    const klageToggle = flags.toggles.find((toggle) => toggle.name === "sosialhjelp.innsyn.klage_enabled");
    if (klageToggle && !klageToggle.enabled) {
        return { notFound: true };
    }
    return pageHandler(context);
};

export default KlageSkjema;
