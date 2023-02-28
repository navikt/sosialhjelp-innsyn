import React from "react";

const initialState = {
    overMaksStorrelse: false,
};

export type DokumentasjonEtterspurtState = typeof initialState;

type Action =
    | {type: "overMaksStorrelse"; payload: boolean}
    | {type: "reset"}
    | {type: "dokEtterspurtState"; payload: DokumentasjonEtterspurtState};

const defaultDispatch: React.Dispatch<Action> = () => initialState; // we never actually use this

const Context = React.createContext({
    dokEtterspurtState: initialState,
    dispatchDokEtterspurtState: defaultDispatch,
});

export const useDokumentasjonEtterspurtContext = () => {
    const context = React.useContext(Context);
    if (context === undefined) {
        throw new Error("Kan kun brukes innenfor DokumentasjonEtterspurtProvider");
    }
    return context;
};

function reducer(state: DokumentasjonEtterspurtState, action: Action): DokumentasjonEtterspurtState {
    switch (action.type) {
        case "overMaksStorrelse":
            return {...state, overMaksStorrelse: action.payload};
        case "dokEtterspurtState":
            return {...action.payload};

        default:
            throw new Error();
    }
}

interface Props {
    children: React.ReactNode;
}
export const DokumentasjonEtterspurtProvider = (props: Props) => {
    const [dokEtterspurtState, dispatchDokEtterspurtState] = React.useReducer(reducer, {
        overMaksStorrelse: false,
    });

    return (
        <Context.Provider
            value={{
                dokEtterspurtState,
                dispatchDokEtterspurtState,
            }}
        >
            {props.children}
        </Context.Provider>
    );
};
