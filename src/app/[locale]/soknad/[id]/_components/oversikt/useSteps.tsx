import { useParams } from "next/navigation";
import * as R from "remeda";

import { useHentHendelserBetaSuspense } from "@generated/hendelse-controller/hendelse-controller";

import SendtStep from "./steps/SendtStep";
import MottattStep from "./steps/MottattStep";
import UnderBehandlingStep from "./steps/UnderBehandlingStep";
import FerdigBehandletStep from "./steps/FerdigBehandletStep";
import ForelopigSvarStep from "./steps/ForelopigSvarStep";
import EtterspurtDokumentasjonStep from "./steps/EtterspurtDokumentasjonStep";
import EtterspurtDokumentasjonLevertStep from "./steps/EtterspurtDokumentasjonLevertStep";

const useSteps = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useHentHendelserBetaSuspense(id);
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
                case "ForelopigSvar":
                    return (
                        <ForelopigSvarStep
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? "Nav-kontoret ditt"}
                        />
                    );
                case "EtterspurtDokumentasjon":
                    return (
                        <EtterspurtDokumentasjonStep
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? "Nav-kontoret ditt"}
                        />
                    );
                case "LevertEtterspurtDokumentasjon":
                    return <EtterspurtDokumentasjonLevertStep tidspunkt={new Date(hendelse.tidspunkt)} />;
            }
        }),
        R.filter((step) => !!step)
    );
    const stepsWithUncompleted = R.pipe(
        steps,
        R.concat(isProcessing ? [] : [<UnderBehandlingStep key="UnderBehandling-kommer" completed={false} />]),
        R.concat(isFinishedProcessing ? [] : [<FerdigBehandletStep key="UnderBehandling-kommer" completed={false} />])
    );
    return { steps: stepsWithUncompleted, completed: steps.length };
};

export default useSteps;
