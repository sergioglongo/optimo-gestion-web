import { FormattedMessage } from 'react-intl';

// type
import { NavItemType } from 'types/menu';
import { FaMoneyBillWave } from 'react-icons/fa';
import { FaMoneyCheckAlt } from 'react-icons/fa';
import { FaTasks } from 'react-icons/fa';

// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const egresosColapsable: NavItemType = {
  id: 'egresos-collapse',
  title: <FormattedMessage id="outflows" />,
  type: 'collapse',
  icon: FaTasks, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'gastos',
      title: <FormattedMessage id="Expenses" />,
      type: 'item',
      url: '/egresos/gastos',
      icon: FaMoneyCheckAlt
    },
    {
      id: 'pagos',
      title: <FormattedMessage id="Payments" />,
      type: 'item',
      url: '/egresos/pagos',
      icon: FaMoneyBillWave
    }
  ]
};

const egresos: NavItemType = {
  id: 'group-egresos',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [egresosColapsable] // Now contains the collapsible menu
};

export default egresos;
