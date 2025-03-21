import Script from "next/script";
import { ReactElement } from "react";
import cx from "classnames";

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
            <Script type="module" strategy="lazyOnload" src="https://widget.uxsignals.com/embed.js" />
            <div
                data-uxsignals-mode={!isProd() ? "demo" : ""}
                data-uxsignals-embed={embedCode}
                className={cx(styles.uxSignalsContainer, className)}
            />
        </>
    );
}

export default UxSignalsWidget;
