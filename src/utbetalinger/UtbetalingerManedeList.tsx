// utbetalinger/shared/MonthList.tsx
"use client";
import React from "react";
import { BoxNew, HStack, BodyShort, VStack } from "@navikt/ds-react";
import { useFormatter } from "next-intl";
import { set } from "date-fns";

import { MonthBucket } from "./UtbetalingerUtils";

type UtbetalingerManedeListProps = {
    sections: MonthBucket[];
    // Header right-side content (e.g., a sum)
    renderHeaderRight?: (m: MonthBucket) => React.ReactNode;
    // Row renderer
    renderRow: (m: MonthBucket, utb: MonthBucket["utbetalingerForManed"][number], idx: number) => React.ReactNode;
};

const UtbetalingerManedeList: React.FC<UtbetalingerManedeListProps> = ({ sections, renderHeaderRight, renderRow }) => {
    const format = useFormatter();

    return (
        <VStack gap="5">
            {sections.map((m) => (
                <React.Fragment key={`${m.ar}-${m.maned}`}>
                    <BoxNew borderRadius="xlarge xlarge 0 0" padding="space-16" background="info-soft">
                        <HStack>
                            <BodyShort className="font-bold mb-1 capitalize">
                                {format.dateTime(set(new Date(0), { year: m.ar, month: m.maned - 1 }), {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </BodyShort>
                            <div className="ml-auto">{renderHeaderRight?.(m)}</div>
                        </HStack>
                    </BoxNew>

                    {m.utbetalingerForManed.map((u, idx) => renderRow(m, u, idx))}
                </React.Fragment>
            ))}
        </VStack>
    );
};

export default UtbetalingerManedeList;
