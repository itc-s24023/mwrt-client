import { DB_Task, DB_Task_ID } from "@/libs/api/_db"
import styles from "./index.module.css"
import { MergeAttributes } from "@/libs/CustomAttribute";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    data: DB_Task;
    onDelete?: (taskId: DB_Task_ID) => void;
}

export function TaskCard({ data, onDelete, ...props }: Props) {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // カードのクリックイベントを伝播させない
        if (confirm(`「${data.name}」を削除しますか？この操作は取り消せません。`)) {
            onDelete?.(data.id);
        }
    };
    
    console.log(data);
    return (
        <div {...MergeAttributes(props, {
            className: styles.container
        })}>
            <div className={styles.header}>
                <h3 className={styles.taskName}>{data.name}</h3>
                {onDelete && (
                    <button 
                        className={styles.deleteButton} 
                        onClick={handleDelete}
                        title="削除"
                    >
                        削除
                    </button>
                )}
            </div>
            <div className={styles.taskInfo}>
                <p className={styles.category}>
                    <span className={styles.label}>カテゴリ:</span> {data.category.name}
                </p>
                <p className={styles.date}>
                    <span className={styles.label}>予定開始:</span> {data.scheduledStartAt.toLocaleString('ja-JP')}
                </p>
                {data.startedAt && (
                    <p className={styles.date}>
                        <span className={styles.label}>実際の開始:</span> {data.startedAt.toLocaleString('ja-JP')}
                    </p>
                )}
                {data.endedAt && (
                    <p className={styles.date}>
                        <span className={styles.label}>終了:</span> {data.endedAt.toLocaleString('ja-JP')}
                    </p>
                )}
                <p className={styles.date}>
                    <span className={styles.label}>作成日:</span> {data.createdAt.toLocaleString('ja-JP')}
                </p>
            </div>
        </div>
    )
}