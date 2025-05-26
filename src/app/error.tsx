"use client";

import React, { useEffect } from "react";
import { logger } from "@navikt/next-logger";

import ServerError from "../pages/500";

export default function Error({ error }: { error: Error }) {
    logger.error(
        `Uncaught clientside error: ${error.name}, error.tsx shown. ErrorInfo: ${JSON.stringify(error.message)}`
    );

    useEffect(() => {
        document.title = "Teknisk feil | Økonomisk sosialhjelp";
    }, []);

    return (
        <div className="min-h-[50vh]">
            <ServerError />
        </div>
    );
}
