import { Alert } from "@navikt/ds-react";
import Markdown from "markdown-to-jsx/react";

import { Driftsmelding } from "@components/driftsmelding/getDriftsmeldinger";

interface Props {
    driftsmeldinger: Driftsmelding[];
}

const DriftsmeldingerPages = ({ driftsmeldinger }: Props) => {
    return driftsmeldinger?.map(({ severity, text, id }) => (
        <Alert variant={severity} fullWidth key={id} className="mt-8">
            <Markdown>{text}</Markdown>
        </Alert>
    ));
};

export default DriftsmeldingerPages;
