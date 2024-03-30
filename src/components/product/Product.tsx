import React from "react";
import style from "./Product.module.css";
import StarBorderPurple500Icon from "@mui/icons-material/StarBorderPurple500";

interface ProductProps {
    title: string;
    price: number;
    avgRate: string | null;
    image: string;
}

const Product: React.FC<ProductProps> = ({ title, price, avgRate, image }) => {
    return (
        <div className={style.product}>
            <div className={style.productNameContainer}>
                <div>{title}</div>
                <div className={style.slogan}>Description or slogan</div>
            </div>
            <div className={style.infoContainer}>
                <div className={style.price}>{`$ ${price}`}</div>
                <div>
                    {avgRate !== null ? (
                        <div className={style.rateContainer}>
                            <StarBorderPurple500Icon
                                sx={{ fontSize: "22px", color: "rgb(6, 130, 171)" }}
                            />
                            &nbsp;
                            <div>{Number(avgRate).toFixed(1)}</div>
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
                <button className={style.learnMoreButton}>Learn more</button>
            </div>
            <img src={image} className={style.image} />
        </div>
    );
};

export default Product;
