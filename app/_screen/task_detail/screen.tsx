'use client';

import { useState, useEffect } from 'react';
import { AppScreen } from "@/screen/screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { ScreenIds } from "../screen";
import { TaskTimer } from "@/page_components/app/task_timer";
import { API } from "@/libs/api/api";
import type { DB_Task } from "@/libs/api/endpoint";
import styles from './screen.module.css';

type Props = AppScreen<ScreenIds> & {
    taskId: string | null;
};

export function Screen_TaskDetail({media, backwardLabel, backward, selectScreen, taskId}: Props) {
    const [task, setTask] = useState<DB_Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [showTimer, setShowTimer] = useState(false);

    useEffect(() => {
        if (taskId) {
            fetchTaskDetail(taskId);
        }
    }, [taskId]);

    const fetchTaskDetail = async (id: string) => {
        setLoading(true);
        try {
            const tasksRes = await API.API_Request_Task_List();
            if (tasksRes.success && tasksRes.data) {
                const foundTask = tasksRes.data.find(t => t.id === id);
                setTask(foundTask || null);
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTimerSave = (record: unknown) => {
        console.log('タイマー記録:', record);
        // TODO: タイマー記録の保存処理を実装
    };

    if (loading) {
        return (
            <Screen_Frame
                backwardLabel={backwardLabel}
                backward={backward}
                top={<div className={styles.title}>タスク詳細</div>}
                center={<div className={styles.loading}>読み込み中...</div>}
            />
        );
    }

    if (!task) {
        return (
            <Screen_Frame
                backwardLabel={backwardLabel}
                backward={backward}
                top={<div className={styles.title}>タスク詳細</div>}
                center={<div className={styles.emptyState}>タスクが見つかりません</div>}
            />
        );
    }

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div className={styles.title}>タスク詳細</div>
            }
            center={
                <div className={styles.detailContainer}>
                    <div className={styles.taskInfo}>
                        <div className={styles.section}>
                            <h2 className={styles.taskTitle}>{task.name}</h2>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.label}>カテゴリ</div>
                            <div className={styles.categoryBadge}>
                                {task.category.name}
                            </div>
                        </div>

                        <div className={styles.section}>
                            <div className={styles.label}>予定日時</div>
                            <div className={styles.value}>
                                {new Date(task.scheduledStartAt).toLocaleString('ja-JP', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </div>
                        </div>



                        <div className={styles.timerSection}>
                            <button 
                                className={styles.timerButton}
                                onClick={() => setShowTimer(!showTimer)}
                            >
                                {showTimer ? 'タイマーを閉じる' : 'タイマーを開始'}
                            </button>
                        </div>

                        {showTimer && (
                            <div className={styles.timerWrapper}>
                                <TaskTimer onSave={handleTimerSave} />
                            </div>
                        )}
                    </div>
                </div>
            }
        />
    );
}
