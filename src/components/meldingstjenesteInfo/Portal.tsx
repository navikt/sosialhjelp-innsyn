import React from "react";
import ReactDOM from "react-dom";

interface PortalProps {
    className?: string;
    children: React.ReactNode;
}
export const Portal: React.FC<PortalProps> = ({children, className}: PortalProps) => {
    const container = React.useRef(document.createElement("div"));
    if (className) container.current.classList.add(className);

    React.useEffect(() => {
        const child = container.current;
        document.getElementById("maincontent")?.appendChild(child);
        return () => {
            document.getElementById("maincontent")?.removeChild(child);
        };
    }, []);

    return ReactDOM.createPortal(children, container.current);
};
