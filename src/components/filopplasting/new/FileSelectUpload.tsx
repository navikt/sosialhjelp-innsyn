import { Alert, BodyShort, Button, FileObject, FileUpload, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { allowedFileTypes } from "@components/filopplasting/new/consts";
import { UploadIcon } from "@navikt/aksel-icons";

interface ResponsiveFileUploadSimpleProps {
    label: ReactNode;
    description?: ReactNode;
    tag?: ReactNode;
    buttonText?: string;
    error?: ReactNode;
    onSelect: (files: FileObject[]) => void;
    disabled?: boolean;
}

export const FileSelectUpload = ({
    label,
    description,
    tag,
    buttonText,
    error,
    onSelect,
    disabled = false,
}: ResponsiveFileUploadSimpleProps) => {
    return (
        <>
            <div className="hidden sm:block">
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={label}
                    description={description}
                    onSelect={onSelect}
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    disabled={disabled}
                    error={error}
                />
            </div>

            <VStack gap="2" className="block sm:hidden">
                <HStack justify="space-between">{tag}</HStack>
                {description && <BodyShort>{description}</BodyShort>}
                <FileUpload.Trigger
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    multiple
                    onSelect={onSelect}
                >
                    <Button className="mt-4" variant="secondary" icon={<UploadIcon aria-hidden />} disabled={disabled}>
                        {buttonText}
                    </Button>
                </FileUpload.Trigger>
                {error && (
                    <Alert variant="error" size="small">
                        {error}
                    </Alert>
                )}
            </VStack>
        </>
    );
};
