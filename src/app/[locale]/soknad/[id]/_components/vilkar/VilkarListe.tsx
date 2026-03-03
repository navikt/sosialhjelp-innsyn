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
import DokKravReadMore from "./readmore/DokKravReadMore";
import Dokumentasjonkrav from "./dokumentasjonkrav/Dokumentasjonkrav";

const sortDokumentasjonKrav = (items: DokumentasjonkravDto[]) =>
    R.sortBy(items, (it) => it.frist ?? new Date(Number.MAX_SAFE_INTEGER).toISOString());

const sortVilkar = (vilkar: VilkarResponse[]) => R.sortBy(vilkar, R.prop("hendelsetidspunkt"));

const VilkarListe = () => {
    const t = useTranslations("VilkarListe");
    const { id } = useParams<{ id: string }>();
    const { data: vilkar, isFetching: isVilkarFetching } = useGetVilkarSuspense(id);
    const { data: dokumentasjonkrav, isFetching: isDokumentasjonkravFetching } =
        useGetDokumentasjonkravBetaSuspense(id);
    const isFetching = isVilkarFetching || isDokumentasjonkravFetching;
    const hasVilkar = vilkar.filter((it) => it.status === "IKKE_OPPFYLT" || it.status === "RELEVANT").length > 0;
    const uncompletedDokKrav = dokumentasjonkrav.filter(
        (it) => (it.status === "IKKE_OPPFYLT" || it.status === "RELEVANT") && it.erLastetOpp === false
    );
    const hasUncompletedDokKrav = uncompletedDokKrav.length > 0;

    const sortedDokumentasjonKrav = sortDokumentasjonKrav(dokumentasjonkrav);
    const sortedVilkar = sortVilkar(vilkar);

    if (sortedDokumentasjonKrav.length + sortedVilkar.length === 0) return null;

    return (
        <VStack gap="space-8" as="section" aria-labelledby="vilkar-tittel">
            <HStack align="center" gap="space-8">
                <Heading size="medium" level="2" id="vilkar-tittel">
                    {t("tittel")}
                </Heading>
                {isFetching && <Loader />}
            </HStack>
            {hasVilkar && <VilkarReadMore />}
            {hasUncompletedDokKrav && <DokKravReadMore />}
            <NavigationGuardProvider>
                {sortedDokumentasjonKrav.map((dokumentasjonkrav) => (
                    <Dokumentasjonkrav key={dokumentasjonkrav.dokumentasjonkravId} dokKrav={dokumentasjonkrav} />
                ))}
            </NavigationGuardProvider>
            {vilkar.map((vilk) => {
                return <Vilkar key={vilk.vilkarReferanse} vilkar={vilk}></Vilkar>;
            })}
        </VStack>
    );
};

export default VilkarListe;
