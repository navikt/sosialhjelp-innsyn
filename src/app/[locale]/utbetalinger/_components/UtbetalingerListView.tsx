"use client";
import { Heading, VStack } from "@navikt/ds-react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerHeaderCard } from "./UtbetalingerHeaderCard";

type Props = {
    tittel: string;
    utbetalingsGruppe: NyeOgTidligereUtbetalingerResponse[];
    manedsUtbetalingerSummert?: ManedUtbetalingStatus[];
    tomListe: React.ReactNode;
};

const UtbetalingerListView = ({ tittel, utbetalingsGruppe, manedsUtbetalingerSummert, tomListe }: Props) => {
    return (
        <VStack gap="4">
            <Heading size="medium" level="2">
                {tittel}
            </Heading>
            {utbetalingsGruppe.length === 0
                ? tomListe
                : utbetalingsGruppe.map((gruppe) => (
                      <UtbetalingerHeaderCard
                          key={`${gruppe.ar}-${gruppe.maned}`}
                          utbetalinger={gruppe}
                          manedsUtbetalingerSummert={manedsUtbetalingerSummert}
                      />
                  ))}
        </VStack>
    );
};

export default UtbetalingerListView;
