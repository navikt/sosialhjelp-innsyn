import { Alert, BodyShort, Button, FileObject, FileUpload, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { UploadIcon } from "@navikt/aksel-icons";
import useIsMobile from "@utils/useIsMobile";

interface ResponsiveFileUploadSimpleProps {
    label: ReactNode;
    description?: ReactNode;
    tag?: ReactNode;
    buttonText: string;
    error?: ReactNode;
    onSelect: (files: FileObject[]) => void;
    disabled?: boolean;
    showDescriptionInside?: boolean;
}

export const FileSelectUpload = ({
    label,
    description,
    tag,
    buttonText,
    error,
    onSelect,
    disabled = false,
    showDescriptionInside = true,
}: ResponsiveFileUploadSimpleProps) => {
    const isMobile = useIsMobile();

    return (
        <>
            {!isMobile ? (
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={label}
                    description={showDescriptionInside ? description : undefined}
                    onSelect={onSelect}
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    disabled={disabled}
                    error={error}
                />
            ) : (
                <VStack gap="2">
                    <HStack justify="space-between">{tag}</HStack>
                    {showDescriptionInside && description && <BodyShort>{description}</BodyShort>}
                    <FileUpload.Trigger
                        accept={allowedFileTypes}
                        maxSizeInBytes={10 * 1024 * 1024}
                        multiple
                        onSelect={onSelect}
                    >
                        <Button
                            className="mt-4 self-start"
                            variant="secondary"
                            icon={<UploadIcon aria-hidden />}
                            disabled={disabled}
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
