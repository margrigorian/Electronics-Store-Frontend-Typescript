import axios from "axios";
import { ILoginForm, IRegistrationForm, IUser, ICategories, IProductListInfo } from "./types";

interface IResponse<T> {
    data: T | null;
    error: Message | null;
}

type Message = {
    message: string;
};

async function makeAuthorization(
    body: ILoginForm
): Promise<IResponse<{ message: string; user: IUser }> | undefined> {
    // undefined из-за catch
    try {
        const data = await axios({
            method: "post",
            url: "http://localhost:3001/authentication/login",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: JSON.stringify(body)
        });

        return data.data;
    } catch (err) {
        console.log(err);
    }
}

async function makeRegistration(
    body: IRegistrationForm
): Promise<IResponse<{ message: string; newUser: IUser }> | undefined> {
    try {
        const data = await axios({
            method: "post",
            url: "http://localhost:3001/authentication/register",
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            },
            data: JSON.stringify(body)
        });

        return data.data;
    } catch (err) {
        console.log(err);
    }
}

async function getFeildOfApplicationCategories(
    fieldOfApplication: string
): Promise<IResponse<{ categories: ICategories[] }> | undefined> {
    // string "Add Products" на ProductCategoriesPage
    try {
        const data = await axios.get(`http://localhost:3001/catalog/${fieldOfApplication}`);

        return data.data.data;
    } catch (err) {
        console.log(err);
    }
}

async function getProductList(
    category: string,
    subcategory: string,
    minPrice: number | string,
    maxPrice: number | string,
    order: string,
    page: number,
    limit: number
): Promise<IResponse<{ data: IProductListInfo }> | undefined> {
    try {
        const data = await axios.get(
            `http://localhost:3001/catalog/product-list/${category}?subcategory=${subcategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${order}&page=${page}&limit=${limit}`
        );

        return data.data;
    } catch (err) {
        console.log(err);
    }
}

export { makeAuthorization, makeRegistration, getFeildOfApplicationCategories, getProductList };
