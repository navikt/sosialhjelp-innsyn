import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Heading, VStack } from "@navikt/ds-react";
import React from "react";
import { getTranslations } from "next-intl/server";
import { NavigationGuardProvider } from "next-navigation-guard";

import { prefetchHentVedleggQuery } from "../../../generated/ssr/vedlegg-controller/vedlegg-controller";

import Opplastingsboks from "./Opplastingsboks";

interface Props {
    id: string;
}

const Dokumenter = async ({ id }: Props) => {
    const t = await getTranslations("Dokumenter");
    const queryClient = new QueryClient();
    await prefetchHentVedleggQuery(queryClient, id);
    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("tittel")}
            </Heading>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <NavigationGuardProvider>
                    <Opplastingsboks />
                </NavigationGuardProvider>
            </HydrationBoundary>
        </VStack>
    );
};

export default Dokumenter;
