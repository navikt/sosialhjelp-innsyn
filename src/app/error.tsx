"use client";

import React, { useEffect } from "react";

import ServerError from "../pages/500";

export default function Error() {
    useEffect(() => {
        document.title = "Teknisk feil | Økonomisk sosialhjelp";
    }, []);

    return (
        <div className="min-h-[50vh]">
            <ServerError />
        </div>
    );
}
