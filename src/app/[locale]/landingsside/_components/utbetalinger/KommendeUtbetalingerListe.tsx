"use client";

import { BodyShort, HStack, Tag, VStack } from "@navikt/ds-react";
import { ClockIcon } from "@navikt/aksel-icons";
import { useFormatter, useTranslations } from "next-intl";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetaling } from "@generated/ssr/model";

interface Props {
    alleKommende: ManedUtbetaling[];
}

const KommendeUtbetalingerListe = ({ alleKommende }: Props) => {
    const format = useFormatter();
    const t = useTranslations("KommendeUtbetalingerListe");

    return (
        <VStack gap="4">
            {alleKommende.map((utbetaling) => {
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
                                        <br />
                                        <Tag variant="info-moderate" className="mt-2">
                                            <HStack gap="2" align="center">
                                                <ClockIcon aria-hidden fontSize="1.5rem" />
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
        </VStack>
    );
};

export default KommendeUtbetalingerListe;
