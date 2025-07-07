"use client";
import { useParams } from "next/navigation";

const useVedtakId = (): string => {
    const { vedtakId } = useParams() as { vedtakId: string };

    if (!vedtakId || Array.isArray(vedtakId)) {
        throw Error("Kunne ikke finne vedtakId i parametere");
    }

    return vedtakId;
};

export default useVedtakId;
