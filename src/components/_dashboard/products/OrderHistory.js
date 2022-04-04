/* eslint-disable no-restricted-globals */
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
import { sentenceCase } from 'change-case';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getDocs, collection, query, where, collectionGroup } from 'firebase/firestore';
import Label from '../../Label';
import { auth, db } from '../../../firebase';
import VendorsPriceList from './VendorsPriceList';

function Row(props) {
  const { row } = props;
  const { product } = props;
  const [open, setOpen] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const handleClickVendor = () => {
    // setOpenVendor(!openVendor);
    setVisible(!visible);
  };

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={handleClick}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.id}
        </TableCell>
        <TableCell>{row.createdAt}</TableCell>
        <TableCell>
          <Label variant="ghost" color={(status === 'banned' && 'error') || 'success'}>
            {sentenceCase(row.status)}
          </Label>
        </TableCell>
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
        <TableCell>
          {row.action === true ? (
            <Button variant="outlined" color="primary" size="small" onClick={handleClick}>
              View Products
            </Button>
          ) : (
            <Button variant="outlined" color="primary" size="small" onClick={handleClick}>
              View Products
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0, paddingLeft: 80 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom component="div">
                PRODUCT LIST
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Product Name</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orders.map((order, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        {order.productName}
                      </TableCell>
                      <TableCell>
                        {order.price === undefined ? (
                          <Typography variant="body2" color="textSecondary" component="p">
                            Pending
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="textSecondary" component="p">
                            {order.price}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>{order.quantity}</TableCell>
                      <TableCell>{order.description}</TableCell>
                      <TableCell>
                        {order.action === true ? (
                          <Button variant="outlined" color="primary" size="small">
                            No action
                          </Button>
                        ) : (
                          <>
                            <IconButton aria-label="delete">
                              <EditIcon />
                            </IconButton>
                            <IconButton aria-label="delete">
                              <DeleteIcon />
                            </IconButton>
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
          {/* <Collapse in={openVendor} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="subtitle1" gutterBottom component="div">
                VENDOR LIST
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
                  {product?.products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell component="th" scope="row">
                        {product.productName}
                      </TableCell>
                      <TableCell>{product.price}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>{product.description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse> */}
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    id: PropTypes.string.isRequired,
    uid: PropTypes.string,
    createdAt: PropTypes.string.isRequired,
    status: PropTypes.string,
    verified: PropTypes.bool,
    action: PropTypes.bool,
    vendor: PropTypes.bool,
    orders: PropTypes.arrayOf(
      PropTypes.shape({
        productName: PropTypes.string.isRequired,
        price: PropTypes.number,
        quantity: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        action: PropTypes.bool
      })
    ).isRequired
  }).isRequired
};

const columns = [
  {
    id: '1',
    label: 'Order ID',
    minWidth: 100
    // format: (value) => value.toLocaleString()
  },
  {
    id: '2',
    label: 'Created At',
    minWidth: 170
  },
  {
    id: '3',
    label: 'Status',
    minWidth: 100,
    // align: 'right',
    format: (value) => value.toLocaleString()
  },
  {
    id: '4',
    label: 'Verified',
    minWidth: 100,
    // align: 'right',
    format: (value) => value.toLocaleString()
  },
  {
    id: '5',
    label: 'Action',
    minWidth: 150,
    // align: 'right',
    format: (value) => value.toLocaleString()
  }
];

export default function OrderHistory() {
  const [tableData, setTableData] = useState([]);
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
      const docRef = collection(db, 'orderDetails');
      const getData = async () => {
        const data = await getDocs(docRef);
        console.log(
          JSON.parse(
            JSON.stringify(
              data.docs
                .map((doc) =>
                  doc.data()?.uid === currentUser?.uid ? { ...doc.data(), id: doc.id } : null
                )
                .filter((element) => element !== null)
            )
          )
        );
        setTableData(
          JSON.parse(
            JSON.stringify(
              data.docs
                .map((doc) =>
                  doc.data()?.uid === currentUser?.uid ? { ...doc.data(), id: doc.id } : null
                )
                .filter((element) => element !== null)
            )
          )
        );
      };
      getData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

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
        // console.log(
        //   JSON.parse(
        //     JSON.stringify(
        //       data.docs
        //         .map((doc) => (doc.data() ? { ...doc.data(), id: doc.id } : null))
        //         .filter((element) => element !== null)
        //     )
        //   )
        // );
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
        <CardHeader title="Order History" subheader="The latest orders placed by you" />
        <CardContent>
          <Button variant="outlined" color="primary" onClick={handleClickVendor}>
            {visible ? 'View Vendor Prices' : 'Back'}
          </Button>
        </CardContent>

        {visible === true ? (
          <>
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
                  {tableData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <>
                        <Row key={index} row={row} />
                      </>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        ) : (
          <>
            <VendorsPriceList products={products} />
          </>
        )}
      </Card>
    </>
  );
}
