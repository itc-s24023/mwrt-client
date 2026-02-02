import { MediaClassName, MediaType } from "@/libs/client/responsive";
import { MergeAttributes, MergeClassNames } from "@/libs/CustomAttribute";


import styles from "./index.module.css";
import { PlainButton } from "@/page_components/form/button";

type Props = React.HTMLAttributes<HTMLDivElement> & {
    media: MediaType;
    back?: () => void;
}

export function AppHead({ media, back, children, ...props }: Props) {
    return (
        <div {...MergeAttributes(props, {
            className: MediaClassName(media, {
                desktop: styles.container,
                tablet: MergeClassNames(styles.container, styles.tablet),
            })
        })}>
            {
                back && <PlainButton onClick={back}>
                    戻る
                </PlainButton>
            }
            <div className={styles.content}>
                {children}
            </div>
        </div>
    )
}