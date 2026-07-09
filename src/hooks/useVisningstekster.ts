import { useTranslations } from "next-intl";
import { originalSoknadVedleggTekstVisning } from "../redux/soknadsdata/vedleggskravVisningConfig";
import { OriginalSoknadVedleggType } from "../redux/soknadsdata/vedleggTypes";

export const useVisningstekster = () => {
    const t = useTranslations("VedleggskravVisning");

    return (type: string, tilleggsinfo: string | undefined) => {
        const sammensattType = type + "|" + tilleggsinfo;
        const erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some(
            (val) => val === sammensattType
        );

        let typeTekst = type;
        let tilleggsinfoTekst = tilleggsinfo;
        if (erOriginalSoknadVedleggType) {
            const soknadVedleggSpec = originalSoknadVedleggTekstVisning.find((spc) => spc.type === sammensattType)!;
            typeTekst = t(soknadVedleggSpec.tittel as Parameters<typeof t>[0]);
            tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo
                ? t(soknadVedleggSpec.tilleggsinfo as Parameters<typeof t>[0])
                : "";
        }

        return { typeTekst, tilleggsinfoTekst };
    };
};
