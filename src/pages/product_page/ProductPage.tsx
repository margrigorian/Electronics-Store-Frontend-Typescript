import style from "./ProductPage.module.css";
import React from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useProducts, useUser, useBasket } from "../../store/store";
import { getProduct, postProductToBasket } from "../../lib/request";
import UserReview from "../../components/user_review/UserReview";
import Reviews from "../../components/reviews/Reviews";
import { IBasketProduct } from "../../lib/types";
import * as Icon from "react-bootstrap-icons";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";

const ProductPage: React.FC = () => {
    const user = useUser(state => state.user);
    let { id } = useParams(); // или же в сторе сохранять id?
    const product = useProducts(state => state.product);
    const setProduct = useProducts(state => state.setProduct);
    const basket = useBasket(state => state.basket);
    let productExistenceInBasket: IBasketProduct | undefined = undefined;
    if (id) {
        productExistenceInBasket = basket.find(el => el.id === Number(id));
    }
    const addProductToBasket = useBasket(state => state.addProductToBasket);
    const setError = useProducts(state => state.setError);
    const setUserRate = useProducts(state => state.setUserRate);

    useEffect(() => {
        makeRequest();
    }, []);

    function makeRequest() {
        if (!id) id = ""; // исключаем undefined
        getProduct(id).then(result => {
            if (result) {
                if (result.data) {
                    const data = result.data.data.product;
                    console.log(data);
                    setProduct(data);
                    // если есть пользователь и есть оценки
                    if (user && data.rates && data.rates.length > 0) {
                        const rate = data.rates.find(el => el.user_id === Number(user.id));
                        // ранее данная оценка товару текущим пользователем
                        if (rate) {
                            setUserRate(rate.rate);
                        } else {
                            // чтобы не отображалась стара оценка к другому товару
                            setUserRate(null);
                        }
                    }
                } else if (result.error) {
                    setError(result.error.message);
                }
            }
        });
    }

    return (
        <div className={style.container}>
            {product ? (
                <div>
                    <div className={style.productContainer}>
                        <div className={style.imagesContainer}>
                            <img src={product.image} className={style.image} />
                            <img src={product.image} className={style.image} />
                        </div>
                        <div className={style.productDescription}>
                            <div>
                                <div className={style.title}>{product.title.toUpperCase()}</div>
                                <div className={style.priceAndRateContainer}>
                                    <div className={style.price}>{`$ ${product.price}`}</div>
                                    <div>
                                        {product.avgRate !== null ? (
                                            <div className={style.rateContainer}>
                                                <StarBorderPurple500Icon
                                                    sx={{
                                                        fontSize: "22px",
                                                        color: "rgb(6, 130, 171)"
                                                    }}
                                                />
                                                &nbsp;
                                                <div>{Number(product.avgRate).toFixed(1)}</div>
                                            </div>
                                        ) : (
                                            <StarBorderPurple500Icon
                                                sx={{
                                                    fontSize: "22px",
                                                    display: "flex",
                                                    alignItems: "center"
                                                }}
                                                className={style.star}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className={style.description}>{product.description}</div>
                                {product.quantity > 0 ? (
                                    <div className={style.quantityContainer}>
                                        <div className={style.quantityTitle}>Stock quantity</div>
                                        <span className={style.quantity}>{product.quantity}</span>
                                    </div>
                                ) : (
                                    <div className={style.outOfStockText}>Product out of stock</div>
                                )}
                            </div>
                            <div>
                                {user === null ? (
                                    <div className={style.pleaseLoginText}>Please login</div>
                                ) : (
                                    ""
                                )}
                                <div className={style.addButtonContainer}>
                                    <button
                                        disabled={
                                            user &&
                                            !productExistenceInBasket &&
                                            product.quantity > 0
                                                ? false
                                                : true
                                        }
                                        className={
                                            user && !productExistenceInBasket
                                                ? style.addProductButton
                                                : style.disabledButton
                                        }
                                        onClick={() => {
                                            if (!productExistenceInBasket) {
                                                addProductToBasket({
                                                    id: product.id,
                                                    title: product.title,
                                                    image: product.image,
                                                    orderedQuantity: 1,
                                                    availableQuantity: product.quantity,
                                                    price: product.price,
                                                    checked: false
                                                });
                                                if (user) {
                                                    // проверку требует типизация
                                                    postProductToBasket(product.id, user.token);
                                                }
                                            }
                                        }}
                                    >
                                        {!productExistenceInBasket
                                            ? "ADD TO BASKET"
                                            : "ADDED TO BASKET"}
                                    </button>
                                    <div className={style.iconsContainer}>
                                        <Icon.Heart size={"18px"} className={style.cursor} />
                                        <Icon.Share size={"18px"} className={style.cursor} />
                                        <Icon.ChatSquareDots
                                            size={"20px"}
                                            className={style.cursor}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <UserReview getProduct={makeRequest} />
                    <Reviews getProduct={makeRequest} />
                </div>
            ) : (
                <div className={style.loading}>Loading...</div>
            )}
        </div>
    );
};

export default ProductPage;
