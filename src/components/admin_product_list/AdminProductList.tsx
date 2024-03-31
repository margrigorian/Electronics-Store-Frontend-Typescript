import style from "./AdminProductList.module.css";
import React from "react";
import { useStateManagment, useUser, useProducts, useFilters } from "../../store/store";
import { deleteProduct } from "../../lib/request";
import Pagination from "@mui/material/Pagination";
import * as Icon from "react-bootstrap-icons";

const AdminProductList: React.FC<{ numberOfPages: number }> = ({ numberOfPages }) => {
    const user = useUser(state => state.user);
    const products = useProducts(state => state.products);
    const setProduct = useProducts(state => state.setProduct);
    const length = useProducts(state => state.length);
    // исп. после удаления для обновления списка товаров
    const renderOfAdminPage = useStateManagment(state => state.renderOfAdminPage);
    const setRenderOfAdminPage = useStateManagment(state => state.setRenderOfAdminPage);
    // FILTERS
    const search = useFilters(state => state.search);
    const setSearch = useFilters(state => state.setSearch);
    const subcategories = useFilters(state => state.subcategories);
    const isActiveSubcategory = useStateManagment(state => state.isActiveSubcategory);
    const setActiveSubcategory = useStateManagment(state => state.setActiveSubcategory);
    const changeStatusOfFilterDrawer = useStateManagment(state => state.changeStatusOfFilterDrawer);
    const setDefaultOrderRadio = useStateManagment(state => state.setDefaultOrderRadio);
    const setOrder = useFilters(state => state.setOrder);
    // PAGINATION
    const page = useFilters(state => state.page);
    const setPage = useFilters(state => state.setPage);
    // ДЛЯ РЕДАКТИРОВАНИЯ И PUT-ЗАПРОСА
    const setSelectedFieldOfApplication = useProducts(state => state.setSelectedFieldOfApplication);
    const setSelectedCategory = useProducts(state => state.setSelectedCategory);
    const setSelectedSubcategory = useProducts(state => state.setSelectedSubcategory);
    const setTitle = useProducts(state => state.setTitle);
    const setDescription = useProducts(state => state.setDescription);
    const setSelectedQuantity = useProducts(state => state.setSelectedQuantity);
    const setSelectedPrice = useProducts(state => state.setSelectedPrice);

    async function makeRequest(productId: number) {
        if (user) {
            const deletedProduct = await deleteProduct(user.token, productId);
            console.log(deletedProduct);
            setRenderOfAdminPage(!renderOfAdminPage);
        }
    }

    return (
        <div className={style.resultContainer}>
            <div className={style.filterAndPaginationContainer}>
                <div className={style.filterContainer}>
                    <div
                        className={style.filterTitleContainer}
                        onClick={() => {
                            if (products) {
                                changeStatusOfFilterDrawer(true);
                            }
                        }}
                    >
                        <Icon.Sliders2 size={"18px"} />
                        <div className={style.filterTitle}>FILTER AND ORDER</div>
                    </div>
                    <input
                        placeholder="search"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            // при новом запросе обнуляем фильтры
                            setActiveSubcategory("");
                            setDefaultOrderRadio("");
                            setOrder("");
                            setPage(1);
                        }}
                        className={style.searchInput}
                    />
                </div>
                <Pagination
                    count={numberOfPages}
                    page={page}
                    onChange={(evt, num) => setPage(num)}
                    sx={{
                        "& .MuiPaginationItem-root": {
                            color: "#fff"
                        }
                    }}
                />
            </div>

            {subcategories ? (
                subcategories.length > 1 ? (
                    <div className={style.subcategoriesContainer}>
                        <div
                            onClick={() => {
                                setActiveSubcategory("");
                                setOrder("");
                                setDefaultOrderRadio("");
                                setPage(1);
                            }}
                            className={
                                isActiveSubcategory === ""
                                    ? style.activeSubcategory
                                    : style.subcategory
                            }
                        >
                            ALL
                        </div>
                        {subcategories.map((el, i) => (
                            <div
                                key={`subcategoryId-${i}`}
                                onClick={() => {
                                    setActiveSubcategory(el);
                                    setOrder("");
                                    setDefaultOrderRadio("");
                                    setPage(1);
                                }}
                                className={
                                    isActiveSubcategory === `${el}`
                                        ? style.activeSubcategory
                                        : style.subcategory
                                }
                            >
                                {el.toUpperCase()}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={style.subcategoriesContainer}>
                        {/* в случае одной категории */}
                        <div className={style.activeSubcategory}>
                            {subcategories[0].toUpperCase()}
                        </div>
                    </div>
                )
            ) : (
                <div className={style.noResultText}>NO RESULT</div>
            )}

            {products ? (
                <div>
                    <div className={style.productsContainer}>
                        {products.map((el, i) => (
                            <div
                                key={`productId-${el.id}`}
                                className={
                                    i === 0
                                        ? style.productItem
                                        : `${style.productItem} ${style.paddingOfItem}`
                                }
                            >
                                <img src={el.image} className={style.productImage} />
                                <div className={style.productInfoContainer}>
                                    <div className={style.productInfo}>
                                        <div className={style.productTitle}>{el.title}</div>
                                        <div>
                                            <span className={style.productInfoSpan}>
                                                Quantity:{" "}
                                            </span>
                                            {el.quantity}
                                        </div>
                                        <div>
                                            <span className={style.productInfoSpan}>Price: </span>
                                            {el.price}$
                                        </div>
                                        <div>
                                            <span className={style.productInfoSpan}>Rate: </span>
                                            {Number(el.avgRate).toFixed(1)}
                                        </div>
                                    </div>
                                    <div className={style.buttonsContainer}>
                                        <button
                                            className={style.editButton}
                                            onClick={() => {
                                                setProduct(el);
                                                setTitle(el.title);
                                                setDescription(el.description);
                                                setSelectedFieldOfApplication(
                                                    el.feildOfApplication
                                                );
                                                setSelectedCategory(el.category);
                                                setSelectedSubcategory(el.subcategory);
                                                setSelectedQuantity(el.quantity.toString());
                                                setSelectedPrice(el.price.toString());
                                                window.scrollTo({
                                                    top: 0,
                                                    left: 0,
                                                    behavior: "smooth"
                                                });
                                            }}
                                        >
                                            EDIT
                                        </button>
                                        <button
                                            className={style.deleteButton}
                                            onClick={() => {
                                                makeRequest(el.id);
                                            }}
                                        >
                                            DELETE
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={style.totalAmount}>TOTAL AMOUNT: {length}</div>
                </div>
            ) : (
                ""
            )}
        </div>
    );
};

export default AdminProductList;
