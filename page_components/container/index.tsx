import { MergeAttributes } from "@/libs/CustomAttribute";
import styles from "./index.module.css";


export function CenteredContainer(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...MergeAttributes({className: styles.centeredContainer}, props)}></div>
    )
}


export function SideContainer(props: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div {...MergeAttributes({className: styles.sideContainer}, props)}></div>
    )
}