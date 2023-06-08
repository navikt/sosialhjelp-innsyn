import React from "react";
import InfoIkon from "../components/ikoner/InfoIkon";
import {BodyShort, Label, Link} from "@navikt/ds-react";
import {Trans, useTranslation} from "react-i18next";

const SavnerUtbetalingPanel: React.FC = () => {
    const {t} = useTranslation("utbetalinger");

    return (
        <div className="savner_utbetaling_panel">
            <span className="infoIkon">
                <InfoIkon />
            </span>
            <Label as="p" spacing>
                {t("savner.sporsmal")}
            </Label>
            <BodyShort>{t("savner.underUtvikling")}</BodyShort>
            <BodyShort style={{marginTop: "18px"}}>{t("savner.kanVise")}</BodyShort>
            <ul style={{marginTop: "0px"}}>
                <li>
                    <BodyShort>{t("savner.kanVise.digital")}</BodyShort>
                </li>
                <li>
                    <BodyShort>{t("savner.kanVise.alder")}</BodyShort>
                </li>
                <li>
                    <BodyShort>
                        <Trans t={t} i18nKey={"savner.kanVise.sosialhjelp"}>
                            {/*Lenken finnes som <0></0> i språkfila. 0 = første children.
                        Teksten her er bare default value, og vil bli oversatt ved språkbytte*/}
                            <Link href="https://tjenester.nav.no/utbetalingsoversikt">
                                Andre utbetalinger finner du her.
                            </Link>
                        </Trans>
                    </BodyShort>
                </li>
            </ul>
            <BodyShort>
                <Trans t={t} i18nKey={"savner.kommende"}>
                    <Link href="https://www.nav.no/sosialhjelp/innsyn">dine søknader.</Link>
                </Trans>
            </BodyShort>
        </div>
    );
};

export default SavnerUtbetalingPanel;
