'use client';

import { useState } from 'react';
import { PlainForm } from '@/page_components/form/plain_form';
import { UI_Button } from '@/page_components/form/button/button';
import styles from './index.module.css';

type TaskFormData = {
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type TaskFormProps = {
    onSubmit?: (data: TaskFormData) => void;
};


export function TaskForm({ onSubmit }: TaskFormProps) {
    const [taskName, setTaskName] = useState('');
    const [category, setCategory] = useState<string>('仕事');
    const [memo, setMemo] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        const formData: TaskFormData = {
            task_name: taskName,
            category: category,
            memo: memo,
            created_date: new Date().toISOString(),
        };

        if (onSubmit) {
            onSubmit(formData);
        }

        // フォームをリセット
        setTaskName('');
        setCategory('仕事');
        setMemo('');
    };

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
                        <option value="仕事">仕事</option>
                        <option value="会議">会議</option>
                        <option value="メール">メール</option>
                        <option value="調査">調査</option>
                        <option value="その他">その他</option>
                    </select>
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
