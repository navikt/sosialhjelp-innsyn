"use client";

import React, { RefObject } from "react";
import { Button } from "@navikt/ds-react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";

import useShowMore, { ITEMS_LIMIT } from "@components/showmore/useShowMore";

interface Props<R extends HTMLElement> extends ReturnType<typeof useShowMore> {
    items: unknown[];
    id: string;
    ref: RefObject<R | null>;
    suffix: string;
}

const ShowMoreButton = <R extends HTMLElement>({
    items,
    ref,
    id,
    showAll,
    hasMore,
    setShowAll,
    suffix,
}: Props<R>): React.JSX.Element | null => {
    const t = useTranslations("ShowMoreButton");
    if (!hasMore) {
        return null;
    }

    const handleToggle = () => {
        const wasShowingAll = showAll;
        setShowAll((prev) => !prev);

        if (!wasShowingAll) {
            // When expanding, move focus to first newly revealed item
            setTimeout(() => {
                ref.current?.focus();
            }, 0);
        }
    };

    return (
        <Button
            className="self-start"
            variant="tertiary"
            onClick={handleToggle}
            icon={!showAll ? <ChevronDownIcon aria-hidden /> : <ChevronUpIcon aria-hidden />}
            aria-expanded={showAll}
            aria-controls={id}
        >
            {!showAll && (
                <>
                    {t("visFlere")} {suffix} ({items.length - ITEMS_LIMIT})
                </>
            )}
            {showAll && (
                <>
                    {t("visFærre")} {suffix}
                </>
            )}
        </Button>
    );
};

export default ShowMoreButton;
