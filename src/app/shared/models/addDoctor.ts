export class AddDoctorAddress{
    city: string | undefined;
    state: string | undefined;
    country: string | undefined;
    pincode: string | undefined;
    address: string | undefined;
}

export class AddDoctorDetails{
    name: string | undefined;
    phoneNumber: string | undefined;
    email: string | undefined;
    photo: string | undefined;
    dateOfBirth: string | undefined;
    specializationIn: string | undefined;
    experience: number | undefined;
    categoriesId:  string[] | undefined;
    address: AddDoctorAddress | undefined;
}