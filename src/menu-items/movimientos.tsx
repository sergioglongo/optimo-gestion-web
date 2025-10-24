import { FormattedMessage } from 'react-intl';
import { FaChartBar, FaDonate, FaPoll } from 'react-icons/fa';

// type
import { NavItemType } from 'types/menu';
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const movimientosColapsable: NavItemType = {
  id: 'movimientos-collapse',
  title: <FormattedMessage id="Transactions" />,
  type: 'collapse',
  icon: FaPoll, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'movimientos',
      title: <FormattedMessage id="Transactions" />,
      type: 'item',
      url: '/movimientos/movimientos',
      icon: FaChartBar
    },
    {
      id: 'fondoreserva',
      title: <FormattedMessage id="reservs" />,
      type: 'item',
      url: '/movimientos/fondos',
      icon: FaDonate
    }
  ]
};

const movimientos: NavItemType = {
  id: 'group-movimientos',
  // title: <FormattedMessage id="Transactions" />,
  type: 'group',
  children: [movimientosColapsable] // Now contains the collapsible menu
};

export default movimientos;
