import React, {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState} from "react";

interface boolskType {
    oppgaverUploadSuccess: boolean;
    setOppgaverUploadSuccess: Dispatch<SetStateAction<boolean>>;
    ettersendelseUploadSuccess: boolean;
    setEttersendelseUploadSuccess: Dispatch<SetStateAction<boolean>>;
}
const initState: boolskType = {
    oppgaverUploadSuccess: false,
    setOppgaverUploadSuccess: () => false,
    ettersendelseUploadSuccess: false,
    setEttersendelseUploadSuccess: () => false,
};

export const FilUploadSuccessfulContext = createContext(initState);

export const useFilUploadSuccessful = () => useContext(FilUploadSuccessfulContext);

export const FilUploadSuccesfulProvider = (props: PropsWithChildren<{}>) => {
    const [oppgaverUploadSuccess, setOppgaverUploadSuccess] = useState<boolean>(false);
    const [ettersendelseUploadSuccess, setEttersendelseUploadSuccess] = useState<boolean>(false);
    return (
        <FilUploadSuccessfulContext.Provider
            value={{
                oppgaverUploadSuccess,
                setOppgaverUploadSuccess,
                ettersendelseUploadSuccess,
                setEttersendelseUploadSuccess,
            }}
        >
            {props.children}
        </FilUploadSuccessfulContext.Provider>
    );
};
