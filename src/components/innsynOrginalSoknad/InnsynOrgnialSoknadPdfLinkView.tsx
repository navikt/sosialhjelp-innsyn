import * as React from 'react';
import Lenke from "nav-frontend-lenker";

interface Props {
    url?: string
}

const InnsynOrgnialSoknadPdfLinkView: React.FC<Props> = (props: Props) => {

    const {url} = props;

    if (url){
        return (
            <Lenke href={url} />
        )
    }
    return null;
};

export default InnsynOrgnialSoknadPdfLinkView;