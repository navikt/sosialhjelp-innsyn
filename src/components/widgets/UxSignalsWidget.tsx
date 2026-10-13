"use client";

import Script from "next/script";
import { ReactElement, useEffect } from "react";
import { useLocalStorage, useSessionStorage } from "react-use";
import { isProd } from "@utils/restUtils";

interface Props {
    embedCode: string;
    enabled?: boolean;
    className?: string;
}
/*
    To enable UxSignalsWidget, paste the code below where you want the widget to appear.
    Enable with a feature toggle for more control.
    <UxSignalsWidget embedCode="panel-wq2simqr8t" className="mb-4" enabled={true} />
*/
function UxSignalsWidget({ enabled = true, embedCode, className }: Props): ReactElement | null {
    const answeredStorageKey = `uxsignals-answered-${embedCode}`;
    const closedStorageKey = `uxsignals-closed-${embedCode}`;
    const [answered, setAnswered] = useLocalStorage(answeredStorageKey, false);
    const [closed, setClosed] = useSessionStorage(closedStorageKey, false);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (typeof event.data !== "string") return;

            try {
                const { command } = JSON.parse(event.data) as { command?: string };
                if (command !== "bookingCompleted" && command !== "isDisqualified" && command !== "closeWidget") return;

                if (command === "closeWidget") setClosed(true);
                else setAnswered(true);
            } catch {
                // Ignore postMessage events unrelated to UX Signals.
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [setAnswered, setClosed]);

    if (!enabled || answered || closed) return null;

    return (
        <>
            <link rel="preconnect" href="https://widget.uxsignals.com" />
            <link rel="preconnect" href="https://api.uxsignals.com" />
            <Script type="module" strategy="lazyOnload" src="https://widget.uxsignals.com/embed.js" />
            <div data-uxsignals-mode={!isProd() ? "demo" : ""} data-uxsignals-embed={embedCode} className={className} />
        </>
    );
}

export default UxSignalsWidget;
