"use client";

interface Props {
    message: string;
}

/**
 * Kunngjør upload-hendelser til skjermlesere via en permanent aria-live-region.
 *
 * Live-region-containeren eksisterer alltid i DOM fra første render — den fjernes
 * aldri. Dette er nødvendig fordi skjermlesere bare lytter på endringer i regioner
 * de allerede kjenner til fra accessibility tree.
 *
 * Tøm-og-fyll-mønsteret styres av announce() i OpplastingsboksTus:
 * message settes til "" først, deretter til den faktiske teksten etter 50ms.
 * Dette tvinger frem en ny DOM-mutasjon som skjermleseren registrerer som en endring,
 * også når identisk tekst sendes to ganger på rad.
 */
const UploadAnnouncements = ({ message }: Props) => (
    <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {message}
    </div>
);

export default UploadAnnouncements;
