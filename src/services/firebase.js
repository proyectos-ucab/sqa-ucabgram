import { firebase, FieldValue } from "../lib";

import * as COLLECTIONS from "../contants/collections";
import { guidGenerator } from "../helpers";

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection(COLLECTIONS.USERS)
    .where("username", "==", username)
    .get();

  if (result.docs.length <= 0) {
    return false;
  } else {
    return true;
  }
}

export async function getUserByUsername(username) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", username.toLowerCase())
    .get();

  return result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));
}

export async function getUserPhotosByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "==", userId)
    .get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));
  return photos;
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("userId", "==", userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}

export async function getSuggestedProfiles(userId, following) {
  let query = firebase.firestore().collection("users");

  if (following.length > 0) {
    query = query.where("userId", "not-in", [...following, userId]);
  } else {
    query = query.where("userId", "!=", userId);
  }
  const result = await query.limit(10).get();

  const profiles = result.docs.map((user) => ({
    ...user.data(),
    docId: user.id,
  }));

  return profiles;
}

export async function getPhotos(userId, following) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("userId", "in", following)
    .get();

  const userFollowedPhotos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    userFollowedPhotos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}

export async function updateLoggedInUserFollowing(
  loggedInUserDocId,
  profileId,
  isFollowingProfile
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(loggedInUserDocId)
    .update({
      following: isFollowingProfile
        ? FieldValue.arrayRemove(profileId)
        : FieldValue.arrayUnion(profileId),
    });
}

export async function updateFollowedUserFollowers(
  profileDocId,
  loggedInUserDocId,
  isFollowingProfile
) {
  return firebase
    .firestore()
    .collection("users")
    .doc(profileDocId)
    .update({
      followers: isFollowingProfile
        ? FieldValue.arrayRemove(loggedInUserDocId)
        : FieldValue.arrayUnion(loggedInUserDocId),
    });
}

export async function isUserFollowingProfile(
  loggedInUserUsername,
  profileUserId
) {
  const result = await firebase
    .firestore()
    .collection("users")
    .where("username", "==", loggedInUserUsername) // karl (active logged in user)
    .where("following", "array-contains", profileUserId)
    .get();

  const [response = {}] = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return response.userId;
}

export async function toggleFollow(
  isFollowingProfile,
  activeUserDocId,
  profileDocId,
  profileUserId,
  followingUserId
) {
  // 1st param: karl's doc id
  // 2nd param: raphael's user id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateLoggedInUserFollowing(
    activeUserDocId,
    profileUserId,
    isFollowingProfile
  );

  // 1st param: karl's user id
  // 2nd param: raphael's doc id
  // 3rd param: is the user following this profile? e.g. does karl follow raphael? (true/false)
  await updateFollowedUserFollowers(
    profileDocId,
    followingUserId,
    isFollowingProfile
  );
}

export async function createUserPost(userId, fileUrl, caption, mediaType) {
  const result = await firebase.firestore().collection("photos").add({
    userId,
    caption: caption,
    imageSrc: fileUrl,
    photoId: guidGenerator(),
    dateCreated: Date.now(),
    comments: [],
    likes: [],
    mediaType: mediaType,
  });

  return result;
}

export async function updateUser(userId, payload) {
  const result = await getUserByUserId(userId);

  if (result != null && result.length > 0) {
    const user = result[0];
    return firebase
      .firestore()
      .collection("users")
      .doc(user.docId)
      .update({
        ...payload,
      });
  }
}

export async function deleteUser(userId) {
  const posts = await getUserPhotosByUserId(userId);

  posts.forEach(async (post) => {
    await deletePostByDocId(post.docId);
  });

  const result = await getUserByUserId(userId);

  if (result != null && result.length > 0) {
    const user = result[0];
    return firebase.firestore().collection("users").doc(user.docId).delete();
  }
}

export async function deletePostByDocId(docId) {
  return firebase.firestore().collection("photos").doc(docId).delete();
}

export async function getPostByPhotoId(photoId) {
  const result = await firebase
    .firestore()
    .collection("photos")
    .where("photoId", "==", photoId)
    .get();

  const post = result.docs.map((post) => ({
    ...post.data(),
    docId: post.id,
  }));

  return post[0];
}

export async function deleteComment(photoId, commnetId) {
  const post = await getPostByPhotoId(photoId);

  if (post != null) {
    const comments = new Array(
      ...post.comments.filter((comment) => comment.commentId !== commnetId)
    );

    return firebase.firestore().collection("photos").doc(post.docId).update({
      comments,
    });
  }
}

export async function getAllPosts(userId) {
  const result = await firebase.firestore().collection("photos").get();

  const photos = result.docs.map((photo) => ({
    ...photo.data(),
    docId: photo.id,
  }));

  const photosWithUserDetails = await Promise.all(
    photos.map(async (photo) => {
      let userLikedPhoto = false;
      if (photo.likes.includes(userId)) {
        userLikedPhoto = true;
      }
      const user = await getUserByUserId(photo.userId);
      const { username } = user[0];
      return { username, ...photo, userLikedPhoto };
    })
  );

  return photosWithUserDetails;
}
