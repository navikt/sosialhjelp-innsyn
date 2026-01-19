import Script from "next/script";
import { ReactElement } from "react";
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
    if (!enabled) return null;
    return (
        <>
            <Script type="module" strategy="lazyOnload" src="https://widget.uxsignals.com/embed.js" />
            <div data-uxsignals-mode={!isProd() ? "demo" : ""} data-uxsignals-embed={embedCode} className={className} />
        </>
    );
}

export default UxSignalsWidget;
