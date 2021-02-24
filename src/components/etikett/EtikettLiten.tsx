import React from "react";
import "./etikettLiten.less";

export const EtikettLiten = (props: {className?: string; children: React.ReactNode}) => (
    <p className={`etikett-liten ${props.className!!}`}>{props.children}</p>
);
