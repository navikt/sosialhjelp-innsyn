"use client";

import { Skeleton } from "@navikt/ds-react";

import useHistory from "../../useHistory";

import { Process } from "@navikt/ds-react/Process";
import ShowMoreButton from "@components/showmore/ShowMoreButton";
import useShowMore from "@components/showmore/useShowMore";
import { EventSkeleton } from "../Event";
import { useTranslations } from "next-intl";
import { useRef } from "react";

const LIMIT = 3;

interface Props {
    labelledById: string;
}

const History = ({ labelledById }: Props) => {
    const t = useTranslations("History");
    const ref = useRef<HTMLLIElement | null>(null);
    const { steps } = useHistory(ref, LIMIT);

    const showMore = useShowMore(steps, LIMIT);

    const { hasMore, showAll } = showMore;

    const truncated = showAll ? steps : steps.slice(0, LIMIT);

    return (
        <>
            <Process id="process" isTruncated={hasMore && !showAll ? "end" : undefined} aria-labelledby={labelledById}>
                {truncated}
            </Process>
            <ShowMoreButton
                items={steps}
                controlsId="process"
                suffix={t("suffix")}
                {...showMore}
                itemsLimit={LIMIT}
                focusOnExpandRef={ref}
            />
        </>
    );
};

export const StepsSkeleton = () => (
    <Process>
        <EventSkeleton title={<Skeleton width="400px" />}>
            <Skeleton width="200px" />
        </EventSkeleton>
        <EventSkeleton status="completed" title={<Skeleton width="400px" />} timestamp={new Date()}>
            <Skeleton width="200px" />
        </EventSkeleton>
    </Process>
);

export default History;
