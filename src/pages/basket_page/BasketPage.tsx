import React, { useState } from "react";
import style from "./BasketPage.module.css";
import BasketProduct from "../../components/basket_product/BasketProduct";
import ProductOfOrder from "../../components/product_of_order/ProductOfOrder";
import { useUser, useBasket } from "../../store/store";
import { makePurchase, getUpdatedUserBasketAndOrders } from "../../lib/request";
import * as Icon from "react-bootstrap-icons";

const BasketPage: React.FC = () => {
    // для отрисовки
    const [isBasketActive, setIsBasketActive] = useState(true);
    const deliveryCharges = 20;
    const user = useUser(state => state.user);
    const basket = useBasket(state => state.basket);
    const orders = useBasket(state => state.orders);
    const orderNumbers = useBasket(state => state.orderNumbers);
    const setOrderNumbers = useBasket(state => state.setOrderNumbers);
    const currentOrder = useBasket(state => state.currentOrder);
    const totalQuantityOfProducts = currentOrder.reduce((sum, current) => {
        return sum + current.quantity;
    }, 0);
    const totalCostOfProducts = currentOrder.reduce((sum, current) => {
        return sum + current.price * current.quantity;
    }, 0);
    // после purchase
    const setCurrentOrder = useBasket(state => state.setCurrentOrder);
    const setBasket = useBasket(state => state.setBasket);
    const setOrders = useBasket(state => state.setOrders);
    const setError = useUser(state => state.setError);

    async function updateUserBasketAndOrders(token: string) {
        const data = await getUpdatedUserBasketAndOrders(token);
        if (data) {
            if (data.data) {
                // добавляем ключ checked для контроля размещения товара в currentOrder
                const basket = data.data.basket.map(el => {
                    el = { ...el, checked: false };
                    return el;
                });
                setBasket(basket);
                // создаем массив номеров заказов для будущей отрисовки в user orders
                const orderNumbers: number[] = [];
                data.data.orders.forEach(el => {
                    if (!orderNumbers.includes(el.order_id)) {
                        orderNumbers.push(el.order_id);
                    }
                });
                setOrderNumbers(orderNumbers);
                setOrders(data.data.orders);
            } else if (data.error) {
                setError(data.error.message);
            }
        }
    }

    function getTotalCostOfOrder(orderNum: number): number {
        const totalOrderCost = orders.reduce((sum, current) => {
            if (current.order_id === orderNum) {
                return sum + current.product_price * current.quantity;
            } else {
                return sum;
            }
        }, 0);

        return totalOrderCost;
    }

    return (
        <div className={style.container}>
            {user ? (
                <div>
                    <div className={style.categoriesContainer}>
                        <div
                            className={
                                isBasketActive
                                    ? `${style.category} ${style.activeCategory}`
                                    : `${style.category} ${style.notActiveCategory}`
                            }
                            onClick={() => setIsBasketActive(true)}
                        >
                            basket
                        </div>
                        <div
                            className={
                                !isBasketActive
                                    ? `${style.category} ${style.activeCategory}`
                                    : `${style.category} ${style.notActiveCategory}`
                            }
                            onClick={() => setIsBasketActive(false)}
                        >
                            orders
                        </div>
                    </div>

                    {isBasketActive ? (
                        basket.length > 0 ? (
                            <div className={style.basketContainer}>
                                <div>
                                    {basket.map(el => (
                                        <div key={`productId-${el.id}`}>
                                            <BasketProduct product={el} token={user.token} />
                                        </div>
                                    ))}
                                </div>
                                <div className={style.purchaseContainer}>
                                    <div className={style.orderSummaryTitle}>ORDER SUMMARY</div>
                                    <div className={style.priceContainer}>
                                        <div>{totalQuantityOfProducts} Products</div>
                                        <div>{totalCostOfProducts} $</div>
                                    </div>
                                    <div
                                        className={`${style.priceContainer} ${style.containerOfDelivery}`}
                                    >
                                        <div>Delivery charges</div>
                                        <div>{currentOrder.length > 0 ? deliveryCharges : 0} $</div>
                                    </div>
                                    <div
                                        className={`${style.priceContainer} ${style.totalCostContainer}`}
                                    >
                                        <div>TOTAL</div>
                                        <div>
                                            {currentOrder.length > 0
                                                ? totalCostOfProducts + deliveryCharges
                                                : 0}{" "}
                                            $
                                        </div>
                                    </div>
                                    <button
                                        className={
                                            currentOrder.length > 0
                                                ? style.processButton
                                                : style.disabledProcessButton
                                        }
                                        disabled={currentOrder.length > 0 ? false : true}
                                        onClick={async () => {
                                            await makePurchase(currentOrder, user.token);
                                            await updateUserBasketAndOrders(user.token);
                                            setCurrentOrder();
                                        }}
                                    >
                                        PROCESS
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className={style.emptyCategoryContainer}>
                                <Icon.Basket size={100} color={"rgb(166, 165, 165)"} />
                                <div className={style.emptyCategoryText}>basket is empty</div>
                            </div>
                        )
                    ) : orders.length > 0 ? (
                        <div>
                            {orderNumbers.map(orderNum => (
                                <div key={`productId-${orderNum}`} className={style.orderContainer}>
                                    <div className={style.orderTitle}>ORDER &#8470;{orderNum}</div>
                                    <div className={style.orderProductsContainer}>
                                        {orders.map(el =>
                                            el.order_id === orderNum ? (
                                                <div key={`productId-${Math.random()}`}>
                                                    <ProductOfOrder product={el} />
                                                </div>
                                            ) : undefined
                                        )}
                                    </div>
                                    <div className={style.totalContainer}>
                                        <span className={style.totalTitle}>TOTAL:</span>{" "}
                                        {getTotalCostOfOrder(orderNum)} $
                                        <div className={style.deliveryCharges}>
                                            {`(delivery - ${deliveryCharges} $)`}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={style.emptyCategoryContainer}>
                            <Icon.CardChecklist size={100} color={"rgb(166, 165, 165)"} />
                            <div className={style.emptyCategoryText}>no orders</div>
                        </div>
                    )}
                </div>
            ) : (
                <div className={style.lockIconContainer}>
                    <Icon.PersonLock size={"200px"} />
                    <div className={style.pleaseLoginText}>please login</div>
                </div>
            )}
        </div>
    );
};

export default BasketPage;
