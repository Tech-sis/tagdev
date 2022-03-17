import { useFormik } from 'formik';
import { useState } from 'react';
// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import {
  // ProductSort,
  // ProductList,
  // ProductCartWidget,
  // ProductFilterSidebar,
  CreateOrder
} from '../components/_dashboard/products';
//
import PRODUCTS from '../_mocks_/products';

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  return (
    <Page title="Dashboard: Create order">
      <Container>
        <Typography variant="h6" sx={{ mb: 5 }}>
          Create New Order
        </Typography>
        <CreateOrder />
      </Container>
    </Page>
  );
}
