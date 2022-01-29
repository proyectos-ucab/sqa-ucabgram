import { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import * as ROUTES from "../contants/routes";
import * as COLLECTIONS from "../contants/collections";

import { FirebaseContext } from "../context";
import { doesUsernameExist } from "../services";

export default function () {
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isInvalid = password === "" || email === "";

  const handleSignUp = async (event) => {
    event.preventDefault();

    const userNameExist = await doesUsernameExist(username);

    if (userNameExist === false) {
      try {
        const createdUserResult = await firebase
          .auth()
          .createUserWithEmailAndPassword(email, password);

        await createdUserResult.user.updateProfile({
          displayName: username,
        });

        await firebase.firestore().collection(COLLECTIONS.USERS).add({
          userId: createdUserResult.user.uid,
          username: username.toLowerCase(),
          fullName: fullName,
          emailAddress: email.toLowerCase(),
          following: [],
          dateCreated: Date.now(),
          status: "active",
        });

        navigate(ROUTES.DASHBOARD);
      } catch (error) {
        setError(error.message);
      }
    } else {
      setError("Username already taken");
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="container flex mx-auto max-w-screen-sm items-center justify-center h-screen">
      <div className="flex flex-col">
        <h1 className="flex justify-center w-full">
          <Link to={ROUTES.DASHBOARD} aria-label="Instagram logo">
            <img src="/images/logo.png" alt="Instagram" className="mb-4" />
          </Link>
        </h1>
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          {error && (
            <span className="mb-4 text-xs text-red-primary">{error}</span>
          )}

          <form onSubmit={handleSignUp} method="POST">
            <input
              aria-label="Enter your user name"
              type="text"
              placeholder="User Name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setUsername(target.value)}
              value={username}
            />
            <input
              aria-label="Enter your full name"
              type="text"
              placeholder="Full Name"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setFullName(target.value)}
              value={fullName}
            />
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email Address"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setEmail(target.value)}
              value={email}
            />
            <input
              aria-label="Enter your password"
              type="password"
              placeholder="Password"
              className="text-sm text-gray-base w-full mr-3 py-5 px-4 h-2 border border-gray-primary rounded mb-2"
              onChange={({ target }) => setPassword(target.value)}
              value={password}
            />
            <button
              disabled={isInvalid}
              type="submit"
              className={`bg-blue-medium text-white w-full rounded h-8 font-bold
          ${isInvalid && "opacity-50"}`}
            >
              Sign up
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Already have an account?{` `}
            <Link to={ROUTES.LOGIN} className="font-bold text-blue-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
