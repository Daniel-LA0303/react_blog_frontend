export interface ProfilePictureI{
    secure_url: string;
    public_id: string;
}

export interface MemberConversationI{
    _id: string;
    name: string;
    email: string;
    profilePicture: ProfilePictureI;
}

export interface ConversationI{
    groupName?: string;
    createdBy?: any;
    _id: string;
    members: MemberConversationI[];
    isGroup: boolean;
    createdAt: string;
}

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