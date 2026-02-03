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
    const isFinishedProcessing = data.some(
        (hendelse) => hendelse.type === "SoknadFerdigBehandlet" || hendelse.type === "SakFerdigBehandlet"
    );
    const steps = R.pipe(
        data,
        R.sortBy(R.prop("tidspunkt")),
        R.map((hendelse, index) => {
            const key = `${hendelse.type}-${hendelse.tidspunkt}-${index}`;
            switch (hendelse.type) {
                case "Sendt":
                    return (
                        <SendtStep
                            key={key}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? ""}
                            url={hendelse.url}
                        />
                    );
                case "Mottatt":
                    return (
                        <MottattStep key={key} tidspunkt={new Date(hendelse.tidspunkt)} navKontor={hendelse.navKontor ?? ""} />
                    );
                case "SoknadUnderBehandling":
                    return (
                        <UnderBehandlingStep
                            key={key}
                            completed
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor}
                        />
                    );
                case "SoknadFerdigBehandlet":
                    return (
                        <FerdigBehandletStep key={key} completed url={hendelse.url} tidspunkt={new Date(hendelse.tidspunkt)} />
                    );
                case "SakFerdigBehandlet":
                    return (
                        <FerdigBehandletStep key={key} completed url={hendelse.url} tidspunkt={new Date(hendelse.tidspunkt)} />
                    );
                case "ForelopigSvar":
                    return (
                        <ForelopigSvarStep
                            key={key}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? "Nav-kontoret ditt"}
                        />
                    );
                case "EtterspurtDokumentasjon":
                    return (
                        <EtterspurtDokumentasjonStep
                            key={key}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? "Nav-kontoret ditt"}
                        />
                    );
                case "LevertEtterspurtDokumentasjon":
                    return <EtterspurtDokumentasjonLevertStep key={key} tidspunkt={new Date(hendelse.tidspunkt)} />;
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
