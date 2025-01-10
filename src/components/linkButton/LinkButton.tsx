import React, { PropsWithChildren } from "react";
import { Link } from "@navikt/ds-react";

import styles from "./LinkButton.module.css";

interface Props {
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    className?: string;
}

const LinkButton = ({ onClick, className, children }: PropsWithChildren<Props>): React.JSX.Element => {
    return (
        <Link className={styles.linkButton + ` ${className}`} as="button" onClick={onClick}>
            {children}
        </Link>
    );
};

export default LinkButton;
