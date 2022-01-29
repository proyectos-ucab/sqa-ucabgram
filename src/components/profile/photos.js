/* eslint-disable no-nested-ternary */
import { useContext } from "react";
import { UserContext } from "../../context";
import { useUser } from "../../hooks";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { deletePostByDocId } from "../../services";

export function Photos({
  photos,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
    description,
  },
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const ownUser = user?.username && user?.username === profileUsername;

  const isAdmin = user != null && user.admin === true;

  async function handleDeletePost(photoDocId) {
    await deletePostByDocId(photoDocId);
    location.reload();
  }

  return (
    <div className="h-16 border-t border-gray-primary mt-12 pt-4">
      <div className="grid grid-cols-3 gap-8 mt-4 mb-12">
        {!photos
          ? new Array(12)
              .fill(0)
              .map((_, i) => <Skeleton key={i} width={320} height={400} />)
          : photos != null && photos.length > 0
          ? photos.map((photo) => (
              <div key={photo.docId} className="relative group">
                {photo.mediaType === "video" && (
                  <video
                    className="w-full"
                    src={photo.imageSrc}
                    controls
                    alt={photo.caption}
                  ></video>
                )}
                {photo.mediaType == null || photo.mediaType === "image" ? (
                  <img
                    className="w-full h-full object-cover"
                    src={photo.imageSrc}
                    alt={photo.caption}
                  />
                ) : null}

                <div className="absolute bottom-0 left-0 bg-gray-200 z-10 w-full justify-evenly items-center h-full bg-black-faded group-hover:flex hidden">
                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {photo.likes != null ? photo.likes.length : 0}
                  </p>

                  <p className="flex items-center text-white font-bold">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-8 mr-4"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {photo.comments != null ? photo.comments.length : 0}
                  </p>

                  {ownUser || isAdmin ? (
                    <p
                      className="flex items-center text-white font-bold cursor-pointer"
                      onClick={() => {
                        handleDeletePost(photo.docId);
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
                    </p>
                  ) : null}
                </div>
              </div>
            ))
          : null}
      </div>

      {!photos ||
        (photos.length === 0 && (
          <p className="text-center text-2xl">No Posts Yet</p>
        ))}
    </div>
  );
}

Photos.propTypes = {
  photos: PropTypes.array,
};
