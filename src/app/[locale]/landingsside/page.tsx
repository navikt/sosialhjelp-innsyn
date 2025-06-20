import { notFound } from "next/navigation";
import { Bleed, Button, Heading, Show, Stack, VStack } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";
import { PencilIcon } from "@navikt/aksel-icons";
import Link from "next/link";

import OkonomiskSosialhjelpIcon from "../../../components/ikoner/OkonomiskSosialhjelp";
import { getFlag, getToggles } from "../../../featuretoggles/unleash";
import Snarveier from "../../../components/snarveier/Snarveier";
import NyttigInformasjon from "../../../components/nyttigInformasjon/NyttigInformasjon";
import { getServerEnv } from "../../../config/env";
import AktiveSoknader from "../../../components/aktiveSoknader/AktiveSoknader";

const Page = async () => {
    const toggle = getFlag("sosialhjelp.innsyn.ny_landingsside", await getToggles());
    const t = await getTranslations("Landingsside");
    if (!toggle.enabled) {
        return notFound();
    }
    return (
        <VStack gap="20" className="mt-20">
            <Bleed marginInline={{ lg: "24" }} asChild>
                <Stack
                    gap="4"
                    direction={{ sm: "row-reverse", lg: "row" }}
                    justify={{ sm: "space-between", lg: "start" }}
                    wrap={false}
                >
                    <Show above="sm">
                        <OkonomiskSosialhjelpIcon className="mr-4" />
                    </Show>
                    <Heading size="xlarge" level="1">
                        {t("tittel")}
                    </Heading>
                </Stack>
            </Bleed>
            <AktiveSoknader />
            <Snarveier />
            <Button
                as={Link}
                href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad`}
                variant="secondary"
                icon={<PencilIcon />}
                className="self-start"
            >
                {t("sokOmSosialhjelp")}
            </Button>
            <NyttigInformasjon />
        </VStack>
    );
};

export default Page;
