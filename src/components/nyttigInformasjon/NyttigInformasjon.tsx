import { Box, Heading, Link, VStack } from "@navikt/ds-react";
import { useTranslations } from "next-intl";

const NyttigInformasjon = () => {
    const t = useTranslations("NyttigInformasjon");
    return (
        <Box>
            <VStack gap="4">
                <Heading size="medium" level="2">
                    {t("tittel")}
                </Heading>
                <Link>{t("endringer")}</Link>
                <Link>{t("klagerettigheter")}</Link>
                <Link>{t("personopplysninger")}</Link>
            </VStack>
        </Box>
    );
};

export default NyttigInformasjon;
