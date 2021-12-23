import { firebase, FieldValue } from '../lib';

import * as COLLECTIONS from '../contants/collections';

export async function doesUsernameExist(username) {
  const result = await firebase
    .firestore()
    .collection(COLLECTIONS.USERS)
    .where('username', '==', username)
    .get();

  if (result.docs.length <= 0) {
    return false;
  } else {
    return true;
  }
}

export async function getUserByUserId(userId) {
  const result = await firebase
    .firestore()
    .collection('users')
    .where('userId', '==', userId)
    .get();
  const user = result.docs.map((item) => ({
    ...item.data(),
    docId: item.id,
  }));

  return user;
}
