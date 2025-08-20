import React from "react";
import { VStack } from "@navikt/ds-react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
}

const UtbetalingerEgendefinert = ({ nye, tidligere }: Props) => {
    return (
        <VStack>
            {tidligere?.find((item) => item.ar)}
            {nye?.find((item) => item.ar)}
        </VStack>
    );
};

export default UtbetalingerEgendefinert;
