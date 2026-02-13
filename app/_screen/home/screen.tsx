'use client';

import { useState } from 'react';
import { AppScreen } from "@/screen/screen";
import { ScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { Calendar } from "@/page_components/app/calendar";
import { TaskForm } from "@/page_components/app/task_form";
import { TaskTimer } from "@/page_components/app/task_timer";
import { TaskSearch } from "@/page_components/app/task_search";
import styles from './screen.module.css';

type Task = {
    id: number;
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type Props = AppScreen<ScreenIds>

export function Screen_Home({backwardLabel, backward}: Props) {
    // 現在の年月を取得（2000年代の例として2024年を使用）
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // タスクリストの状態管理
    const [tasks, setTasks] = useState<Task[]>([]);

    const handleTaskSubmit = (data: any) => {
        console.log('タスク登録:', data);
        // 新しいタスクを追加
        const newTask: Task = {
            id: Date.now(),
            task_name: data.task_name,
            category: data.category,
            memo: data.memo,
            created_date: data.created_date,
        };
        setTasks([newTask, ...tasks]);
    };

    const handleTimerSave = (record: unknown) => {
        console.log('タイマー記録:', record);
        // TODO: データベースへの保存処理を実装
    };

    const handleSelectTask = (task: Task) => {
        console.log('選択されたタスク:', task);
        // TODO: タスク詳細表示や編集機能を実装
    };

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem' }}>
                    ホーム
                </div>
            }
            center={
                <div className={styles.homeContainer}>
                    <div className={styles.leftPanel}>
                        <Calendar year={year} month={month} />
                        <TaskSearch tasks={tasks} onSelectTask={handleSelectTask} />
                    </div>
                    <div className={styles.rightPanel}>
                        <TaskForm onSubmit={handleTaskSubmit} />
                        <TaskTimer onSave={handleTimerSave} />
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