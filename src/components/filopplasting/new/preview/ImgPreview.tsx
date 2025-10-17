import Image from "next/image";

interface Props {
    url: string;
    filename: string;
}

const ImgPreview = ({ url, filename }: Props) => (
    <div className="relative inset-0 flex flex-col w-fit mx-auto grow shrink">
        <Image alt={filename} src={url} width={800} height={800} />
    </div>
);

export default ImgPreview;
