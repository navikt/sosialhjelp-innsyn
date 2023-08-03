import {useGetOppgaver} from "../../generated/oppgave-controller/oppgave-controller";
import React from "react";
import {OppgaveElement, OppgaveResponse} from "../../generated/model";

interface DokumentasjonEtterspurElement extends OppgaveElement {
    id: string;
}

export interface DokumentasjonEtterspurtResponse extends OppgaveResponse {
    oppgaveElementer: DokumentasjonEtterspurElement[];
}
const useDokumentasjonEtterspurt = (fiksDigisosId: string) => {
    const [dataWithId, setDataWithId] = React.useState<DokumentasjonEtterspurtResponse[] | undefined>(undefined);

    const {data, isLoading, isError} = useGetOppgaver(fiksDigisosId);

    React.useEffect(() => {
        if (data) {
            const dataWithId = data?.map((item) => {
                const withId = item.oppgaveElementer.map((el) => ({
                    ...el,
                    id: crypto.randomUUID(),
                }));
                return {
                    ...item,
                    oppgaveElementer: withId,
                };
            });
            setDataWithId(dataWithId);
        } else {
            setDataWithId(undefined);
        }
        // Then we update the state with
        // this augmented data:
    }, [data]);
    return {dokumentasjonEtterspurt: dataWithId, isLoading, isError};
};

export default useDokumentasjonEtterspurt;
