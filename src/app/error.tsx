"use client";

import React from "react";

import TekniskFeil from "../components/errors/TekniskFeil";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    console.log("Feilet her");
    return <TekniskFeil error={error} reset={reset} />;
}
