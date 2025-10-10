// This is example of menu item without group for horizontal layout. There will be no children.

// third-party
import { FormattedMessage } from 'react-intl';

// type
import { NavItemType } from 'types/menu';
// icons
import { FaHome } from 'react-icons/fa';

// ==============================|| MENU ITEMS - SAMPLE PAGE ||============================== //

const home: NavItemType = {
  id: 'home',
  title: <FormattedMessage id="Home" />,
  type: 'group',
  url: '/home',
  icon: FaHome
};

export default home;
