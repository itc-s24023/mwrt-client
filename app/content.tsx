"use client";


import { MediaType, ResponsiveMedia } from "@/libs/client/responsive";
import { ScreenType } from "@/screen/app.type";
import { ScreenDetail } from "@/screen/detail/screen";
import { Screen_Top } from "@/screen/top/screen";
import { ReactNode, useEffect, useState } from "react";

export function Content() {
    const [media, setMedia] = useState<MediaType>("desktop");
    const [screen, setScreen] = useState<keyof typeof ScreenMap>("top");

    useEffect(() => {
        ResponsiveMedia({
            minWidth: 600,
            maxWidth: 1024,
            minHeight: 400,
            maxHeight: 768
        }, "width", (media) => {
            setMedia(media);

        }, (media) => {
            setMedia(media);

        });

    }, []);


    const navigate = (screen: ScreenType) => {
        setScreen(screen);
    }


    const ScreenMap: Record<ScreenType, () => ReactNode> = {
        top: () => <Screen_Top media={media} navigate={navigate} />,
        detail: () => <ScreenDetail media={media} navigate={navigate} />,
    }
    
    
    return (
        ScreenMap[screen]()
    )
}