import { useEffect, useState } from "react";

export function useContextId(raw: string): string | null {
    const [hashed, setHashed] = useState<string | null>(null);
    useEffect(() => {
        crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw)).then((buf) =>
            setHashed(
                Array.from(new Uint8Array(buf))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("")
            )
        );
    }, [raw]);
    return hashed;
}
