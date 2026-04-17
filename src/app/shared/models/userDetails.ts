export class Address{
    city:  string | undefined;
    state:  string | undefined;
    country:  string | undefined;
    pincode:  string | undefined;
    address:  string | undefined;
    _id: string | undefined;
}

export class UserData {
    _id: string | undefined;
    phoneNumber: string | undefined;
    role: string | undefined;
    verificationAttempts: number | undefined;
    isBlocked: boolean | undefined;
    isActive: boolean | undefined;
    createdAt: string | undefined;
    updatedAt: string | undefined;
    __v: number | undefined;
    dateOfBirth:  string | undefined;
    email:  string | undefined;
    name: string | undefined;
    address: Address | undefined;
}
export class UserDetails{
    token: string | undefined;
    data: UserData | undefined;
}

export class UserList {
    total: number | undefined;
    data : UserData[] | undefined;
}

// export class UserListData {
//     _id: string | undefined;
//     phoneNumber: string | undefined;
//     role: string | undefined;
//     verificationAttempts: number | undefined;
//     isBlocked:boolean | undefined;
//     isActive: boolean | undefined;
//     createdAt: string | undefined;
//     updatedAt: string | undefined;
//     __v: number | undefined;
// }

export class UpdateUserData {
    data : UserData | undefined;
}