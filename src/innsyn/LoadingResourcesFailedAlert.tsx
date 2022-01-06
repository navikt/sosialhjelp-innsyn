import {Alert, BodyShort} from "@navikt/ds-react";
import React, {useEffect} from "react";
import {REST_STATUS} from "../utils/restUtils";
import {logServerfeil} from "../utils/amplitude";
import {useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";

const leserData = (restStatus: REST_STATUS): boolean => {
    return restStatus === REST_STATUS.INITIALISERT || restStatus === REST_STATUS.PENDING;
};

export const LoadingResourcesFailedAlert = (props: {
    loadingResourcesFailed: boolean;
    setLoadingResourcesFailed: (loadingResourcesFailed: boolean) => void;
}) => {
    const {saksStatus, oppgaver, hendelser, vedlegg} = useSelector(
        (state: InnsynAppState) => state.innsynsdata.restStatus
    );

    const {setLoadingResourcesFailed} = props;

    useEffect(() => {
        if (!leserData(saksStatus) && !leserData(oppgaver) && !leserData(hendelser) && !leserData(vedlegg)) {
            if (
                saksStatus === REST_STATUS.FEILET ||
                oppgaver === REST_STATUS.FEILET ||
                hendelser === REST_STATUS.FEILET ||
                vedlegg === REST_STATUS.FEILET
            ) {
                logServerfeil({saksStatus, oppgaver, hendelser, vedlegg});
                setLoadingResourcesFailed(true);
            }
        }
    }, [saksStatus, oppgaver, hendelser, vedlegg, setLoadingResourcesFailed]);
    return (
        <>
            {props.loadingResourcesFailed && (
                <Alert variant="warning" className="luft_over_16px">
                    <BodyShort>Vi klarte ikke å hente inn all informasjonen på siden.</BodyShort>
                    <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
                </Alert>
            )}
        </>
    );
};
