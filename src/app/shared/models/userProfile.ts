export interface UserProfile {
    data : ProfileDetails | undefined;
}

export interface ProfileDetails{
    _id:string | undefined;
    phoneNumber: string | undefined;
    role: string | undefined;
    verificationAttempts: number | undefined;
    isBlocked: boolean | undefined;
    isActive: boolean | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    __v: number | undefined;
}