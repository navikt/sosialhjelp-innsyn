import { useParams } from "next/navigation";
import * as R from "remeda";

import { useHentHendelserBeta } from "../../../generated/hendelse-controller/hendelse-controller";

import SendtStep from "./steps/SendtStep";
import MottattStep from "./steps/MottattStep";
import UnderBehandlingStep from "./steps/UnderBehandlingStep";
import FerdigBehandletStep from "./steps/FerdigBehandletStep";

const useSteps = () => {
    const { id } = useParams<{ id: string }>();
    const { data, isLoading, error } = useHentHendelserBeta(id);
    if (isLoading) {
        return { isLoading };
    }
    if (!data) {
        return { error };
    }
    const isProcessing = data.some((hendelse) => hendelse.type === "SoknadUnderBehandling");
    const isFinishedProcessing = data.some((hendelse) => hendelse.type === "SoknadFerdigBehandlet");
    const steps = R.pipe(
        data,
        R.sortBy(R.prop("tidspunkt")),
        R.map((hendelse) => {
            switch (hendelse.type) {
                case "Sendt":
                    return <SendtStep tidspunkt={new Date(hendelse.tidspunkt)} navKontor={hendelse.navKontor ?? ""} />;
                case "Mottatt":
                    return (
                        <MottattStep tidspunkt={new Date(hendelse.tidspunkt)} navKontor={hendelse.navKontor ?? ""} />
                    );
                case "SoknadUnderBehandling":
                    return (
                        <UnderBehandlingStep
                            completed
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor}
                        />
                    );
                case "SoknadFerdigBehandlet":
                    return (
                        <FerdigBehandletStep completed url={hendelse.url} tidspunkt={new Date(hendelse.tidspunkt)} />
                    );
            }
        }),
        R.filter((step) => !!step)
    );
    const stepsWithUncompleted = R.pipe(
        steps,
        R.concat(isProcessing ? [] : [<UnderBehandlingStep key="UnderBehandling-kommer" completed={false} />]),
        R.concat(isFinishedProcessing ? [] : [<FerdigBehandletStep key="UnderBehandling-kommer" completed={false} />])
    );
    return { isLoading, error, steps: stepsWithUncompleted, completed: steps.length };
};

export default useSteps;
