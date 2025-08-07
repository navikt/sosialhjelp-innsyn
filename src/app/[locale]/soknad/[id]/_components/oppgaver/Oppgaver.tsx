import { Heading, Tag, VStack } from "@navikt/ds-react";
import { NavigationGuardProvider } from "next-navigation-guard";
import { getTranslations } from "next-intl/server";

import { getVisningstekster } from "@utils/vedleggUtils";
import Opplastingsboks from "@components/opplastingsboks/Opplastingsboks";
import { OppgaveElement } from "@generated/ssr/model";

interface Props {
    oppgaver: (OppgaveElement & { frist?: string })[];
}

const Oppgaver = async ({ oppgaver }: Props) => {
    const t = await getTranslations("Oppgaver");

    return (
        <VStack gap="4">
            <Heading size="large" level="2" spacing>
                {t("tittel")}
            </Heading>
            {oppgaver.map((oppgave) => {
                const { typeTekst, tilleggsinfoTekst } = getVisningstekster(
                    oppgave.dokumenttype,
                    oppgave.tilleggsinformasjon
                );
                return (
                    <NavigationGuardProvider
                        key={`${oppgave.dokumenttype}-${oppgave.tilleggsinformasjon}-${oppgave.hendelsereferanse}`}
                    >
                        <Opplastingsboks
                            label={typeTekst}
                            description={tilleggsinfoTekst}
                            tag={
                                oppgave.frist && (
                                    <Tag variant="warning">{t("frist", { frist: new Date(oppgave.frist) })}</Tag>
                                )
                            }
                            metadatas={[
                                {
                                    innsendelsesfrist: oppgave.frist,
                                    hendelsereferanse: oppgave.hendelsereferanse,
                                    type: oppgave.dokumenttype,
                                    tilleggsinfo: oppgave.tilleggsinformasjon,
                                    hendelsetype: oppgave.hendelsetype,
                                },
                            ]}
                        />
                    </NavigationGuardProvider>
                );
            })}
        </VStack>
    );
};

export default Oppgaver;
