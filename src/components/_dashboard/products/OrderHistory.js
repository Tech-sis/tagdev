/* eslint-disable no-restricted-globals */
import React, { useState, useEffect } from 'react';
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
  Link
} from '@mui/material';
import { sentenceCase } from 'change-case';

import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { getDocs, collection } from 'firebase/firestore';
import Label from '../../Label';
import { auth, db } from '../../../firebase';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
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
        <TableCell>
          {row.vendor === true ? (
            <Button variant="outlined" color="primary" size="small">
              Vendor
            </Button>
          ) : (
            <Button variant="outlined" color="primary" size="small">
              View Vendors Prices
            </Button>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
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
    ).isRequired
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

export default function OrderHistory() {
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
        console.log(tableData);
        const userData = {
          tableData
        };
        console.log(userData.tableData.map((element) => element.orders));
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
                {columns.map((column, index) => (
                  <TableCell key={index} align={column.align} style={{ minWidth: column.minWidth }}>
                    {column.label}
                  </TableCell>
                ))}
                <TableCell style={{ minWidth: '270px' }} align="left" />
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
