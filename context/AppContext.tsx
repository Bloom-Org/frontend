"use client";

import { createContext, useState } from "react";
import { Dispatch, SetStateAction } from "react";

export interface AppState {
    isTransitioning: boolean;
}

export interface AppContextInterface {
    state: AppState;
    setState: Dispatch<SetStateAction<AppState>>;
}

const AppContext = createContext<AppContextInterface>({state: {} as AppState, setState: () => {}});

export default function AppProvider({
    children
}: {
    children: React.ReactNode
}) {
    const [appState, setAppState] = useState<AppState>({isTransitioning: false});

    return (
        <AppContext.Provider value={{state: appState, setState: setAppState}}>
            {children}
        </AppContext.Provider>
    );
};

export { AppContext };