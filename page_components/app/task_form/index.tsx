'use client';

import { useState, useEffect, useMemo } from 'react';
import { PlainForm } from '@/page_components/form/plain_form';
import { UI_Button } from '@/page_components/form/button/button';
import type { DB_Category } from '@/libs/api/endpoint';
import styles from './index.module.css';

type TaskFormData = {
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type TaskFormProps = {
    onSubmit?: (data: TaskFormData) => void;
    selectedDate?: Date | null;
    categories?: DB_Category[];
};

const DEFAULT_CATEGORIES = ['仕事', '会議', 'メール', '調査', 'その他'];

export function TaskForm({ onSubmit, selectedDate, categories }: TaskFormProps) {
    // 日付の計算をuseMemoで行う
    const calculatedDate = useMemo(() => {
        const date = selectedDate || new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }, [selectedDate]);

    // カテゴリの初期値をuseMemoで計算
    const initialCategory = useMemo(() => {
        if (categories && categories.length > 0) {
            return categories[0].name;
        }
        return DEFAULT_CATEGORIES[0];
    }, [categories]);

    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState<string>(initialCategory);
    const [memo, setMemo] = useState('');
    const [taskDate, setTaskDate] = useState(calculatedDate);

    // selectedDateが変更されたら、taskDateを更新
    useEffect(() => {
        setTaskDate(calculatedDate);
    }, [calculatedDate]);

    // カテゴリが変更されたら更新
    useEffect(() => {
        if (initialCategory && !category) {
            setCategory(initialCategory);
        }
    }, [initialCategory, category]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        // taskDateをISOStringに変換
        const selectedDateTime = new Date(taskDate);
        
        const formData: TaskFormData = {
            task_name: taskName,
            category: category,
            memo: memo,
            created_date: selectedDateTime.toISOString(),
        };

        if (onSubmit) {
            onSubmit(formData);
        }

        // フォームをリセット
        setTaskName('');
        if (categories && categories.length > 0) {
            setCategory(categories[0].name);
        } else {
            setCategory(DEFAULT_CATEGORIES[0]);
        }
        setMemo('');
        // 日付は選択された日付を維持（selectedDateがあればそのまま、なければ今日の日付にリセット）
        if (!selectedDate) {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            setTaskDate(`${year}-${month}-${day}`);
        }
    };

    // 表示用のカテゴリリストを取得
    const displayCategories = categories && categories.length > 0 
        ? categories.map(cat => cat.name)
        : DEFAULT_CATEGORIES;

    return (
        <div className={styles.taskFormContainer}>
            <h2 className={styles.title}>M-1. タスク登録フォーム</h2>
            <PlainForm onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="task_name" className={styles.label}>
                        プロジェクト名 <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        id="task_name"
                        value={taskName}
                        onChange={(e) => setTaskName(e.target.value)}
                        maxLength={100}
                        required
                        className={styles.input}
                        placeholder="プロジェクト名を入力"
                    />
                    <span className={styles.charCount}>{taskName.length}/100</span>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="category" className={styles.label}>
                        カテゴリ（タグ）
                    </label>
                    <select 
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={styles.select}
                    >
                        {displayCategories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="task_date" className={styles.label}>
                        予定日 <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="date"
                        id="task_date"
                        value={taskDate}
                        onChange={(e) => setTaskDate(e.target.value)}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="memo" className={styles.label}>
                        メモ
                    </label>
                    <textarea
                        id="memo"
                        value={memo}
                        onChange={(e) => setMemo(e.target.value)}
                        maxLength={500}
                        className={styles.textarea}
                        placeholder="メモを入力（任意）"
                        rows={5}
                    />
                    <span className={styles.charCount}>{memo.length}/500</span>
                </div>

                <div className={styles.buttonGroup}>
                    <UI_Button type="submit" size="medium">
                        登録
                    </UI_Button>
                </div>
            </PlainForm>
        </div>
    );
}
