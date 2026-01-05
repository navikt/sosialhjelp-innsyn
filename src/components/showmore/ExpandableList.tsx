import React, { RefObject, useRef } from "react";
import { VStack } from "@navikt/ds-react";

import useShowMore, { ITEMS_LIMIT } from "@components/showmore/useShowMore";
import ShowMoreButton from "@components/showmore/ShowMoreButton";

interface Props<T> {
    items: T[];
    children: (item: T, index: number, ref: RefObject<HTMLLIElement | null>) => React.JSX.Element;
    id: string;
    showMoreSuffix: string;
    itemsLimit?: number;
}

const ExpandableList = <T,>({ itemsLimit, children, items, id, showMoreSuffix }: Props<T>): React.JSX.Element => {
    const showMore = useShowMore(items, itemsLimit);
    const { hasMore, showAll } = showMore;
    const ref = useRef<HTMLLIElement>(null);
    return (
        <>
            <VStack as="ol" gap="2" id={id}>
                {/* eslint-disable-next-line react-hooks/refs */}
                {items.slice(0, showAll ? items.length : ITEMS_LIMIT).map((item, index) => children(item, index, ref))}
            </VStack>
            {hasMore && <ShowMoreButton items={items} ref={ref} id={id} suffix={showMoreSuffix} {...showMore} />}
        </>
    );
};

export default ExpandableList;
