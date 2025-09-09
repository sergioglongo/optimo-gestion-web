// third-party
import { FormattedMessage } from 'react-intl';

// project import

// assets
import { DashboardOutlined, GoldOutlined, LoadingOutlined } from '@ant-design/icons';

// type
// import { any } from 'types/menu';

// import { useGetMenu } from 'api/menu';

const icons = {
  dashboard: DashboardOutlined,
  components: GoldOutlined,
  loading: LoadingOutlined
};

// const loadingMenu: any = {
//   id: 'group-dashboard-loading',
//   title: <FormattedMessage id="dashboard" />,
//   type: 'group',
//   icon: icons.loading,
//   children: [
//     {
//       id: 'dashboard1',
//       title: <FormattedMessage id="dashboard" />,
//       type: 'collapse',
//       icon: icons.loading,
//       children: [
//         {
//           id: 'default1',
//           title: 'loading',
//           type: 'item',
//           url: '/dashboard/default',
//           breadcrumbs: false
//         },
//         {
//           id: 'analytics1',
//           title: 'loading',
//           type: 'item',
//           url: '/dashboard/analytics',
//           breadcrumbs: false
//         }
//       ]
//     }
//   ]
// };

// ==============================|| MENU ITEMS - API ||============================== //

export const MenuFromAPI = () => {
  // const { menu, menuLoading } = useGetMenu();

  // if (menuLoading) return loadingMenu;

  const menu = {
    id: 'group-dashboard',
    title: 'dashboard',
    type: 'group',
    icon: 'dashboard',
    children: [
      {
        id: 'dashboard',
        title: 'dashboard',
        type: 'collapse',
        icon: 'dashboard',
        children: [
          {
            id: 'analytics',
            title: 'analytics',
            type: 'item',
            url: '/dashboard/analytics',
            breadcrumbs: false
          }
        ]
      }
    ]
  };

  const subChildrenList = (children: any[]) => {
    return children?.map((subList: any) => {
      return fillItem(subList);
    });
  };

  const itemList = (subList: any) => {
    let list = fillItem(subList);

    // if collapsible item, we need to feel its children as well
    if (subList.type === 'collapse') {
      list.children = subChildrenList(subList.children!);
    }
    return list;
  };

  const childrenList: any[] | undefined = menu?.children?.map((subList: any) => {
    return itemList(subList);
  });

  let menuList = fillItem(menu, childrenList);
  return menuList;
};

function fillItem(item: any, children?: any[] | undefined) {
  return {
    ...item,
    title: <FormattedMessage id={`${item?.title}`} />,
    // @ts-ignore
    icon: icons[item?.icon],
    ...(children && { children })
  };
}
