import { useEffect } from "react";
import { logger } from "@navikt/next-logger";
import { isArray } from "remeda";

import { ErrorType } from "../custom-fetch";
import { HentAlleSaker400, SaksListeResponse } from "../generated/model";

export const useSakslisteDebug = ({
    saker,
    isLoading,
    status,
    error,
    failureReason,
}: {
    saker: SaksListeResponse[] | undefined;
    isLoading: boolean;
    status: "error" | "success" | "pending";
    error: ErrorType<HentAlleSaker400> | null;
    failureReason: ErrorType<HentAlleSaker400> | null;
}) => {
    useEffect(() => {
        if (error) {
            logger.warn(`Error fetching alleSaker: ${error}`);
        }

        if (isLoading) return;

        if (!isArray(saker)) {
            // vi forventer at data er truthy om isLoading er false
            if (!saker) {
                logger.error(
                    `Viser "ingen søknader funnet", ingen data - status: ${status} - error: ${error} - data type: ${typeof saker} - failureReason: ${failureReason}`
                );
            }
            // vi forventer at data er en array om isLoading er false, men om det ikke er (saker?.length er undefined),
            // vil "ingen søknader"-siden vises.
            else
                logger.error(
                    `Viser "ingen søknader funnet", ugyldig data - status: ${status} - error: ${error} - data length: ${
                        (
                            saker as {
                                length?: number;
                            }
                        )?.length
                    } - data type: ${typeof saker} - failureReason: ${failureReason}`
                );
            return;
        }

        if (!saker.length) {
            if (error?.message === "TypeError: Failed to fetch") return;
            logger.info(
                `Viser "ingen søknader funnet"-siden - status: ${status} - error: ${error} - data length: ${saker?.length} - data type: ${typeof saker} - failureReason: ${failureReason}`
            );
        }
    }, [saker, isLoading, status, error, failureReason]);
};
