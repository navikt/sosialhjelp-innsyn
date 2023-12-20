import {useTranslation} from "next-i18next";
import {Alert, BodyShort, Heading} from "@navikt/ds-react";
import styled from "styled-components";
import useIsAalesundBlocked from "../../hooks/useIsAalesundBlocked";

const StyledAlert = styled(Alert)`
    margin-top: -2rem;
    margin-bottom: 2rem;
`;

interface Props {
    showAalesundBanner?: boolean;
}

const NewYearEngelsk = ({showAalesundBanner}: Props) => (
    <StyledAlert variant={"warning"}>
        {showAalesundBanner && (
            <>
                <Heading size="small" level="2" spacing>
                    Ålesund: forwarding of attachments is not possible.
                </Heading>
                <BodyShort spacing>
                    Due to the municipal division of Ålesund municipality, it will never be possible to submit
                    attachments to applications submitted before January 1, 2024.
                </BodyShort>
            </>
        )}
        <Heading size={"small"} level={"2"} spacing>
            Scheduled downtime
        </Heading>
        <BodyShort spacing>
            Due to county and municipal redistricting,{" "}
            <span className={"font-bold"}>
                the digital application for financial assistance is unavailable between December 31st at 23:59 and
                January 2nd at 08:00.
            </span>
        </BodyShort>
        <BodyShort>All applications which have been created but not yet sent will be deleted on January 1st.</BodyShort>
    </StyledAlert>
);
const NewYearNorsk = ({showAalesundBanner}: Props) => {
    return (
        <StyledAlert variant={"warning"}>
            {showAalesundBanner && (
                <>
                    <Heading size="small" level="2">
                        Ålesund: ettersending av vedlegg blir ikke mulig
                    </Heading>
                    <BodyShort spacing>
                        Grunnet kommunedelingen av Ålesund kommune vil det aldri bli mulig å ettersende vedlegg til
                        søknader sendt inn før 1. januar 2024.
                    </BodyShort>
                </>
            )}
            <Heading size={"small"} level={"2"} spacing>
                Planlagt nedetid
            </Heading>
            <BodyShort spacing>
                Grunnet fylkesoppløsning og nye kommunenummer vil den digitale søknaden for økonomisk sosialhjelp være
                utilgjengelig{" "}
                <span className={"font-bold"}>mellom 31. desember 2023 kl. 23:59 og 2. januar 2024 kl. 08:00.</span>
            </BodyShort>
            <BodyShort>Påbegynte søknader som ikke er sendt inn før årsskiftet vil bli slettet 1 januar.</BodyShort>
        </StyledAlert>
    );
};

export const NewYearNewNumbers = () => {
    const {showBanner} = useIsAalesundBlocked();
    const {
        i18n: {language},
    } = useTranslation();

    if (language === "en") return <NewYearEngelsk showAalesundBanner={showBanner} />;
    else return <NewYearNorsk showAalesundBanner={showBanner} />;
};
