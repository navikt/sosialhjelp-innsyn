"use client";

import { useTranslations } from "next-intl";

export type UploadAnnouncement =
    | { id: number; type: "files-selected"; count: number }
    | { id: number; type: "file-deleted"; remainingCount: number }
    | { id: number; type: "folder-rejected" };

interface Props {
    announcement?: UploadAnnouncement;
}

/**
 * Rendrer en skjult aria-live-region for upload-hendelser.
 *
 * Bruker `key={announcement.id}` på span-elementet slik at React lager en ny
 * DOM-node ved hver hendelse. Dette gjør at identisk tekst (f.eks. "1 fil valgt"
 * to ganger på rad) fortsatt registreres som en ny endring av skjermleseren.
 */
const UploadAnnouncements = ({ announcement }: Props) => {
    const t = useTranslations("Opplastingsboks");

    const text = (() => {
        if (!announcement) return "";
        switch (announcement.type) {
            case "files-selected":
                return t("filValgt", { count: announcement.count });
            case "file-deleted":
                return t("filSlettet", { count: announcement.remainingCount });
            case "folder-rejected":
                return t("mappeIkkeTillatt");
        }
    })();

    return (
        <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            <span key={announcement?.id}>{text}</span>
        </div>
    );
};

export default UploadAnnouncements;
