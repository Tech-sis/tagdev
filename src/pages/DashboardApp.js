import { useState, useEffect } from 'react';
// material
import { Box, Grid, Container, Typography } from '@mui/material';
import { getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../firebase';
// components
import Page from '../components/Page';
import {
  AppTasks,
  AppNewUsers,
  AppBugReports,
  AppItemOrders,
  AppNewsUpdate,
  AppWeeklySales,
  AppOrderTimeline,
  AppCurrentVisits,
  AppWebsiteVisits,
  AppTrafficBySite,
  AppCurrentSubject,
  AppConversionRates
} from '../components/_dashboard/app';

// ----------------------------------------------------------------------

export default function DashboardApp() {
  const [name, setName] = useState([]);
  const { currentUser } = auth;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log(user);
      const docRef = collection(db, 'users');
      const getData = async () => {
        const data = await getDocs(docRef);
        console.log(
          data.docs
            .map((doc) => (doc.data().uid === currentUser?.uid ? doc.data() : null))
            .filter((element) => element !== null)
        );
        const userData = data.docs
          .map((doc) => (doc.data().uid === currentUser?.uid ? doc.data() : null))
          .filter((element) => element !== null)[0];
        console.log(
          userData?.displayName,
          userData?.email,
          userData?.phoneNumber,
          userData?.userType
        );

        localStorage.setItem(
          'user',
          JSON.stringify({
            companyName: userData?.companyName,
            displayName: userData?.displayName,
            email: userData?.email,
            userType: userData?.userType
          })
        );
      };
      getData();
    });
    return () => unsubscribe();
  }, []);

  const user = JSON.parse(localStorage.getItem('user'));
  useEffect(() => {
    if (user?.userType === 'admin') {
      setName(user?.displayName);
    } else if (user?.userType === 'vendor') {
      setName(user?.companyName);
    } else if (user?.userType === 'customer') {
      setName(user?.displayName);
    } else {
      setName(user?.displayName);
    }
  }, [user]);

  return (
    <Page title="Dashboard | Minimal-UI">
      <Container maxWidth="xl">
        <Box sx={{ pb: 5 }}>
          <Typography variant="h4" sx={{ textTransform: 'capitalize' }}>
            Hi, {name}
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <AppWeeklySales />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppNewUsers />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppItemOrders />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <AppBugReports />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppWebsiteVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentVisits />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppConversionRates />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppCurrentSubject />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppNewsUpdate />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppOrderTimeline />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <AppTrafficBySite />
          </Grid>

          <Grid item xs={12} md={6} lg={8}>
            <AppTasks />
          </Grid>
        </Grid>
      </Container>
    </Page>
  );
}
