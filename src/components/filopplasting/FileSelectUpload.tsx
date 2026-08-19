import { Alert, BodyLong, Button, FileObject, FileUpload, Heading, VStack } from "@navikt/ds-react";
import { ReactNode, Ref } from "react";
import { allowedFileTypes } from "@components/filopplasting/consts";
import { UploadIcon } from "@navikt/aksel-icons";
import useIsMobile from "@utils/useIsMobile";

interface FileSelectUploadProps {
    label: ReactNode;
    headerId: string;
    description?: ReactNode;
    tag?: ReactNode;
    buttonText: string;
    error?: ReactNode;
    onSelect: (files: FileObject[]) => void;
    disabled?: boolean;
    currentCount: number;
    accept?: string;
    variant?: "default" | "warning";
    // Ref til et alltid-montert, usynlig fokus-anker (se srFocusAnchor under).
    // Brukes som et stabilt fokus-fallback fra FileSelectNew når siste fil i
    // listen slettes — i motsetning til filliste-heading'en (som forsvinner
    // fra DOM sammen med resten av listen når den blir tom), forsvinner
    // dette elementet aldri.
    headerSectionRef?: Ref<HTMLDivElement>;
}

export const FileSelectUpload = ({
    label,
    headerId,
    description,
    tag,
    buttonText,
    error,
    onSelect,
    disabled,
    currentCount,
    accept = allowedFileTypes,
    variant = "default",
    headerSectionRef,
}: FileSelectUploadProps) => {
    const isMobile = useIsMobile();
    const dataColor = variant === "warning" ? "warning" : undefined;

    const labelContent =
        typeof label === "string" ? (
            <Heading size="small" level="3" lang="no" data-color={dataColor}>
                {label}
            </Heading>
        ) : (
            label
        );

    const descriptionContent =
        description == null ? null : typeof description === "string" ? (
            <BodyLong lang="no" data-color={dataColor}>
                {description}
            </BodyLong>
        ) : (
            description
        );

    // Mobile: tag on top, label below (flex-col); Desktop: label left, tag right (flex-row)
    const headerSection = (
        <div className="flex flex-col ax-md:flex-row ax-md:justify-between ax-md:items-center gap-2" id={headerId}>
            <div className="order-2 ax-md:order-1">{labelContent}</div>
            {tag && <div className="order-1 ax-md:order-2">{tag}</div>}
        </div>
    );

    // Usynlig, alltid-montert fokus-anker for skjermleser (se headerSectionRef).
    // Må IKKE ligge inni headerSection: på desktop sendes headerSection inn som
    // `label`-prop til <FileUpload.Dropzone>, som Aksel rendrer inni en native
    // <label htmlFor=skjult-filinput>. Et fokusbart element plassert der
    // arver label-elementets kontekst og gir uforutsigbar oppførsel i
    // Chrome+VoiceOver (fokus-hopp endte opp med å lese fillistens overskrift
    // i stedet for stedet vi faktisk ba om). Dette ankeret ligger derfor som
    // en helt separat søsken-node, aria-label gir det en meningsfull
    // tilgjengelig tekst uten synlig duplisering av tittelen.
    const srFocusAnchor = (
        <div
            ref={headerSectionRef}
            tabIndex={-1}
            aria-label={typeof label === "string" ? label : undefined}
            className="sr-only"
        />
    );

    return (
        <>
            {srFocusAnchor}
            {!isMobile ? (
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={headerSection}
                    description={
                        descriptionContent ? <VStack className="mb-2">{descriptionContent}</VStack> : undefined
                    }
                    onSelect={onSelect}
                    accept={accept}
                    maxSizeInBytes={10 * 1024 * 1024}
                    fileLimit={{ max: 30, current: currentCount }}
                    multiple
                    disabled={disabled}
                    error={error}
                />
            ) : (
                <VStack gap="space-16">
                    <VStack gap="space-2">
                        {headerSection}
                        {descriptionContent}
                    </VStack>
                    <FileUpload.Trigger accept={accept} maxSizeInBytes={10 * 1024 * 1024} multiple onSelect={onSelect}>
                        <Button
                            className="self-start"
                            variant="secondary"
                            icon={<UploadIcon aria-hidden />}
                            disabled={disabled}
                            aria-describedby={headerId}
                            aria-label={buttonText}
                        >
                            {buttonText}
                        </Button>
                    </FileUpload.Trigger>
                    {error && (
                        <Alert variant="error" size="small">
                            {error}
                        </Alert>
                    )}
                </VStack>
            )}
        </>
    );
};
