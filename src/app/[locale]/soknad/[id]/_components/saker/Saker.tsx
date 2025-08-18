import { hentAlleSaker } from "@generated/saks-oversikt-controller/saks-oversikt-controller";
import { hentSaksStatuser } from "@generated/ssr/saks-status-controller/saks-status-controller";

interface Props {
    id: string;
}

const Saker = async ({ id }: Props) => {
    const saker = await hentSaksStatuser(id);
    saker.map(it => it.saker = hentAlleSaker(it.id));
    return;
};

export default Saker;
