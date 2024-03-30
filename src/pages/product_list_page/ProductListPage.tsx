import React from "react";
import style from "./ProductListPage.module.css";
import { useEffect, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import { useStateManagment, useProducts, useFilters } from "../../store/store";
import FilterDrawer from "../../components/filter_drawer/FilterDrawer";
import Product from "../../components/product/Product";
import { getProductList } from "../../lib/request";
import * as Icon from "react-bootstrap-icons";
import Pagination from "@mui/material/Pagination";

const ProductListPage: React.FC = () => {
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
    let { category } = useParams(); // передаем в запрос
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
    }, [isActiveSubcategory, page, limit]);

    function makeRequest(min: number | string, max: number | string, orderType: string): void {
        if (!category) {
            category = ""; // так как useParams() может быть и undefined
        }
        getProductList(category, isActiveSubcategory, min, max, orderType, page, limit).then(
            result => {
                if (result) {
                    if (result.data) {
                        console.log(result.data.data.products);
                        setProducts(result.data.data.products);
                        setSubcategories(result.data.data.subcategories);
                        setPriceMin(result.data.data.priceMin);
                        setPriceMax(result.data.data.priceMax);
                        setNumberOfPages(Math.ceil(result.data.data.length / limit));
                    } else if (result.error) {
                        setError(result.error.message);
                    }
                }
            }
        );
    }

    return (
        <div className={style.container}>
            <FilterDrawer makeRequest={makeRequest} />
            <div className={style.categoryName}>{category}</div>
            <div className={style.subcategoryContainer}>
                <div
                    onClick={() => {
                        setActiveSubcategory("");
                        setOrder("");
                        setDefaultOrderRadio("");
                        setPage(1);
                    }}
                    className={
                        isActiveSubcategory === "" ? style.activeSubcategory : style.subcategory
                    }
                >
                    all
                </div>
                {subcategories
                    ? subcategories.map((el, i) => (
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
                              {el}
                          </div>
                      ))
                    : ""}
            </div>
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
            <div className={style.productsContainer}>
                {products ? (
                    products.map(el => (
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
                    ))
                ) : (
                    <div className={style.loading}>Loading...</div>
                )}
            </div>
        </div>
    );
};

export default ProductListPage;
