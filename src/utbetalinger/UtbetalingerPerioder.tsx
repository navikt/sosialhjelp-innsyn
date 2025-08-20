"use client";
import { VStack } from "@navikt/ds-react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: string;
}

const UtbetalingerPerioder = ({ tidligere, selectedChip }: Props) => {
    return (
        <VStack>
            {tidligere?.map((item, index) => (
                <div key={`tidligere-${index}`}>{JSON.stringify(item)}</div>
            ))}
            {selectedChip}
        </VStack>
    );
};

export default UtbetalingerPerioder;
