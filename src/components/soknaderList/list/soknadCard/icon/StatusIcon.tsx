import { ElementType } from "react";


interface Props {
    icon: ElementType;
}

interface CommonProps {
    height?: string | number;
    width?: string | number;
}

const commonProps: CommonProps = {
    width: "32px",
    height: "32px",
};

const StatusIcon = ({ icon: Icon }: Props) => {
    return <Icon {...commonProps} />;
};

export default StatusIcon;
