import { create } from "zustand";
import { persist } from "zustand/middleware"; // работает с localStorage
import {
    IUseStateManagmentStore,
    IUseUserStore,
    IUseProductsStore,
    IUseFilters,
    IUseBasket
} from "../lib/types";

export const useStateManagment = create<IUseStateManagmentStore>(set => ({
    isOpenedNavBarDrawer: false,
    isOpenedSmartHomeCategory: false,
    isOpenedLifeStyleCategory: false,
    renderOfSearchPage: false,
    isOpenedSearchDrawer: false,
    isOpenedFilterDrawer: false,
    isActiveSubcategory: "",
    defaultOrderRadio: "",
    renderOfAdminPage: false,

    changeStatusOfNavBarDrawer: status => set({ isOpenedNavBarDrawer: status }),
    changeStatusOfSmartHomeCategory: status => set({ isOpenedSmartHomeCategory: status }),
    changeStatusOfLifeStyleCategory: status => set({ isOpenedLifeStyleCategory: status }),
    setRenderOfSearchPage: render => set({ renderOfSearchPage: render }),
    changeStatusOfSearchDrawer: status => set({ isOpenedSearchDrawer: status }),
    changeStatusOfFilterDrawer: status => set({ isOpenedFilterDrawer: status }),
    setActiveSubcategory: category => set({ isActiveSubcategory: category }),
    setDefaultOrderRadio: status => set({ defaultOrderRadio: status }),
    setRenderOfAdminPage: render => set({ renderOfAdminPage: render })
}));

export const useUser = create<IUseUserStore>(set => ({
    authenticationMessage: null,
    user: null,
    error: null,

    setAuthenticationMessage: message => set({ authenticationMessage: message }),
    setUser: obj => set({ user: obj }),
    setError: message => set({ error: message })
}));

export const useProducts = create<IUseProductsStore>(set => ({
    // для post/put, возможно нужно вынести отдельно
    structure: null,
    selectedFieldOfApplication: "",
    selectedCategory: "",
    selectedSubcategory: "",
    selectedImage: null,
    title: "",
    description: "",
    selectedQuantity: "",
    selectedPrice: "",
    // для отрисовки на странице ProductCategoriesPage
    categories: null,
    products: null, // arr
    product: null,
    // для страницы Admin Page, общее количество товаров в базе
    length: null,
    userRate: null,
    userComment: "",
    evaluation: null,
    error: null,

    // для post/put
    setStructure: obj => set({ structure: obj }),
    setSelectedFieldOfApplication: feild => set({ selectedFieldOfApplication: feild }),
    setSelectedCategory: category => set({ selectedCategory: category }),
    setSelectedSubcategory: subcategory => set({ selectedSubcategory: subcategory }),
    setSelectedImage: image => set({ selectedImage: image }),
    setTitle: title => set({ title: title }),
    setDescription: description => set({ description: description }),
    setSelectedQuantity: quantity => set({ selectedQuantity: quantity }),
    setSelectedPrice: price => set({ selectedPrice: price }),
    // PRODUCT LIST
    setCategories: arr => set({ categories: arr }),
    setProducts: arr => set({ products: arr }),
    setLength: length => set({ length: length }),
    // ДЛЯ Product Page
    setProduct: product => set({ product: product }),
    setUserRate: value => set({ userRate: value }),
    setEvaluation: action => set({ evaluation: action }),
    setUserComment: comment => set({ userComment: comment }),
    setError: message => set({ error: message })
}));

export const useFilters = create<IUseFilters>(set => ({
    search: "",
    subcategories: null, // массив
    priceMin: 0, // чтобы отрисовывать в SLIDER, значение string или null не подходят в качестве начального value
    priceMax: 1,
    order: "", // для request, null выдаст ошибку 406
    page: 1,
    limit: 8,

    setSearch: value => set({ search: value }),
    setSubcategories: value => set({ subcategories: value }),
    setPriceMin: value => set({ priceMin: value }),
    setPriceMax: value => set({ priceMax: value }),
    setOrder: value => set({ order: value }),
    setPage: value => set({ page: value }),
    setLimit: value => set({ limit: value })
}));

export const useBasket = create<IUseBasket>(set => ({
    basket: [],
    orderNumbers: [],
    orders: [],
    currentOrder: [],

    setBasket: productArr => set({ basket: productArr }),
    addProductToBasket: product =>
        set(state => {
            return { basket: [...state.basket, product] };
        }),
    chooseProduct: productId =>
        set(state => {
            return {
                basket: state.basket.map(el => {
                    if (el.id === productId) {
                        el.checked = !el.checked;
                        return el;
                    } else {
                        return el;
                    }
                })
            };
        }),
    updateQuantityOfProductInBasket: productParams =>
        set(state => {
            return {
                basket: state.basket.map(el => {
                    if (el.id === productParams.id) {
                        el.orderedQuantity = productParams.quantity;
                        return el;
                    } else {
                        return el;
                    }
                }),
                // чтобы для purchase всегда была актуальная информация
                currentOrder: state.currentOrder.map(el => {
                    if (el.productId === productParams.id) {
                        el.quantity = productParams.quantity;
                        return el;
                    } else {
                        return el;
                    }
                })
            };
        }),
    deleteProductFromBasket: productId =>
        set(state => {
            return {
                basket: state.basket.filter(el => el.id !== productId),
                currentOrder: state.currentOrder.filter(el => el.productId !== productId)
            };
        }),
    setOrderNumbers: orderNumbers => set({ orderNumbers: orderNumbers }),
    setOrders: productArr => set({ orders: productArr }),
    setCurrentOrder: () => set({ currentOrder: [] }),
    addProductToCurrentOrder: product =>
        set(state => {
            return { currentOrder: [...state.currentOrder, product] };
        }),
    // убираем галочку, убирая из currentOrder
    deleteProductFromCurrentOrder: productId =>
        set(state => {
            return { currentOrder: state.currentOrder.filter(el => el.productId !== productId) };
        })
}));
