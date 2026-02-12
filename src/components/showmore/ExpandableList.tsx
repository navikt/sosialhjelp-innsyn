import React, { RefObject, useRef } from "react";
import { VStack } from "@navikt/ds-react";

import useShowMore, { ITEMS_LIMIT } from "@components/showmore/useShowMore";
import ShowMoreButton from "@components/showmore/ShowMoreButton";

interface Props<T> {
    items: T[];
    children: (item: T, index: number, firstExpandedItemRef: RefObject<HTMLLIElement | null>) => React.JSX.Element;
    id: string;
    showMoreSuffix: string;
    labelledById: string;
    itemsLimit?: number;
}

const ExpandableList = <T,>({
    itemsLimit,
    children,
    items,
    id,
    showMoreSuffix,
    labelledById,
}: Props<T>): React.JSX.Element => {
    const showMore = useShowMore(items, itemsLimit);
    const { hasMore, showAll } = showMore;
    const firstExpandedItemRef = useRef<HTMLLIElement>(null);
    const visibleItems = showAll ? items : items.slice(0, ITEMS_LIMIT);
    return (
        <>
            <VStack as="ul" gap="space-8" id={id} aria-labelledby={labelledById}>
                {/* eslint-disable-next-line react-hooks/refs */}
                {visibleItems.map((item, index) => children(item, index, firstExpandedItemRef))}
            </VStack>
            {hasMore && (
                <ShowMoreButton
                    items={items}
                    ref={firstExpandedItemRef}
                    id={id}
                    suffix={showMoreSuffix}
                    {...showMore}
                />
            )}
        </>
    );
};

export default ExpandableList;
