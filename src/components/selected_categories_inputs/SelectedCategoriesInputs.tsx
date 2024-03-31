import style from "./SelectedCategoriesInputs.module.css";
import React from "react";
import { useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { useProducts } from "../../store/store";
import { IPostOrPutProductForm } from "../../lib/types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface IUseFormTools {
    register: UseFormRegister<IPostOrPutProductForm>;
    errors: FieldErrors<IPostOrPutProductForm>;
}

const SelectedCategoriesInputs: React.FC<IUseFormTools> = ({ register, errors }) => {
    // СТРУКТУРА
    const structure = useProducts(state => state.structure);
    // SELECT
    const [isOpenedfieldSelect, setIsOpenedFieldSelect] = useState(false);
    const selectedFieldOfApplication = useProducts(state => state.selectedFieldOfApplication);
    const setSelectedFieldOfApplication = useProducts(state => state.setSelectedFieldOfApplication);
    const [isOpenedCategorySelect, setIsOpenedCategorySelect] = useState(false);
    const selectedCategory = useProducts(state => state.selectedCategory);
    const setSelectedCategory = useProducts(state => state.setSelectedCategory);
    const [isOpenedSubcategorySelect, setIsOpenedSubcategorySelect] = useState(false);
    const selectedSubcategory = useProducts(state => state.selectedSubcategory);
    const setSelectedSubcategory = useProducts(state => state.setSelectedSubcategory);

    return (
        <div>
            {/* SELECT FIELD */}
            <div>
                <div
                    className={style.select}
                    style={{
                        boxShadow: errors?.feildOfApplication && "none",
                        borderBottom: errors?.feildOfApplication && "1px solid rgb(212, 31, 31)"
                    }}
                >
                    <input
                        {...register("feildOfApplication", {
                            // делаем валидацию
                            required: "This field is required" // сообщение ошибки,
                        })}
                        value={selectedFieldOfApplication}
                        className={style.selectInput}
                        onChange={e => {
                            setSelectedFieldOfApplication(e.target.value);
                            setIsOpenedFieldSelect(false);
                        }}
                        placeholder="field of application (edit)"
                    />
                    <ExpandMoreIcon
                        sx={{ color: "grey", cursor: "pointer" }}
                        onClick={() => {
                            setIsOpenedCategorySelect(false);
                            setIsOpenedSubcategorySelect(false);
                            setIsOpenedFieldSelect(!isOpenedfieldSelect);
                            console.log(isOpenedfieldSelect);
                        }}
                    />
                </div>
                {isOpenedfieldSelect && (
                    <div className={style.optionContaner}>
                        {structure ? (
                            <div>
                                {structure.feildsOfApplication.map((el, i) => (
                                    <option
                                        key={`feildId-${i}`}
                                        className={
                                            i === 0
                                                ? style.option
                                                : `${style.option} ${style.optionBorder}`
                                        }
                                        onClick={() => {
                                            setSelectedFieldOfApplication(el.feildOfApplication);
                                            setIsOpenedFieldSelect(false);
                                        }}
                                    >
                                        {el.feildOfApplication}
                                    </option>
                                ))}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>

            {/* SELECT CATEGORY */}
            <div className={style.caregoriesContainer}>
                <div
                    className={style.select}
                    style={{
                        boxShadow: errors?.category && "none",
                        borderBottom: errors?.category && "1px solid rgb(212, 31, 31)"
                    }}
                >
                    <input
                        {...register("category", {
                            // делаем валидацию
                            required: "This field is required" // сообщение ошибки
                        })}
                        value={selectedCategory}
                        className={style.selectInput}
                        onChange={e => {
                            setSelectedCategory(e.target.value);
                            setIsOpenedCategorySelect(false);
                        }}
                        placeholder="category (edit)"
                    />
                    <ExpandMoreIcon
                        sx={{ color: "grey", cursor: "pointer" }}
                        onClick={() => {
                            setIsOpenedFieldSelect(false);
                            setIsOpenedSubcategorySelect(false);
                            setIsOpenedCategorySelect(!isOpenedCategorySelect);
                        }}
                    />
                </div>
                {isOpenedCategorySelect && structure && (
                    <div className={style.optionContaner}>
                        {selectedFieldOfApplication ? (
                            <div>
                                {structure.categories.map(
                                    (el, i) =>
                                        el.fromFeildOfApplication ===
                                            selectedFieldOfApplication && (
                                            <option
                                                key={`categoryId-${i}`}
                                                className={
                                                    i === 0
                                                        ? style.option
                                                        : `${style.option} ${style.optionBorder}`
                                                }
                                                onClick={() => {
                                                    setSelectedCategory(el.category);
                                                    setIsOpenedCategorySelect(false);
                                                }}
                                            >
                                                {el.category}
                                            </option>
                                        )
                                )}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>

            {/* SELECT SUBCATEGORY */}
            <div className={style.caregoriesContainer}>
                <div
                    className={style.select}
                    style={{
                        boxShadow: errors?.subcategory && "none",
                        borderBottom: errors?.subcategory && "1px solid rgb(212, 31, 31)"
                    }}
                >
                    <input
                        {...register("subcategory", {
                            // делаем валидацию
                            required: "This field is required" // сообщение ошибки
                        })}
                        value={selectedSubcategory}
                        className={style.selectInput}
                        onChange={e => {
                            setSelectedSubcategory(e.target.value);
                            setIsOpenedSubcategorySelect(false);
                        }}
                        placeholder="subcategory (edit)"
                    />
                    <ExpandMoreIcon
                        sx={{ color: "grey", cursor: "pointer" }}
                        onClick={() => {
                            setIsOpenedFieldSelect(false);
                            setIsOpenedCategorySelect(false);
                            setIsOpenedSubcategorySelect(!isOpenedSubcategorySelect);
                        }}
                    />
                </div>
                {isOpenedSubcategorySelect && structure && (
                    <div className={style.optionContaner}>
                        {selectedCategory ? (
                            <div>
                                {structure.subcategories.map(
                                    (el, i) =>
                                        el.fromCategory === selectedCategory && (
                                            <option
                                                key={`subcategoryId-${i}`}
                                                className={
                                                    i === 0
                                                        ? style.option
                                                        : `${style.option} ${style.optionBorder}`
                                                }
                                                onClick={() => {
                                                    setSelectedSubcategory(el.subcategory);
                                                    setIsOpenedSubcategorySelect(false);
                                                }}
                                            >
                                                {el.subcategory}
                                            </option>
                                        )
                                )}
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SelectedCategoriesInputs;
