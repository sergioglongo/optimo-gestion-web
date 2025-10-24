import { FormattedMessage } from 'react-intl';

import { FaHandHoldingUsd, FaJournalWhills } from 'react-icons/fa';
// type
import { NavItemType } from 'types/menu';
import { FaBook } from 'react-icons/fa';
import { FaBookDead } from 'react-icons/fa';
// ==============================|| MENU ITEMS - APPLICATIONS ||============================== //

const expensasColapsable: NavItemType = {
  id: 'expensas-collapse',
  title: <FormattedMessage id="Fees" />,
  type: 'collapse',
  icon: FaJournalWhills, // Using AppstoreAddOutlined as the main icon
  children: [
    {
      id: 'expensas',
      title: <FormattedMessage id="Statement" />,
      type: 'item',
      url: '/expensas/liquidaciones',
      icon: FaBook
    },
    {
      id: 'cobranzas',
      title: <FormattedMessage id="Incomes" />,
      type: 'item',
      url: '/expensas/cobranzas',
      icon: FaHandHoldingUsd
    },
    {
      id: 'Deudores',
      title: <FormattedMessage id="overdue-list" />,
      type: 'item',
      url: '/expensas/deudores',
      icon: FaBookDead
    }
  ]
};

const expensas: NavItemType = {
  id: 'group-expensas',
  // title: <FormattedMessage id="Consorcios" />,
  type: 'group',
  children: [expensasColapsable] // Now contains the collapsible menu
};

export default expensas;
