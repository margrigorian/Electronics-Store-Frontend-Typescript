// USER

export interface IUseStateManagmentStore {
    isOpenedNavBarDrawer: boolean;
    isOpenedSmartHomeCategory: boolean;
    isOpenedLifeStyleCategory: boolean;
    renderOfSearchPage: boolean;
    isOpenedSearchDrawer: boolean;
    isOpenedFilterDrawer: boolean;
    isActiveSubcategory: string;
    defaultOrderRadio: string;
    renderOfAdminPage: boolean;

    changeStatusOfNavBarDrawer: (status: boolean) => void;
    changeStatusOfSmartHomeCategory: (status: boolean) => void;
    changeStatusOfLifeStyleCategory: (status: boolean) => void;
    setRenderOfSearchPage: (render: boolean) => void;
    changeStatusOfSearchDrawer: (status: boolean) => void;
    changeStatusOfFilterDrawer: (status: boolean) => void;
    setActiveSubcategory: (subcategory: string) => void;
    setDefaultOrderRadio: (status: string) => void;
    setRenderOfAdminPage: (render: boolean) => void;
}

export interface IUseUserStore {
    authenticationMessage: string | null;
    user: IUser | null;
    error: string | null;

    setAuthenticationMessage: (message: string | null) => void;
    setUser: (obj: IUser) => void;
    setError: (message: string | null) => void;
}

export interface IUser {
    id: string;
    username: string;
    status: string;
    token: string;
}

// PRODUCTS

export interface IUseProductsStore {
    // для admin post/put, возможно нужно вынести отдельно
    structure: ITotalProductsStructure | null; // admin page
    selectedFieldOfApplication: string;
    selectedCategory: string;
    selectedSubcategory: string;
    selectedImage: File | null;
    title: string;
    description: string;
    selectedQuantity: string;
    selectedPrice: string;
    // для отрисовки на странице ProductCategoriesPage
    categories: (ICategories | string)[] | null; // string добавляется на фронте - элемент "All Products"
    // productListPage
    products: IProductListInfo | null; // arr
    // для страницы Admin Page, общее количество товаров в базе
    length: number | null;
    // productPage
    product: IProductWithCommentsAndRates | null;
    // для контроля выбора количества товара на Product Page
    quantity: number;
    userRate: number | null;
    userComment: string;
    evaluation: string | null;
    error: string | null;

    // для admin post/put
    setStructure: (obj: ITotalProductsStructure | null) => void;
    setSelectedFieldOfApplication: (feild: string) => void;
    setSelectedCategory: (category: string) => void;
    setSelectedSubcategory: (subcategory: string) => void;
    setSelectedImage: (image: File | null) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setSelectedQuantity: (quantity: string) => void;
    setSelectedPrice: (price: string) => void;
    // PRODUCT LIST
    setCategories: (arr: (ICategories | string)[]) => void;
    setProducts: (arr: IProductListInfo | null) => void;
    setLength: (length: number) => void;
    // ДЛЯ Product Page
    setProduct: (product: IProductWithCommentsAndRates | null) => void;
    setQuantity: (value: number) => void;
    setUserRate: (value: number) => void;
    setUserComment: (comment: string) => void;
    setEvaluation: (action: string | null) => void;
    setError: (message: string | null) => void;
}

// product structure for admin

interface IFeildOfApplicationStructure {
    feildOfApplication: string;
}

interface ICategoriesStructure {
    category: string;
    fromFeildOfApplication: string;
}

interface ISubategoriesStructure {
    subcategory: string;
    fromCategory: string;
}

interface ITotalProductsStructure {
    feildsOfApplication: IFeildOfApplicationStructure[];
    categories: ICategoriesStructure[];
    subcategories: ISubategoriesStructure[];
}

// For feildOfApplicationCategories and Products

interface ICategory {
    category: string;
}

interface ICategoryProduct {
    id: string;
    title: string;
    image: string;
    price: number;
}

interface ICategories extends ICategory {
    products: ICategoryProduct[];
}

interface IProductListInfo {
    products: IProduct[] | IProductWithCommentsAndRates[]; // второе для allProductsController
    subcategories: string[];
    priceMin: number;
    priceMax: number;
    length: number;
}

interface IProduct {
    id: number;
    title: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
    feildOfApplication: string;
    category: string;
    subcategory: string;
}

interface IProductWithCommentsAndRates extends IProduct {
    avgRating: number | null;
    comments: ICommentsWithRates[];
    rates?: IRates[];
}

interface ICommentsWithRates {
    comment_id: number;
    comment: string;
    rate: number;
    user_id: number;
    username: string;
}

interface IRates {
    user_id: number;
    rate: number;
}

// FILTERS

export interface IUseFilters {
    search: string;
    subcategories: string[] | null; // массив
    priceMin: number | null; // чтобы отрисовывать в SLIDER, значение string выдает ошибку
    priceMax: number | null;
    order: string; // для request, null выдаст ошибку 406
    page: number;
    limit: number;

    setSearch: (value: string) => void;
    setSubcategories: (arr: string[]) => void;
    setPriceMin: (value: number | null) => void;
    setPriceMax: (value: number | null) => void;
    setOrder: (value: string) => void;
    setPage: (value: number) => void;
    setLimit: (value: number) => void;
}

// LOGIN

export interface ILoginForm {
    email: string;
    password: string;
}

export interface IRegistrationForm {
    username: string;
    email: string;
    password: string;
    repeatedPassword?: string;
}
