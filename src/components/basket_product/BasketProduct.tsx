import React from "react";
import style from "./BasketProduct.module.css";
import { NavLink } from "react-router-dom";
import { useBasket } from "../../store/store";
import { putQuantityOfProductInBasket, deleteProductFromUserBasket } from "../../lib/request";
import { IBasketProduct } from "../../lib/types";
import Checkbox from "@mui/material/Checkbox";
import * as Icon from "react-bootstrap-icons";

interface IProductInfo {
    product: IBasketProduct;
    token: string;
}

const BasketProduct: React.FC<IProductInfo> = ({ product, token }) => {
    const chooseProduct = useBasket(state => state.chooseProduct);
    const updateQuantityOfProductInBasket = useBasket(
        state => state.updateQuantityOfProductInBasket
    );
    const deleteProductFromBasket = useBasket(state => state.deleteProductFromBasket);
    const addProductToCurrentOrder = useBasket(state => state.addProductToCurrentOrder);
    const deleteProductFromCurrentOrder = useBasket(state => state.deleteProductFromCurrentOrder);

    return (
        <div key={`productId-${product.id}`} className={style.productContainer}>
            <div className={style.checkboxAndTrashIconContainer}>
                <Checkbox
                    className={style.checkbox}
                    sx={{
                        color: "rgb(6, 130, 171)",
                        "&.Mui-checked": {
                            color: "rgb(6, 130, 171)"
                        }
                    }}
                    checked={product.checked}
                    onChange={e => {
                        if (e.target.checked) {
                            chooseProduct(product.id);
                            addProductToCurrentOrder({
                                productId: product.id,
                                price: product.price,
                                quantity: product.orderedQuantity
                            });
                        } else {
                            chooseProduct(product.id);
                            deleteProductFromCurrentOrder(product.id);
                        }
                    }}
                />
                <Icon.Trash3
                    size={"20px"}
                    color={"rgb(166, 165, 165)"}
                    cursor={"pointer"}
                    onClick={async () => {
                        await deleteProductFromUserBasket(product.id, token);
                        deleteProductFromBasket(product.id);
                    }}
                />
            </div>
            <NavLink to={`/catalog/product/${product.id}`}>
                <img src={product.image} className={style.productImage} />
            </NavLink>
            <div className={style.productInfoContainer}>
                <div className={style.productInfo}>
                    <NavLink to={`/catalog/product/${product.id}`} className={style.titleNavLink}>
                        <div className={style.productTitle}>{product.title}</div>
                    </NavLink>

                    <div className={style.quantityContainer}>
                        <div className={style.quantityTitle}>Quantity</div>
                        <div className={style.buttonsContainer}>
                            <button
                                onClick={async () => {
                                    await putQuantityOfProductInBasket(
                                        product.id,
                                        product.orderedQuantity - 1,
                                        token
                                    );
                                    updateQuantityOfProductInBasket({
                                        id: product.id,
                                        quantity: product.orderedQuantity - 1
                                    });
                                }}
                                disabled={product.orderedQuantity > 1 ? false : true}
                                className={style.minusButton}
                            >
                                &ndash;
                            </button>
                            <div className={style.quantity}>{product.orderedQuantity}</div>
                            <button
                                onClick={async () => {
                                    await putQuantityOfProductInBasket(
                                        product.id,
                                        product.orderedQuantity + 1,
                                        token
                                    );
                                    updateQuantityOfProductInBasket({
                                        id: product.id,
                                        quantity: product.orderedQuantity + 1
                                    });
                                }}
                                disabled={
                                    product.orderedQuantity < product.availableQuantity
                                        ? false
                                        : true
                                }
                                className={style.plusButton}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
                <div className={style.productPriceInfo}>
                    <div className={style.price}>{product.price} $</div>
                    <div className={style.amountContainer}>
                        <div className={style.amountTitle}>amount</div>
                        <div style={{ fontWeight: "bold" }}>
                            {product.price * product.orderedQuantity} $
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasketProduct;
