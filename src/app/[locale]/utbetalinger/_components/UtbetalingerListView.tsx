"use client";
import { Heading, VStack } from "@navikt/ds-react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerHeaderCard } from "./UtbetalingerHeaderCard";

type Props = {
    tittel: string;
    utbetalingsGruppe: NyeOgTidligereUtbetalingerResponse[];
    tillateStatuser?: ManedUtbetalingStatus[];
    manedsUtbetalingerSummert?: ManedUtbetalingStatus[];
    tomListe: React.ReactNode;
};

const UtbetalingerListView = ({
    tittel,
    utbetalingsGruppe,
    tillateStatuser,
    manedsUtbetalingerSummert,
    tomListe,
}: Props) => {
    return (
        <VStack gap="4">
            <Heading size="small" level="2">
                {tittel}
            </Heading>
            {utbetalingsGruppe.length === 0
                ? tomListe
                : utbetalingsGruppe.map((g) => (
                      <UtbetalingerHeaderCard
                          key={`${g.ar}-${g.maned}`}
                          utbetalinger={g}
                          tilatteStatuser={tillateStatuser}
                          manedsUtbetalingSummert={manedsUtbetalingerSummert}
                      />
                  ))}
        </VStack>
    );
};

export default UtbetalingerListView;
