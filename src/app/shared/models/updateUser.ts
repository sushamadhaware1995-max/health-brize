import { AddUserAddress } from "./addUser";

export class updateUserData {
    name: string | undefined;
    email: string | undefined;
    dateOfBirth: string | undefined;
    role: string | undefined;
    address: AddUserAddress | undefined;
    isBlocked?: boolean | undefined;
}
