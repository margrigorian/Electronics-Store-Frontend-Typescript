import style from "./NavBar.module.css";
import React from "react";
import { NavLink } from "react-router-dom";
import { useStateManagment, useUser, useProducts, useFilters, useBasket } from "../../store/store";
import NavBarDrawer from "../navbar_drawer/NavBarDrawer";
import SearchDrawer from "../search_drawer/SearchDrawer";
import * as Icon from "react-bootstrap-icons";

const NavBar: React.FC = () => {
    const changeStatusOfNavBarDrawer = useStateManagment(state => state.changeStatusOfNavBarDrawer);
    const changeStatusOfSmartHomeCategory = useStateManagment(
        state => state.changeStatusOfSmartHomeCategory
    );
    const changeStatusOfLifeStyleCategory = useStateManagment(
        state => state.changeStatusOfLifeStyleCategory
    );
    const changeStatusOfSearchDrawer = useStateManagment(state => state.changeStatusOfSearchDrawer);

    // отображать необходимость логина по цвету иконки
    const user = useUser(state => state.user);
    const basket = useBasket(state => state.basket);
    // чтобы login форма отрисовывалась, а не висело сообщение об авторизации
    const setAuthenticationMessage = useUser(state => state.setAuthenticationMessage);
    // закрытие при переходах filterDrawer
    const setActiveSubcategory = useStateManagment(state => state.setActiveSubcategory);
    const changeStatusOfFilterDrawer = useStateManagment(state => state.changeStatusOfFilterDrawer);
    const setDefaultOrderRadio = useStateManagment(state => state.setDefaultOrderRadio);
    const setOrder = useFilters(state => state.setOrder);
    const setPage = useFilters(state => state.setPage);
    // обновлять поиск и обнулять информацию в store
    const setSearch = useFilters(state => state.setSearch);
    const setProduct = useProducts(state => state.setProduct);

    return (
        <div>
            <NavBarDrawer />
            <SearchDrawer />
            <div className={style.navBar}>
                <div className={style.navbarList}>
                    <NavLink
                        to={"/"}
                        onClick={() => {
                            // filter param
                            setSearch("");
                            setActiveSubcategory("");
                            changeStatusOfFilterDrawer(false);
                            setDefaultOrderRadio("");
                            setOrder("");
                            setPage(1);
                        }}
                        className={`${style.logo} ${style.cursor}`}
                    >
                        <div>T/</div>
                    </NavLink>

                    <div
                        className={style.category}
                        onMouseEnter={() => {
                            changeStatusOfNavBarDrawer(true);
                            changeStatusOfSmartHomeCategory(true);
                        }}
                        onMouseLeave={() => {
                            changeStatusOfNavBarDrawer(false);
                            changeStatusOfSmartHomeCategory(false);
                        }}
                        onClick={() => {
                            // filter param
                            setSearch("");
                            setActiveSubcategory("");
                            changeStatusOfFilterDrawer(false);
                            setDefaultOrderRadio("");
                            setOrder("");
                            setPage(1);
                            // navbar drawer
                            changeStatusOfNavBarDrawer(false);
                        }}
                    >
                        SMART HOME
                    </div>
                    <NavLink to={"catalog/life-style"} className={style.category}>
                        <div
                            onMouseEnter={() => {
                                changeStatusOfNavBarDrawer(true);
                                changeStatusOfLifeStyleCategory(true);
                            }}
                            onMouseLeave={() => {
                                changeStatusOfNavBarDrawer(false);
                                changeStatusOfLifeStyleCategory(false);
                            }}
                            onClick={() => {
                                // filter param
                                setSearch("");
                                setActiveSubcategory("");
                                changeStatusOfFilterDrawer(false);
                                setDefaultOrderRadio("");
                                setOrder("");
                                setPage(1);
                                // navbar drawer
                                changeStatusOfNavBarDrawer(false);
                            }}
                        >
                            LIFE STYLE
                        </div>
                    </NavLink>
                </div>
                <div className={style.navbarList}>
                    <div className={style.infoChapter}>discover</div>
                    <div className={style.infoChapter}>support</div>
                    <Icon.Search
                        color={"black"}
                        onClick={() => {
                            setSearch("");
                            changeStatusOfSearchDrawer(true);
                        }}
                        className={style.cursor}
                    />
                    <div className={style.userIconContainer}>
                        <NavLink
                            to={
                                user
                                    ? user.status === "admin"
                                        ? "admin/edit-page"
                                        : "/user/basket"
                                    : window.location
                            }
                            onClick={() => {
                                // необходимо после перехода с Product Page
                                setProduct(null);
                                // filter param
                                setSearch("");
                                setActiveSubcategory("");
                                changeStatusOfFilterDrawer(false);
                                setDefaultOrderRadio("");
                                setOrder("");
                                setPage(1);
                            }}
                            className={style.userIcon}
                        >
                            <Icon.PersonCircle size={20} color={"black"} className={style.cursor} />
                            {user && basket.length > 0 && (
                                <span>
                                    <sup>
                                        <button className={style.basketSup}>{basket.length}</button>
                                    </sup>
                                </span>
                            )}
                        </NavLink>
                        <NavLink
                            to={"/authentication/login"}
                            onClick={() => {
                                // filter param
                                setSearch("");
                                setActiveSubcategory("");
                                changeStatusOfFilterDrawer(false);
                                setDefaultOrderRadio("");
                                setOrder("");
                                setPage(1);
                                // ...
                                setAuthenticationMessage(null);
                            }}
                            className={style.loginIcon}
                        >
                            <Icon.BoxArrowInRight
                                size={25}
                                className={user ? style.blackLoginIcon : style.blueLoginIcon}
                            />
                        </NavLink>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;
