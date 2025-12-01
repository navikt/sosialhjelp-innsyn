"use client";

import React from "react";
import { BoxNew, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import Sak from "./Sak";
import SingleSak from "./SingleSak";

interface Props {
    saker: SaksStatusResponse[];
    klager: KlageRef[];
}

const SakListe = ({ saker, klager }: Props) => {
    const t = useTranslations("SakListe");

    if (saker.length === 1) {
        const sak = saker[0];
        return (
            <VStack gap="2">
                <Heading size="large" level="2">
                    {t("vedtak")}
                </Heading>
                <BoxNew borderWidth="1" borderRadius="xlarge" borderColor="neutral-subtle" padding="8">
                    <SingleSak
                        sak={sak}
                        innsendtKlage={klager.find((klage) =>
                            sak.vedtaksfilUrlList?.some((vedtaksfil) => vedtaksfil.id === klage.vedtakId)
                        )}
                    />
                </BoxNew>
            </VStack>
        );
    }

    return (
        <VStack gap="2">
            <Heading size="large" level="2">
                {t("dineSaker")}
            </Heading>
            <VStack gap="16">
                {saker.map((sak, index) => (
                    <BoxNew borderWidth="1" borderRadius="xlarge" borderColor="neutral-subtle" padding="8" key={index}>
                        <Sak
                            key={index}
                            sak={sak}
                            innsendtKlage={klager.find((klage) =>
                                sak.vedtaksfilUrlList?.some((vedtaksfil) => vedtaksfil.id === klage.vedtakId)
                            )}
                        />
                    </BoxNew>
                ))}
            </VStack>
        </VStack>
    );
};

export default SakListe;
