import React, {useEffect, useState} from "react";
import {Alert, BodyShort} from "@navikt/ds-react";
import "./saksoversikt.css";
import SaksoversiktDineSaker from "./SaksoversiktDineSaker";
import {useBannerTittel} from "../redux/navigasjon/navigasjonUtils";
import SaksoversiktIngenSoknader from "./SaksoversiktIngenSoknader";
import {logAmplitudeEvent} from "../utils/amplitude";
import {ApplicationSpinner} from "../components/applicationSpinner/ApplicationSpinner";
import {setBreadcrumbs} from "../utils/breadcrumbs";
import {useHentAlleSaker} from "../generated/saks-oversikt-controller/saks-oversikt-controller";

const Saksoversikt: React.FC = () => {
    document.title = "Dine søknader - Økonomisk sosialhjelp";
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

    useBannerTittel("Økonomisk sosialhjelp");
    return (
        <>
            {(isLoading || error?.status === 401) && <ApplicationSpinner />}
            {!isLoading && (
                <>
                    {error && (
                        <Alert variant="warning" className="luft_over_16px">
                            <BodyShort>Vi klarte ikke å hente inn all informasjonen på siden.</BodyShort>
                            <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
                        </Alert>
                    )}
                    {saker?.length ? <SaksoversiktDineSaker saker={saker} /> : <SaksoversiktIngenSoknader />}
                </>
            )}
        </>
    );
};

export default Saksoversikt;
