export type AppController = {
    navigate(screen: ScreenType): void;

}

export type AppScreen = AppController & {
    media: MediaType;
}


export type ScreenType = "top" | "detail";