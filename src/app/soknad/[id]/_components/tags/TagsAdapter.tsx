"use client";

import Tags from "@components/tags/Tags";
import React from "react";
import { useGetSaksDetaljerSuspense } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import { useParams } from "next/navigation";
import { HStack } from "@navikt/ds-react";
import TagsContextProvider from "@components/tags/TagsContextProvider";
import useIsMobile from "@utils/useIsMobile";
import { useHentKlager } from "@generated/klage-controller/klage-controller";

const TagsAdapter = () => {
    const { id } = useParams<{ id: string }>();
    const { data } = useGetSaksDetaljerSuspense(id);
    const { data: klager } = useHentKlager(id, { query: { retry: false } });
    const isMobile = useIsMobile();

    return (
        <HStack gap="space-8" align="center">
            <TagsContextProvider size={isMobile ? "small" : "medium"}>
                <Tags soknad={data} hasKlage={!!klager?.length} />
            </TagsContextProvider>
        </HStack>
    );
};

export default TagsAdapter;
