import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Button
} from '@mui/material';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
  getDocs,
  query,
  collectionGroup,
  where,
  updateDoc,
  collection,
  doc
} from 'firebase/firestore';
import { auth, db } from '../../../firebase';

function Row(props) {
  const { row } = props;
  const [openVendor, setOpenVendor] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleClickVendor = () => {
    setOpenVendor(!openVendor);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Price list accepted');
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleClickVendor}>
            {openVendor ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{row.createdAt}</TableCell>
        <TableCell>
          {row.verified === true ? (
            <Typography variant="body2" color="textSecondary">
              Yes
            </Typography>
          ) : (
            <Typography variant="body2" color="textSecondary">
              No
            </Typography>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 80 }} colSpan={6}>
          <Collapse in={openVendor} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle2" gutterBottom component="div">
                Order Details
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.products.map((product, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {product.productName}
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.description}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleSubmit}
                      >
                        Accept Price
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired,
    vendor: PropTypes.string.isRequired,
    vendorId: PropTypes.string.isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        productName: PropTypes.string.isRequired,
        price: PropTypes.number,
        quantity: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      })
    )
  }).isRequired
};

const columns = [
  {
    id: '1',
    label: 'Vendor ID',
    minWidth: 100
  },
  {
    id: '2',
    label: 'Created At',
    minWidth: 170
  },
  {
    id: '3',
    label: 'Verified',
    minWidth: 100,
    format: (value) => value.toLocaleString()
  }
];

export default function VendorsPriceList() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [visible, setVisible] = useState(true);
  const [vendorsData, setVendorsData] = useState([]);
  const [products, setProducts] = useState([]);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 5));
    setPage(0);
  };

  const handleClickVendor = (e) => {
    setVisible(!visible);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(() => {
      const { currentUser } = auth;
      const vendorRef = query(
        collectionGroup(db, 'vendors'),
        where('customerId', '==', currentUser?.uid)
      );
      const querySnapshot = getDocs(vendorRef);
      const getData = async () => {
        const data = await querySnapshot;
        setVendorsData(
          JSON.parse(
            JSON.stringify(
              data.docs
                .map((doc) => (doc.data() ? { ...doc.data(), id: doc.id } : null))
                .filter((element) => element !== null)
            )
          )
        );
        console.log(vendorsData);
        setProducts(
          vendorsData.map((vendor) =>
            vendor.products.map((product) => ({
              ...product,
              vendor: vendor.vendorName
            }))
          )
        );
        console.log(products);
      };
      getData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      <Card>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {vendorsData.map((row) => (
                <>
                  <Row key={row.id} row={row} />
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={vendorsData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </>
  );
}
