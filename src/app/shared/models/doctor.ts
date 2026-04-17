export class Doctor {
    categoriesId:  string[] | undefined;
    createdAt: string | undefined;
    experience: number | undefined;
    isActive: boolean | undefined;
    specializationIn: string | undefined;
    updatedAt: string | undefined;
    userId: string | undefined;
    __v: number | undefined;
    _id: string | undefined;
}

export class DoctorList {
    data: Doctor[] | undefined;
}