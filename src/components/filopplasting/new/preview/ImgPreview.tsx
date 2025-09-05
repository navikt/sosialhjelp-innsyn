interface Props {
    url: string;
}

const ImgPreview = ({ url }: Props) => {
    return (
        <div className="relative inset-0 flex flex-col w-fit mx-auto grow shrink">
            <img src={url}></img>
        </div>
    );
};

export default ImgPreview;
