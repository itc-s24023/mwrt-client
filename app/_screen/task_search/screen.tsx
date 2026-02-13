'use client';

import { useState, useEffect } from 'react';
import { AppScreen } from "@/screen/screen";
import { ScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { TaskSearch } from "@/page_components/app/task_search";
import { API } from "@/libs/api/api";
import type { DB_Task } from "@/libs/api/endpoint";
import styles from './screen.module.css';

type Props = AppScreen<ScreenIds>

export function Screen_TaskSearch({backwardLabel, backward}: Props) {
    const [tasks, setTasks] = useState<DB_Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const tasksRes = await API.API_Request_Task_List();
            if (tasksRes.success && tasksRes.data) {
                setTasks(tasksRes.data);
            }
        } catch (error) {
            console.error('タスク取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTask = (task: DB_Task) => {
        console.log('選択されたタスク:', task);
        // TODO: タスク詳細画面への遷移
    };

    if (loading) {
        return (
            <Screen_Frame
                backwardLabel={backwardLabel}
                backward={backward}
                top={<div className={styles.title}>タスク検索</div>}
                center={<div className={styles.loading}>読み込み中...</div>}
            />
        );
    }

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div className={styles.title}>タスク検索</div>
            }
            center={
                <div className={styles.container}>
                    <TaskSearch tasks={tasks} onSelectTask={handleSelectTask} />
                </div>
            }
        />
    );
}
