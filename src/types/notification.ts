export type notification = {
    id: string;
    type: string;
    content: string;
    date: Date;
    removeNotification: (id: string) => void;
}

export type notifications = notification[];