import { Icon } from '@iconify/react';
import pieChart2Fill from '@iconify/icons-eva/pie-chart-2-fill';
import peopleFill from '@iconify/icons-eva/people-fill';
import shoppingBagFill from '@iconify/icons-eva/shopping-bag-fill';
import fileTextFill from '@iconify/icons-eva/file-text-fill';
import lockFill from '@iconify/icons-eva/lock-fill';
import personAddFill from '@iconify/icons-eva/person-add-fill';
import alertTriangleFill from '@iconify/icons-eva/alert-triangle-fill';
// import { render } from 'react-dom';

// ----------------------------------------------------------------------

const getIcon = (name) => <Icon icon={name} width={22} height={22} />;

export const sidebarConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'all customers',
    path: '/dashboard/user',
    icon: getIcon(peopleFill)
  },
  {
    title: 'all vendors',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'products',
    path: '/dashboard/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'all orders',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  }
];

export const notUserConfig = [
  {
    title: 'login',
    path: '/login',
    icon: getIcon(lockFill)
  },
  {
    title: 'register',
    path: '/register',
    icon: getIcon(personAddFill)
  },
  {
    title: 'Not found',
    path: '/404',
    icon: getIcon(alertTriangleFill)
  }
];

export const customerConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'blog',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'create new order',
    path: '/dashboard/new-order',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'my Orders',
    path: '/dashboard/orders',
    icon: getIcon(shoppingBagFill)
  }
];

export const vendorConfig = [
  {
    title: 'dashboard',
    path: '/dashboard/app',
    icon: getIcon(pieChart2Fill)
  },
  {
    title: 'Vendor Order review',
    path: '/dashboard/blog',
    icon: getIcon(fileTextFill)
  },
  {
    title: 'past orders',
    path: '/dashboard/products',
    icon: getIcon(shoppingBagFill)
  },
  {
    title: 'my vendor profile',
    path: '/dashboard/products',
    icon: getIcon(shoppingBagFill)
  }
];
