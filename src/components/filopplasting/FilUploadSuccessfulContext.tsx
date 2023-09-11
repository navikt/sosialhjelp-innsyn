import React, {createContext, Dispatch, PropsWithChildren, SetStateAction, useContext, useState} from "react";

interface boolskType {
    uploadSuccess: boolean;
    setUploadSuccessful: Dispatch<SetStateAction<boolean>>;
}
const initState: boolskType = {uploadSuccess: false, setUploadSuccessful: () => false};

export const FilUploadSuccessfulContext = createContext(initState);

export const useFilUploadSuccessful = () => useContext(FilUploadSuccessfulContext);

export const FilUploadSuccesfulProvider = (props: PropsWithChildren<{}>) => {
    const [uploadSuccess, setUploadSuccessful] = useState<boolean>(false);
    return (
        <FilUploadSuccessfulContext.Provider value={{uploadSuccess, setUploadSuccessful}}>
            {props.children}
        </FilUploadSuccessfulContext.Provider>
    );
};
