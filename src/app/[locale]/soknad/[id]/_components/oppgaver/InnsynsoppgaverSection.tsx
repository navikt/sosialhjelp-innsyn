"use client";

import { Heading, HStack, Loader, Tag, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { useTranslations } from "next-intl";
import { TasklistIcon } from "@navikt/aksel-icons";
import ExpandableList from "@components/showmore/ExpandableList";
import { OppgaveResponseBeta } from "@generated/model";
import TipsReadMore from "../TipsReadMore";
import OppgaveItem from "../oppgaver/OppgaveItem";

interface Props {
    oppgaver: OppgaveResponseBeta[];
    isFetching: boolean;
}

const InnsynsoppgaverSection = ({ oppgaver, isFetching }: Props) => {
    const t = useTranslations("InnsynsoppgaverSection");

    const fullforteOppgaver = oppgaver.filter((oppgave) => oppgave.erLastetOpp);
    const hasUncompletedOppgaver = oppgaver.length - fullforteOppgaver.length > 0;

    return (
        <VStack gap="space-8" as="section" aria-labelledby="oppgaver-tittel">
            <HStack align="center" gap="space-8">
                <Heading size="medium" level="2" id="oppgaver-tittel" lang="no">
                    {t("tittel")}
                </Heading>
                <Tag variant={hasUncompletedOppgaver ? "warning" : "success"} icon={<TasklistIcon aria-hidden />}>
                    {hasUncompletedOppgaver
                        ? t("xAvYFullfort", { fullfort: fullforteOppgaver.length, total: oppgaver.length })
                        : t("alleFullfort")}
                </Tag>
                {isFetching && <Loader />}
            </HStack>
            {hasUncompletedOppgaver && <TipsReadMore />}
            <NavigationGuardProvider>
                <ExpandableList
                    items={oppgaver}
                    id="oppgaver"
                    showMoreSuffix={t("suffix")}
                    labelledById="oppgaver-tittel"
                    itemsLimit={hasUncompletedOppgaver ? 3 : 1}
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

export default InnsynsoppgaverSection;
