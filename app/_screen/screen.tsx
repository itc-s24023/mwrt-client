"use client";

import { MediaType, ResponsiveMedia } from "@/libs/client/responsive";
import { Controll_APP_Loading } from "@/page_components/app/controll_loading";
import { ScreenMap } from "@/screen/screen";
import { useEffect, useState } from "react";
import { Screen_Home } from "./home/screen";
import { Screen_Details } from "./details/screen";
import { Screen_TaskRegister } from "./task_register/screen";
import { Screen_Timer } from "./timer/screen";
import { Screen_TaskSearch } from "./task_search/screen";
import { Screen_TaskDetail } from "./task_detail/screen";

export type ScreenIds = "home" | "details" | "task_register" | "timer" | "task_search" | "task_detail";

export function Screen() {
    const [media, setMedia] = useState<MediaType>("desktop");
    const [screen, setScreen] = useState<ScreenIds>("home");
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

    const { element: loadingElement, controller: { hide } } = Controll_APP_Loading({});

    useEffect(() => {
        ResponsiveMedia({
            minWidth:  600,
            maxWidth: 1200,
            minHeight:  400,
            maxHeight:  800,
        }, "width", (media) => {
            setMedia(media);
            console.log("Showing loading screen");
            hide(true);

        }, (media) => {
            setMedia(media);

        });
    }, [hide]);

    const Screens: ScreenMap<ScreenIds> = {
        "home":    () => <Screen_Home 
            media={media} 
            selectScreen={setScreen} 
            backward={() => setScreen("home")}
            onSelectDate={setSelectedDate}
        />,
        "details": () => <Screen_Details 
            data={selectedDate} 
            media={media} 
            selectScreen={setScreen} 
            backward={() => setScreen("home")}
            onSelectTask={(taskId) => {
                setSelectedTaskId(taskId);
                setScreen("task_detail");
            }}
        />,
        "task_register": () => <Screen_TaskRegister
            media={media}
            selectScreen={setScreen}
            backward={() => setScreen("home")}
        />,
        "timer": () => <Screen_Timer
            media={media}
            selectScreen={setScreen}
            backward={() => setScreen("home")}
        />,
        "task_search": () => <Screen_TaskSearch
            media={media}
            selectScreen={setScreen}
            backward={() => setScreen("home")}
        />,
        "task_detail": () => <Screen_TaskDetail
            taskId={selectedTaskId}
            media={media}
            selectScreen={setScreen}
            backward={() => setScreen("details")}
        />,
    }
    
    
    return (
        <>
            {loadingElement}
            {Screens[screen]()}
        </>
    )
}