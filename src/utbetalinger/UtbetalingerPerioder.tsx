import { VStack } from "@navikt/ds-react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    selectedChip?: string;
}

const UtbetalingerPerioder = ({ tidligere, selectedChip }: Props) => {
    return (
        <VStack>
            {tidligere?.find((item) => item.ar)}
            <div>{selectedChip}</div>
        </VStack>
    );
};

export default UtbetalingerPerioder;
