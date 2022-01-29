import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { useUser } from "../../hooks";
import {
  deleteUser,
  isUserFollowingProfile,
  toggleFollow,
  updateUser,
} from "../../services";
import { UserContext, ModalContext, FirebaseContext } from "../../context";
import { DEFAULT_AVATAR_PATH } from "../../contants";
import { UserInfoForm } from "./user-info-form";
import * as ROUTES from "../../contants/routes";
import { useNavigate } from "react-router-dom";

export function ProfileHeader({
  photosCount,
  followerCount,
  setFollowerCount,
  profile: {
    docId: profileDocId,
    userId: profileUserId,
    fullName,
    followers,
    following,
    username: profileUsername,
    description,
    status,
  },
}) {
  const { user: loggedInUser } = useContext(UserContext);
  const { user } = useUser(loggedInUser?.uid);
  const [isFollowingProfile, setIsFollowingProfile] = useState(null);
  const activeBtnFollow = user?.username && user?.username !== profileUsername;
  const activeBtnDelete = user?.username && user?.username === profileUsername;
  const { handleModal } = useContext(ModalContext);
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const isAdmin = user != null && user.admin === true;

  const handleToggleFollow = async () => {
    setIsFollowingProfile((isFollowingProfile) => !isFollowingProfile);
    setFollowerCount({
      followerCount: isFollowingProfile ? followerCount - 1 : followerCount + 1,
    });
    await toggleFollow(
      isFollowingProfile,
      user.docId,
      profileDocId,
      profileUserId,
      user.userId
    );
  };

  useEffect(() => {
    const isLoggedInUserFollowingProfile = async () => {
      const isFollowing = await isUserFollowingProfile(
        user.username,
        profileUserId
      );
      setIsFollowingProfile(!!isFollowing);
    };

    if (user?.username && profileUserId) {
      isLoggedInUserFollowingProfile();
    }
  }, [user?.username, profileUserId]);

  const handleUserInfoClick = () => {
    if (profileUserId != user.userId && isAdmin == false) {
      return;
    }

    handleModal(
      <UserInfoForm
        user={{ profileUserId, fullName, description }}
        onFormSubmitted={() => {
          handleModal();
          location.reload();
        }}
      />
    );
  };

  const handleDeleteButtonClick = async () => {
    await deleteUser(profileUserId);
    firebase.auth().signOut();
    navigate(ROUTES.LOGIN);
  };

  const handleActivateButtonClick = async () => {
    await updateUser(profileUserId, {
      status: status === "active" ? "unactive" : "active",
    });
    location.reload();
  };

  return (
    <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
      <div className="container flex justify-center items-center">
        {profileUsername ? (
          <img
            className="rounded-full h-40 w-40 flex"
            alt={`${fullName} profile picture`}
            src={`/images/avatars/${profileUsername}.jpg`}
            onError={(e) => {
              e.target.src = DEFAULT_AVATAR_PATH;
            }}
          />
        ) : (
          <Skeleton circle height={150} width={150} count={1} />
        )}
      </div>
      <div className="flex items-center justify-center flex-col col-span-2">
        <div className="container flex items-center">
          <p className="text-2xl mr-4">{profileUsername}</p>
          {activeBtnFollow && isFollowingProfile === null ? (
            <Skeleton count={1} width={80} height={32} />
          ) : (
            activeBtnFollow && (
              <button
                className="bg-blue-medium font-bold text-sm rounded text-white w-20 h-8 mr-4"
                type="button"
                onClick={handleToggleFollow}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleToggleFollow();
                  }
                }}
              >
                {isFollowingProfile ? "Unfollow" : "Follow"}
              </button>
            )
          )}
          {activeBtnDelete || isAdmin ? (
            <button
              style={{ background: "#F47172" }}
              className="font-bold text-sm rounded text-white w-32 h-8"
              type="button"
              onClick={handleDeleteButtonClick}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleDeleteButtonClick();
                }
              }}
            >
              Eliminar Perfil
            </button>
          ) : null}

          {isAdmin && (
            <button
              style={{ background: "#3CB371" }}
              className="font-bold text-sm rounded text-white w-32 h-8 ml-4"
              type="button"
              onClick={handleActivateButtonClick}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  handleActivateButtonClick();
                }
              }}
            >
              {status === "active" ? "Desactivar Perfil" : "Activar Perfil"}
            </button>
          )}
        </div>
        <div className="container flex mt-4">
          <p className="mr-10">
            <span className="font-bold">{photosCount}</span> photos
          </p>
          <p className="mr-10">
            <span className="font-bold">{followerCount}</span>
            {` `}
            {followerCount === 1 ? `follower` : `followers`}
          </p>
          <p className="mr-10">
            <span className="font-bold">{following?.length}</span> following
          </p>
        </div>
        <div
          className="container mt-4 cursor-pointer"
          onClick={() => {
            handleUserInfoClick();
          }}
        >
          <p className="font-medium">
            {!fullName ? <Skeleton count={1} height={24} /> : fullName}
          </p>
          <p className="font-medium">
            {!description ? <Skeleton count={1} height={24} /> : description}
          </p>
        </div>
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  photosCount: PropTypes.number.isRequired,
  followerCount: PropTypes.number.isRequired,
  setFollowerCount: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    docId: PropTypes.string,
    userId: PropTypes.string,
    fullName: PropTypes.string,
    username: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
  }).isRequired,
};
