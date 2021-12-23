import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { Header } from '../components';

export default function Dashboard() {
  return (
    <div className="bg-gray-background">
      <Header />
      <div className="grid grid-cols-3 gap-4 justify-between mx-auto max-w-screen-lg">
        Dashboard
      </div>
    </div>
  );
}
