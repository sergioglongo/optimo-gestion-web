import { FormattedMessage } from 'react-intl';

// type
import { NavItemType } from 'types/menu';
import { FaChartBar } from 'react-icons/fa';
import { FaMoneyCheckAlt } from 'react-icons/fa';

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const movimientosColapsable: NavItemType = {
  id: 'movimientos-collapse',
  title: <FormattedMessage id="Transactions" />,
  type: 'collapse',
  icon: FaChartBar, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'gastos',
      title: <FormattedMessage id="Expenses" />,
      type: 'item',
      url: '/movimientos/gastos',
      icon: FaMoneyCheckAlt
    },
    {
      id: 'transacciones',
      title: <FormattedMessage id="transaction" />,
      type: 'item',
      url: '/movimientos/transacciones',
      icon: FaChartBar
    }
  ]
};

const movimientos: NavItemType = {
  id: 'group-movimientos',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [movimientosColapsable] // Now contains the collapsible menu
};

export default movimientos;
