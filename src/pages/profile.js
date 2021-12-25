import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getUserByUsername } from '../services';
import * as ROUTES from '../contants/routes';

import { Header, Profile as UserProfile } from '../components';

export default function Profile() {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkUserExists() {
      const [user] = await getUserByUsername(username);
      if (user?.userId) {
        setUser(user);
      } else {
        navigate(ROUTES.NOT_FOUND);
      }
    }

    checkUserExists();
  }, [username]);

  return user?.username ? (
    <div>
      <Header />
      <div className="mx-auto max-w-screen-lg">
        <UserProfile user={user} />
      </div>
    </div>
  ) : null;
}
