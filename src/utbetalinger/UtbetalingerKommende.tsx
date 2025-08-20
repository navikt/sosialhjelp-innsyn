import { VStack } from "@navikt/ds-react";

import { NyeOgTidligereUtbetalingerResponse } from "@generated/ssr/model";

interface Props {
    nye?: NyeOgTidligereUtbetalingerResponse[];
}

const UtbetalingerKommende = ({ nye }: Props) => {
    return <VStack>{nye?.find((item) => item.ar)}</VStack>;
};

export default UtbetalingerKommende;
