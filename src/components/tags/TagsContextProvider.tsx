"use client";

import { createContext, PropsWithChildren, useContext } from "react";

interface Props {
    size?: "small" | "medium";
}

const TagsContext = createContext<{ size: "small" | "medium" } | null>(null);
export const useTagSize = () => {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error("useTagSize must be used within a TagsContextProvider");
    }
    return context.size;
};

const TagsContextProvider = ({ size, children }: PropsWithChildren<Props>) => (
    <TagsContext.Provider value={{ size: size ?? "small" }}>{children}</TagsContext.Provider>
);

export default TagsContextProvider;
