import { useState } from "react";

export const ITEMS_LIMIT = 5;

const useShowMore = (items: unknown[], itemsLimit: number = ITEMS_LIMIT) => {
    const [showAll, setShowAll] = useState(false);
    const hasMore = items.length > itemsLimit;
    return { showAll, setShowAll, hasMore };
};

export default useShowMore;
