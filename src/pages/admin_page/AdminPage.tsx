import style from "./AdminPage.module.css";
import React from "react";
import { useState, useEffect } from "react";
import { useStateManagment, useUser, useProducts, useFilters } from "../../store/store";
import { getAllProductsWithCategoryStructure } from "../../lib/request";
import PostProductForm from "../../components/post_product_form/PostProductForm";
import FilterDrawer from "../../components/filter_drawer/FilterDrawer";
import * as Icon from "react-bootstrap-icons";

const AdminPage: React.FC = () => {
    // GENERAL
    const user = useUser(state => state.user);
    const setStructure = useProducts(state => state.setStructure);
    const setProducts = useProducts(state => state.setProducts);
    const setLength = useProducts(state => state.setLength);
    const setError = useProducts(state => state.setError);
    const renderOfAdminPage = useStateManagment(state => state.renderOfAdminPage);
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
    // PAGINATION
    const page = useFilters(state => state.page);
    const limit = useFilters(state => state.limit);
    const [numberOfPages, setNumberOfPages] = useState(1);

    useEffect(() => {
        if (user) {
            makeRequest("", "", order);
        }
    }, [renderOfAdminPage, search, isActiveSubcategory, page, limit]);

    function makeRequest(min: number | string, max: number | string, orderType: string): void {
        if (user) {
            getAllProductsWithCategoryStructure(
                search,
                isActiveSubcategory,
                min,
                max,
                orderType,
                page,
                limit,
                user.token
            ).then(result => {
                if (result) {
                    if (result.error) {
                        setError(result.error.message);
                    } else if (result.data) {
                        // console.log(result.data.structure);
                        setStructure(result.data.data.structure);
                        // проверка, если search выдал null, нет категорий и продуктов соответтвенно
                        if (result.data.data.subcategories) {
                            const subcategoriesArr = result.data.data.subcategories;
                            setSubcategories(subcategoriesArr);
                            // если сабкатегория одна, сразу ее устанавливаем
                            // будет использоваться только при filterDrawer
                            // subcategories не сразу преобразуется, поэтому условие единожды сработает
                            if (subcategoriesArr.length === 1 && subcategories === null) {
                                setActiveSubcategory(subcategoriesArr[0]);
                            }
                            setProducts(result.data.data.products);
                            setLength(result.data.data.length);
                            setPriceMin(result.data.data.priceMin);
                            setPriceMax(result.data.data.priceMax);
                            setNumberOfPages(Math.ceil(result.data.data.length / limit));
                        } else {
                            setSubcategories(null);
                            setActiveSubcategory("");
                            setProducts(null);
                            setPriceMin(0);
                            setPriceMax(1);
                            setNumberOfPages(1);
                        }
                    }
                }
            });
        }
    }

    return (
        <div className={style.container}>
            <FilterDrawer makeRequest={makeRequest} />
            {user && user.status === "admin" ? (
                <div>
                    <div className={style.adminTitle}>admin</div>
                    <PostProductForm />
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

export default AdminPage;
