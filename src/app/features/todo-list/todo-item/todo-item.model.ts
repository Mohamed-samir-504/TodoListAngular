export interface todoItem {
    id: string;
    title: string;
    description: string;
    status: 'todo' | 'completed';
    priority: boolean;
}