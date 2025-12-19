import { Alert, VStack } from "@navikt/ds-react";
import Markdown from "markdown-to-jsx/react";
import { getDriftsmeldinger } from "@components/driftsmelding/getDriftsmeldinger";

export const Driftsmeldinger = async () => {
    const driftsmeldinger = await getDriftsmeldinger();
    if (!driftsmeldinger.length) {
        return null;
    }
    return (
        <VStack gap="4" className="mt-4">
            {driftsmeldinger?.map(({ severity, text, id }) => (
                <Alert variant={severity} fullWidth key={id} data-testid={`driftsmelding-${id}`}>
                    <Markdown>{text}</Markdown>
                </Alert>
            ))}
        </VStack>
    );
};
