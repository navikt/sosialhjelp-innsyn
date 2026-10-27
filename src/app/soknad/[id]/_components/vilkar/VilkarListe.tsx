"use client";

import * as R from "remeda";
import { Heading, HStack, Loader, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import React from "react";
import { VilkarResponse } from "@generated/ssr/model";
import {
    useGetDokumentasjonkravBetaSuspense,
    useGetVilkarSuspense,
} from "@generated/oppgave-controller-v-2/oppgave-controller-v-2";
import { DokumentasjonkravDto } from "@generated/model";

import Vilkar from "./vilkar/Vilkar";
import VilkarReadMore from "./readmore/VilkarReadMore";
import TipsReadMore from "../TipsReadMore";
import Dokumentasjonkrav from "./dokumentasjonkrav/Dokumentasjonkrav";

const sortUncompletedDokumentasjonKrav = (items: DokumentasjonkravDto[]) =>
    R.sort(items, (a, b) => {
        if (!a.frist) return 1;
        if (!b.frist) return -1;
        return new Date(a.frist).getTime() - new Date(b.frist).getTime();
    });

const sortCompletedDokumentasjonKrav = (items: DokumentasjonkravDto[]) =>
    R.sort(items, (a, b) => {
        if (!a.frist) return -1;
        if (!b.frist) return 1;
        return new Date(a.frist).getTime() - new Date(b.frist).getTime();
    });

const sortVilkar = (vilkar: VilkarResponse[]) => R.sortBy(vilkar, (vilk) => new Date(vilk.hendelsetidspunkt));

const VilkarListe = () => {
    const t = useTranslations("VilkarListe");
    const { id } = useParams<{ id: string }>();
    const { data: vilkar, isFetching: isVilkarFetching } = useGetVilkarSuspense(id);
    const { data: dokumentasjonkrav, isFetching: isDokumentasjonkravFetching } =
        useGetDokumentasjonkravBetaSuspense(id);
    const isFetching = isVilkarFetching || isDokumentasjonkravFetching;

    const relevantVilkar = vilkar.filter((it) => it.status === "IKKE_OPPFYLT" || it.status === "RELEVANT");
    const uncompletedDokKrav = dokumentasjonkrav.filter(
        (it) => (it.status === "IKKE_OPPFYLT" || it.status === "RELEVANT") && it.erLastetOpp === false
    );
    const completedDokKrav = dokumentasjonkrav.filter((it) => it.status === "OPPFYLT" || it.erLastetOpp === true);

    const hasVilkar = relevantVilkar.length > 0;
    const hasUncompletedDokKrav = uncompletedDokKrav.length > 0;

    const sortedUncompletedDokumentasjonKrav = sortUncompletedDokumentasjonKrav(uncompletedDokKrav);
    const sortedCompletedDokumentasjonKrav = sortCompletedDokumentasjonKrav(completedDokKrav);
    const sortedVilkar = sortVilkar(relevantVilkar);

    if (sortedUncompletedDokumentasjonKrav.length + sortedVilkar.length === 0) return null;

    return (
        <VStack gap="space-8" as="section" aria-labelledby="vilkar-tittel">
            <HStack align="center" gap="space-8">
                <Heading size="medium" level="2" id="vilkar-tittel">
                    {t("tittel")}
                </Heading>
                {isFetching && <Loader />}
            </HStack>
            {hasVilkar && <VilkarReadMore />}
            {hasUncompletedDokKrav && <TipsReadMore />}
            <VStack as="ol" gap={{ xs: "space-12", md: "space-16" }}>
                <NavigationGuardProvider>
                    {sortedUncompletedDokumentasjonKrav.map((dokumentasjonkrav) => (
                        <Dokumentasjonkrav key={dokumentasjonkrav.dokumentasjonkravId} dokKrav={dokumentasjonkrav} />
                    ))}
                </NavigationGuardProvider>
                {sortedVilkar.map((vilk) => (
                    <Vilkar key={vilk.vilkarReferanse} vilkar={vilk} />
                ))}
                <NavigationGuardProvider>
                    {sortedCompletedDokumentasjonKrav.map((dokumentasjonkrav) => (
                        <Dokumentasjonkrav key={dokumentasjonkrav.dokumentasjonkravId} dokKrav={dokumentasjonkrav} />
                    ))}
                </NavigationGuardProvider>
            </VStack>
        </VStack>
    );
};

export default VilkarListe;
