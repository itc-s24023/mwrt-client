'use client';

import { useState, useEffect } from 'react';
import { AppScreen } from "@/screen/screen";
import { ScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { TaskForm } from "@/page_components/app/task_form";
import { API } from "@/libs/api/api";
import type { DB_Category } from "@/libs/api/endpoint";
import styles from './screen.module.css';

type TaskFormData = {
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type Props = AppScreen<ScreenIds>

export function Screen_TaskRegister({backwardLabel, backward, selectScreen}: Props) {
    const [categories, setCategories] = useState<DB_Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const categoriesRes = await API.API_Request_Category_List();
            if (categoriesRes.success && categoriesRes.data) {
                setCategories(categoriesRes.data);
            }
        } catch (error) {
            console.error('カテゴリ取得エラー:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskSubmit = async (data: TaskFormData) => {
        console.log('タスク登録:', data);
        
        const category = categories.find(cat => cat.name === data.category);
        const categoryId = category?.id || categories[0]?.id;

        if (!categoryId) {
            console.error('カテゴリが見つかりません');
            return;
        }

        try {
            const result = await API.API_Request_Task_Create({
                title: data.task_name,
                category: categoryId,
            });

            if (result.success) {
                console.log('タスク登録成功:', result.data);
                alert('タスクを登録しました');
                // ホーム画面に戻る
                selectScreen('home');
            } else {
                console.error('タスク登録失敗:', result.error);
                alert('タスク登録に失敗しました');
            }
        } catch (error) {
            console.error('タスク登録エラー:', error);
            alert('エラーが発生しました');
        }
    };

    if (loading) {
        return (
            <Screen_Frame
                backwardLabel={backwardLabel}
                backward={backward}
                top={<div className={styles.title}>タスク登録</div>}
                center={<div className={styles.loading}>読み込み中...</div>}
            />
        );
    }

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div className={styles.title}>タスク登録</div>
            }
            center={
                <div className={styles.container}>
                    <TaskForm onSubmit={handleTaskSubmit} categories={categories} />
                </div>
            }
        />
    );
}
