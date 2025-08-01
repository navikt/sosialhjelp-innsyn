import Link from "next/link";
import { PencilIcon } from "@navikt/aksel-icons";
import { Button } from "@navikt/ds-react";
import { getTranslations } from "next-intl/server";

import { getServerEnv } from "@config/env";

const SokButton = async () => {
    const t = await getTranslations("SokButton");
    return (
        <Button
            as={Link}
            href={`${getServerEnv().NEXT_PUBLIC_INNSYN_ORIGIN}/sosialhjelp/soknad`}
            variant="secondary"
            icon={<PencilIcon />}
            className="self-start"
        >
            {t("sokOmSosialhjelp")}
        </Button>
    );
};

export default SokButton;
