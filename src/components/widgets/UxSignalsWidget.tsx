import Script from "next/script";
import {ReactElement} from "react";

import styles from "./UxSignalsWidget.module.css";
import {isProd} from "../../utils/restUtils";
import {useFlag} from "../../featuretoggles/context";

interface Props {
    enabled: boolean;
}

function UxSignalsWidget({enabled}: Props): ReactElement | null {
    const flag = useFlag("sosialhjelp.innsyn.uxsignals_kort_soknad");
    if (!enabled || !flag.enabled) return null;
    return (
        <>
            <Script
                type="module"
                strategy="lazyOnload"
                src="https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js"
            />
            <div
                data-uxsignals-mode={!isProd() ? "demo" : ""}
                data-uxsignals-embed={"panel-gwdfo3en3x"}
                className={styles.uxSignalsContainer}
            />
        </>
    );
}

export default UxSignalsWidget;
