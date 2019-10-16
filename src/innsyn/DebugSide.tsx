import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {InnsynAppState} from "../redux/reduxTypes";
import {hentInnsynsdata} from "../redux/innsynsdata/innsynsDataActions";
import {InnsynsdataSti, InnsynsdataType} from "../redux/innsynsdata/innsynsdataReducer";

interface Props {
    match: {
        params: {
            soknadId: any;
        }
    };
}

const DebugSide: React.FC<Props> = ({match}) => {
    const dispatch = useDispatch();
    const soknadId = match.params.soknadId;

    useEffect(() => {
        const fiksDigisosId: string = soknadId === undefined ? "1234" : soknadId;
        const restDataStier: InnsynsdataSti[] = [
            InnsynsdataSti.SAKSSTATUS,
            InnsynsdataSti.OPPGAVER,
            InnsynsdataSti.SOKNADS_STATUS,
            InnsynsdataSti.HENDELSER,
            InnsynsdataSti.VEDLEGG
        ];
        restDataStier.map((restDataSti: InnsynsdataSti) =>
            dispatch(hentInnsynsdata(fiksDigisosId, restDataSti, true))
        );
    }, [dispatch, soknadId]);

    const innsynsdata: InnsynsdataType = useSelector((state: InnsynAppState) => state.innsynsdata);

    return (
        <>
            <h1>Innsynsdata</h1>
            <p>
                Alle innsynsdata som mottas fra backend:
            </p>
            <pre>{JSON.stringify(innsynsdata, null, 4)}</pre>
        </>
    )
};

export default DebugSide;
