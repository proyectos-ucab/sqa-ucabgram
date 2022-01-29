import { useState, useEffect, useContext } from "react";
import { FirebaseContext } from "../context";
import { getUserByUserId } from "../services";

export function useAuthListener() {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("authUser"))
  );
  const { firebase } = useContext(FirebaseContext);

  useEffect(() => {
    const listener = firebase.auth().onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const result = await getUserByUserId(authUser.uid);
        if (result != null) {
          const user = result[0];
          if (user.status == "active") {
            localStorage.setItem("authUser", JSON.stringify(authUser));
            setUser(authUser);
          }
        }
      } else {
        localStorage.removeItem("authUser");
        setUser(null);
      }
    });

    return () => listener();
  }, [firebase]);

  return { user };
}
