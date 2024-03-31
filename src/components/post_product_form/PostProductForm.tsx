import style from "./PostProductForm.module.css";
import React from "react";
import { useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useStateManagment, useUser, useProducts } from "../../store/store";
import { postProduct, putProduct } from "../../lib/request";
import SelectedCategoriesInputs from "../selected_categories_inputs/SelectedCategoriesInputs";
import { IPostOrPutProductForm } from "../../lib/types";

const PostProductForm: React.FC = () => {
    const user = useUser(state => state.user);
    const product = useProducts(state => state.product);
    const setProduct = useProducts(state => state.setProduct);
    const renderOfAdminPage = useStateManagment(state => state.renderOfAdminPage);
    const setRenderOfAdminPage = useStateManagment(state => state.setRenderOfAdminPage);
    // SELECT
    const selectedFieldOfApplication = useProducts(state => state.selectedFieldOfApplication);
    const setSelectedFieldOfApplication = useProducts(state => state.setSelectedFieldOfApplication);
    const selectedCategory = useProducts(state => state.selectedCategory);
    const setSelectedCategory = useProducts(state => state.setSelectedCategory);
    const selectedSubcategory = useProducts(state => state.selectedSubcategory);
    const setSelectedSubcategory = useProducts(state => state.setSelectedSubcategory);
    // FORM VALUES
    const imagePicker = useRef(null);
    const selectedImage = useProducts(state => state.selectedImage);
    const setSelectedImage = useProducts(state => state.setSelectedImage);
    const title = useProducts(state => state.title);
    const setTitle = useProducts(state => state.setTitle);
    const description = useProducts(state => state.description);
    const setDescription = useProducts(state => state.setDescription);
    const selectedQuantity = useProducts(state => state.selectedQuantity);
    const setSelectedQuantity = useProducts(state => state.setSelectedQuantity);
    const selectedPrice = useProducts(state => state.selectedPrice);
    const setSelectedPrice = useProducts(state => state.setSelectedPrice);

    const {
        register, // метод формы, который возвращает объект, поэтому деструкт. в самой форме
        setValue,
        formState: { errors }, // содержит разные св-ва
        reset,
        handleSubmit // функия-обертка над нашим кастомным хэндлером - onSubmit, в случае ошибки не допустит отправку данных
    } = useForm<IPostOrPutProductForm>({
        mode: "onBlur" // настройка режима: если убрать фокус с инпут, при ошибке сразу высветится коммент error
    });

    const onSubmit: SubmitHandler<IPostOrPutProductForm> = async data => {
        console.log(data);

        const formData = new FormData();
        if (data.id) {
            // при put-запросе
            formData.append("id", data.id);
        }
        formData.append("image", data.image);
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("feildOfApplication", data.feildOfApplication);
        formData.append("category", data.category);
        formData.append("subcategory", data.subcategory);
        formData.append("quantity", data.quantity);
        formData.append("price", data.price);

        if (user) {
            if (product) {
                await putProduct(formData, user.token).then(result => console.log(result));
            } else {
                await postProduct(formData, user.token).then(result => console.log(result));
            }
        }

        setProduct(null);
        setSelectedImage(null);
        setTitle("");
        setDescription("");
        setSelectedFieldOfApplication("");
        setSelectedCategory("");
        setSelectedSubcategory("");
        setSelectedQuantity("");
        setSelectedPrice("");
        reset();
        // обновление списка продуктов через рендеринг
        setRenderOfAdminPage(!renderOfAdminPage);
        // console.log(renderOfAmninPage);
    };

    return (
        <div className={style.container}>
            <div className={style.formContainer}>
                <div
                    className={style.imageContainer}
                    onClick={() => {
                        // через ref сработает клик на image input
                        if (imagePicker.current) {
                            // не null
                            (imagePicker.current as HTMLInputElement).click();
                        }
                    }}
                    style={{
                        border: errors?.image && "1px solid rgb(212, 31, 31)",
                        boxShadow: errors?.image && "none"
                    }}
                >
                    {/* или загружено изображение или выбрано изображение сущ. продукта (при put) */}
                    {selectedImage || product ? (
                        <img
                            src={
                                selectedImage
                                    ? URL.createObjectURL(selectedImage)
                                    : product
                                      ? product.image
                                      : "" // наче ругается на product.image
                            }
                            className={style.uploadImage}
                        />
                    ) : (
                        <div className={style.defaultImage}></div>
                    )}
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={style.form} id="form">
                    <div>
                        <div className={style.inputContainer}>
                            <input
                                {...register("title", {
                                    // делаем валидацию
                                    required: "This field is required" // сообщение ошибки
                                })}
                                value={title}
                                onChange={e => {
                                    setTitle(e.target.value);
                                }}
                                placeholder="Title"
                                style={{
                                    borderBottom: errors?.title && "1px solid rgb(212, 31, 31)",
                                    boxShadow: errors?.title && "none"
                                }}
                                className={style.titleInput}
                            />
                            <div className={style.error}>
                                {/* В объекте errors существует ошибка, связанная с ключом title */}
                                {errors?.title && <p>{errors?.title.message}</p>}
                            </div>
                        </div>

                        <div className={style.textareaContainer}>
                            <textarea
                                {...register("description", {
                                    // делаем валидацию
                                    required: "This field is required" // сообщение ошибки
                                })}
                                value={description}
                                onChange={e => {
                                    setDescription(e.target.value);
                                }}
                                placeholder="Description"
                                className={style.description}
                                style={{
                                    border: errors?.description && "1px solid rgb(212, 31, 31)",
                                    boxShadow: errors?.description && "none"
                                }}
                            ></textarea>
                        </div>
                    </div>

                    <div className={style.selectContainer}>
                        {/* SELECT */}
                        <SelectedCategoriesInputs register={register} errors={errors} />

                        {/* ДЛЯ  ЗАГРУЗКИ ИЗОБРАЖЕНИЯ */}
                        <div className={style.imageInputContainer}>
                            <input
                                {...register("image", {
                                    // делаем валидацию
                                    required: "This field is required" // сообщение ошибки
                                })}
                                type="file"
                                accept="image/*,.png,.jpeg,.jpg"
                                className={style.hiddenImageInput}
                                ref={imagePicker}
                                onChange={evt => {
                                    const inputsFile = evt.target as HTMLInputElement;
                                    // проверка для исключения ошибки
                                    if (inputsFile.files && inputsFile.files[0]) {
                                        setSelectedImage(inputsFile.files[0]);
                                        setValue("image", inputsFile.files[0]);
                                    }
                                }}
                            />
                        </div>
                        <div className={style.quantityAndPriceContainer}>
                            <div>
                                <input
                                    {...register("quantity", {
                                        // делаем валидацию
                                        required: "This field is required" // сообщение ошибки
                                    })}
                                    value={selectedQuantity}
                                    onChange={e => {
                                        setSelectedQuantity(e.target.value);
                                    }}
                                    placeholder="0"
                                    className={style.quantitativeWindow}
                                />
                                <div
                                    className={style.inputLabel}
                                    style={{ color: errors?.quantity && "rgb(212, 31, 31)" }}
                                >
                                    Quantity
                                </div>
                            </div>
                            <div>
                                <input
                                    {...register("price", {
                                        // делаем валидацию
                                        required: "This field is required" // сообщение ошибки
                                    })}
                                    value={selectedPrice}
                                    onChange={e => {
                                        setSelectedPrice(e.target.value);
                                    }}
                                    placeholder="0"
                                    className={style.quantitativeWindow}
                                />
                                <div
                                    className={style.inputLabel}
                                    style={{ color: errors?.price && "rgb(212, 31, 31)" }}
                                >
                                    Price
                                </div>
                            </div>
                        </div>
                        <div className={style.buttonsContainer}>
                            <button
                                type="button"
                                className={style.resetButton}
                                onClick={() => {
                                    setProduct(null);
                                    setSelectedImage(null);
                                    setTitle("");
                                    setDescription("");
                                    setSelectedFieldOfApplication("");
                                    setSelectedCategory("");
                                    setSelectedSubcategory("");
                                    setSelectedQuantity("");
                                    setSelectedPrice("");
                                    reset();
                                }}
                            >
                                RESET
                            </button>
                            <button
                                type="submit"
                                className={style.addButton}
                                // без доп. настройки срабатывает с ошибкой,
                                // так как не было непосредственно клика на input
                                onClick={() => {
                                    // if (selectedImage) setValue("image", selectedImage);
                                    // setValue("image", selectedImage);
                                    // необходимо для put
                                    if (product) {
                                        setValue("id", String(product.id));
                                    }
                                    setValue("feildOfApplication", selectedFieldOfApplication);
                                    setValue("category", selectedCategory);
                                    setValue("subcategory", selectedSubcategory);
                                }}
                            >
                                {product ? "CHANGE" : "ADD PRODUCT"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostProductForm;
