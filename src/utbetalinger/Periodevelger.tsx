import React, {useState} from "react";
import {CheckboxGroup, Checkbox, RadioGroup, Radio} from "@navikt/ds-react";
import {useTranslation} from "react-i18next";

interface Props {
    className?: string;
    onChange: (antallMaanederTilbake: number, tilDinKonto: boolean, tilAnnenMottaker: boolean) => void;
    antMndTilbake: number;
}

const Periodevelger: React.FC<Props> = ({className, onChange, antMndTilbake}) => {
    const [antallMaanederTilbake, setAntallMaanederTilbake] = useState<number>(antMndTilbake);
    const [tilDinKonto, setTilDinKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);
    const {t} = useTranslation("utbetalinger");

    const onChangePeriode = (antall: number) => {
        setAntallMaanederTilbake(antall);
        onChange(antall, tilDinKonto, tilAnnenMottaker);
    };

    const onChangeTilDinKonto = () => {
        setTilDinKonto(!tilDinKonto);
        onChange(antallMaanederTilbake, !tilDinKonto, tilAnnenMottaker);
    };

    const onChangeTilAnnenMottaker = () => {
        setTilAnnenMottaker(!tilAnnenMottaker);
        onChange(antallMaanederTilbake, tilDinKonto, !tilAnnenMottaker);
    };

    return (
        <div className={className}>
            <RadioGroup
                legend={t("filter.periode")}
                defaultValue={antallMaanederTilbake.toString()}
                onChange={(value: string) => onChangePeriode(parseInt(value))}
            >
                <Radio value="3">{t("filter.periode.3mnd")}</Radio>

                <Radio value="6">{t("filter.periode.6mnd")}</Radio>

                <Radio value="15">{t("filter.periode.15mnd")}</Radio>
            </RadioGroup>
            <CheckboxGroup legend={t("filter.mottaker")} defaultValue={["tilDinKonto", "tilAnnenMottaker"]}>
                <Checkbox value="tilDinKonto" onChange={() => onChangeTilDinKonto()}>
                    {t("filter.tilDeg")}
                </Checkbox>
                <Checkbox value="tilAnnenMottaker" onChange={() => onChangeTilAnnenMottaker()}>
                    {t("filter.tilAnnen")}
                </Checkbox>
            </CheckboxGroup>
        </div>
    );
};

export default Periodevelger;
