import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const useFocusRef = <T extends HTMLElement>(hash: string) => {
    const ref = useRef<T>(null);
    // Denne trigger rerendring på hash change (#vedtak), selv om den ikke brukes
    const params = useSearchParams();

    useEffect(() => {
        const link = ref.current;
        if (window.location.hash === hash && link) {
            requestAnimationFrame(() => {
                link.scrollIntoView({ behavior: "smooth", block: "center" });
                // focusVisible tvinger :focus-visible pseudoclass på elementet. Funker ikke i alle browsere
                link.focus({ preventScroll: true, focusVisible: true });
            });
        }
    }, [params, hash]);

    return ref;
};

export default useFocusRef;
