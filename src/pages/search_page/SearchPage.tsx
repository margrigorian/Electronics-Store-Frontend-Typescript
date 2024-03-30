import style from "./SearchPage.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { useStateManagment, useFilters, useProducts } from "../../store/store";
import { getSearchProductList } from "../../lib/request";
import FilterDrawer from "../../components/filter_drawer/FilterDrawer";
import Product from "../../components/product/Product";
import * as Icon from "react-bootstrap-icons";
import Pagination from "@mui/material/Pagination";
import { NavLink } from "react-router-dom";

const SearchPage: React.FC = () => {
    // рендеринг Search Page
    const renderOfSearchPage = useStateManagment(state => state.renderOfSearchPage);
    // DRAWER
    const changeStatusOfFilterDrawer = useStateManagment(state => state.changeStatusOfFilterDrawer);
    // DEFAULT RADIO
    const setDefaultOrderRadio = useStateManagment(state => state.setDefaultOrderRadio);
    // PRODUCTS
    const products = useProducts(state => state.products);
    const setProducts = useProducts(state => state.setProducts);
    const setError = useProducts(state => state.setError);
    const setQuantity = useProducts(state => state.setQuantity);
    const setUserRate = useProducts(state => state.setUserRate);
    // FILTERS
    const search = useFilters(state => state.search);
    const isActiveSubcategory = useStateManagment(state => state.isActiveSubcategory);
    const setActiveSubcategory = useStateManagment(state => state.setActiveSubcategory);
    // c backend для отрисовки на front
    const subcategories = useFilters(state => state.subcategories);
    const setSubcategories = useFilters(state => state.setSubcategories);
    const setPriceMin = useFilters(state => state.setPriceMin);
    const setPriceMax = useFilters(state => state.setPriceMax);
    const order = useFilters(state => state.order);
    const setOrder = useFilters(state => state.setOrder);
    const page = useFilters(state => state.page);
    const setPage = useFilters(state => state.setPage);
    const limit = useFilters(state => state.limit);
    // PAGINATION
    const [numberOfPages, setNumberOfPages] = useState(1);

    useEffect(() => {
        makeRequest("", "", order);
    }, [renderOfSearchPage, isActiveSubcategory, page, limit]);

    function makeRequest(min: number | string, max: number | string, orderType: string): void {
        getSearchProductList(search, isActiveSubcategory, min, max, orderType, page, limit).then(
            result => {
                if (result) {
                    if (result.error) {
                        setError(result.error.message);
                    } else if (result.data) {
                        setProducts(result.data.data.products);
                        const subcategoriesArr = result.data.data.subcategories;
                        setSubcategories(subcategoriesArr);
                        // если сабкатегория одна, сразу ее устанавливаем
                        // будет использоваться только при filterDrawer
                        // subcategories не сразу преобразуется, поэтому условие единожды сработает
                        if (subcategoriesArr.length === 1 && subcategories === null) {
                            setActiveSubcategory(subcategoriesArr[0]);
                        }

                        setPriceMin(result.data.data.priceMin);
                        setPriceMax(result.data.data.priceMax);
                        setNumberOfPages(Math.ceil(result.data.data.length / limit));
                    } else {
                        setProducts(null);
                        setSubcategories(null);
                        setActiveSubcategory("");
                    }
                }
            }
        );
    }

    return (
        <div className={style.container}>
            <FilterDrawer makeRequest={makeRequest} />
            <div className={style.resultTitle}>
                {search ? `SEARCH RESULTS FOR ${search.toUpperCase()}` : "PRODUCTS"}
            </div>
            {subcategories && products ? (
                <div>
                    <div className={style.filterAndPaginationContainer}>
                        <div
                            onClick={() => {
                                changeStatusOfFilterDrawer(true);
                            }}
                            className={style.filterTitleContainer}
                        >
                            <Icon.Sliders2 size={"18px"} />
                            <div className={style.filterTitle}>FILTER AND ORDER</div>
                        </div>
                        <Pagination
                            count={numberOfPages}
                            page={page}
                            onChange={(evt, num) => setPage(num)}
                        />
                    </div>

                    <div className={style.resultContainer}>
                        {subcategories.length > 1 ? (
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
                            // в случае одной категории
                            <div className={style.subcategoriesContainer}>
                                <div className={style.activeSubcategory}>
                                    {subcategories[0].toUpperCase()}
                                </div>
                            </div>
                        )}
                        <div className={style.productsContainer}>
                            <div className={style.secondProductsContainer}>
                                {products.map(el => (
                                    <NavLink
                                        to={`/catalog/product/${el.id}`}
                                        onClick={() => {
                                            setQuantity(1);
                                            setUserRate(null);
                                        }}
                                        key={`productId-${el.id}`}
                                        className={style.product}
                                    >
                                        <Product
                                            title={el.title}
                                            price={el.price}
                                            rate={el.rate}
                                            image={el.image}
                                        />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={style.noResultContainer}>
                    <Icon.ExclamationSquare className={style.alertIcon} />
                    <div className={style.noResultText}>
                        No results. Click the tabs above to see more or try a different search
                    </div>
                </div>
            )}
        </div>
    );
};

export default SearchPage;
