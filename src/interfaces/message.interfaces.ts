
export interface ProfilePictureI {
    public_id: string;
    secure_url: string;
}

export interface SenderI{
    email: string;
    name: string;
    profilePicture: ProfilePictureI;
    _id: string;
}

export interface NewMessageFromSocketI {
    conversationId: string;
    createdAt: string;
    message: string;
    read: false;
    receiverId: string;
    senderId: SenderI;
    updatedAt: string;
    _id: string;
}