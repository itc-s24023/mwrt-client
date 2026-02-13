"use client";


import { ScreenMap } from "@/screen/screen";
import { Screen_Dev_Home } from "./home/screen";
import { useEffect, useState } from "react";
import { MediaType } from "@/libs/client/responsive";
import { DB_Task } from "@/libs/api/_db";
import { API } from "@/libs/api/api";

export type DevScreenIds = "home";


export function Screen_Dev() {

    const [screen, setScreen] = useState<DevScreenIds>("home");
    const [media, setMedia] = useState<MediaType>("desktop");


    const [tasks, setTasks] = useState<DB_Task[]>([]);



    useEffect(() => {
        API.API_Request_Task_List().then( (data) => {
            if (data.success) {
                setTasks(data.data ?? []);
            }
        } );
    }, [])




    const screenMap: ScreenMap<DevScreenIds> = {
        "home": () =>  <Screen_Dev_Home media={media} data={tasks} root={true} />
    }
    
    
    
    
    
    return (
        <>
            {screenMap[screen]()}
        </>
    );
}