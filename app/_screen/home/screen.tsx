'use client';

import { useState, useEffect } from 'react';
import { AppScreen } from "@/screen/screen";
import { ScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { Calendar } from "@/page_components/app/calendar";
import { TaskForm } from "@/page_components/app/task_form";
import { TaskTimer } from "@/page_components/app/task_timer";
import { TaskSearch } from "@/page_components/app/task_search";
import { API } from "@/libs/api/api";
import type { DB_Task, DB_Category, DB_Category_ID } from "@/libs/api/endpoint";
import styles from './screen.module.css';

// TaskSearchとTaskFormで使用される型（API型との変換用）
type LegacyTask = {
    id: number;
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

// TaskFormから渡されるデータの型
type TaskFormData = {
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type Props = AppScreen<ScreenIds>

export function Screen_Home({backwardLabel, backward}: Props) {
    // 現在の年月を取得
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    // タスクリストとカテゴリの状態管理
    const [tasks, setTasks] = useState<DB_Task[]>([]);
    const [categories, setCategories] = useState<DB_Category[]>([]);
    const [loading, setLoading] = useState(true);

    // 初回データ取得
    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            // カテゴリとタスクを並行取得
            const [categoriesRes, tasksRes] = await Promise.all([
                API.API_Request_Category_List(),
                API.API_Request_Task_List()
            ]);

            if (categoriesRes.success && categoriesRes.data) {
                setCategories(categoriesRes.data);
            }

            if (tasksRes.success && tasksRes.data) {
                setTasks(tasksRes.data);
            }
        } catch (error) {
            console.error('データ取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskSubmit = async (data: TaskFormData) => {
        console.log('タスク登録:', data);
        
        // カテゴリ名からカテゴリIDを取得
        const category = categories.find(cat => cat.name === data.category);
        const categoryId = category?.id || categories[0]?.id;

        if (!categoryId) {
            console.error('カテゴリが見つかりません');
            return;
        }

        // APIでタスクを追加
        const result = await API.API_Request_Task_Add({
            name: data.task_name,
            categoryId: categoryId as DB_Category_ID,
            scheduledStartAt: new Date(data.created_date)
        });

        if (result.success && result.data) {
            // 新しいタスクをリストの先頭に追加
            setTasks([result.data, ...tasks]);
        } else {
            console.error('タスク追加に失敗しました');
        }
    };

    const handleTimerSave = (record: unknown) => {
        console.log('タイマー記録:', record);
        // TODO: タイマー記録の保存処理を実装
    };

    const handleSelectTask = (task: LegacyTask) => {
        console.log('選択されたタスク:', task);
        // TODO: タスク詳細表示や編集機能を実装
    };

    // API型をLegacy型に変換（TaskSearchコンポーネント用）
    const convertToLegacyTasks = (apiTasks: DB_Task[]): LegacyTask[] => {
        return apiTasks.map(task => ({
            id: parseInt(task.id as string), // stringからnumberに変換
            task_name: task.name,
            category: task.category.name,
            memo: '', // メモは別途取得が必要
            created_date: task.createdAt.toISOString()
        }));
    };

    const legacyTasks = convertToLegacyTasks(tasks);

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem' }}>
                    ホーム {loading && <span style={{ fontSize: '0.9rem', color: '#666' }}>読み込み中...</span>}
                </div>
            }
            center={
                <div className={styles.homeContainer}>
                    <div className={styles.leftPanel}>
                        <Calendar year={year} month={month} />
                        <TaskSearch tasks={legacyTasks} onSelectTask={handleSelectTask} />
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