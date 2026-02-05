import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@navikt/aksel-icons";
import { Button, HStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

interface Props {
    numPages: number | undefined;
    pageNumber: number;
    setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}

const PageFlipperButtons = ({ numPages, pageNumber, setPageNumber }: Props) => {
    const t = useTranslations("PageFlipperButtons");
    if (numPages === undefined) return null;

    const navigate = (direction: "next" | "prev") => {
        if (direction === "next") {
            if (pageNumber < numPages) setPageNumber((prev) => prev + 1);
        } else {
            if (pageNumber > 1) setPageNumber((prev) => prev - 1);
        }
    };

    return (
        <HStack justify="end" gap="4">
            <Button
                icon={<ChevronLeftIcon aria-hidden />}
                onClick={() => navigate("prev")}
                disabled={pageNumber === 0}
                aria-label={t("forrige")}
            />
            <Button
                icon={<ChevronRightIcon aria-hidden />}
                onClick={() => navigate("next")}
                disabled={pageNumber === numPages}
                aria-label={t("neste")}
            />
        </HStack>
    );
};
export default PageFlipperButtons;
