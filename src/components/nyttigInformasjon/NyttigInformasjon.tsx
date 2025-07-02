import { Box, Heading, Link, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getServerEnv } from "../../config/env";

const NyttigInformasjon = async () => {
    const t = await getTranslations("NyttigInformasjon");
    return (
        <Box>
            <VStack gap="4">
                <Heading size="medium" level="2">
                    {t("tittel")}
                </Heading>
                <Link href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/okonomisk-sosialhjelp#melde`}>
                    {t("endringer")}
                </Link>
                <Link href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/okonomisk-sosialhjelp#klage`}>
                    {t("klagerettigheter")}
                </Link>
                <Link href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/personopplysninger-sosialhjelp`}>
                    {t("personopplysninger")}
                </Link>
            </VStack>
        </Box>
    );
};

export default NyttigInformasjon;
