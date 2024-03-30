import style from "./UserReview.module.css";
import React from "react";
import { useProducts, useUser } from "../../store/store";
import { postRate, putRate, postComment } from "../../lib/request";
import Rating from "@mui/material/Rating";
import { useEffect } from "react";

interface IGetProductFunction {
    getProduct: () => void;
}

const UserReview: React.FC<IGetProductFunction> = ({ getProduct }) => {
    const user = useUser(state => state.user);
    const product = useProducts(state => state.product);
    const userRate = useProducts(state => state.userRate);
    const setUserRate = useProducts(state => state.setUserRate);
    const userComment = useProducts(state => state.userComment);
    const setUserComment = useProducts(state => state.setUserComment);
    const evaluation = useProducts(state => state.evaluation);
    const setEvaluation = useProducts(state => state.setEvaluation);

    useEffect(() => {
        // чтобы не было лишних проверок
        if (evaluation) {
            makeEvaluation();
        }
    }, [evaluation]);

    // вызов без useEffect передает userRate как null, поэтому исп. makePost()
    // отдельно выносим по причине асинхронности
    async function makeEvaluation(): Promise<void> {
        // проверку требует типизация
        if (product && user) {
            if (evaluation === "postRate" && userRate) {
                await postRate(product.id, userRate, user.token);
                getProduct();
            } else if (evaluation === "putRate" && userRate) {
                await putRate(product.id, userRate, user.token);
                getProduct();
            } else if (evaluation === "postComment") {
                await postComment(product.id, userComment, user.token);
                getProduct();
                setUserComment("");
            }
        }

        setEvaluation(null);
    }

    return (
        <div className={style.userReviewContainer}>
            <div className={style.userReviewTitle}>LEAVE YOUR REVIEW</div>
            {user ? (
                <div className={style.userRateContainer}>
                    <Rating
                        name="controlled"
                        sx={{
                            "& .MuiRating-iconFilled": {
                                color: "rgb(6, 130, 171)"
                            }
                        }}
                        // rating передает string, нужно корректировать
                        value={userRate ? +userRate : userRate} // не принимает string
                        onChange={evt => {
                            if (userRate === null) {
                                const ratesInput = evt.target as HTMLInputElement; // будет считываться как string
                                setUserRate(Number(ratesInput.value));
                                setEvaluation("postRate");
                            } else {
                                // необходимо ли органичить действие при дублировании оценки: было 2, нажали 2?
                                const ratesInput = evt.target as HTMLInputElement; // будет считываться как string
                                setUserRate(Number(ratesInput.value));
                                setEvaluation("putRate");
                            }
                        }}
                    />
                    <div className={style.messageToUser}>Your last rate</div>
                </div>
            ) : (
                <div className={style.userRateContainer}>
                    <Rating name="no-value" value={null} readOnly />
                    <div className={style.messageToUser}>Please login</div>
                </div>
            )}
            <div className={style.userCommentContainer}>
                <textarea
                    placeholder="Comment"
                    className={style.commentTextArea}
                    disabled={user ? false : true}
                    value={userComment}
                    onChange={evt => setUserComment(evt.target.value)}
                ></textarea>
                <button
                    disabled={user ? false : true}
                    className={user ? style.addCommentButton : style.disabledAddCommentButton}
                    onClick={() => {
                        if (userComment) {
                            setEvaluation("postComment");
                        }
                    }}
                >
                    ADD COMMENT
                </button>
            </div>
        </div>
    );
};

export default UserReview;
