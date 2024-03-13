import * as React from "react";
import EllaBlunk from "../ellaBlunk";
import {ApplicationSpinner} from "../applicationSpinner/ApplicationSpinner";
import {BodyLong, Heading} from "@navikt/ds-react";
import {UthevetPanel} from "../paneler/UthevetPanel";
import styled from "styled-components";
import Banner from "../banner/Banner";
import {useTranslation} from "next-i18next";
import {useHarTilgang} from "../../generated/tilgang-controller/tilgang-controller";
import {logger} from "@navikt/next-logger";
import {useRouter} from "next/router";

const StyledElla = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Wrapper = styled.div`
    margin-top: 2rem;
`;
export interface TilgangskontrollsideProps {
    children: React.ReactNode;
    queryHas403: boolean;
}

const Tilgangskontrollside: React.FC<TilgangskontrollsideProps> = ({children, queryHas403}) => {
    const {data, isLoading, error} = useHarTilgang();
    const router = useRouter();
    const {t} = useTranslation();

    if (isLoading) {
        return (
            <div className="informasjon-side">
                {!router.pathname.includes("/utbetaling") && <Banner>{t("app.tittel")}</Banner>}
                <ApplicationSpinner />
            </div>
        );
    }

    if (error) {
        logger.error("Fikk feilmelding fra harTilgang", error);
    }
    if (!data?.harTilgang || queryHas403) {
        const fornavn = data?.fornavn ?? "";
        fornavn === ""
            ? logger.warn(
                  `Viser tilgangskontrollside uten fornavn, queryHas403: ${queryHas403}, harTilgang: ${data?.harTilgang}`
              )
            : logger.warn(
                  `Viser tilgangskontrollside med fornavn, queryHas403: ${queryHas403}, harTilgang: ${data?.harTilgang}`
              );

        return (
            <div className="informasjon-side">
                <Banner>{t("app.tittel")}</Banner>
                <Wrapper className={"blokk-center"}>
                    <UthevetPanel className="panel-glippe-over">
                        <StyledElla>
                            <EllaBlunk size={"175"} />
                        </StyledElla>
                        <Heading as="p" size="large" spacing>
                            {t("tilgang.header", {
                                fornavn,
                            })}
                        </Heading>
                        <BodyLong spacing>{t("tilgang.info")}</BodyLong>
                        <BodyLong spacing>{t("tilgang.cookietip")}</BodyLong>
                    </UthevetPanel>
                </Wrapper>
            </div>
        );
    }

    return <>{children}</>;
};

export default Tilgangskontrollside;
