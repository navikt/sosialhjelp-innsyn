"use client";

import React from "react";
import cx from "classnames";
import { BodyShort, ExpansionCard, HStack, Skeleton, VStack } from "@navikt/ds-react";
import { Link } from "@navikt/ds-react/Link";
import { ArrowRightIcon } from "@navikt/aksel-icons";
import { Link as NextLink } from "@i18n/navigation";

import styles from "../../../../../utbetalinger/utbetalinger.module.css";

interface Props {
    index: number;
    count: number;
}

export const cardBorder = (id: number, count: number) => {
    if (count <= 1) return "border-none rounded-t-none rounded-b-lg";
    if (id === count - 1) return "border-none rounded-t-none rounded-b-lg";
    return "border-none rounded-none";
};

const UtbetalingerContentCardSkeleton = ({ index, count }: Props) => {
    const alignmentWithChevron = "leading-[1.75]"; // Justerer linjehøyde for å matche høyden på chevron i ExpansionCard
    return (
        <ExpansionCard
            size="small"
            aria-label="loading"
            data-color="accent"
            className={cx("hover:outline-none hover:shadow-none", cardBorder(index, count))}
        >
            <ExpansionCard.Header
                className={cx("gap-2 data-[open=true]:after:content-none", cardBorder(index, count), styles.headerFill)}
            >
                <ExpansionCard.Title as="h4">
                    <HStack align="center" wrap={false} className="w-full" justify="space-between">
                        <HStack gap="2" align="center" className="min-w-0" wrap={false}>
                            <BodyShort
                                lang="no"
                                size="medium"
                                weight="semibold"
                                className={cx("truncate", alignmentWithChevron)}
                            >
                                <Skeleton as="span" width="50px" variant="text" />
                            </BodyShort>
                            <HStack gap="1">
                                <BodyShort size="small" className={cx("truncate", alignmentWithChevron)}>
                                    <Skeleton as="span" width="50px" variant="text" />
                                </BodyShort>
                                <BodyShort size="small" className={cx("truncate", alignmentWithChevron)}>
                                    <Skeleton as="span" width="50px" variant="text" />
                                </BodyShort>
                            </HStack>
                        </HStack>
                        <BodyShort weight="semibold" className={cx("truncate tabular-nums", alignmentWithChevron)}>
                            <Skeleton as="span" width="50px" variant="text" />
                        </BodyShort>
                    </HStack>
                </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
                <VStack gap="4">
                    <VStack>
                        <BodyShort size="medium" weight="semibold">
                            <Skeleton as="span" width="50px" variant="text" />
                        </BodyShort>
                        <Skeleton as="span" width="50px" variant="text" />
                    </VStack>
                    <Link as={NextLink}>
                        <Skeleton as="span" width="50px" variant="text" />
                        <ArrowRightIcon fontSize="1.75rem" className="navds-link-anchor__arrow pointer-events-none" />
                    </Link>
                </VStack>
            </ExpansionCard.Content>
        </ExpansionCard>
    );
};

export default UtbetalingerContentCardSkeleton;
