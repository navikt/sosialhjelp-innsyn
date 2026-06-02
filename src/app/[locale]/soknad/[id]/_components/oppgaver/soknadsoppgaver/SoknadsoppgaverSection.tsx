"use client";

import { Heading, HStack, Loader, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useTranslations } from "next-intl";
import ExpandableList from "@components/showmore/ExpandableList";
import { OppgaveResponseBeta } from "@generated/model";
import SoknadsoppgaverReadMore from "./SoknadsoppgaverReadMore";
import OppgaveItem from "../OppgaveItem";

interface Props {
    oppgaver: OppgaveResponseBeta[];
    isFetching: boolean;
}

const SoknadsoppgaverSection = ({ oppgaver, isFetching }: Props) => {
    const t = useTranslations("SoknadsoppgaverSection");

    const hasUncompletedOppgaver = oppgaver.some((oppgave) => !oppgave.erLastetOpp);

    if (!hasUncompletedOppgaver) {
        return null;
    }

    return (
        <VStack gap="space-8" as="section" aria-labelledby="oppgaver-tittel">
            <HStack align="center" gap="space-8">
                <Heading size="medium" level="2" id="oppgaver-tittel" lang="no">
                    {t("title")}
                </Heading>
                {isFetching && <Loader />}
            </HStack>
            <SoknadsoppgaverReadMore />
            <NavigationGuardProvider>
                <ExpandableList
                    items={oppgaver}
                    id="oppgaver"
                    showMoreSuffix={t("suffix")}
                    labelledById="oppgaver-tittel"
                    itemsLimit={3}
                    gap={{ xs: "space-12", md: "space-16" }}
                >
                    {(oppgave, ref) => (
                        <OppgaveItem
                            ref={ref}
                            key={`${oppgave.oppgaveId}-${oppgave.dokumenttype}-${oppgave.tilleggsinformasjon}`}
                            oppgave={oppgave}
                        />
                    )}
                </ExpandableList>
            </NavigationGuardProvider>
        </VStack>
    );
};

export default SoknadsoppgaverSection;
