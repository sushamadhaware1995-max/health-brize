export class CategoryData {
    _id: string | undefined;
    name: string | undefined;
    description:  string | undefined;
    tags: string[] | undefined;
    isListed: boolean | undefined;
    isActive: boolean | undefined;
    createdAt: string | undefined;
    updatedAt:  string | undefined;
    __v: number | undefined;
}

export class Category{
    data : CategoryData[] | undefined;
}