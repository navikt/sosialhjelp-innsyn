import Image from "next/image";

interface Props {
    url: string;
    filename: string;
}

const ImgPreview = ({ url, filename }: Props) => {
    return (
        <div className="relative inset-0 flex flex-col w-fit mx-auto grow shrink">
            <Image alt={filename} src={url} />
        </div>
    );
};

export default ImgPreview;
