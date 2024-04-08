import style from "./LoginPage.module.css";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { NavLink } from "react-router-dom";
import { makeAuthorization } from "../../lib/request";
import { useBasket, useUser } from "../../store/store";
import { ILoginForm } from "../../lib/types";

const LoginPage: React.FC = () => {
    const message = useUser(state => state.authenticationMessage);
    const setAuthenticationMessage = useUser(state => state.setAuthenticationMessage);
    const setUser = useUser(state => state.setUser);
    const setBasket = useBasket(state => state.setBasket);
    const setOrderNumbers = useBasket(state => state.setOrderNumbers);
    const setOrders = useBasket(state => state.setOrders);
    const setError = useUser(state => state.setError);

    const {
        register, // метод формы, который возвращает объект, поэтому деструкт. в самой форме
        formState: { errors }, // содержит разные св-ва
        handleSubmit, // функия-обертка над нашим кастомным хэндлером - onSubmit, в случае ошибки не допустит отправку данных
        reset
    } = useForm<ILoginForm>({
        mode: "onBlur" // настройка режима: если убрать фокус с инпут, при ошибке сразу высветится коммент error
    });

    const onSubmit: SubmitHandler<ILoginForm> = async data => {
        // наш хэндлер
        const serverAnswer = await makeAuthorization(data);

        // при ошибке на сервере будет undefined, нужна проверка
        if (serverAnswer) {
            if (serverAnswer.data) {
                setAuthenticationMessage(serverAnswer.data.message);
                setUser(serverAnswer.data.user);
                // добавляем ключ checked для контроля размещения товара в currentOrder
                const basket = serverAnswer.data.basket.map(el => {
                    el = { ...el, checked: false };
                    return el;
                });
                setBasket(basket);
                // создаем массив номеров заказов для будущей отрисовки в user orders
                const orderNumbers: number[] = [];
                serverAnswer.data.orders.forEach(el => {
                    if (!orderNumbers.includes(el.order_id)) {
                        orderNumbers.push(el.order_id);
                    }
                });
                setOrderNumbers(orderNumbers);
                setOrders(serverAnswer.data.orders);
            } else if (serverAnswer.error) {
                // при наличии ошибки
                setError(serverAnswer.error.message);
            }
        }

        reset();
    };

    return (
        <div className={style.container}>
            <div className={style.loginTitle}>log in</div>
            {!message ? (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)} className={style.form}>
                        <div className={style.inputContainer}>
                            <input
                                {...register("email", {
                                    // делаем валидацию
                                    required: "This field is required", // сообщение ошибки
                                    pattern: {
                                        value: /([A-z0-9_.-]{1,})@([A-z0-9_.-]{1,}).([A-z]{2,8})/,
                                        message: "Please enter a valid email" // сообщение ошибки
                                    }
                                })}
                                placeholder="email address"
                                className={style.input}
                            />
                            <div className={style.error}>
                                {/* В объекте errors существует ошибка, связанная с ключом email */}
                                {errors?.email && <p>{errors?.email.message}</p>}
                            </div>
                        </div>

                        <div className={style.inputContainer}>
                            <input
                                {...register("password", {
                                    required: "This field is required",
                                    minLength: {
                                        value: 5,
                                        message: "Minimum of 5 characters"
                                    }
                                })}
                                placeholder="password"
                                className={style.input}
                            />
                            <div className={style.error}>
                                {errors?.password && <p>{errors?.password.message}</p>}
                            </div>
                        </div>

                        <button type="submit" className={style.button}>
                            Log in
                        </button>
                    </form>

                    <div className={style.forgotPasswordText}>Forgot your password?</div>
                    <div className={style.registerText}>
                        Don`t have an account yet?
                        <NavLink
                            to="/authentication/register"
                            onClick={() => {
                                setAuthenticationMessage(null);
                            }}
                            className={style.registerNavlink}
                        >
                            <span className={style.spanText}> Register</span>
                        </NavLink>
                    </div>
                </div>
            ) : (
                <div className={style.messageContainer}>{message}</div>
            )}
        </div>
    );
};

export default LoginPage;
