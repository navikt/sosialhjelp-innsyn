import React from "react";
import "./layoutKomponenter.css";

const OverskriftBoks: React.FC<{children: any}> = ({children}) => (
    <div className="layout_overskriftboks">{children}</div>
);

const AvsnittBoks: React.FC<{children: any}> = ({children}) => <div className="layout_avsnittboks">{children}</div>;

export {OverskriftBoks, AvsnittBoks};
