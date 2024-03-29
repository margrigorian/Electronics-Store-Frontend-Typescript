import style from "./SearchDrawer.module.css";
import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Drawer } from "@mui/material";
import { useStateManagment, useFilters } from "../../store/store";
import * as Icon from "react-bootstrap-icons";

const SearchDrawer: React.FC = () => {
    // управление drawer, input
    const isOpenedSearchDrawer = useStateManagment(state => state.isOpenedSearchDrawer);
    const changeStatusOfSearchDrawer = useStateManagment(state => state.changeStatusOfSearchDrawer);
    const [inputFocus, setInputFocus] = useState(false);
    const search = useFilters(state => state.search);
    const setSearch = useFilters(state => state.setSearch);
    const navigate = useNavigate();
    // закрытие filterDrawer при переходах
    const setActiveSubcategory = useStateManagment(state => state.setActiveSubcategory);
    const changeStatusOfFilterDrawer = useStateManagment(state => state.changeStatusOfFilterDrawer);
    const setDefaultOrderRadio = useStateManagment(state => state.setDefaultOrderRadio);
    const setOrder = useFilters(state => state.setOrder);
    const setPage = useFilters(state => state.setPage);
    const setLimit = useFilters(state => state.setLimit);
    // рендеринг Search Page
    const renderOfSearchPage = useStateManagment(state => state.renderOfSearchPage);
    const setRenderOfSearchPage = useStateManagment(state => state.setRenderOfSearchPage);

    return (
        <div>
            <Drawer
                anchor="top"
                open={isOpenedSearchDrawer}
                disableScrollLock={true}
                sx={{ zIndex: "1250" }}
                onClick={() => {
                    setSearch("");
                    changeStatusOfSearchDrawer(false);
                }}
            >
                <div
                    onClick={e => {
                        e.stopPropagation();
                        // чтобы border с синего цвет перешел на серый
                        setInputFocus(false);
                    }}
                    onKeyDown={evt => {
                        if (evt.key === "Enter" && search !== "") {
                            // filter param
                            setActiveSubcategory("");
                            changeStatusOfFilterDrawer(false);
                            setDefaultOrderRadio("");
                            setOrder("");
                            setPage(1);
                            setLimit(6);
                            // чтобы на SearchPage срабатывал useEffect
                            setRenderOfSearchPage(!renderOfSearchPage);
                            // переход
                            setInputFocus(false);
                            changeStatusOfSearchDrawer(false);
                            navigate("/catalog/search");
                        }
                    }}
                    className={style.searchDrawerContent}
                >
                    <div className={style.logoContainer}>
                        <NavLink to={"/"} className={style.navlink}>
                            <div
                                onClick={() => {
                                    // очищаем поиск
                                    setSearch("");
                                    // filter param
                                    setActiveSubcategory("");
                                    changeStatusOfFilterDrawer(false);
                                    setDefaultOrderRadio("");
                                    setOrder("");
                                    setPage(1);
                                    // закрываем драйвер
                                    changeStatusOfSearchDrawer(false);
                                }}
                                className={style.logo}
                            >
                                T/
                            </div>
                        </NavLink>
                    </div>
                    <div className={inputFocus ? style.focusInputContainer : style.inputContainer}>
                        <Icon.Search color={inputFocus ? "black" : "rgb(88, 87, 87)"} />
                        <input
                            placeholder="Search"
                            onClick={e => {
                                // чтобы border с серого цвета перешел на синый
                                setInputFocus(true);
                                e.stopPropagation();
                            }}
                            value={search}
                            onChange={e => {
                                setSearch(e.target.value);
                            }}
                            className={style.input}
                        />
                        <Icon.XLg
                            onClick={e => {
                                setSearch("");
                                e.stopPropagation();
                            }}
                            color={inputFocus ? "black" : "rgb(88, 87, 87)"}
                            cursor={"pointer"}
                        />
                    </div>
                </div>
            </Drawer>
        </div>
    );
};

export default SearchDrawer;
