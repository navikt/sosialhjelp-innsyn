import React from "react";
import { BodyShort, BoxNew, Heading, HStack, Skeleton, VStack } from "@navikt/ds-react";

import UtbetalingerContentCardSkeleton from "./UtbetalingerContentCardSkeleton";

const UtbetalingerCardSkeleton = () => (
    <VStack gap="05">
        <BoxNew borderRadius="xlarge xlarge 0 0" paddingInline="4" paddingBlock="space-12" background="accent-soft">
            <HStack className="pr-2" align="center">
                <Heading size="small" level="3" className="capitalize">
                    <Skeleton as="span" width="120px" variant="rectangle" />
                </Heading>
                <BodyShort className="ml-auto tabular-nums" weight="semibold">
                    <Skeleton as="span" width="50px" variant="rectangle" />
                </BodyShort>
            </HStack>
        </BoxNew>
        <UtbetalingerContentCardSkeleton index={0} count={2} />
        <UtbetalingerContentCardSkeleton index={1} count={2} />
    </VStack>
);

export default UtbetalingerCardSkeleton;
