export interface windowItem {
    title: string;
    url: string;
    screenshot: string;
}

export interface ipcItem extends Partial<windowItem> {
    success: boolean;
}