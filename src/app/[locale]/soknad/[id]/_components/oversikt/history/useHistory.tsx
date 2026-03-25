import { useParams } from "next/navigation";
import * as R from "remeda";
import { useHentHendelserBetaSuspense } from "@generated/hendelse-controller/hendelse-controller";

import SendtEvent from "./events/SendtEvent";
import MottattEvent from "./events/MottattEvent";
import UnderBehandlingEvent from "./events/UnderBehandlingEvent";
import FerdigBehandletEvent from "./events/FerdigBehandletEvent";
import ForelopigSvarEvent from "./events/ForelopigSvarEvent";
import EtterspurtDokumentasjonEvent from "./events/EtterspurtDokumentasjonEvent";
import EtterspurtDokumentasjonLevertEvent from "./events/EtterspurtDokumentasjonLevertEvent";
import VedtakFattetEvent from "./events/VedtakFattetEvent";
import { RefObject } from "react";
import DokumentasjonskravEvent from "./events/DokumentasjonskravEvent";
import UtbetalingerOppdatertEvent from "./events/UtbetalingerOppdatertEvent";
import VideresendtEvent from "./events/VideresendtEvent";
import DeltSoknadEvent from "./events/DeltSoknadEvent";
import { HentHendelserBeta200Item } from "@generated/model";
import BehandlesIkkeEvent from "./events/BehandlesIkkeEvent";
import KanIkkeViseStatusEvent from "./events/KanIkkeViseStatusEvent";

type Hendelse =
    | HentHendelserBeta200Item
    | {
          type: "DeltSøknad";
          tidspunkt: string;
      };

const mapReduce = (hendelser: HentHendelserBeta200Item[]): Hendelse[] => {
    const sakerUnderBehandling = R.pipe(
        hendelser,
        R.sortBy([R.prop("tidspunkt"), "desc"]),
        R.filter((hendelse) => hendelse.type === "SakUnderBehandling")
    );

    // Tar bort denne hendelsetypen. Erstattes med "DeltSøknad" dersom det er flere "SakUnderBehandling" på samme tid.
    const withoutSaker: Hendelse[] = hendelser.filter((hendelse) => hendelse.type !== "SakUnderBehandling");
    if (sakerUnderBehandling.length > 1) {
        return withoutSaker.concat([{ type: "DeltSøknad", tidspunkt: sakerUnderBehandling[0].tidspunkt }]);
    }

    return withoutSaker;
};

const useHistory = (ref: RefObject<HTMLLIElement | null>, refIndex: number) => {
    const { id } = useParams<{ id: string }>();
    const { data } = useHentHendelserBetaSuspense(id);
    const hasMultipleCases =
        new Set(
            data
                .filter((otherHendelse) => otherHendelse.type === "SakUnderBehandling")
                .map((hendelse) => hendelse.sakstittel)
        ).size > 1;
    const steps = R.pipe(
        data,
        mapReduce,
        R.sortBy([R.prop("tidspunkt"), "desc"]),
        R.map((hendelse, index) => {
            const key = `${hendelse.type}-${hendelse.tidspunkt}-${index}`;
            switch (hendelse.type) {
                case "BehandlesIkke":
                    return (
                        <BehandlesIkkeEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                        />
                    );
                // Fallthrough med vilje. Disse to hendelsetypene har samme visning.
                case "SakKanIkkeViseStatus":
                case "SoknadKanIkkeViseStatus":
                    return (
                        <KanIkkeViseStatusEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                        />
                    );
                case "Videresendt":
                    return (
                        <VideresendtEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor!}
                        />
                    );
                case "DeltSøknad":
                    return <DeltSoknadEvent key={key} timestamp={new Date(hendelse.tidspunkt)} />;
                case "DokumentasjonKrav":
                    return (
                        <DokumentasjonskravEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                        />
                    );
                case "Sendt":
                    return (
                        <SendtEvent
                            key={key}
                            ref={index === refIndex ? ref : undefined}
                            tidspunkt={new Date(hendelse.tidspunkt)}
                            navKontor={hendelse.navKontor ?? ""}
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
                            tidspunkt={tidspunkt}
                            isNew={isNew}
                            sakstittel={hasMultipleCases ? hendelse.sakstittel : undefined}
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
