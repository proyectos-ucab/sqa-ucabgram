import React, { lazy, useContext } from 'react';
import {
  Routes,
  Route,
  BrowserRouter,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom';
import * as ROUTES from './contants/routes';
import { UserContext } from './context';
import { useAuthListener } from './hooks';
const Login = lazy(() => import('./pages/login'));
const Signup = lazy(() => import('./pages/signup'));
const NotFound = lazy(() => import('./pages/not-found'));
const Dashboard = lazy(() => import('./pages/dashboard'));

function RequireAuth({ user }) {
  let location = useLocation();

  if (user == null) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} />;
  }

  return <Outlet />;
}

export default function App() {
  const { user } = useAuthListener();

  return (
    <UserContext.Provider value={{ user }}>
      <BrowserRouter>
        <Routes>
          <Route element={<RequireAuth user={user} />}>
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <React.Suspense fallback={<p>Loading...</p>}>
                  <Dashboard />
                </React.Suspense>
              }
            />
          </Route>

          <Route
            path={ROUTES.LOGIN}
            element={
              <React.Suspense fallback={<p>Loading...</p>}>
                {user != null ? <Navigate to={ROUTES.DASHBOARD} /> : <Login />}
              </React.Suspense>
            }
          />
          <Route
            path={ROUTES.SIGN_UP}
            element={
              <React.Suspense fallback={<p>Loading...</p>}>
                {user != null ? <Navigate to={ROUTES.DASHBOARD} /> : <Signup />}
              </React.Suspense>
            }
          />
          <Route
            path={'*'}
            element={
              <React.Suspense fallback={<p>Loading...</p>}>
                <NotFound />
              </React.Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserContext.Provider>
  );
}
