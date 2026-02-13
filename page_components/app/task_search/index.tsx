'use client';

import { useState } from 'react';
import styles from './index.module.css';

type Task = {
    id: number;
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type TaskSearchProps = {
    tasks: Task[];
    onSelectTask?: (task: Task) => void;
};

export function TaskSearch({ tasks, onSelectTask }: TaskSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredTasks = tasks.filter(task =>
        task.task_name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={styles.taskSearchContainer}>
            <h3 className={styles.title}>タスク検索</h3>
            <div className={styles.searchBox}>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="プロジェクト名で検索..."
                    className={styles.searchInput}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        className={styles.clearButton}
                    >
                        ✕
                    </button>
                )}
            </div>
            <div className={styles.resultCount}>
                {filteredTasks.length}件のタスク
            </div>
            <div className={styles.taskList}>
                {filteredTasks.length > 0 ? (
                    filteredTasks.map((task) => (
                        <div
                            key={task.id}
                            className={styles.taskItem}
                            onClick={() => onSelectTask?.(task)}
                        >
                            <div className={styles.taskName}>{task.task_name}</div>
                            <div className={styles.taskMeta}>
                                <span className={styles.category}>{task.category}</span>
                                <span className={styles.date}>
                                    {new Date(task.created_date).toLocaleDateString('ja-JP')}
                                </span>
                            </div>
                            {task.memo && (
                                <div className={styles.taskMemo}>{task.memo}</div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className={styles.emptyState}>
                        {searchQuery ? '検索結果がありません' : 'タスクがありません'}
                    </div>
                )}
            </div>
        </div>
    );
}
