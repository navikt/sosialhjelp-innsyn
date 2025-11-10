import { BodyShort, Heading, HStack, Tag, VStack } from "@navikt/ds-react";
import { getTranslations, getFormatter } from "next-intl/server";
import { CalendarIcon } from "@navikt/aksel-icons";

import DigisosLinkCard from "@components/statusCard/DigisosLinkCard";
import { ManedUtbetalingStatus } from "@generated/model";

import { getKommendeUtbetalinger } from "../../_utils/getKommendeUtbetalinger";

const VisKommendeUtbetalinger = async () => {
    const t = await getTranslations("VisKommendeUtbetalinger");
    const format = await getFormatter();
    const kommendeUtbetalinger = await getKommendeUtbetalinger();

    const alleKommende = kommendeUtbetalinger
        .flatMap((gruppe) => gruppe.utbetalingerForManed)
        .filter(
            (utbetaling) =>
                utbetaling.status === ManedUtbetalingStatus.PLANLAGT_UTBETALING ||
                (utbetaling.forfallsdato && new Date(utbetaling.forfallsdato) > new Date())
        );

    alleKommende.sort((a, b) => {
        if (!a.forfallsdato && !b.forfallsdato) return 0;
        if (!a.forfallsdato) return 1;
        if (!b.forfallsdato) return -1;

        return new Date(a.forfallsdato).getTime() - new Date(b.forfallsdato).getTime();
    });

    if (alleKommende.length === 0) {
        return null;
    }

    return (
        <VStack gap="2">
            <Heading size="medium" level="2">
                {t("tittel")}
            </Heading>
            <VStack gap="4">
                {alleKommende.map((utbetaling) => {
                    const amount = format.number(utbetaling.belop);

                    return (
                        <DigisosLinkCard
                            key={utbetaling.referanse}
                            href="/utbetalinger"
                            description={
                                <>
                                    <strong>{utbetaling.tittel}</strong>
                                    {utbetaling.utbetalingsdato && (
                                        <>
                                            <br />
                                            <Tag variant="info-moderate" className="mt-2">
                                                <HStack gap="2" align="center">
                                                    <CalendarIcon aria-hidden fontSize="1.5rem" />
                                                    <BodyShort size="small" className="whitespace-nowrap">
                                                        {t("utbetales")}{" "}
                                                        {format.dateTime(new Date(utbetaling.utbetalingsdato), {
                                                            day: "numeric",
                                                            month: "long",
                                                            year: "numeric",
                                                        })}
                                                    </BodyShort>
                                                </HStack>
                                            </Tag>
                                        </>
                                    )}
                                </>
                            }
                        >
                            {t("beskrivelse", { amount })}
                        </DigisosLinkCard>
                    );
                })}
            </VStack>
        </VStack>
    );
};

export default VisKommendeUtbetalinger;
