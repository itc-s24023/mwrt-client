"use client";


export type MediaSize = {
    minWidth: number;
    maxWidth: number;
    minHeight: number;
    maxHeight: number;
}


export type MediaType = "mobile" | "tablet" | "desktop";

type MediaSwitchType = "width" | "height" | "both";



/**
 * 画面サイズを監視し、指定されたサイズに応じてコールバックを呼び出す
 * @param size 
 * メディアサイズの条件
 * @param switchType
 * サイズの切り替え条件（幅、高さ、両方）\
 * 両方に設定した場合、縦横の中間点を基準に切り替えを行う
 * @param init 
 * @param onChange 
 */
export function ResponsiveMedia(size: MediaSize, switchType: MediaSwitchType, init: (media: MediaType) => void, onChange: (media: MediaType) => void) {
    const check = (): MediaType => {
        const width = window.innerWidth;
        const height = window.innerHeight;

        const media_w: MediaType = width < size.minWidth ? "mobile" : width > size.maxWidth ? "desktop" : "tablet";
        const media_h: MediaType = height < size.minHeight ? "mobile" : height > size.maxHeight ? "desktop" : "tablet";

        if (switchType === "width") {
            return media_w;

        } else if (switchType === "height") {
            return media_h;

        } else {
            //両方の場合、中間点を計算
            const mid_w = (size.minWidth + size.maxWidth) / 2;
            const mid_h = (size.minHeight + size.maxHeight) / 2;

            //それぞれの中間点からの距離を計算
            const dist_w = Math.abs(mid_w - width);
            const dist_h = Math.abs(mid_h - height);

            //近い方を採用
            return dist_w < dist_h ? media_w : media_h;
            
        }
    }

    init(check());

    window.addEventListener("resize", (ev) => {
        onChange(check());
    });
}



export function MediaStyle(type: MediaType, style: {[key in MediaType]?: React.CSSProperties}): React.CSSProperties {
    const desktop = style.desktop ?? {};
    const tablet = style.tablet ?? desktop;
    const mobile = style.mobile ?? tablet;
    return {
        mobile,
        tablet,
        desktop
    }[type]
}


export function MediaClassName(type: MediaType, className: {[key in MediaType]?: string}): string {
    const desktop = className.desktop ?? "";
    const tablet = className.tablet ?? desktop;
    const mobile = className.mobile ?? tablet;
    return {
        mobile,
        tablet,
        desktop
    }[type]
}