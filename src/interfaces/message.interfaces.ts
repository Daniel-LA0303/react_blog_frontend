
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