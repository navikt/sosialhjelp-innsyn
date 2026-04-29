import { Alert, BodyLong, Button, FileObject, FileUpload, HStack, VStack } from "@navikt/ds-react";
import { ReactNode } from "react";
import { allowedFileTypes } from "@components/filopplasting/consts";
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
    currentCount: number;
    showLabelOnMobile?: boolean;
}

export const FileSelectUpload = ({
    label,
    description,
    tag,
    buttonText,
    error,
    onSelect,
    disabled,
    currentCount,
    showLabelOnMobile = false,
}: ResponsiveFileUploadSimpleProps) => {
    const isMobile = useIsMobile();

    return (
        <>
            {!isMobile ? (
                <FileUpload.Dropzone
                    className="flex flex-col"
                    // @ts-expect-error: Typen på Dropzone er string, men den sendes ned i en komponent som aksepterer ReactNode.
                    label={
                        tag ? (
                            <HStack justify="space-between">
                                {label}
                                {tag}
                            </HStack>
                        ) : (
                            label
                        )
                    }
                    description={<VStack className="mb-2">{description}</VStack>}
                    onSelect={onSelect}
                    accept={allowedFileTypes}
                    maxSizeInBytes={10 * 1024 * 1024}
                    fileLimit={{ max: 30, current: currentCount }}
                    multiple
                    disabled={disabled}
                    error={error}
                />
            ) : (
                <VStack gap="space-16">
                    {showLabelOnMobile && (
                        <HStack justify="space-between" align="center">
                            {label}
                            {tag}
                        </HStack>
                    )}
                    {!showLabelOnMobile && tag && <HStack>{tag}</HStack>}
                    {description && <BodyLong>{description}</BodyLong>}
                    <FileUpload.Trigger
                        accept={allowedFileTypes}
                        maxSizeInBytes={10 * 1024 * 1024}
                        multiple
                        onSelect={onSelect}
                    >
                        <Button
                            className="self-start"
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
