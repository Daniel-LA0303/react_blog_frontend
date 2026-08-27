export type NotificationType = 'LIKE_POST' | 'COMMENT_POST' | 'MESSAGE' | 'NOTE' | string

export interface Sender {
    _id: string
    name: string
    profilePicture: { public_id: string; secure_url: string }
}

export interface NotificationI {
    _id: string
    message: string
    type: NotificationType
    isRead: boolean
    createdAt: string
    entityId: string
    senderId: Sender
}