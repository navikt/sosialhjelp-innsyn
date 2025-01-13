import { useTranslation } from "next-i18next";
import { Alert, BodyShort, Heading } from "@navikt/ds-react";
import styled from "styled-components";

import useIsAalesundBlocked from "../../hooks/useIsAalesundBlocked";

const StyledAlert = styled(Alert)`
    margin-top: -2rem;
    margin-bottom: 2rem;
`;

const NewYearEngelsk = () => (
    <StyledAlert variant="warning">
        <Heading size="small" level="2" spacing>
            Ålesund: forwarding of attachments is not possible.
        </Heading>
        <BodyShort spacing>
            Due to the municipal division of Ålesund municipality, it will never be possible to submit attachments to
            applications submitted before January 1, 2024.
        </BodyShort>
    </StyledAlert>
);
const NewYearNorsk = () => {
    return (
        <StyledAlert variant="warning">
            <Heading size="small" level="2">
                Ålesund: ettersending av vedlegg blir ikke mulig
            </Heading>
            <BodyShort spacing>
                Grunnet kommunedelingen av Ålesund kommune vil det aldri bli mulig å ettersende vedlegg til søknader
                sendt inn før 1. januar 2024.
            </BodyShort>
        </StyledAlert>
    );
};

export const NewYearNewNumbers = () => {
    const isAalesund = useIsAalesundBlocked();
    const {
        i18n: { language },
    } = useTranslation();

    if (!isAalesund) {
        return null;
    }

    if (language === "en") return <NewYearEngelsk />;
    else return <NewYearNorsk />;
};
