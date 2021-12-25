import { useContext } from 'react';
import { Suggestions, User } from '../sidebar';
import { LoggedInUserContext } from '../../context';

export function Sidebar() {
  const { user: { docId = '', fullName, username, userId, following } = {} } =
    useContext(LoggedInUserContext);

  return (
    <div className="p-4">
      <User username={username} fullName={fullName} />
      <Suggestions
        userId={userId}
        following={following}
        loggedInUserDocId={docId}
      />
    </div>
  );
}
