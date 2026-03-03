import React, { useEffect, useRef } from "react";
import { VStack } from "@navikt/ds-react";

import useShowMore, { ITEMS_LIMIT } from "@components/showmore/useShowMore";
import ShowMoreButton from "@components/showmore/ShowMoreButton";

interface Props<T> {
    items: T[];
    children: (item: T, ref: React.Ref<HTMLLIElement> | null) => React.JSX.Element;
    id: string;
    showMoreSuffix: string;
    labelledById: string;
    itemsLimit?: number;
    forceShowAll?: boolean;
}

const ExpandableList = <T,>({
    itemsLimit = ITEMS_LIMIT,
    children,
    items,
    id,
    showMoreSuffix,
    labelledById,
    forceShowAll,
}: Props<T>): React.JSX.Element => {
    const showMore = useShowMore(items, itemsLimit);
    const { hasMore, showAll, setShowAll } = showMore;

    useEffect(() => {
        if (forceShowAll) setShowAll(true);
    }, [forceShowAll, setShowAll]);
    const firstExpandedItemRef = useRef<HTMLLIElement>(null);
    const visibleItems = showAll ? items : items.slice(0, itemsLimit);

    return (
        <>
            <VStack as="ul" gap="space-8" id={id} aria-labelledby={labelledById}>
                {/* eslint-disable-next-line react-hooks/refs -- Using ref for focus management on expand */}
                {visibleItems.map((item, index) => children(item, index === itemsLimit ? firstExpandedItemRef : null))}
            </VStack>
            {hasMore && (
                <ShowMoreButton
                    items={items}
                    focusOnExpandRef={firstExpandedItemRef}
                    controlsId={id}
                    suffix={showMoreSuffix}
                    itemsLimit={itemsLimit}
                    {...showMore}
                />
            )}
        </>
    );
};

export default ExpandableList;
