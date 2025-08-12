"use client";

import { addDays } from "date-fns";
import { Fragment } from "react";
import { useTranslations } from "next-intl";
import { Box, Button } from "@navikt/ds-react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";

import { SaksListeResponse } from "@generated/model";
import { SaksDetaljerResponse } from "@generated/ssr/model";
import useShowMore, { ITEMS_LIMIT } from "@hooks/useShowMore";
import { PaabegyntSoknad } from "@api/fetch/paabegynteSoknader/fetchPaabegynteSoknader";

import SoknadCard from "./soknadCard/SoknadCard";
import PaabegyntCard from "./soknadCard/status/PaabegyntCard";

interface Props {
    soknader: (PaabegyntSoknad | (Partial<SaksDetaljerResponse> & SaksListeResponse))[];
}

const SoknaderList = ({ soknader }: Props) => {
    const t = useTranslations("AktiveSoknader");
    const { hasMore, showAll, setShowAll } = useShowMore(soknader);
    return (
        <>
            {soknader.slice(0, showAll ? soknader.length : ITEMS_LIMIT).map((sak) => (
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
                        {t("visFlere")} ({soknader.length - ITEMS_LIMIT})
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

export default SoknaderList;
