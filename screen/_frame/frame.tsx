import { MergeAttributes } from "@/libs/CustomAttribute";

import styles from "./frame.module.css";
import { ReactNode } from "react";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    top?: ReactNode;
    center?: ReactNode;
    bottom?: ReactNode;
};

export function ScreenFrame({ top, center, bottom, ...props }: Props) {
    return (
        <div {...MergeAttributes(props, {
            className: styles.container
        })}>
            {
                top &&
                <div className={styles.top}>{top}</div>
            }
            <div className={styles.center}>{center}</div>
            {
                bottom &&
                <div className={styles.bottom}>{bottom}</div>
            }
        </div>
    )
}