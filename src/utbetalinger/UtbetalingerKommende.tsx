"use client";
import { BodyShort, BoxNew, ExpansionCard, HStack, VStack } from "@navikt/ds-react";
import { useFormatter } from "next-intl";
import { set } from "date-fns";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
}

//const

const UtbetalingerKommende = ({ nye }: Props) => {
    const format = useFormatter();

    return (
        <VStack>
            {nye?.map((item, index) => (
                <VStack gap="2" key={index}>
                    <BoxNew
                        borderRadius="xlarge xlarge 0 0"
                        padding="space-16"
                        background="info-moderateA"
                        key={`tidligere-${index}`}
                    >
                        {format.dateTime(
                            set(new Date(0), {
                                year: item.ar,
                                month: item.maned - 1,
                            }),
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </BoxNew>
                    {item.utbetalingerForManed.map((utb, id) => (
                        <ExpansionCard
                            key={id}
                            aria-label="Utbetalinger"
                            data-color="info"
                            className={
                                id === 0
                                    ? "border-0 rounded-none"
                                    : id === item.utbetalingerForManed.length - 1
                                      ? "border-0 border-b-4"
                                      : " border-0 rounded-none"
                            }
                        >
                            <ExpansionCard.Header>
                                <ExpansionCard.Title>
                                    <HStack>
                                        {utb.tittel} <BodyShort>{utb.status}</BodyShort>
                                        {utb.belop}
                                    </HStack>
                                </ExpansionCard.Title>
                            </ExpansionCard.Header>
                            <ExpansionCard.Content>
                                <VStack>
                                    <BodyShort>{utb.fom}</BodyShort>
                                    <BodyShort>{utb.tom}</BodyShort>
                                    <BodyShort>{utb.mottaker}</BodyShort>
                                    <BodyShort>{utb.fiksDigisosId}</BodyShort>
                                </VStack>
                            </ExpansionCard.Content>
                        </ExpansionCard>
                    ))}
                </VStack>
            ))}
        </VStack>
    );
};

export default UtbetalingerKommende;
