"use client";

import { MediaType, ResponsiveMedia } from "@/libs/client/responsive";
import { Controll_APP_Loading } from "@/page_components/app/controll_loading";
import { ScreenMap } from "@/screen/screen";
import { useEffect, useState } from "react";
import { Screen_Home } from "./home/screen";
import { Screen_Details } from "./details/screen";

export type ScreenIds = "home" | "details";

export function Screen() {
    const [media, setMedia] = useState<MediaType>("desktop");
    const [screen, setScreen] = useState<ScreenIds>("home");

    const { element: loadingElement, controller: { show, hide } } = Controll_APP_Loading({});

    useEffect(() => {
        ResponsiveMedia({
            minWidth:  600,
            maxWidth: 1280,
            minHeight:  400,
            maxHeight:  768,
        }, "width", (media) => {
            setMedia(media);
            console.log("Showing loading screen");
            hide(true);

        }, (media) => {
            setMedia(media);

        });
    }, []);

    const Screens: ScreenMap<ScreenIds> = {
        "home":    () => <Screen_Home media={media} selectScreen={setScreen} backward={() => setScreen("home")}/>,
        "details": () => <Screen_Details data={undefined} media={media} selectScreen={setScreen} backward={() => setScreen("home")}/>,
    }
    
    
    return (
        <>
            {loadingElement}
            {Screens[screen]()}
        </>
    )
}