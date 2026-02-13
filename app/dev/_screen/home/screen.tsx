import { AppScreen, ScreenMap } from "@/screen/screen";
import { DevScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { DB_Task, DB_Task_ID } from "@/libs/api/_db";
import { useState } from "react";
import { API } from "@/libs/api/api";
import { TaskCard } from "@/page_components/app/taskCard";
import { TaskDetailCard } from "@/page_components/app/taskDetailCard";

type Props = AppScreen<DevScreenIds> & {
    data: DB_Task[];
}

export function Screen_Dev_Home({media, backwardLabel, backward, data, ...props}: Props) {

    const [task, setTask] = useState<DB_Task<true> | null>(null);








    
    

    const screenContent = task ? (
        <TaskDetailCard data={task} />
    ) : (
        data.map( (task) => (
            <TaskCard key={task.id} data={task} onClick={async () => {
                const res = await API.API_Request_Task_Detail(task.id);
                if (res.success && res.data) setTask(res.data);
            }}/>
        ))
    );


    

    return (
        <Screen_Frame
            root={true}
        
            backwardLabel={backwardLabel}
            backward={task ? () => setTask(null) : backward}
            top={
                <>
                </>
            }
            
            center={
                screenContent
            }
            
        />
    )
}