import React, {useState} from "react";
import styles from "./utbetalinger.module.css";
import TabInnhold from "./tabs/TabInnhold";
import {BodyLong, Heading, Label, Panel, Tabs} from "@navikt/ds-react";
import Lastestriper from "../../components/lastestriper/Lasterstriper";
import HandCoinsIcon from "../../components/ikoner/HandCoins";
import {KommendeUtbetalingerResponse, UtbetalteUtbetalingerResponse} from "../../generated/model";
import {useHentKommendeUtbetalinger} from "../../generated/utbetalinger-controller/utbetalinger-controller";
import {logAmplitudeEvent} from "../../utils/amplitude";

interface Props {
    utbetalinger: UtbetalteUtbetalingerResponse[];
    lasterData: boolean;
}

const UtbetalingerPanelBeta: React.FC<Props> = ({utbetalinger, lasterData}) => {
    const [tabState, setTabState] = React.useState("utbetalt");
    const [pageLoadIsLogged, setPageLoadIsLogged] = useState(false);

    const {data: kommende, isLoading} = useHentKommendeUtbetalinger({
        query: {
            onSuccess: (data) => {
                if (!pageLoadIsLogged) {
                    logAmplitudeEvent("Lastet utbetalinger", {antall: data.length});
                    setPageLoadIsLogged(true);
                }
            },
        },
    });
    /*
    const kommende = utbetalinger
        .filter((utbetalingSak: UtbetalingerResponse) => {
            const now = new Date();
            const utbetaling = new Date(utbetalingSak.foersteIManeden);
            return utbetaling.getMonth() >= now.getMonth();
        })
        .map((utbetalingSak: UtbetalingerResponse) => {
            const kommendeUtbetalinger = utbetalingSak.utbetalinger.filter((utbetaling) => {
                const now = new Date();
                return (
                    new Date(utbetaling.utbetalingsdato ?? 0) >= now || new Date(utbetaling.forfallsdato ?? 0) >= now
                );
            });
            const kommendeSaker: UtbetalingerResponse = {
                ...utbetalingSak,
                utbetalinger: kommendeUtbetalinger,
            };
            return kommendeSaker;
        });


     */
    console.log(kommende);

    if (lasterData) {
        return (
            <div>
                <Lastestriper linjer={3} />
            </div>
        );
    }
    return (
        <Panel className={styles.utbetalinger_panel}>
            <HandCoinsIcon className={styles.utbetalinger_decoration} bgcolor="#9BD0B0" />
            <Heading size="medium" level="2" spacing>
                Utbetalinger for sosialhjelp
            </Heading>
            <BodyLong spacing>
                Vær oppmerksom på at dine planlagte utbetalinger for sosialhjelp er et anslag. Beløpet du faktisk får
                utbetalt kan derfor være lavere. I disse tilfellene, skal du alltid få et endringsvedtak som forklarer
                begrunnelsen for redusering av deler eller hele beløpet.
            </BodyLong>
            <Heading size="small" level="3" spacing>
                Utbetalinger
            </Heading>

            <Tabs value={tabState} onChange={setTabState}>
                <Tabs.List>
                    <Tabs.Tab value="utbetalt" label="Utbetalt" />
                    <Tabs.Tab value="kommende" label="Kommende" />
                </Tabs.List>
                <Tabs.Panel value="utbetalt" className={styles.tab_panel}>
                    {(!utbetalinger || utbetalinger.length === 0) && (
                        <BodyLong>Vi finner ingen registrerte utbetalinger for perioden.</BodyLong>
                    )}
                    {utbetalinger?.map((utbetalingSak: UtbetalteUtbetalingerResponse, index: number) => (
                        <TabInnhold key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} utbetalingSak={utbetalingSak} />
                    ))}
                </Tabs.Panel>
                <Tabs.Panel value="kommende" className={styles.tab_panel}>
                    {(!kommende || kommende.length === 0) && (
                        <BodyLong>Vi finner ingen registrerte utbetalinger for perioden.</BodyLong>
                    )}
                    {kommende?.map((utbetalingSak: KommendeUtbetalingerResponse, index: number) => (
                        <TabInnhold utbetalingSak={utbetalingSak} key={`${utbetalingSak.maned}-${utbetalingSak.ar}`} />
                    ))}
                </Tabs.Panel>
            </Tabs>
        </Panel>
    );
};

export default UtbetalingerPanelBeta;
