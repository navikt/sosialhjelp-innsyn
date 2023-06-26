import React, {useEffect, useState} from "react";
import {Alert, BodyShort} from "@navikt/ds-react";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {logAmplitudeEvent} from "../utils/amplitude";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import {setBreadcrumbs} from "../utils/breadcrumbs";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";
import {useTranslation} from "react-i18next";

const Saksoversikt: React.FC = () => {
    const {t} = useTranslation();
    document.title = `${t("dineSoknader")} -${t("app.tittel")}`;

    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);
    const {
        data: saker,
        isLoading,
        error,
    } = useHentAlleSaker({
        query: {
            onSuccess: (data) => {
                if (!pageLoadIsLogged) {
                    logAmplitudeEvent("Hentet innsynsdata", {
                        antallSoknader: data?.length,
                    });
                    setPageLoadIsLogged(true);
                }
            },
        },
    });
    useEffect(() => {
        setBreadcrumbs();
    }, []);

    useBannerTittel(t("app.tittel"));
    return (
        <>
            {(isLoading || error?.status === 401) && <ApplicationSpinner />}
            {!isLoading && (
                <>
                    {error && (
                        <Alert variant="warning">
                            <BodyShort>{t("feilmelding.saksoversikt")}</BodyShort>
                            <BodyShort>{t("feilmelding.saksoversikt2")}</BodyShort>
                        </Alert>
                    )}
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </>
    );
};

export default Saksoversikt;
