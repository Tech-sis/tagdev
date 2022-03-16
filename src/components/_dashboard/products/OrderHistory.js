import React, { useState, useEffect } from 'react';
import { Card } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDocs, collection } from 'firebase/firestore';
import { auth, db } from '../../../firebase';

const OrderHistory = () => {
  const [tableData, setTableData] = useState([]);

  const columns = [
    // { field: 'id', headerName: 'ID', width: 100 },
    { field: 'createdAt', headerName: 'Created At', width: 150 },
    { field: 'productName', headerName: 'Product', width: 130 },
    { field: 'quantity', headerName: 'Quantity', type: 'number', width: 100 },
    {
      field: 'description',
      headerName: 'Description',
      description: 'This column has a value getter and is not sortable.',
      sortable: false,
      width: 200
    },
    { field: 'productName1', headerName: 'Product name', width: 130 },
    { field: 'quantity1', headerName: 'Quantity', type: 'number', width: 100 },
    { field: 'description1', headerName: 'Description', width: 200 },
    {
      field: 'status',
      headerName: 'Status',
      width: 100
    }
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      const docRef = collection(db, 'orderDetails');
      const getData = async () => {
        const data = await getDocs(docRef);
        setTableData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
        console.log(tableData);
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
        <DataGrid
          rows={tableData}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[15]}
          autoHeight
          headerHeight={100}
          rowHeight={50}
          sx={{
            height: '100%',
            textTransform: 'uppercase'
          }}
        />
      </Card>
    </>
  );
};

export default OrderHistory;
