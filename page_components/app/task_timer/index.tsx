'use client';

import { useState } from 'react';
import { Timer } from '@/page_components/app/timer';
import styles from './index.module.css';

type TimerRecord = {
    start_time: string;
    end_time: string;
    duration_seconds: number;
};

type TaskTimerProps = {
    onSave?: (record: TimerRecord) => void;
};

export function TaskTimer({ onSave }: TaskTimerProps) {
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [isRunning, setIsRunning] = useState(false);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const handleStart = () => {
        const now = new Date();
        setStartTime(now);
        setIsRunning(true);
        console.log('タイマー開始:', now.toISOString());
    };

    const handleStop = (timeMs: number) => {
        const endTime = new Date();
        const durationSeconds = Math.floor(timeMs / 1000);
        
        if (startTime) {
            const record: TimerRecord = {
                start_time: startTime.toISOString(),
                end_time: endTime.toISOString(),
                duration_seconds: durationSeconds,
            };

            console.log('タイマー停止:', record);
            
            if (onSave) {
                onSave(record);
            }
        }

        setIsRunning(false);
        setStartTime(null);
    };

    return (
        <div className={styles.taskTimerContainer}>
            <h2 className={styles.title}>M-2. タイマー機能</h2>
            <div className={styles.timerWrapper}>
                <Timer
                    custom={{
                        customTimeFormat: formatTime,
                        onStart: handleStart,
                        onStop: handleStop,
                    }}
                />
            </div>
            <div className={styles.info}>
                {isRunning && startTime && (
                    <div className={styles.startInfo}>
                        開始時刻: {startTime.toLocaleString('ja-JP')}
                    </div>
                )}
            </div>
        </div>
    );
}
