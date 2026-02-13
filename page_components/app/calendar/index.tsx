'use client';

import styles from './index.module.css';

type CalendarProps = {
    year: number;
    month: number;
};

export function Calendar({ year, month }: CalendarProps) {
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
    
    return (
        <div className={styles.calendar}>
            <div className={styles.header}>
                {year}年{month}月
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
                            <div key={dayIndex} className={styles.day}>
                                {day || ''}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
