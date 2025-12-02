"use client";

import React, { use } from "react";
import { BoxNew, Heading, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

import { KlageRef, SaksStatusResponse } from "@generated/model";

import Sak from "./sak/Sak";
import SingleSak from "./sak/SingleSak";

interface Props {
    sakerPromise: Promise<SaksStatusResponse[]>;
    klagerPromise: Promise<KlageRef[]>;
}

const Saker = ({ sakerPromise, klagerPromise }: Props) => {
    const saker = use(sakerPromise);
    const klager = use(klagerPromise);
    const t = useTranslations("Saker");

    if (!saker.length) {
        return null;
    }
    if (saker.length === 1) {
        const sak = saker[0];
        return (
            <VStack gap="2">
                <SingleSak
                    sak={sak}
                    innsendtKlage={klager.find((klage) =>
                        sak.vedtaksfilUrlList?.some((vedtaksfil) => vedtaksfil.id === klage.vedtakId)
                    )}
                />
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

export default Saker;
