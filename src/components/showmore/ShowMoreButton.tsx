"use client";

import React, { RefObject } from "react";
import { Button } from "@navikt/ds-react";
import { ChevronDownIcon, ChevronUpIcon } from "@navikt/aksel-icons";
import { useTranslations } from "next-intl";

import useShowMore, { ITEMS_LIMIT } from "@components/showmore/useShowMore";

interface Props<R extends HTMLElement> extends ReturnType<typeof useShowMore> {
    items: unknown[];
    controlsId: string;
    focusOnExpandRef?: RefObject<R | null>;
    suffix: string;
    itemsLimit?: number;
}

const ShowMoreButton = <R extends HTMLElement>({
    items,
    focusOnExpandRef,
    controlsId,
    showAll,
    hasMore,
    setShowAll,
    suffix,
    itemsLimit = ITEMS_LIMIT,
}: Props<R>): React.JSX.Element | null => {
    const t = useTranslations("ShowMoreButton");
    if (!hasMore) {
        return null;
    }

    const handleToggle = () => {
        const wasShowingAll = showAll;
        setShowAll((prev) => !prev);

        if (!wasShowingAll && focusOnExpandRef) {
            // When expanding, move focus to first newly revealed item
            // Use requestAnimationFrame to ensure DOM has updated
            requestAnimationFrame(() => {
                setTimeout(() => {
                    if (focusOnExpandRef.current) {
                        focusOnExpandRef.current.focus({ preventScroll: false });
                        focusOnExpandRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
                    }
                }, 500);
            });
        }
    };

    return (
        <Button
            className="self-start"
            variant="tertiary"
            onClick={handleToggle}
            icon={!showAll ? <ChevronDownIcon aria-hidden /> : <ChevronUpIcon aria-hidden />}
            aria-expanded={showAll}
            aria-controls={controlsId}
        >
            {!showAll && (
                <>
                    {t("visFlere")} {suffix} ({items.length - itemsLimit})
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
