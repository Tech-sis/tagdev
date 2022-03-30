/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
// firebase
import { collection, addDoc, getDocs, doc, setDoc } from 'firebase/firestore';
import {
  Card,
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
  Button,
  TextField,
  AlertTitle,
  Alert
} from '@mui/material';
import { sentenceCase } from 'change-case';

import PropTypes, { element } from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
// import { getDocs, collection } from 'firebase/firestore';
import Label from '../../Label';
import { auth, db } from '../../../firebase';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [openVendor, setOpenVendor] = useState(false);
  const [status, setStatus] = useState(undefined);
  const [editing, setEditing] = useState(true);
  // const [price, setPrice] = useState([]);
  const [inputPrices, setInputPrices] = useState([
    {
      productName: row.orders.map((order) => order.productName).join(', '),
      quantity: row.orders.map((order) => order.quantity).join(', '),
      description: row.orders.map((order) => order.description).join(', '),
      price: ''
    }
  ]);

  const handleClick = () => {
    setOpen(!open);
  };

  const { currentUser } = auth;
  const docRef = collection(db, 'orderDetails', `${row.id}`, 'vendors');
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      addDoc(docRef, {
        products: inputPrices,
        vendorid: currentUser.uid,
        verified: false,
        accepted: false,
        id: row.id,
        createdAt: new Date().toDateString()
      });
      setInputPrices({
        productName: '',
        description: '',
        quantity: '',
        price: ''
      });
      setEditing(false);
      setStatus('success');
      setInputPrices([
        {
          productName: '',
          description: '',
          quantity: '',
          price: ''
        }
      ]);
      console.log('product added');
      console.log(inputPrices);
      setStatus({ type: 'success', message: 'Prices added successfully' });
    } catch (error) {
      console.log(error);
      setStatus({ type: 'error', message: error.message });
    }
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
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.orders.map((order, index) => (
                    <>
                      <TableRow key={index}>
                        <TableCell component="th" scope="row">
                          {order.productName}
                        </TableCell>
                        <TableCell>
                          <TextField
                            label="Price"
                            variant="outlined"
                            size="small"
                            name="price"
                            value={inputPrices[index]?.price}
                            onChange={(e) => {
                              setInputPrices(
                                inputPrices.map((item, i) => {
                                  if (i === index) {
                                    return {
                                      ...item,
                                      price: e.target.value
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                            required
                            type="number"
                          />
                          {console.log(inputPrices)}
                        </TableCell>
                        <TableCell>{order.quantity}</TableCell>
                        <TableCell>{order.description}</TableCell>
                      </TableRow>
                    </>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={handleSubmit}
                      >
                        Submit Price
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
    status: PropTypes.string.isRequired,
    verified: PropTypes.bool.isRequired,
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
    ).isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        productName: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        quantity: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired
      })
    )
  }).isRequired
};

const columns = [
  {
    label: 'Order ID',
    minWidth: 100
    // format: (value) => value.toLocaleString()
  },
  {
    label: 'Created At',
    minWidth: 170
    // align: 'right'
    // format: (value) => value.toLocaleString()
  },
  {
    label: 'Status',
    minWidth: 100,
    // align: 'right',
    format: (value) => value.toLocaleString()
  },
  {
    label: 'Verified',
    minWidth: 100,
    // align: 'right',
    format: (value) => value.toLocaleString()
  },
  {
    label: 'Action',
    minWidth: 150,
    // align: 'right',
    format: (value) => value.toLocaleString()
  }
];

export default function OrderReview() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (e, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 5));
    setPage(0);
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
                .map((doc) => (doc.data() ? { ...doc.data(), id: doc.id } : null))
                .filter((element) => element !== null)
            )
          )
        );
        setTableData(
          JSON.parse(
            JSON.stringify(
              data.docs
                .map((doc) => (doc.data() ? { ...doc.data(), id: doc.id } : null))
                .filter((element) => element !== null)
            )
          )
        );
        console.log(tableData);
        const userData = {
          tableData
        };
        console.log(userData.tableData.map((element) => element.orders));
        console.log(userData.tableData.map((element) => element.vendors));
      };
      getData();
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {status && (
        <Alert severity={status.type}>
          <AlertTitle>{status.type}</AlertTitle>
          {status.message}
        </Alert>
      )}
      <Card>
        <TableContainer component={Paper}>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell />
                {columns.map((column, index) => (
                  <TableCell key={index} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {tableData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <Row key={index} row={row} />
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
      </Card>
    </>
  );
}
