"use client";

import { Box, Button, Tag, VStack } from "@navikt/ds-react";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { useFormatter, useTranslations } from "next-intl";
import { LinkCardFooter } from "@navikt/ds-react/LinkCard";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetaling } from "@generated/ssr/model";
import useShowMore, { ITEMS_LIMIT } from "@hooks/useShowMore";

interface Props {
    alleKommende: ManedUtbetaling[];
}

const KommendeUtbetalingerListe = ({ alleKommende }: Props) => {
    const format = useFormatter();
    const t = useTranslations("KommendeUtbetalingerListe");
    const { hasMore, showAll, setShowAll } = useShowMore(alleKommende);

    return (
        <VStack gap="4">
            {alleKommende.slice(0, showAll ? alleKommende.length : ITEMS_LIMIT).map((utbetaling) => {
                const amount = format.number(utbetaling.belop);
                return (
                    <DigisosLinkCard
                        key={utbetaling.referanse}
                        href="/utbetalinger"
                        description={utbetaling.tittel}
                        footer={
                            utbetaling.utbetalingsdato && (
                                <LinkCardFooter>
                                    <Tag
                                        variant="info-moderate"
                                        size="small"
                                        icon={<CalendarIcon aria-hidden={true} />}
                                    >
                                        {t("utbetales")}{" "}
                                        {format.dateTime(new Date(utbetaling.utbetalingsdato), {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </Tag>
                                </LinkCardFooter>
                            )
                        }
                    >
                        {t("beskrivelse", { amount })}
                    </DigisosLinkCard>
                );
            })}
            <Box className="self-start">
                {!showAll && hasMore && (
                    <Button onClick={() => setShowAll(true)} variant="tertiary" icon={<ChevronDownIcon />}>
                        {t("visFlere")} ({alleKommende.length - ITEMS_LIMIT})
                    </Button>
                )}
                {showAll && hasMore && (
                    <Button onClick={() => setShowAll(false)} variant="tertiary" icon={<ChevronUpIcon />}>
                        {t("visFærre")}
                    </Button>
                )}
            </Box>
        </VStack>
    );
};

export default KommendeUtbetalingerListe;
