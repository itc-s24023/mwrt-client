
import styles from "./screen_top.module.css";
import { ScreenFrame } from "../_frame/frame";
import { AppScreen } from "../app.type";
import { AppHead } from "@/page_components/app/head";
import { PlainButton } from "@/page_components/form/button";

type Props = AppScreen & React.HTMLAttributes<HTMLDivElement>;

export function Screen_Top({ media, navigate, ...props }: Props) {
    return (
        <ScreenFrame
            {...props}
            
            top={
                <AppHead media={media} back={() => navigate("top")}>
                    トップ画面
                </AppHead>
            }

            center={
                <div>
                    <PlainButton onClick={() => navigate("detail")}>詳細</PlainButton>
                </div>
            }
        />
    )
}