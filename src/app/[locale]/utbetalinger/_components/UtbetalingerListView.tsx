"use client";
import { Heading, VStack } from "@navikt/ds-react";

import { ManedUtbetalingStatus, NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

import { UtbetalingerHeaderCard } from "./UtbetalingerHeaderCard";

type Props = {
    title: string;
    groups: NyeOgTidligereUtbetalingerResponse[];
    allowedStatuses?: ManedUtbetalingStatus[];
    sumStatuses?: ManedUtbetalingStatus[];
    empty: React.ReactNode;
};

const UtbetalingerListView = ({ title, groups, allowedStatuses, sumStatuses, empty }: Props) => {
    return (
        <VStack gap="4">
            <Heading size="small" level="2">
                {title}
            </Heading>
            {groups.length === 0
                ? empty
                : groups.map((g) => (
                      <UtbetalingerHeaderCard
                          key={`${g.ar}-${g.maned}`}
                          utbetalinger={g}
                          allowedStatuses={allowedStatuses}
                          manedsUtbetalingSum={sumStatuses}
                      />
                  ))}
        </VStack>
    );
};

export default UtbetalingerListView;
