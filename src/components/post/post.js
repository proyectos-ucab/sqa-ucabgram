import { useRef } from "react";
import PropTypes from "prop-types";

import { PostHeader, Image, Actions, Footer, Comments, Video } from "../post";

export function Post({ content }) {
  const commentInput = useRef(null);
  const handleFocus = () => commentInput.current.focus();

  return (
    <div className="rounded col-span-4 border bg-white border-gray-primary mb-12">
      <PostHeader username={content.username} />
      {content.mediaType === "video" && (
        <Video src={content.imageSrc} caption={content.caption} />
      )}
      {content.mediaType == null || content.mediaType === "image" ? (
        <Image src={content.imageSrc} caption={content.caption} />
      ) : null}
      <Actions
        docId={content.docId}
        totalLikes={content.likes.length}
        likedPhoto={content.userLikedPhoto}
        handleFocus={handleFocus}
      />
      <Footer caption={content.caption} username={content.username} />
      <Comments
        docId={content.docId}
        photoId={content.photoId}
        comments={content.comments}
        posted={content.dateCreated}
        commentInput={commentInput}
        userId={content.userId}
      />
    </div>
  );
}

Post.propTypes = {
  content: PropTypes.shape({
    username: PropTypes.string.isRequired,
    imageSrc: PropTypes.string.isRequired,
    caption: PropTypes.string.isRequired,
    docId: PropTypes.string.isRequired,
    userLikedPhoto: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    comments: PropTypes.array.isRequired,
    dateCreated: PropTypes.number.isRequired,
  }),
};
