import { useState } from "react";

export const ITEMS_LIMIT = 5;

const useShowMore = <T>(items: T[]) => {
    const [showAll, setShowAll] = useState(false);
    const hasMore = items.length > ITEMS_LIMIT;
    return { showAll, setShowAll, hasMore };
};

export default useShowMore;
