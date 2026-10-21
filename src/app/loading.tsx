import React from "react";
import { Loader, VStack } from "@navikt/ds-react";

const Loading = (): React.JSX.Element => (
    <VStack justify="center" align="center">
        <Loader size="3xlarge" />
    </VStack>
);

export default Loading;
