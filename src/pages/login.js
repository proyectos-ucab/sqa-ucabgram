import { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import * as ROUTES from '../contants/routes';

import { FirebaseContext } from '../context';

export default function () {
  const { firebase } = useContext(FirebaseContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const isInvalid = password === '' || email === '';

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      setEmail('');
      setPassword('');
      setError(error.message);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="container flex mx-auto max-w-screen-sm items-center justify-center h-screen">
      <div className="flex flex-col">
        <div className="flex flex-col items-center bg-white p-4 border border-gray-primary mb-4 rounded">
          {error && <p className="mb-4 text-xs text-red-primary">{error}</p>}

          <form onSubmit={handleLogin} method="POST">
            <input
              aria-label="Enter your email address"
              type="text"
              placeholder="Email address"
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
          ${isInvalid && 'opacity-50'}`}
            >
              Login
            </button>
          </form>
        </div>
        <div className="flex justify-center items-center flex-col w-full bg-white p-4 rounded border border-gray-primary">
          <p className="text-sm">
            Don't have an account?{` `}
            <Link to={ROUTES.SIGN_UP} className="font-bold text-blue-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
