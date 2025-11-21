"use client";

import { BodyShort, Box, Button, HStack, Tag, VStack } from "@navikt/ds-react";
import { CalendarIcon, ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { useFormatter, useTranslations } from "next-intl";

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
        <>
            {alleKommende.slice(0, showAll ? alleKommende.length : ITEMS_LIMIT).map((utbetaling) => {
                const amount = format.number(utbetaling.belop);
                return (
                    <DigisosLinkCard
                        key={utbetaling.referanse}
                        href="/utbetalinger"
                        description={
                            <VStack>
                                {utbetaling.tittel}
                                {utbetaling.utbetalingsdato && (
                                    <HStack>
                                        <Tag variant="info-moderate" className="mt-2">
                                            <HStack gap="2" align="center">
                                                <CalendarIcon aria-hidden fontSize="1.5rem" />
                                                <BodyShort size="small" className="whitespace-nowrap">
                                                    {t("utbetales")}{" "}
                                                    {format.dateTime(new Date(utbetaling.utbetalingsdato), {
                                                        day: "numeric",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </BodyShort>
                                            </HStack>
                                        </Tag>
                                    </HStack>
                                )}
                            </VStack>
                        }
                    >
                        {t("beskrivelse", { amount })}
                    </DigisosLinkCard>
                );
            })}
            {hasMore && (
                <Box className="self-start">
                    {!showAll && (
                        <Button onClick={() => setShowAll(true)} variant="tertiary" icon={<ChevronDownIcon />}>
                            {t("visFlere")} ({alleKommende.length - ITEMS_LIMIT})
                        </Button>
                    )}
                    {showAll && (
                        <Button onClick={() => setShowAll(false)} variant="tertiary" icon={<ChevronUpIcon />}>
                            {t("visFærre")}
                        </Button>
                    )}
                </Box>
            )}
        </>
    );
};

export default KommendeUtbetalingerListe;
