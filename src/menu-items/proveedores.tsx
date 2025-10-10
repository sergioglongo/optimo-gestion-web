import { FormattedMessage } from 'react-intl';
import { FaDolly } from 'react-icons/fa';

// type
import { NavItemType } from 'types/menu';
import { FaDonate } from 'react-icons/fa';
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const proveedoresColapsable: NavItemType = {
  id: 'proveedores-collapse',
  title: <FormattedMessage id="Providers" />,
  type: 'collapse',
  icon: FaDolly, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'proveedores',
      title: <FormattedMessage id="Providers" />,
      type: 'item',
      url: '/proveedores/listado',
      icon: FaDolly
    },
    {
      id: 'pagos',
      title: <FormattedMessage id="Payments" />,
      type: 'item',
      url: '/proveedores/pagos',
      icon: FaDonate
    }
  ]
};

const proveedores: NavItemType = {
  id: 'group-proveedores',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [proveedoresColapsable] // Now contains the collapsible menu
};

export default proveedores;
