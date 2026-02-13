'use client';

import { AppScreen } from "@/screen/screen";
import { ScreenIds } from "../screen";
import { Screen_Frame } from "@/screen/screen_frame";
import { TaskTimer } from "@/page_components/app/task_timer";
import styles from './screen.module.css';

type Props = AppScreen<ScreenIds>

type TimerRecord = {
    start_time: string;
    end_time: string;
    duration_seconds: number;
};

export function Screen_Timer({backwardLabel, backward}: Props) {
    const handleTimerSave = async (record: TimerRecord) => {
        console.log('タイマー記録:', record);
        // TODO: データベースへの保存処理を実装
        alert(`作業時間: ${Math.floor(record.duration_seconds / 60)}分${record.duration_seconds % 60}秒`);
    };

    return (
        <Screen_Frame
            backwardLabel={backwardLabel}
            backward={backward}
            top={
                <div className={styles.title}>タイマー</div>
            }
            center={
                <div className={styles.container}>
                    <TaskTimer onSave={handleTimerSave} />
                </div>
            }
        />
    );
}
