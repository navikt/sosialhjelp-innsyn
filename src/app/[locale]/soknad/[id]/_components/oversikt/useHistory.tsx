import { useParams } from "next/navigation";
import * as R from "remeda";
import { useHentHendelserBetaSuspense } from "@generated/hendelse-controller/hendelse-controller";

import SendtEvent from "./history/events/SendtEvent";
import MottattEvent from "./history/events/MottattEvent";
import UnderBehandlingEvent from "./history/events/UnderBehandlingEvent";
import FerdigBehandletEvent from "./history/events/FerdigBehandletEvent";
import ForelopigSvarEvent from "./history/events/ForelopigSvarEvent";
import EtterspurtDokumentasjonEvent from "./history/events/EtterspurtDokumentasjonEvent";
import EtterspurtDokumentasjonLevertEvent from "./history/events/EtterspurtDokumentasjonLevertEvent";
import VedtakFattetEvent from "./history/events/VedtakFattetEvent";
import { RefObject } from "react";
import DokumentasjonskravEvent from "./history/events/DokumentasjonskravEvent";
import UtbetalingerOppdatertEvent from "./history/events/UtbetalingerOppdatertEvent";

type KommendeHendelse = {
    type: "UnderBehandling-kommer";
};

const useHistory = (ref: RefObject<HTMLLIElement | null>, refIndex: number) => {
    const { id } = useParams<{ id: string }>();
    const { data } = useHentHendelserBetaSuspense(id);
    const isProcessing = data.some((hendelse) => hendelse.type === "SoknadUnderBehandling");
    const isFinished = data.some((hendelse) => hendelse.type === "SoknadFerdigBehandlet");
    const steps = R.pipe(
        data,
        R.sortBy(R.prop("tidspunkt")),
        R.concat(isProcessing || isFinished ? [] : [{ type: "UnderBehandling-kommer" } satisfies KommendeHendelse]),
        R.reverse(),
        // TODO: Skal denne vises i lista?
        R.filter((it) => it.type !== "SakUnderBehandling"),
        R.map((hendelse, index) => {
            if (hendelse.type === "UnderBehandling-kommer") {
                return (
                    <UnderBehandlingEvent
                        ref={index === refIndex ? ref : undefined}
                        key="UnderBehandling-kommer"
                        completed={false}
                    />
                );
            }
            const key = `${hendelse.type}-${hendelse.tidspunkt}-${index}`;
            switch (hendelse.type) {
                case "DokumentasjonKrav":
                    return (
                        <DokumentasjonskravEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            url={hendelse.link ?? ""}
                        />
                    );
                case "Sendt":
                    return (
                        <SendtEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? ""}
                            url={hendelse.url}
                        />
                    );
                case "Mottatt":
                    return (
                        <MottattEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? ""}
                        />
                    );
                case "SoknadUnderBehandling":
                    return (
                        <UnderBehandlingEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            completed
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor}
                        />
                    );
                case "SoknadFerdigBehandlet":
                    return (
                        <FerdigBehandletEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                        />
                    );
                case "SakFerdigBehandlet":
                    const tidspunkt = new Date(hendelse.tidspunkt);
                    const vedtakPaaSammeSak = data.filter(
                        (otherHendelse) =>
                            otherHendelse.type === "SakFerdigBehandlet" &&
                            otherHendelse.sakstittel === hendelse.sakstittel
                    );
                    const isNew =
                        vedtakPaaSammeSak.length > 0 &&
                        vedtakPaaSammeSak.some((vedtakFattet) => new Date(vedtakFattet.tidspunkt) < tidspunkt);
                    return (
                        <VedtakFattetEvent
                            ref={index === refIndex ? ref : undefined}
                            key={key}
                            url={hendelse.url}
                            tidspunkt={tidspunkt}
                            isNew={isNew}
                        />
                    );
                case "ForelopigSvar":
                    return (
                        <ForelopigSvarEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? "Nav-kontoret ditt"}
                        />
                    );
                case "EtterspurtDokumentasjon":
                    return (
                        <EtterspurtDokumentasjonEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            url={hendelse.link}
                            navKontor={hendelse.navKontor ?? "Nav-kontoret ditt"}
                        />
                    );
                case "UtbetalingerOppdatert":
                    return (
                        <UtbetalingerOppdatertEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                        />
                    );
                case "LevertEtterspurtDokumentasjon":
                    return (
                        <EtterspurtDokumentasjonLevertEvent
                            ref={index === refIndex ? ref : undefined}
                            key={key}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                        />
                    );
            }
        }),
        R.filter((item) => !!item)
    );

    return { steps };
};

export default useHistory;
