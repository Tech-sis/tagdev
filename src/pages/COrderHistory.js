// material
import { Container, Stack, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { OrderHistory } from '../components/_dashboard/products';
//

// ----------------------------------------------------------------------

export default function EcommerceShop() {
  return (
    <Page title="Dashboard: Order History">
      <Container>
        <Typography variant="h6" sx={{ mb: 5 }}>
          Order History
        </Typography>
        <OrderHistory />
      </Container>
    </Page>
  );
}
