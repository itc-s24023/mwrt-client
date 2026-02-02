import { MergeAttributes, MergeClassNames } from "@/libs/CustomAttribute";
import styles from "./index.module.css";
import { SizeType } from "@/type";

type Options = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: SizeType;
}


export function PlainButton({ size="medium", ...props }: Options) {
    return (
        <button
            {...MergeAttributes(props, {
                className: MergeClassNames(styles.button, styles[size])
            })}
        />
    )
}
