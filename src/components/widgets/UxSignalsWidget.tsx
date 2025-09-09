import Script from "next/script";
import { ReactElement } from "react";

import { isProd } from "@utils/restUtils";

interface Props {
    embedCode: string;
    enabled?: boolean;
    className?: string;
}

function UxSignalsWidget({ enabled = true, embedCode, className }: Props): ReactElement | null {
    if (!enabled) return null;
    return (
        <>
            <Script type="module" strategy="lazyOnload" src="https://widget.uxsignals.com/embed.js" />
            <div data-uxsignals-mode={!isProd() ? "demo" : ""} data-uxsignals-embed={embedCode} className={className} />
        </>
    );
}

export default UxSignalsWidget;
