import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";

import { ApplicationSpinner } from "../applicationSpinner/ApplicationSpinner";

import Tilgangskontrollside from "./Tilgangskontrollside";

const sessionUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/session";
const loginUrl = process.env.NEXT_PUBLIC_LOGIN_BASE_URL + "/oauth2/login";

export const TilgangskontrollsideWrapper = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const [sessionReady, setSessionReady] = useState(false);

    const sessionQuery = useQuery({
        queryKey: ["dekorator-login"],
        queryFn: async () => {
            const result = await fetch(sessionUrl, {
                method: "get",
                credentials: "include",
            });
            const data: { session: { active: boolean } } | undefined =
                result.status === 200 ? await result.json() : undefined;
            return { status: result.status, ...data };
        },
    });

    useEffect(() => {
        if (!sessionQuery.isLoading && sessionQuery.data?.status === 404) {
            setSessionReady(true);
            return;
        }

        if (
            !sessionQuery.isLoading &&
            (sessionQuery.data?.status === 401 || sessionQuery.data?.session?.active === false)
        ) {
            router.replace(loginUrl + "?redirect=" + window.location.href);
        }
    }, [sessionQuery.data, sessionQuery.isLoading, router]);

    useEffect(() => {
        if (sessionQuery.data?.session?.active) {
            setSessionReady(true);
        }
    }, [sessionQuery.data?.session?.active]);

    if (sessionQuery.isLoading || !sessionReady) {
        return (
            <div className="informasjon-side">
                1
                <ApplicationSpinner />
            </div>
        );
    }

    return <Tilgangskontrollside>{children}</Tilgangskontrollside>;
};
