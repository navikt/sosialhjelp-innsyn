import { Alert, VStack } from "@navikt/ds-react";
import Markdown from "markdown-to-jsx/react";

import { Driftsmelding } from "@components/driftsmelding/getDriftsmeldinger";

interface Props {
    driftsmeldinger: Driftsmelding[];
}

const DriftsmeldingerPages = ({ driftsmeldinger }: Props) => {
    return (
        <VStack gap="4">
            {driftsmeldinger?.map(({ severity, text, id }) => (
                <Alert variant={severity} fullWidth key={id} data-testid={`driftsmelding-${id}`}>
                    <Markdown>{text}</Markdown>
                </Alert>
            ))}
        </VStack>
    );
};

export default DriftsmeldingerPages;
