import React from "react";
import style from "./ProductOfOrder.module.css";
import { NavLink } from "react-router-dom";
import { IConfirmedOrderedProduct } from "../../lib/types";
import Checkbox from "@mui/material/Checkbox";
import * as Icon from "react-bootstrap-icons";

interface IProductInfo {
    product: IConfirmedOrderedProduct;
}

const ProductOfOrder: React.FC<IProductInfo> = ({ product }) => {
    return (
        <div key={`productId-${product.product_id}`} className={style.productContainer}>
            <NavLink to={`/catalog/product/${product.product_id}`}>
                <img src={product.product_image} className={style.productImage} />
            </NavLink>
            <div className={style.productInfoContainer}>
                <div className={style.productInfo}>
                    <div>
                        <NavLink
                            to={`/catalog/product/${product.product_id}`}
                            className={style.titleNavLink}
                        >
                            <div className={style.productTitle}>{product.product_title}</div>
                        </NavLink>
                        <div className={style.explanatoryText}>delivery info</div>
                    </div>

                    <div className={style.quantityContainer}>
                        <div className={style.quantityTitle}>Quantity</div>
                        <div className={style.quantity}>{product.quantity}</div>
                    </div>
                </div>
                <div className={style.productPriceInfo}>
                    <div className={style.price}>{product.product_price} $</div>
                    <div className={style.amountContainer}>
                        <div className={style.explanatoryText}>amount</div>
                        <div style={{ fontWeight: "bold" }}>
                            {product.product_price * product.quantity} $
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductOfOrder;
