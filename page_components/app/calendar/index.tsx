'use client';

import { useState } from 'react';
import styles from './index.module.css';

type CalendarProps = {
    year: number;
    month: number;
    selectedDate?: Date | null;
    onDateClick?: (date: Date) => void;
    onMonthChange?: (year: number, month: number) => void;
    tasksWithDates?: Date[];
};

export function Calendar({ year, month, selectedDate, onDateClick, onMonthChange, tasksWithDates = [] }: CalendarProps) {
    const [touchStart, setTouchStart] = useState<number | null>(null);
    const [touchEnd, setTouchEnd] = useState<number | null>(null);

    // スワイプの最小距離（50px）
    const minSwipeDistance = 50;

    // 月の最初の日と最終日を取得
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    
    // 月の最初の日の曜日（0: 日曜日）
    const firstDayOfWeek = firstDay.getDay();
    
    // 月の日数
    const daysInMonth = lastDay.getDate();
    
    // カレンダーの日付配列を作成
    const days = [];
    
    // 最初の週の空白
    for (let i = 0; i < firstDayOfWeek; i++) {
        days.push(null);
    }
    
    // 日付を追加
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }
    
    // 週ごとにグループ化
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
        weeks.push(days.slice(i, i + 7));
    }

    const handleDayClick = (day: number | null) => {
        if (day && onDateClick) {
            const clickedDate = new Date(year, month - 1, day);
            onDateClick(clickedDate);
        }
    };

    const isSelected = (day: number | null) => {
        if (!day || !selectedDate) return false;
        const dayDate = new Date(year, month - 1, day);
        return dayDate.toDateString() === selectedDate.toDateString();
    };

    const hasTask = (day: number | null) => {
        if (!day) return false;
        const dayDate = new Date(year, month - 1, day);
        return tasksWithDates.some(taskDate => {
            const td = new Date(taskDate);
            return td.getFullYear() === dayDate.getFullYear() &&
                   td.getMonth() === dayDate.getMonth() &&
                   td.getDate() === dayDate.getDate();
        });
    };

    const handlePrevMonth = () => {
        if (!onMonthChange) return;
        if (month === 1) {
            onMonthChange(year - 1, 12);
        } else {
            onMonthChange(year, month - 1);
        }
    };

    const handleNextMonth = () => {
        if (!onMonthChange) return;
        if (month === 12) {
            onMonthChange(year + 1, 1);
        } else {
            onMonthChange(year, month + 1);
        }
    };

    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;
        
        if (isLeftSwipe) {
            handleNextMonth();
        }
        if (isRightSwipe) {
            handlePrevMonth();
        }
    };
    
    return (
        <div 
            className={styles.calendar}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            <div className={styles.header}>
                <button 
                    className={styles.navButton}
                    onClick={handlePrevMonth}
                    aria-label="前月"
                >
                    ‹
                </button>
                <div className={styles.yearMonth}>
                    {year}年{month}月
                </div>
                <button 
                    className={styles.navButton}
                    onClick={handleNextMonth}
                    aria-label="次月"
                >
                    ›
                </button>
            </div>
            <div className={styles.weekdays}>
                <div className={styles.weekday}>日</div>
                <div className={styles.weekday}>月</div>
                <div className={styles.weekday}>火</div>
                <div className={styles.weekday}>水</div>
                <div className={styles.weekday}>木</div>
                <div className={styles.weekday}>金</div>
                <div className={styles.weekday}>土</div>
            </div>
            <div className={styles.weeks}>
                {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className={styles.week}>
                        {week.map((day, dayIndex) => (
                            <div 
                                key={dayIndex} 
                                className={`${styles.day} ${isSelected(day) ? styles.selected : ''} ${hasTask(day) ? styles.hasTask : ''}`}
                                onClick={() => handleDayClick(day)}
                            >
                                {day || ''}
                                {hasTask(day) && <span className={styles.taskDot}>●</span>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
