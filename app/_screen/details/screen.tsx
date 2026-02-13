'use client';

import { useState, useEffect } from 'react';
import { AppScreen } from "@/screen/screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { ScreenIds } from "../screen";
import { TaskCard } from "@/page_components/app/taskCard";
import { API } from "@/libs/api/api";
import type { DB_Task } from "@/libs/api/endpoint";
import styles from './screen.module.css';

type Props = AppScreen<ScreenIds> & {
    data: Date | null;
    onSelectTask?: (taskId: string) => void;
};

export function Screen_Details({media, backwardLabel, backward, selectScreen, data, onSelectTask}: Props) {
    const [tasks, setTasks] = useState<DB_Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            fetchTasksForDate(data);
        }
    }, [data]);

    const fetchTasksForDate = async (date: Date) => {
        setLoading(true);
        try {
            const tasksRes = await API.API_Request_Task_List();
            if (tasksRes.success && tasksRes.data) {
                // 選択された日付のタスクをフィルタリング
                const filteredTasks = tasksRes.data.filter(task => {
                    const taskDate = new Date(task.scheduledStartAt);
                    return taskDate.toDateString() === date.toDateString();
                });
                setTasks(filteredTasks);
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectTask = (task: DB_Task) => {
        console.log('選択されたタスク:', task);
        onSelectTask?.(task.id);
    };

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem' }}>
                    {data ? data.toLocaleDateString('ja-JP', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                    }) : '詳細'}の詳細
                </div>
            }
            center={
                <div className={styles.detailsContainer}>
                    <div className={styles.mainSection}>
                        <h2 className={styles.title}>
                            タスク一覧 ({tasks.length}件)
                        </h2>
                        
                        <div className={styles.taskList}>
                            {loading ? (
                                <div className={styles.emptyState}>読み込み中...</div>
                            ) : tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TaskCard
                                        key={task.id}
                                        data={task}
                                        onClick={() => handleSelectTask(task)}
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))
                            ) : (
                                <div className={styles.emptyState}>この日のタスクはありません</div>
                            )}
                        </div>
                    </div>
                </div>
            }
            bottom={
                <>
                </>
            }
        />
    )
}