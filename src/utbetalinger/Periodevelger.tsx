import React, {useState} from "react";
import {CheckboxGroup, Checkbox, RadioGroup, Radio} from "@navikt/ds-react";

interface Props {
    className?: string;
    onChange: (antallMaanederTilbake: number, tilDinKonto: boolean, tilAnnenMottaker: boolean) => void;
    antMndTilbake: number;
}

const Periodevelger: React.FC<Props> = ({className, onChange, antMndTilbake}) => {
    const [antallMaanederTilbake, setAntallMaanederTilbake] = useState<number>(antMndTilbake);
    const [tilDinKonto, setTilDinKonto] = useState<boolean>(true);
    const [tilAnnenMottaker, setTilAnnenMottaker] = useState<boolean>(true);

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
                legend="Velg periode"
                defaultValue={antallMaanederTilbake.toString()}
                onChange={(value: string) => onChangePeriode(parseInt(value))}
            >
                <Radio value="3">Siste 3 måneder</Radio>

                <Radio value="6">Siste 6 måneder</Radio>

                <Radio value="12">Siste 12 måneder</Radio>
            </RadioGroup>
            <CheckboxGroup legend="Velg mottaker" defaultValue={["tilDinKonto", "tilAnnenMottaker"]}>
                <Checkbox value="tilDinKonto" onChange={() => onChangeTilDinKonto()}>
                    Til deg
                </Checkbox>
                <Checkbox value="tilAnnenMottaker" onChange={() => onChangeTilAnnenMottaker()}>
                    Til annen mottaker
                </Checkbox>
            </CheckboxGroup>
        </div>
    );
};

export default Periodevelger;
