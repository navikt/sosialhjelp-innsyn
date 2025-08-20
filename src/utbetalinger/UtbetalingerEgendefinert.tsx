"use client";
import React from "react";
import { VStack } from "@navikt/ds-react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
    nye?: NyeOgTidligereUtbetalingerResponse[];
}

const UtbetalingerEgendefinert = ({ nye, tidligere }: Props) => {
    return (
        <VStack>
            {tidligere?.map((item, index) => (
                <div key={`tidligere-${index}`}>{JSON.stringify(item)}</div>
            ))}
            {nye?.map((item, index) => (
                <div key={`nye-${index}`}>{JSON.stringify(item)}</div>
            ))}
        </VStack>
    );
};

export default UtbetalingerEgendefinert;
