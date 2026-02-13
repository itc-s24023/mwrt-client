'use client';

import { useState } from 'react';
import { DB_Task, DB_Memo_ID, DB_Task_ID, DB_Category, DB_Category_ID } from "@/libs/api/_db"
import styles from "./index.module.css"
import { MergeAttributes } from "@/libs/CustomAttribute";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    data: DB_Task<true>;
    categories?: DB_Category[];
    onMemoUpdate?: (memoId: DB_Memo_ID, newContent: string) => Promise<void>;
    onMemoAdd?: (taskId: DB_Task_ID, content: string) => Promise<void>;
    onTaskUpdate?: (taskId: DB_Task_ID, name: string, categoryId: DB_Category_ID) => Promise<void>;
    onDelete?: (taskId: DB_Task_ID) => void;
}

export function TaskDetailCard({ data, categories, onMemoUpdate, onMemoAdd, onTaskUpdate, onDelete, ...props }: Props) {
    const [editingMemoId, setEditingMemoId] = useState<DB_Memo_ID | null>(null);
    const [editContent, setEditContent] = useState<string>('');
    const [saving, setSaving] = useState(false);
    
    // メモ追加用の状態
    const [isAddingMemo, setIsAddingMemo] = useState(false);
    const [newMemoContent, setNewMemoContent] = useState('');
    
    // タスク情報編集用の状態
    const [isEditingTask, setIsEditingTask] = useState(false);
    const [editTaskName, setEditTaskName] = useState(data.name);
    const [editCategoryId, setEditCategoryId] = useState<DB_Category_ID>(data.category.id);
    const [savingTask, setSavingTask] = useState(false);

    const handleEditClick = (memoId: DB_Memo_ID, currentContent: string) => {
        setEditingMemoId(memoId);
        setEditContent(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingMemoId(null);
        setEditContent('');
    };

    const handleSave = async (memoId: DB_Memo_ID) => {
        if (!onMemoUpdate) {
            console.log('メモ更新:', memoId, editContent);
            // TODO: APIが実装されたら呼び出す
            setEditingMemoId(null);
            return;
        }

        setSaving(true);
        try {
            await onMemoUpdate(memoId, editContent);
            setEditingMemoId(null);
        } catch (error) {
            console.error('メモ更新エラー:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = () => {
        if (confirm(`「${data.name}」を削除しますか？この操作は取り消せません。`)) {
            onDelete?.(data.id);
        }
    };
    
    const handleTaskEditClick = () => {
        setIsEditingTask(true);
        setEditTaskName(data.name);
        setEditCategoryId(data.category.id);
    };
    
    const handleCancelTaskEdit = () => {
        setIsEditingTask(false);
        setEditTaskName(data.name);
        setEditCategoryId(data.category.id);
    };
    
    const handleTaskSave = async () => {
        if (!onTaskUpdate) {
            console.log('タスク更新:', editTaskName, editCategoryId);
            setIsEditingTask(false);
            return;
        }
        
        setSavingTask(true);
        try {
            await onTaskUpdate(data.id, editTaskName, editCategoryId);
            setIsEditingTask(false);
        } catch (error) {
            console.error('タスク更新エラー:', error);
        } finally {
            setSavingTask(false);
        }
    };
    
    const handleAddMemoClick = () => {
        setIsAddingMemo(true);
        setNewMemoContent('');
    };
    
    const handleCancelAddMemo = () => {
        setIsAddingMemo(false);
        setNewMemoContent('');
    };
    
    const handleSaveNewMemo = async () => {
        if (!onMemoAdd || !newMemoContent.trim()) {
            console.log('メモ追加:', newMemoContent);
            setIsAddingMemo(false);
            return;
        }
        
        setSaving(true);
        try {
            await onMemoAdd(data.id, newMemoContent);
            setIsAddingMemo(false);
            setNewMemoContent('');
        } catch (error) {
            console.error('メモ追加エラー:', error);
        } finally {
            setSaving(false);
        }
    };

    console.log(data);
    return (
        <div {...MergeAttributes(props, {
            className: styles.container
        })}>
            <div className={styles.header}>
                {isEditingTask ? (
                    <div className={styles.taskEditMode}>
                        <input
                            type="text"
                            className={styles.taskNameInput}
                            value={editTaskName}
                            onChange={(e) => setEditTaskName(e.target.value)}
                            disabled={savingTask}
                            placeholder="タスク名"
                        />
                        <div className={styles.editButtons}>
                            <button
                                className={styles.saveButton}
                                onClick={handleTaskSave}
                                disabled={savingTask || !editTaskName.trim()}
                            >
                                {savingTask ? '保存中...' : '保存'}
                            </button>
                            <button
                                className={styles.cancelButton}
                                onClick={handleCancelTaskEdit}
                                disabled={savingTask}
                            >
                                キャンセル
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className={styles.taskHeader}>
                        <h3 className={styles.taskName}>{data.name}</h3>
                        <div className={styles.headerButtons}>
                            {onTaskUpdate && categories && (
                                <button className={styles.editTaskButton} onClick={handleTaskEditClick}>
                                    編集
                                </button>
                            )}
                            {onDelete && (
                                <button className={styles.deleteButton} onClick={handleDelete}>
                                    削除
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
            
            <div className={styles.taskInfo}>
                {isEditingTask ? (
                    <p className={styles.category}>
                        <span className={styles.label}>カテゴリ:</span>
                        <select
                            className={styles.categorySelect}
                            value={editCategoryId}
                            onChange={(e) => setEditCategoryId(e.target.value as DB_Category_ID)}
                            disabled={savingTask}
                        >
                            {categories?.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </p>
                ) : (
                    <p className={styles.category}>
                        <span className={styles.label}>カテゴリ:</span>
                        {data.category.name}
                    </p>
                )}
                <p>
                    <span className={styles.label}>予定開始:</span>
                    {data.scheduledStartAt.toLocaleString('ja-JP')}
                </p>
                {data.startedAt && (
                    <p>
                        <span className={styles.label}>実際の開始:</span>
                        {data.startedAt.toLocaleString('ja-JP')}
                    </p>
                )}
                {data.endedAt && (
                    <p>
                        <span className={styles.label}>終了:</span>
                        {data.endedAt.toLocaleString('ja-JP')}
                    </p>
                )}
                <p>
                    <span className={styles.label}>作成日:</span>
                    {data.createdAt.toLocaleString('ja-JP')}
                </p>
                <p>
                    <span className={styles.label}>更新日:</span>
                    {data.updatedAt.toLocaleString('ja-JP')}
                </p>
            </div>

            <div className={styles.memosSection}>
                <div className={styles.memosSectionHeader}>
                    <h4 className={styles.memosTitle}>メモ ({data.memos.length}件)</h4>
                    {onMemoAdd && !isAddingMemo && (
                        <button className={styles.addMemoButton} onClick={handleAddMemoClick}>
                            + 追加
                        </button>
                    )}
                </div>
                
                {isAddingMemo && (
                    <div className={styles.memoItem}>
                        <div className={styles.editMode}>
                            <textarea
                                className={styles.memoTextarea}
                                value={newMemoContent}
                                onChange={(e) => setNewMemoContent(e.target.value)}
                                placeholder="新しいメモを入力..."
                                rows={5}
                                disabled={saving}
                                autoFocus
                            />
                            <div className={styles.editButtons}>
                                <button
                                    className={styles.saveButton}
                                    onClick={handleSaveNewMemo}
                                    disabled={saving || !newMemoContent.trim()}
                                >
                                    {saving ? '保存中...' : '保存'}
                                </button>
                                <button
                                    className={styles.cancelButton}
                                    onClick={handleCancelAddMemo}
                                    disabled={saving}
                                >
                                    キャンセル
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {data.memos.length > 0 ? (
                    <div className={styles.memosList}>
                        {data.memos.map((memo) => (
                            <div key={memo.id} className={styles.memoItem}>
                                {editingMemoId === memo.id ? (
                                    // 編集モード
                                    <div className={styles.editMode}>
                                        <textarea
                                            className={styles.memoTextarea}
                                            value={editContent}
                                            onChange={(e) => setEditContent(e.target.value)}
                                            rows={5}
                                            disabled={saving}
                                        />
                                        <div className={styles.editButtons}>
                                            <button
                                                className={styles.saveButton}
                                                onClick={() => handleSave(memo.id)}
                                                disabled={saving}
                                            >
                                                {saving ? '保存中...' : '保存'}
                                            </button>
                                            <button
                                                className={styles.cancelButton}
                                                onClick={handleCancelEdit}
                                                disabled={saving}
                                            >
                                                キャンセル
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    // 表示モード
                                    <>
                                        <div className={styles.memoHeader}>
                                            <div className={styles.memoMeta}>
                                                作成: {memo.createdAt.toLocaleString('ja-JP')}
                                                {memo.updatedAt.getTime() !== memo.createdAt.getTime() && 
                                                    ` (更新: ${memo.updatedAt.toLocaleString('ja-JP')})`
                                                }
                                            </div>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => handleEditClick(memo.id, memo.content)}
                                            >
                                                編集
                                            </button>
                                        </div>
                                        <p className={styles.memoContent}>{memo.content}</p>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    !isAddingMemo && <p className={styles.noMemos}>メモはありません</p>
                )}
            </div>
        </div>
    )
}