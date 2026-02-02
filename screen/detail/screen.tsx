import { MergeAttributes } from "@/libs/CustomAttribute";
import { ScreenFrame } from "../_frame/frame";
import { AppScreen } from "../app.type";


import styles from "./screen.module.css";
import { AppHead } from "@/page_components/app/head";


type Props = AppScreen & React.HTMLAttributes<HTMLDivElement>;


export function ScreenDetail({ media, navigate, ...props }: Props) {
    return (
        <ScreenFrame
            {...props}

            top={
                <AppHead media={media} back={() => navigate("top")}>
                    詳細画面
                </AppHead>
            }
        />
    )
}