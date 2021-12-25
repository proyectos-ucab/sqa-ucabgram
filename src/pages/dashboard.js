import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Header, Sidebar, Timeline } from '../components';
import { LoggedInUserContext } from '../context';
import { useUser } from '../hooks';

export default function Dashboard({ user: loggedInUser }) {
  const { user, setActiveUser } = useUser(loggedInUser.uid);

  return (
    <LoggedInUserContext.Provider value={{ user, setActiveUser }}>
      <div>
        <Header />
        <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
          <Timeline />
          <Sidebar />
        </div>
      </div>
    </LoggedInUserContext.Provider>
  );
}

Dashboard.propTypes = {
  user: PropTypes.object.isRequired,
};
