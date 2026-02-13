'use client';

import { useState, useEffect, useRef } from 'react';
import type { MediaType } from '@/libs/client/responsive';
import { MediaClassName } from '@/libs/client/responsive';
import { MergeClassNames } from '@/libs/CustomAttribute';
import styles from './index.module.css';

type TaskSearchProps = {
    media: MediaType;
    onSearchConditionChange?: (searchQuery: string, startDate: string, endDate: string) => void;
    onReset?: () => void;
    initialStartDate?: string;
    initialEndDate?: string;
};

export function TaskSearch({ media, onSearchConditionChange, onReset, initialStartDate = '', initialEndDate = '' }: TaskSearchProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(initialEndDate);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const startDateInputRef = useRef<HTMLInputElement>(null);
    const endDateInputRef = useRef<HTMLInputElement>(null);

    // マウント時に検索入力にフォーカス
    useEffect(() => {
        searchInputRef.current?.focus();
    }, []);

    // 検索条件が変更されたら親に通知
    useEffect(() => {
        // 検索条件を親に通知
        onSearchConditionChange?.(searchQuery, startDate, endDate);
    }, [searchQuery, startDate, endDate, onSearchConditionChange]);

    return (
        <div className={
            MergeClassNames(
                styles.taskSearchContainer,
                MediaClassName(media, {
                    tablet: styles.mobile,
                })
            )
        }>
            <h3 className={styles.title}>タスク検索</h3>
            <div className={styles.searchBox}>
                <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="タスク名で検索..."
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
            <div className={styles.dateRangeBox}>
                <div className={styles.dateInput} >
                    <label className={styles.dateLabel}>開始日</label>
                    <input
                        ref={startDateInputRef}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className={styles.dateField}
                        onClick={(e) => e.currentTarget.showPicker?.()}
                    />
                </div>
                <div className={styles.dateInput} >
                    <label className={styles.dateLabel}>終了日</label>
                    <input
                        ref={endDateInputRef}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className={styles.dateField}
                        onClick={(e) => e.currentTarget.showPicker?.()}
                    />
                </div>
                {(startDate || endDate || searchQuery) && (
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setStartDate(initialStartDate);
                            setEndDate(initialEndDate);
                            onReset?.();
                        }}
                        className={styles.clearDateButton}
                    >
                        クリア
                    </button>
                )}
            </div>
        </div>
    );
}
