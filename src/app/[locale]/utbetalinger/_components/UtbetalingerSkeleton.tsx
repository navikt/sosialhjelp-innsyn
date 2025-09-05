import { Box, Skeleton, VStack } from "@navikt/ds-react";
import React from "react";

export const UtbetalingerSkeleton = () => {
    return (
        <Box>
            <VStack gap="1">
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
                <Skeleton variant="rectangle" />
            </VStack>
        </Box>
    );
};
