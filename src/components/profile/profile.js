import { useReducer, useEffect } from "react";
import PropTypes from "prop-types";

import { ProfileHeader, Photos } from "../profile";

import { getUserPhotosByUserId } from "../../services";

export function Profile({ user }) {
  const reducer = (state, newState) => ({ ...state, ...newState });
  const initialState = {
    profile: {},
    photosCollection: null,
    followerCount: 0,
  };

  const [{ profile, photosCollection, followerCount }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(() => {
    async function getProfileInfoAndPhotos() {
      const photos = await getUserPhotosByUserId(user.userId);
      dispatch({
        profile: user,
        photosCollection: photos,
        followerCount: user.followers != null ? user.followers.length : 0,
      });
    }
    getProfileInfoAndPhotos();
  }, [user.username]);

  return (
    <>
      <ProfileHeader
        photosCount={photosCollection != null ? photosCollection.length : 0}
        profile={profile}
        followerCount={followerCount}
        setFollowerCount={dispatch}
      />
      <Photos photos={photosCollection} profile={profile} />
    </>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    dateCreated: PropTypes.number,
    emailAddress: PropTypes.string,
    followers: PropTypes.array,
    following: PropTypes.array,
    fullName: PropTypes.string,
    userId: PropTypes.string,
    username: PropTypes.string,
  }),
};
