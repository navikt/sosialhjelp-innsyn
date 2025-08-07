import { originalSoknadVedleggTekstVisning } from "src/redux/soknadsdata/vedleggskravVisningConfig";
import { OriginalSoknadVedleggType } from "src/redux/soknadsdata/vedleggTypes";

export const getVisningstekster = (type: string, tilleggsinfo: string | undefined) => {
    const sammensattType = type + "|" + tilleggsinfo;
    const erOriginalSoknadVedleggType = Object.values(OriginalSoknadVedleggType).some((val) => val === sammensattType);

    let typeTekst = type;
    let tilleggsinfoTekst = tilleggsinfo;
    if (erOriginalSoknadVedleggType) {
        const soknadVedleggSpec = originalSoknadVedleggTekstVisning.find((spc) => spc.type === sammensattType)!;
        typeTekst = soknadVedleggSpec.tittel;
        tilleggsinfoTekst = soknadVedleggSpec.tilleggsinfo;
    }

    return { typeTekst, tilleggsinfoTekst };
};
