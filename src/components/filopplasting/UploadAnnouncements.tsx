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
 * Kunngjør upload-hendelser til skjermlesere via en aria-live-region.
 *
 * Bruker `key={announcement?.id}` på selve live-region-containeren (<div>),
 * ikke på innholdet inni. Dette gjør at React fjerner den gamle containeren
 * og lager en helt ny ved hver hendelse — tilsvarende "generate live region
 * via JS, then populate"-mønsteret som TetraLogical sin testmatrise viser
 * fungerer konsistent på tvers av alle skjermleser/nettleser-kombinasjoner,
 * inkludert Firefox + VoiceOver som ikke leser opp injeksjoner i eksisterende
 * live-regioner med role="status"/aria-live="polite".
 */
const UploadAnnouncements = ({ announcement }: Props) => {
    const t = useTranslations("Opplastingsboks");

    if (!announcement) return null;

    const text = (() => {
        switch (announcement.type) {
            case "files-selected":
                return t("filLagtTil", { count: announcement.count });
            case "file-deleted":
                return t("filSlettet", { count: announcement.remainingCount });
        }
    })();

    return (
        <div key={announcement.id} role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {text}
        </div>
    );
};

export default UploadAnnouncements;
