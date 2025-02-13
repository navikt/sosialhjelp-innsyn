import Script from "next/script";
import { ReactElement } from "react";

import { isProd } from "../../utils/restUtils";

import styles from "./UxSignalsWidget.module.css";

interface Props {
    embedCode: string;
    enabled?: boolean;
    className?: string;
}

function UxSignalsWidget({ enabled = true, embedCode, className }: Props): ReactElement | null {
    if (!enabled) return null;
    return (
        <>
            <Script
                type="module"
                strategy="lazyOnload"
                src="https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js"
            />
            <div
                data-uxsignals-mode={!isProd() ? "demo" : ""}
                data-uxsignals-embed={embedCode}
                className={`${styles.uxSignalsContainer} ${className}`}
            />
        </>
    );
}

export default UxSignalsWidget;
