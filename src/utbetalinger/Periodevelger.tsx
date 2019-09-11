import React, {useState} from 'react';
import {Knapp} from 'nav-frontend-knapper';
import {Checkbox, Radio} from 'nav-frontend-skjema';

const Periodevelger: React.FC<{className?: string}> = ({className}) => {

    const [periode, setPeriode]: [number, (periode: number) => void] = useState(0);

    return (
        <div className={className}>
            <h2 className="typo-undertittel">Velg periode</h2>
            <form className="skjema">
                <div className="periodevelger_skjemaelement">
                    <Radio
                        label="Neste 3 måneder"
                        name="minRadioKnapp1"
                        checked={periode===3}
                        onChange={(value: any) => setPeriode(3)}
                    />
                </div>
                <div className="periodevelger_skjemaelement">
                    <Radio
                        label="Neste 6 måneder"
                        name="minRadioKnapp2"
                        checked={periode===6}
                        onChange={(value: any) => setPeriode(6)}
                    />
                </div>
                <div className="periodevelger_skjemaelement">
                    <Radio
                        label="Neste 12 måneder"
                        name="minRadioKnapp6"
                        checked={periode===12}
                        onChange={(value: any) => setPeriode(12)}
                    />
                </div>
                <Knapp type="hoved">OPPDATER</Knapp>
            </form>
            <div>
                <h2 className="typo-undertittel">Velg ytelse</h2>
                <form className="ytelsestypecheckbox">
                    <div className="periodevelger_skjemaelement">
                        <Checkbox label={'Til din konto'}/>
                        <Checkbox label={'Til annen mottaker'}/>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Periodevelger;

