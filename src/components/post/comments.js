import { useState, useContext } from "react";
import PropTypes from "prop-types";
import { formatDistance } from "date-fns";
import { Link } from "react-router-dom";
import { UserContext } from "../../context";

import { AddComment } from "../post";
import { deleteComment } from "../../services";
import { useUser } from "../../hooks";

export function Comments({
  docId,
  photoId,
  comments: allComments,
  posted,
  commentInput,
  userId,
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [comments, setComments] = useState(allComments);
  const [commentsSlice, setCommentsSlice] = useState(3);

  const showNextComments = () => {
    setCommentsSlice(commentsSlice + 3);
  };

  const isAdmin = user != null && user.admin === true;

  const userIsAbleToDeleteAllComments = userId === loggedInUser.uid;

  async function handleDeleteComment(commnetId) {
    await deleteComment(photoId, commnetId);
    location.reload();
  }

  return (
    <>
      <div className="p-4 pt-1 pb-4">
        {comments.slice(0, commentsSlice).map((item) => (
          <p
            key={`${item.comment}-${item.displayName}`}
            className="mb-1 comment"
          >
            <Link to={`/p/${item.displayName}`}>
              <span className="mr-1 font-bold">{item.displayName}</span>
            </Link>
            <span>{item.comment}</span>

            {userIsAbleToDeleteAllComments ||
            item.userId === loggedInUser.uid ||
            isAdmin ? (
              <div
                className="comment__delete-icon"
                onClick={() => {
                  handleDeleteComment(item.commentId);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            ) : null}
          </p>
        ))}
        {comments.length >= 3 && commentsSlice < comments.length && (
          <button
            className="text-sm text-gray-base mb-1 cursor-pointer focus:outline-none"
            type="button"
            onClick={showNextComments}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                showNextComments();
              }
            }}
          >
            View more comments
          </button>
        )}
        <p className="text-gray-base uppercase text-xs mt-2">
          {formatDistance(posted, new Date())} ago
        </p>
      </div>
      <AddComment
        docId={docId}
        comments={comments}
        setComments={setComments}
        commentInput={commentInput}
      />
    </>
  );
}

Comments.propTypes = {
  docId: PropTypes.string.isRequired,
  comments: PropTypes.array.isRequired,
  posted: PropTypes.number.isRequired,
  commentInput: PropTypes.object.isRequired,
};
