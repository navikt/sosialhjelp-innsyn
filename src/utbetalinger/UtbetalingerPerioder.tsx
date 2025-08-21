"use client";
import { BoxNew, VStack } from "@navikt/ds-react";
import { useFormatter } from "next-intl";
import { set } from "date-fns";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    tidligere?: NyeOgTidligereUtbetalingerResponse[];
}

const UtbetalingerPerioder = ({ tidligere }: Props) => {
    const format = useFormatter();

    return (
        <VStack>
            {tidligere?.map((item, index) => (
                <>
                    <BoxNew background="info-soft" key={`tidligere-${index}`}>
                        {format.dateTime(
                            set(new Date(0), {
                                year: item.ar,
                                month: item.maned - 1,
                            }),
                            {
                                month: "long",
                                year: "numeric",
                            }
                        )}
                    </BoxNew>
                    {item.utbetalingerForManed.map((utb, id) => (
                        <BoxNew background="warning-moderateA" key={`tidligere-${id}`}>
                            {utb.tittel}
                        </BoxNew>
                    ))}
                </>
            ))}
        </VStack>
    );
};

export default UtbetalingerPerioder;
