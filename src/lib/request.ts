import axios from "axios";
import {
    ILoginForm,
    IRegistrationForm,
    IUser,
    ICategories,
    IProductListInfo,
    IProductWithCommentsAndRates,
    IAllProductsWithStructure
} from "./types";

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

async function getSearchProductList(
    search: string,
    subcategory: string,
    minPrice: number | string,
    maxPrice: number | string,
    order: string,
    page: number,
    limit: number
): Promise<IResponse<{ data: IProductListInfo }> | undefined> {
    try {
        const data = await axios.get(
            `http://localhost:3001/catalog/search?q=${search}&subcategory=${subcategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${order}&page=${page}&limit=${limit}`
        );

        return data.data;
    } catch (err) {
        console.log(err);
    }
}

async function getProduct(
    id: string
): Promise<IResponse<{ data: { product: IProductWithCommentsAndRates } }> | undefined> {
    try {
        const data = await axios.get(`http://localhost:3001/catalog/product/${id}`);
        return data.data;
    } catch (err) {
        console.log(err);
    }
}

async function postRate(productId: number, rate: number, token: string): Promise<void> {
    try {
        await axios({
            method: "post",
            url: `http://localhost:3001/catalog/product/${productId}?rate=${rate}`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.log(err);
    }
}

async function putRate(productId: number, rate: number, token: string): Promise<void> {
    try {
        await axios({
            method: "put",
            url: `http://localhost:3001/catalog/product/${productId}?rate=${rate}`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.log(err);
    }
}

async function postComment(productId: number, comment: string, token: string): Promise<void> {
    try {
        await axios({
            method: "post",
            url: `http://localhost:3001/catalog/product/${productId}`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                authorization: `Bearer ${token}`
            },
            data: JSON.stringify({ comment })
        });
    } catch (err) {
        console.log(err);
    }
}

async function deleteComment(productId: number, commentId: number, token: string): Promise<void> {
    try {
        await axios({
            method: "delete",
            url: `http://localhost:3001/catalog/product/${productId}?commentId=${commentId}`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.log(err);
    }
}

async function getAllProductsWithCategoryStructure(
    search: string,
    subcategory: string,
    minPrice: number | string,
    maxPrice: number | string,
    order: string,
    page: number,
    limit: number,
    token: string
): Promise<IResponse<{ data: IAllProductsWithStructure }> | undefined> {
    try {
        const data = await axios({
            method: "get",
            url: `http://localhost:3001/admin/edit-page/?q=${search}&subcategory=${subcategory}&minPrice=${minPrice}&maxPrice=${maxPrice}&order=${order}&page=${page}&limit=${limit}`,
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                authorization: `Bearer ${token}`
            }
        });
        console.log(data.data);

        return data.data;
    } catch (err) {
        console.log(err);
    }
}

async function postProduct(
    data: FormData,
    token: string
): Promise<{ data: { product: IProductWithCommentsAndRates } } | undefined> {
    try {
        const postProductInfo = await axios({
            method: "post",
            url: `http://localhost:3001/admin/edit-page`,
            headers: {
                // Заголовок при отправке файлов, необходимо исп. FormData
                "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
                authorization: `Bearer ${token}`
            },
            data
        });

        return postProductInfo.data;
    } catch (err) {
        console.log(err);
    }
}

async function putProduct(
    data: FormData,
    token: string
): Promise<{ data: { product: IProductWithCommentsAndRates } } | undefined> {
    try {
        const putProductInfo = await axios({
            method: "put",
            url: `http://localhost:3001/admin/edit-page`,
            headers: {
                // Заголовок при отправке файлов, необходимо исп. FormData
                "Content-Type": "multipart/form-data; boundary=<calculated when request is sent>",
                authorization: `Bearer ${token}`
            },
            data
        });

        return putProductInfo.data;
    } catch (err) {
        console.log(err);
    }
}

async function deleteProduct(
    token: string,
    productId: number
): Promise<{ data: { product: IProductWithCommentsAndRates } } | undefined> {
    try {
        const data = await axios({
            method: "delete",
            url: `http://localhost:3001/admin/edit-page?productId=${productId}`,
            headers: {
                authorization: `Bearer ${token}`
            }
        });

        return data.data;
    } catch (err) {
        console.log(err);
    }
}

export {
    makeAuthorization,
    makeRegistration,
    getFeildOfApplicationCategories,
    getProductList,
    getSearchProductList,
    getProduct,
    postRate,
    putRate,
    postComment,
    deleteComment,
    getAllProductsWithCategoryStructure,
    postProduct,
    putProduct,
    deleteProduct
};
