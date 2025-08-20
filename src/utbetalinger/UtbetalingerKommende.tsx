"use client";
import { VStack } from "@navikt/ds-react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
}

const UtbetalingerKommende = ({ nye }: Props) => {
    return (
        <VStack>
            {nye?.map((item, index) => (
                <div key={`nye-${index}`}>{JSON.stringify(item)}</div>
            ))}
        </VStack>
    );
};

export default UtbetalingerKommende;
