"use client"

import styles from "./pageLoader.module.css";
import { useContext, useEffect, useState } from "react";
import { AppContextInterface, AppContext } from "@/context/AppContext";
import { usePathname } from "next/navigation";

export default function PageLoader() {
    const pathname = usePathname();
    const { state, setState } : AppContextInterface = useContext(AppContext);
    const [isExitingTransition, setIsExitingTransition] = useState(false);
    const [appLoaded, setAppLoaded] = useState(false);
    useEffect(() => {
        if (appLoaded) {
            setState({...state, isTransitioning: false});
            setIsExitingTransition(true);
            setTimeout(() => {
                setIsExitingTransition(false);
            }, 250);
        } else {
            setAppLoaded(true);
        }
    }, [pathname]);
    if (state.isTransitioning) {
        return (
            <div className={styles.pageLoaderContainer}>
                <div className={styles.progressBar}>
                    <div className={styles.progressBarValue}></div>
                </div>
            </div>
        );
    } else if (isExitingTransition) {
            return (
                <div className={styles.pageLoaderContainer}>
                    <div className={styles.progressBar} style={{transform: "translateX(0%)", animation: "none"}}>
                        <div className={styles.progressBarValue}></div>
                    </div>
                </div>
            );
    } else {
        return null;
    }
}