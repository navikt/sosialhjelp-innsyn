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
import VideresendtEvent from "./history/events/VideresendtEvent";
import DeltSoknadEvent from "./history/events/DeltSoknadEvent";
import { HentHendelserBeta200Item } from "@generated/model";

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
    const steps = R.pipe(
        data,
        mapReduce,
        R.sortBy([R.prop("tidspunkt"), "desc"]),
        R.map((hendelse, index) => {
            const key = `${hendelse.type}-${hendelse.tidspunkt}-${index}`;
            switch (hendelse.type) {
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
