"use client";

import { BodyShort } from "@navikt/ds-react";
import { createContext, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Announce = (text: string, delayMs?: number) => void;

const LiveAnnouncerContext = createContext<Announce>(() => {});

// Tid meldingen blir stående før den tømmes. Tømmingen gjør at samme tekst kan kunngjøres på nytt.
const CLEAR_AFTER_MS = 1000;

/**
 * Én felles aria-live-region som alltid ligger i DOM. Regionen må finnes før teksten settes,
 * ellers leser flere skjermlesere ikke opp den første meldingen.
 */
export const LiveAnnouncerProvider = ({ children }: PropsWithChildren) => {
    const [text, setText] = useState("");
    const announceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

    useEffect(
        () => () => {
            clearTimeout(announceTimer.current);
            clearTimeout(clearTimer.current);
        },
        []
    );

    // delayMs brukes når en nettleserdialog nettopp er lukket (f.eks. filvelgeren). Nettleseren flytter da fokus
    // tilbake, og skjermleseren leser fokusendringen. En melding som settes samtidig blir ikke lest opp.
    const announce = useCallback<Announce>((message, delayMs = 0) => {
        clearTimeout(announceTimer.current);
        clearTimeout(clearTimer.current);
        announceTimer.current = setTimeout(() => {
            setText(message);
            clearTimer.current = setTimeout(() => setText(""), CLEAR_AFTER_MS);
        }, delayMs);
    }, []);

    const value = useMemo(() => announce, [announce]);

    return (
        <LiveAnnouncerContext.Provider value={value}>
            {children}
            <BodyShort as="div" visuallyHidden aria-live="assertive" aria-atomic>
                {text}
            </BodyShort>
        </LiveAnnouncerContext.Provider>
    );
};

export const useAnnounce = () => useContext(LiveAnnouncerContext);
