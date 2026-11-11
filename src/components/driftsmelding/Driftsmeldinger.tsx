import { Alert, Link, VStack } from "@navikt/ds-react";
import Markdown from "markdown-to-jsx/react";
import { getDriftsmeldinger } from "@components/driftsmelding/getDriftsmeldinger";

export const Driftsmeldinger = async () => {
    const driftsmeldinger = await getDriftsmeldinger();
    if (!driftsmeldinger.length) {
        return null;
    }
    return (
        <VStack gap="space-16" className="mb-6 ax-md:mb-20">
            {driftsmeldinger?.map(({ severity, text, id }) => (
                <Alert variant={severity} fullWidth key={id} data-testid={`driftsmelding-${id}`}>
                    <Markdown options={{ overrides: { a: { component: Link, props: { inlineText: true } } } }}>
                        {text}
                    </Markdown>
                </Alert>
            ))}
        </VStack>
    );
};
