import React, {useState} from "react";
import {Checkbox, Radio} from "nav-frontend-skjema";

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
            <h2 className="typo-undertittel">Velg periode</h2>
            <form className="skjema">
                <div className="periodevelger_skjemaelement">
                    <Radio
                        label="Siste 3 måneder"
                        name="minRadioKnapp1"
                        checked={antallMaanederTilbake === 3}
                        onChange={() => onChangePeriode(3)}
                    />
                </div>
                <div className="periodevelger_skjemaelement">
                    <Radio
                        label="Siste 6 måneder"
                        name="minRadioKnapp2"
                        checked={antallMaanederTilbake === 6}
                        onChange={() => onChangePeriode(6)}
                    />
                </div>
                <div className="periodevelger_skjemaelement">
                    <Radio
                        label={"Siste 12 måneder"}
                        name="minRadioKnapp3"
                        checked={antallMaanederTilbake === 12}
                        onChange={() => onChangePeriode(12)}
                    />
                </div>
            </form>
            <div>
                <h2 className="typo-undertittel">Velg mottaker</h2>
                <form className="ytelsestypecheckbox">
                    <div className="periodevelger_skjemaelement">
                        <Checkbox label={"Til deg"} checked={tilDinKonto} onChange={() => onChangeTilDinKonto()} />
                    </div>
                    <div className="periodevelger_skjemaelement">
                        <Checkbox
                            label={"Til annen mottaker"}
                            checked={tilAnnenMottaker}
                            onChange={() => onChangeTilAnnenMottaker()}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Periodevelger;
