import SoknadCardSkeleton from "./soknadCard/SoknadCardSkeleton";

interface Props {
    count: number;
}

const AktiveSoknaderListSkeleton = ({ count }: Props) => {
    return Array(count).map((i) => <SoknadCardSkeleton key={i} />);
};

export default AktiveSoknaderListSkeleton;
