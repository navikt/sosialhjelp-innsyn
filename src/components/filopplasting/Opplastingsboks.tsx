"use client";

import { useFlag } from "@featuretoggles/context";
import { browserEnv } from "@config/env";
import OpplastingsboksTus, { Props } from "./OpplastingsboksTus";
import DirectUploadBox from "./direct/DirectUploadBox";

export default function Opplastingsboks(props: Props) {
    const enabled = useFlag("sosialhjelp.innsyn.direkte-ettersendelse").enabled;
    if (enabled && ["dev", "local"].includes(browserEnv.NEXT_PUBLIC_RUNTIME_ENVIRONMENT) && !props.completed) {
        return <DirectUploadBox {...props} />;
    }
    return <OpplastingsboksTus {...props} />;
}
