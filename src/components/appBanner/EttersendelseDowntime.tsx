import {useTranslation} from "next-i18next";
import {Alert, BodyShort, Heading} from "@navikt/ds-react";
import styled from "styled-components";

const StyledAlert = styled(Alert)`
    margin-top: -2rem;
    margin-bottom: 2rem;
`;

const EttersendelseDowntimeEnglish = () => (
    <StyledAlert variant={"warning"}>
        <Heading size={"small"} level={"2"} spacing>
            Scheduled downtime for attachment forwarding
        </Heading>
        <BodyShort spacing>
            Due to the municipality division of Ålesund kommune, it will not be possible to submit attachments for
            applications submitted before 1.1.24.
        </BodyShort>
    </StyledAlert>
);
const EttersendelseDowntimeNorwegian = () => (
    <StyledAlert variant={"warning"}>
        <Heading size={"small"} level={"2"} spacing>
            Planlagt nedetid på innsending av vedlegg
        </Heading>
        <BodyShort spacing>
            Grunnet kommunedelingen av Ålesund kommune vil det ikke være mulig å ettersende vedlegg til søknader sendt
            inn før 1.1.24.
        </BodyShort>
    </StyledAlert>
);

const EttersendelseDowntime = () => {
    const {
        i18n: {language},
    } = useTranslation();

    if (language === "en") return <EttersendelseDowntimeEnglish />;
    else return <EttersendelseDowntimeNorwegian />;
};

export default EttersendelseDowntime;
