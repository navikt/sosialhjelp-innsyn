"use client";

import React from "react";
import { logger } from "@navikt/next-logger";
import ErrorPage from "@components/error/ErrorPage";

export default function Error({ error }: { error: Error & { digest?: string } }) {
    logger.error(`Uncaught clientside error: ${error.name}, error.tsx shown. Error: ${error}.`);

    return <ErrorPage />;
}
