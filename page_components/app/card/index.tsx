'use client';

import type { DB_Task } from '@/libs/api/endpoint';
import { MergeAttributes } from '@/libs/CustomAttribute';
import styles from './index.module.css';

type Props = React.HTMLAttributes<HTMLDivElement> & {
    task: DB_Task;
};

export function TaskCard({ task, ...props }: Props) {
    const getStatusDisplay = () => {
        if (task.endedAt) {
            return <span className={`${styles.status} ${styles.completed}`}>完了</span>;
        }
        if (task.startedAt) {
            return <span className={`${styles.status} ${styles.inProgress}`}>進行中</span>;
        }
        return <span className={`${styles.status} ${styles.pending}`}>未開始</span>;
    };

    return (
        <div {...MergeAttributes(props, {
            className: styles.container
        })}>
            <div className={styles.header}>
                <h3 className={styles.taskName}>{task.name}</h3>
            </div>
            <div className={styles.taskInfo}>
                <p className={styles.category}>
                    <span className={styles.label}>カテゴリ:</span> {task.category.name}
                </p>
                <p className={styles.date}>
                    <span className={styles.label}>予定開始:</span>{' '}
                    {new Date(task.scheduledStartAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </p>
                {task.startedAt && (
                    <p className={styles.date}>
                        <span className={styles.label}>実際の開始:</span>{' '}
                        {new Date(task.startedAt).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                )}
                {task.endedAt && (
                    <p className={styles.date}>
                        <span className={styles.label}>終了:</span>{' '}
                        {new Date(task.endedAt).toLocaleString('ja-JP', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                )}
                {getStatusDisplay()}
            </div>
        </div>
    );
}