import style from "./ProductCategoriesPage.module.css";
import React from "react";
import { useEffect } from "react";
import { useStateManagment, useProducts, useFilters } from "../../store/store";
import { getFeildOfApplicationCategories } from "../../lib/request";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { NavLink } from "react-router-dom";

const ProductCategoriesPage: React.FC = () => {
    const categories = useProducts(state => state.categories);
    const setCategories = useProducts(state => state.setCategories);
    const setError = useProducts(state => state.setError);
    const setActiveSubcategory = useStateManagment(state => state.setActiveSubcategory);
    const setLimit = useFilters(state => state.setLimit);
    const setUserRate = useProducts(state => state.setUserRate);

    const currentPath = window.location.pathname;
    const currentPathArr = currentPath.split("/");
    const fieldOfApplication = currentPathArr[currentPathArr.length - 1];

    useEffect(() => {
        getFeildOfApplicationCategories(fieldOfApplication).then(result => {
            console.log(result);
            if (result) {
                if (result.data) {
                    const data = result.data.categories;
                    const editedData = data.map(el => {
                        // if (el.products.length === 3) {
                        return { ...el, products: [...el.products, "All Product"] };
                        // }

                        // return el;
                    });

                    setCategories(editedData);
                } else if (result.error) {
                    // необходимо ли отражать NOT FOUND, который не должен случиться?
                    setError(result.error.message); // при наличии ошибки
                }
            }
        });
    }, []);

    return (
        <div className={style.container}>
            {categories ? (
                // при индесации map i возникает ;, что ведет к ошибке
                categories.map(el => (
                    <div key={`categoryId-${Math.random()}`} className={style.categoryContainer}>
                        <div className={style.categoryName}>{el.category}</div>
                        <NavLink
                            to={`/catalog/product-list/${el.category}`}
                            onClick={() => {
                                setActiveSubcategory("");
                                // необходимо после страницы поиска
                                setLimit(8);
                            }}
                        >
                            <button
                                disabled={el.products.length === 4 ? undefined : true}
                                className={style.moreButton}
                            >
                                More
                            </button>
                        </NavLink>
                        <div className={style.productsContainer}>
                            {el.products.map(item =>
                                typeof item !== "string" ? ( // Это не элемент string "All Products"
                                    <NavLink
                                        to={`/catalog/product/${item.id}`}
                                        onClick={() => {
                                            setUserRate(null);
                                        }}
                                        key={`productId-${item.id}`}
                                        className={style.navlink}
                                    >
                                        <div className={style.product}>
                                            <div className={style.productNameContainer}>
                                                <div>{item.title}</div>
                                                <div className={style.slogan}>
                                                    Description or slogan
                                                </div>
                                            </div>
                                            <button className={style.learnMoreButton}>
                                                Learn more
                                            </button>
                                            <img src={item.image} className={style.image} />
                                        </div>
                                    </NavLink>
                                ) : (
                                    <NavLink
                                        to={`/catalog/product-list/${el.category}`}
                                        key={`productId-${Math.random()}`}
                                        onClick={() => {
                                            setActiveSubcategory("");
                                            // необходимо после страницы поиска
                                            setLimit(8);
                                        }}
                                        className={style.navlink}
                                    >
                                        <div className={style.allProductContainer}>
                                            <div>{item}</div>
                                            <button className={style.arrowButton}>
                                                <ArrowForwardIcon />
                                            </button>
                                        </div>
                                    </NavLink>
                                )
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className={style.loading}>Loading...</div>
            )}
        </div>
    );
};

export default ProductCategoriesPage;
