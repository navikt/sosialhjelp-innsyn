"use client";

import { Heading, VStack } from "@navikt/ds-react";
import { PropsWithChildren } from "react";

type Props = {
    tittel: string;
};

const UtbetalingerListView = ({ tittel, children }: PropsWithChildren<Props>) => {
    return (
        <VStack gap="4">
            <Heading size="medium" level="2">
                {tittel}
            </Heading>
            {children}
        </VStack>
    );
};

export default UtbetalingerListView;
