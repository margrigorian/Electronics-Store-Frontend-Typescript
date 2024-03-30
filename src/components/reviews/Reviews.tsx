import style from "./Reviews.module.css";
import React from "react";
import { useUser, useProducts } from "../../store/store";
import { deleteComment } from "../../lib/request";
import * as Icon from "react-bootstrap-icons";
import Rating from "@mui/material/Rating";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";

interface IGetProductFunction {
    getProduct: () => void;
}

const Reviews: React.FC<IGetProductFunction> = ({ getProduct }) => {
    const user = useUser(state => state.user);
    const product = useProducts(state => state.product);

    async function deleteUserComment(commentId: number) {
        if (product && user) {
            await deleteComment(product.id, commentId, user.token);
            getProduct();
        }
    }

    return (
        <div className={style.evaluationContainer}>
            <div>CUSTOMER REVIEWS</div>
            {product && product.comments.length > 0 ? (
                <div className={style.reviewsContainer}>
                    {product.comments.map(el => (
                        <div key={`commentId-${el.comment_id}`} className={style.review}>
                            <div>
                                <div className={style.nameAndStarsContainer}>
                                    <div className={style.username}>{el.username}</div>
                                    {el.rate ? (
                                        <Rating
                                            name="read-only"
                                            key={`rateId-${Math.random()}`}
                                            value={el.rate}
                                            readOnly
                                            size="small"
                                            sx={{
                                                "& .MuiRating-iconFilled": {
                                                    color: "rgb(6, 130, 171)"
                                                }
                                            }}
                                        />
                                    ) : (
                                        <Rating
                                            name="read-only"
                                            value={null}
                                            size="small"
                                            readOnly
                                        />
                                    )}
                                </div>
                                <div className={style.comment}>{el.comment}</div>
                            </div>
                            <div className={style.fotterOfCommentContainer}>
                                <div>
                                    <Icon.HandThumbsUp className={style.handIcon} />
                                    <Icon.HandThumbsDown className={style.handIcon} />
                                </div>
                                {user ? (
                                    user.status === "admin" || el.user_id === Number(user.id) ? (
                                        <div
                                            onClick={() => {
                                                deleteUserComment(el.comment_id);
                                            }}
                                            className={style.deleteCommentText}
                                        >
                                            Delete comment
                                        </div>
                                    ) : (
                                        ""
                                    )
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className={style.noReviewContainer}>
                    <DriveFileRenameOutlineIcon />
                    <div>NO REVIEWS</div>
                </div>
            )}
        </div>
    );
};

export default Reviews;
