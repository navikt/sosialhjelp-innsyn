import { Alert } from "@navikt/ds-react";
import Markdown from "markdown-to-jsx/react";

import { getDriftsmeldinger } from "@components/driftsmelding/getDriftsmeldinger";

export const Driftsmeldinger = async () => {
    const driftsmeldinger = await getDriftsmeldinger();
    return driftsmeldinger?.map(({ severity, text, id }) => (
        <Alert variant={severity} fullWidth key={id}>
            <Markdown>{text}</Markdown>
        </Alert>
    ));
};
