"use client";

import { useTranslations } from "next-intl";

export type UploadAnnouncement =
    | { id: number; type: "files-selected"; count: number }
    | { id: number; type: "file-deleted"; remainingCount: number };

export type UploadAnnouncementEvent =
    { type: "files-selected"; count: number } | { type: "file-deleted"; remainingCount: number };

interface Props {
    announcement?: UploadAnnouncement;
}

/**
 * Rendrer en skjult aria-live-region for upload-hendelser.
 *
 * Bruker `key={announcement?.id}` på <span>-elementet slik at React alltid
 * lager en ny DOM-node ved hver hendelse — ikke bare oppdaterer tekstinnholdet.
 * Dette gjør at identisk tekst (f.eks. "1 fil lagt til" to ganger på rad)
 * fortsatt registreres som en ny DOM-mutasjon av skjermleseren.
 *
 * Én enkelt live-region er mer forutsigbar enn to alternerende regioner,
 * særlig for JAWS og NVDA som kan oppfatte to regioner som to separate hendelser.
 */
const UploadAnnouncements = ({ announcement }: Props) => {
    const t = useTranslations("Opplastingsboks");

    const text = (() => {
        if (!announcement) return "";
        switch (announcement.type) {
            case "files-selected":
                return t("filLagtTil", { count: announcement.count });
            case "file-deleted":
                return t("filSlettet", { count: announcement.remainingCount });
        }
    })();

    return (
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            <span key={announcement?.id}>{text}</span>
        </div>
    );
};

export default UploadAnnouncements;
