/* eslint-disable no-nested-ternary */
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
  FormControlLabel,
  Switch,
  Link,
  Paper
} from '@mui/material';
import PropTypes from 'prop-types';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

// function Row(props) {
//   const { row } = props;
//   const [open, setOpen] = useState(false);
//   return (
//     <>
//       <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
//         <TableCell>
//           <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
//             {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
//           </IconButton>
//         </TableCell>
//         <TableCell component="th" scope="row">
//           {row.id}
//         </TableCell>
//         <TableCell align="right">{row.createdAt}</TableCell>
//         <TableCell align="right">{row.status}</TableCell>
//         <TableCell align="right">{row.verified}</TableCell>
//         <TableCell align="right">{row.protein}</TableCell>
//       </TableRow>
//       <TableRow>
//         <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
//           <Collapse in={open} timeout="auto" unmountOnExit>
//             <Box sx={{ margin: 1 }}>
//               <Typography variant="h6" gutterBottom component="div">
//                 PRODUCT LIST
//               </Typography>
//               <Table size="small" aria-label="purchases">
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>PRODUCT NAME</TableCell>
//                     <TableCell>PRICE</TableCell>
//                     <TableCell align="right">QUANTITY</TableCell>
//                     <TableCell align="right">DESCRIPTION</TableCell>
//                     <TableCell align="right">ACTION</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {row.productList.map((productListRow) => (
//                     <TableRow key={productListRow.productName}>
//                       <TableCell component="th" scope="row">
//                         {productListRow.price}
//                       </TableCell>
//                       <TableCell>{productListRow.quantity}</TableCell>
//                       <TableCell align="right">{productListRow.description}</TableCell>
//                       <TableCell align="right">{productListRow.action}</TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </Box>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }

// Row.propTypes = {
//   row: PropTypes.shape({
//     id: PropTypes.number.isRequired,
//     createdAt: PropTypes.number.isRequired,
//     status: PropTypes.number.isRequired,
//     productList: PropTypes.arrayOf(
//       PropTypes.shape({
//         productName: PropTypes.number.isRequired,
//         price: PropTypes.string.isRequired,
//         quantity: PropTypes.string.isRequired,
//         description: PropTypes.string.isRequired,
//         action: PropTypes.string.isRequired
//       })
//     ).isRequired,
//     verified: PropTypes.string.isRequired,
//     action: PropTypes.number.isRequired,
//     protein: PropTypes.number.isRequired
//   }).isRequired
// };

const columns = [
  {
    label: 'ID',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString()
  },
  {
    label: 'Created At',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString()
  },
  {
    label: 'Status',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString()
  },
  {
    label: 'Verified',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString()
  },
  {
    label: 'Action',
    minWidth: 170,
    align: 'left',
    format: (value) => value.toLocaleString()
  }
];

export default function OrderHistory() {
  const [tableData, setTableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dense, setDense] = useState(false);

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
                .map((doc) => (doc.data()?.uid === currentUser?.uid ? doc.data() : null))
                .filter((element) => element !== null)
            )
          )
        );
        setTableData(
          JSON.parse(
            JSON.stringify(
              data.docs
                .map((doc) => (doc.data()?.uid === currentUser?.uid ? doc.data() : null))
                .filter((element) => element !== null)
                .map((element) => {
                  const { uid, createdAt, status, orders, verified, action } = element;
                  return { uid, createdAt, status, orders, verified, action };
                })
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
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer>
            <Table aria-label="collapsible table">
              <TableHead>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableCell
                      key={index}
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
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" align="right">
                        {index + 1}
                      </TableCell>
                      <TableCell>{row.createdAt}</TableCell>
                      <TableCell>{row.status}</TableCell>
                      <TableCell>{row.verified === true ? 'True' : 'False'}</TableCell>
                      <TableCell>
                        {row.action === true ? (
                          <IconButton size="small">
                            <Link to={`/order-details/${row.uid}`}>View Products</Link>
                          </IconButton>
                        ) : (
                          <IconButton size="small">
                            <Link to={`/order-details/${row.uid}`}>View Vendors</Link>
                          </IconButton>
                        )}
                      </TableCell>
                    </TableRow>
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
        </Paper>
      </Card>
    </>
  );
}
