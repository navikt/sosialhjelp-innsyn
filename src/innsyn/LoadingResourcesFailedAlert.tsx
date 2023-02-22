import {Alert, BodyShort} from "@navikt/ds-react";
import React, {useEffect} from "react";
import {logServerfeil} from "../utils/amplitude";
import {
    useGetDokumentasjonkrav,
    useGetOppgaver,
    useGetVilkar,
} from "../generated/oppgave-controller/oppgave-controller";
import {useHentSoknadsStatus} from "../generated/soknads-status-controller/soknads-status-controller";
import {useHentHendelser} from "../generated/hendelse-controller/hendelse-controller";
import {useHentVedlegg} from "../generated/vedlegg-controller/vedlegg-controller";

export const LoadingResourcesFailedAlert = (props: {
    fiksDigisosId: string;
    loadingResourcesFailed: boolean;
    setLoadingResourcesFailed: (loadingResourcesFailed: boolean) => void;
}) => {
    const {isError: soknadsStatusHasError} = useHentSoknadsStatus(props.fiksDigisosId);
    const {isError: oppgaverHasError} = useGetOppgaver(props.fiksDigisosId);
    const {isError: vilkarHasError} = useGetVilkar(props.fiksDigisosId);
    const {isError: dokumentasjonkravHasError} = useGetDokumentasjonkrav(props.fiksDigisosId);
    const {isError: hendelserHasError} = useHentHendelser(props.fiksDigisosId);
    const {isError: vedleggHasError} = useHentVedlegg(props.fiksDigisosId);

    const {setLoadingResourcesFailed} = props;

    useEffect(() => {
        if (
            soknadsStatusHasError ||
            oppgaverHasError ||
            dokumentasjonkravHasError ||
            vilkarHasError ||
            hendelserHasError ||
            vedleggHasError
        ) {
            logServerfeil({
                soknadsStatusHasError,
                oppgaverHasError,
                vilkarHasError,
                dokumentasjonkravHasError,
                hendelserHasError,
                vedleggHasError,
            });
            setLoadingResourcesFailed(true);
        }
    }, [
        soknadsStatusHasError,
        oppgaverHasError,
        dokumentasjonkravHasError,
        vilkarHasError,
        hendelserHasError,
        vedleggHasError,
        setLoadingResourcesFailed,
    ]);

    return (
        <div style={{position: "sticky", top: 0, zIndex: 1}}>
            {props.loadingResourcesFailed && (
                <Alert variant="error" className="luft_over_16px">
                    <BodyShort>Vi klarte ikke å hente inn all informasjonen på siden.</BodyShort>
                    <BodyShort>Du kan forsøke å oppdatere siden, eller prøve igjen senere.</BodyShort>
                </Alert>
            )}
        </div>
    );
};
