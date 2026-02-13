'use client';

import { useState, useEffect, useCallback } from 'react';
import { AppScreen } from "@/screen/screen";
import { ScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { Calendar } from "@/page_components/app/calendar";
import { TaskForm } from "@/page_components/app/task_form";
import { TaskSearch } from "@/page_components/app/task_search";
import { UI_Screen_Fill } from "@/page_components/screen/fill";
import fillStyles from "@/page_components/screen/fill/index.module.css";
import { API } from "@/libs/api/api";
import type { DB_Category, DB_Task } from "@/libs/api/endpoint";
import styles from './screen.module.css';
import { MediaClassName } from '@/libs/client/responsive';
import { MergeClassNames } from '@/libs/CustomAttribute';

type TaskFormData = {
    task_name: string;
    category: string;
    memo: string;
    created_date: string;
};

type Props = AppScreen<ScreenIds> & {
    onSelectDate?: (date: Date) => void;
}

export function Screen_Home({media, backwardLabel, backward, selectScreen, onSelectDate}: Props) {
    // 現在の年月を取得
    const currentDate = new Date();
    const [year, setYear] = useState(currentDate.getFullYear());
    const [month, setMonth] = useState(currentDate.getMonth() + 1);

    // 指定された年月の範囲を計算
    const getMonthRange = (y: number, m: number) => {
        const firstDay = `${y}-${String(m).padStart(2, '0')}-01`;
        const lastDay = new Date(y, m, 0).getDate();
        const lastDayStr = `${y}-${String(m).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`;
        return { firstDay, lastDayStr };
    };

    const { firstDay, lastDayStr } = getMonthRange(year, month);

    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [categories, setCategories] = useState<DB_Category[]>([]);
    const [tasks, setTasks] = useState<DB_Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<DB_Task[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [showSearchPopup, setShowSearchPopup] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchStartDate, setSearchStartDate] = useState(firstDay);
    const [searchEndDate, setSearchEndDate] = useState(lastDayStr);
    const [isManualSearch, setIsManualSearch] = useState(false);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
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

    const handleDateSelect = (date: Date) => {
        setSelectedDate(date);
        if (onSelectDate) {
            onSelectDate(date);
        }
        // 日付をクリックしたら詳細画面に遷移
        selectScreen?.('details');
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
            const result = await API.API_Request_Task_Add({
                name: data.task_name,
                categoryId: categoryId,
                scheduledStartAt: new Date(data.created_date),
            });

            if (result.success) {
                alert('タスクを登録しました');
                // タスクリストを再取得
                fetchInitialData();
            } else {
                alert('タスク登録に失敗しました');
            }
        } catch (error) {
            console.error('タスク登録エラー:', error);
            alert('エラーが発生しました');
        }
    };

    const handleSearchConditionChange = useCallback((query: string, startDate: string, endDate: string) => {
        setSearchQuery(query);
        setSearchStartDate(startDate);
        setSearchEndDate(endDate);
        setIsManualSearch(true); // ユーザーが検索条件を変更したことを記録
    }, []);

    const handleResetSearch = useCallback(() => {
        setIsManualSearch(false); // 手動検索フラグをリセット
    }, []);

    // 月が変更されたときの処理
    useEffect(() => {
        // 手動検索がされていない場合のみ、表示月に合わせて検索条件を更新
        if (!isManualSearch) {
            const { firstDay: newFirstDay, lastDayStr: newLastDayStr } = getMonthRange(year, month);
            setSearchStartDate(newFirstDay);
            setSearchEndDate(newLastDayStr);
        }
    }, [year, month, isManualSearch]);

    // 検索条件に基づいてタスクをフィルタリング
    useEffect(() => {
        // 検索条件が何もない場合は全タスクを表示
        if (!searchQuery && !searchStartDate && !searchEndDate) {
            setFilteredTasks(null);
            return;
        }

        const filtered = tasks.filter(task => {
            const matchesQuery = searchQuery ? task.name.toLowerCase().includes(searchQuery.toLowerCase()) : true;
            
            let matchesDateRange = true;
            if (searchStartDate || searchEndDate) {
                const taskDate = new Date(task.scheduledStartAt);
                taskDate.setHours(0, 0, 0, 0);
                
                if (searchStartDate) {
                    const start = new Date(searchStartDate);
                    start.setHours(0, 0, 0, 0);
                    matchesDateRange = matchesDateRange && taskDate >= start;
                }
                
                if (searchEndDate) {
                    const end = new Date(searchEndDate);
                    end.setHours(23, 59, 59, 999);
                    matchesDateRange = matchesDateRange && taskDate <= end;
                }
            }
            
            return matchesQuery && matchesDateRange;
        });

        setFilteredTasks(filtered);
    }, [searchQuery, searchStartDate, searchEndDate, tasks]);

    // 合計作業時間を計算（ミリ秒単位）
    const calculateTotalWorkTime = (tasksList: DB_Task[]): number => {
        return tasksList.reduce((total, task) => {
            if (task.startedAt && task.endedAt) {
                const startTime = new Date(task.startedAt).getTime();
                const endTime = new Date(task.endedAt).getTime();
                return total + (endTime - startTime);
            }
            return total;
        }, 0);
    };

    // ミリ秒を時間、分、秒に変換
    const formatWorkTime = (milliseconds: number): string => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        
        if (hours > 0) {
            return `${hours}時間 ${minutes}分 ${seconds}秒`;
        } else if (minutes > 0) {
            return `${minutes}分 ${seconds}秒`;
        } else {
            return `${seconds}秒`;
        }
    };

    const handleMonthChange = (newYear: number, newMonth: number) => {
        setYear(newYear);
        setMonth(newMonth);
    };

    // タスクの日付リストを作成（検索結果がある場合はそれを使用、なければ全タスク）
    const displayTasks = filteredTasks !== null ? filteredTasks : tasks;
    const tasksWithDates = displayTasks.map(task => new Date(task.scheduledStartAt));
    const totalWorkTime = calculateTotalWorkTime(displayTasks);
    const hasSearchCondition = searchQuery || searchStartDate || searchEndDate;

    return (
        <>
        <Screen_Frame
            top={
                <div className={styles.header}>
                    <div className={styles.title}>ホーム</div>
                    <button 
                        className={styles.searchButton}
                        onClick={() => setShowSearchPopup(true)}
                        aria-label="タスク検索"
                    >
                        🔍
                    </button>
                </div>
            }
            center={
                <div className={
                    MergeClassNames(
                        styles.homeContainer,
                        MediaClassName(media, {
                            tablet: styles.mobile,
                        })
                    )
                }>
                    <div className={styles.leftPanel}>
                        <Calendar 
                            year={year} 
                            month={month} 
                            selectedDate={selectedDate} 
                            onDateClick={handleDateSelect}
                            onMonthChange={handleMonthChange}
                            tasksWithDates={tasksWithDates}
                        />
                        <div className={styles.searchInfo}>
                            <div className={styles.searchInfoTitle}>検索情報</div>
                            {hasSearchCondition ? (
                                <>
                                    {searchQuery && (
                                        <div className={styles.searchCondition}>
                                            <span className={styles.conditionLabel}>キーワード:</span> {searchQuery}
                                        </div>
                                    )}
                                    {searchStartDate && (
                                        <div className={styles.searchCondition}>
                                            <span className={styles.conditionLabel}>開始日:</span> {searchStartDate}
                                        </div>
                                    )}
                                    {searchEndDate && (
                                        <div className={styles.searchCondition}>
                                            <span className={styles.conditionLabel}>終了日:</span> {searchEndDate}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className={styles.noSearchCondition}>検索条件なし</div>
                            )}
                            <div className={styles.totalWorkTime}>
                                <span className={styles.workTimeLabel}>合計作業時間:</span>
                                <span className={styles.workTimeValue}>{formatWorkTime(totalWorkTime)}</span>
                            </div>
                            <div className={styles.taskCount}>
                                <span className={styles.taskCountLabel}>タスク数:</span>
                                <span className={styles.taskCountValue}>{displayTasks.length}件</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles.rightPanel}>
                        {loading ? (
                            <div className={styles.loading}>読み込み中...</div>
                        ) : (
                            <TaskForm 
                                onSubmit={handleTaskSubmit} 
                                selectedDate={selectedDate}
                                categories={categories}
                            />
                        )}
                    </div>
                </div>
            }
        />
        {
            showSearchPopup && 
            <UI_Screen_Fill className={fillStyles.blurred} onClick={() => setShowSearchPopup(false)}>
                <div className={styles.searchPopup} onClick={(e) => e.stopPropagation()}>
                    <div className={styles.popupHeader}>
                        <h2 className={styles.popupTitle}>タスク検索</h2>
                        <button 
                            className={styles.closeButton}
                            onClick={() => setShowSearchPopup(false)}
                            aria-label="閉じる"
                        >
                            ✕
                        </button>
                    </div>
                    <div className={styles.popupContent}>
                        <TaskSearch 
                            media={media}
                            onSearchConditionChange={handleSearchConditionChange}
                            onReset={handleResetSearch}
                            initialStartDate={firstDay}
                            initialEndDate={lastDayStr}
                        />
                    </div>
                </div>
            </UI_Screen_Fill>
        }
        </>
    );
}