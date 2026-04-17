export class AddUserAddress{
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    pincode: string | undefined;
    address: string | undefined;
}

export class AddUserData {
    name: string | undefined;
    email: string | undefined;
    dateOfBirth: string | undefined;
    role: string | undefined;
    phoneNumber: string | undefined;
    address: AddUserAddress | undefined;
    isBlocked: boolean | undefined;
}