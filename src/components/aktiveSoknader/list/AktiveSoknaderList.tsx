"use client";

import { addDays } from "date-fns";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Box, Button } from "@navikt/ds-react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";

import { SaksListeResponse } from "../../../generated/model";
import type { getSaksDetaljerResponse } from "../../../generated/ssr/saks-oversikt-controller/saks-oversikt-controller";
import { PaabegyntSak } from "../AktiveSoknader";

import SoknadCard from "./soknadCard/SoknadCard";
import PaabegyntCard from "./soknadCard/status/PaabegyntCard";
import useSaker from "./useSaker";

interface Props {
    paabegynteSaker: PaabegyntSak[];
    saksdetaljer: Promise<getSaksDetaljerResponse[]>;
    saker: SaksListeResponse[];
}

const AktiveSoknaderList = ({ saker, paabegynteSaker, saksdetaljer }: Props) => {
    const t = useTranslations("AktiveSoknader");
    const { hasMore, sorted, showAll, setShowAll, totaltAntallSoknader } = useSaker(
        paabegynteSaker,
        saksdetaljer,
        saker
    );
    return (
        <>
            {sorted.map((sak) => (
                <Fragment
                    key={
                        "fiksDigisosId" in sak
                            ? sak.fiksDigisosId
                            : "soknadId" in sak
                              ? sak.soknadId
                              : sak.sistOppdatert
                    }
                >
                    {"fiksDigisosId" in sak && <SoknadCard key={sak.fiksDigisosId} sak={sak} />}
                    {"soknadId" in sak && (
                        <PaabegyntCard
                            soknadId={sak.soknadId}
                            keptUntil={addDays(new Date(sak.sistOppdatert), 21)}
                            key={sak.sistOppdatert}
                        />
                    )}
                </Fragment>
            ))}
            <Box className="self-start">
                {!showAll && hasMore && (
                    <Button onClick={() => setShowAll(true)} variant="tertiary" icon={<ChevronDownIcon />}>
                        {t("visAlle")} ({totaltAntallSoknader})
                    </Button>
                )}
                {showAll && (
                    <Button onClick={() => setShowAll(false)} variant="tertiary" icon={<ChevronUpIcon />}>
                        {t("visFærre")}
                    </Button>
                )}
            </Box>
        </>
    );
};

export default AktiveSoknaderList;
