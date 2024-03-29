import axios from "axios";
import { ILoginForm, IRegistrationForm, IUser } from "./types";

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

export { makeAuthorization, makeRegistration };
