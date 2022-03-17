import React, { useState, useEffect } from 'react';
// firebase
import { collection, addDoc } from 'firebase/firestore';
// material
import {
  Card,
  CardContent,
  TextField,
  Button,
  CardActions,
  CardHeader,
  IconButton,
  Alert,
  AlertTitle,
  Container,
  Divider,
  Typography
} from '@mui/material';
// material icons
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Icon from '@mui/icons-material/Send';
// import { styled } from '@mui/material/styles';
import { db, auth } from '../../../firebase';

const CreateOrder = () => {
  const [status, setStatus] = useState(undefined);
  const [inputFields, setInputFields] = useState([
    {
      productName: '',
      quantity: '',
      description: ''
    }
  ]);

  const handleChangeInput = (event, index) => {
    const values = [...inputFields];
    values[index][event.target.name] = event.target.value;
    setInputFields(values);
    console.log(inputFields);
  };

  const handleAddInput = () => {
    const values = [...inputFields];
    values.push({
      productName: '',
      quantity: '',
      description: ''
    });
    setInputFields(values);
  };

  const handleDeleteInput = (index) => {
    const values = [...inputFields];
    values.splice(index, 1);
    setInputFields(values);
  };

  const orderRef = collection(db, 'orderDetails');
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      addDoc(orderRef, {
        uid: user.uid,
        createdAt: new Date().toDateString(),
        order: inputFields
      });
      console.log('order added');
      console.log(inputFields);
      setInputFields([
        {
          productName: '',
          quantity: '',
          description: ''
        }
      ]);
      setStatus({ type: 'Success', message: 'Order added successfully' });
    } catch (error) {
      console.log(error);
      setStatus({ type: 'Error', message: error.message });
    }
  };

  return (
    <>
      {status && (
        <Alert severity={status.type}>
          <AlertTitle>{status.type}</AlertTitle>
          {status.message}
        </Alert>
      )}

      <Card>
        <CardHeader title="Product Request Form" />
        <CardContent
          sx={{
            display: 'block',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            width: '100%',
            position: 'relative'
          }}
        >
          <form onSubmit={handleSubmit}>
            {inputFields.map((inputField, index) => (
              <Container key={index}>
                <Typography variant="body2" align="left">
                  {index}
                </Typography>
                <TextField
                  label="Product Name"
                  name="productName"
                  value={inputField.productName}
                  onChange={(event) => handleChangeInput(event, index)}
                  variant="outlined"
                  required
                  type="text"
                  margin="normal"
                  sx={{
                    width: '65%',
                    mr: 5
                  }}
                />
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={inputField.quantity}
                  //   onChange={(e) => setQuantity(e.target.value)}
                  onChange={(event) => handleChangeInput(event, index)}
                  variant="outlined"
                  required
                  type="number"
                  margin="normal"
                  sx={{
                    width: '25%'
                  }}
                />
                <TextField
                  label="Description"
                  name="description"
                  value={inputField.description}
                  onChange={(event) => handleChangeInput(event, index)}
                  variant="outlined"
                  type="text"
                  margin="normal"
                  sx={{
                    mr: 3,
                    mb: 3,
                    width: '65%'
                  }}
                  multiline
                  rows={2}
                />
                <IconButton
                  aria-label="delete"
                  variant="outlined"
                  color="primary"
                  onClick={handleDeleteInput}
                  sx={{
                    mt: 5,
                    ml: 10
                  }}
                >
                  <DeleteIcon />
                </IconButton>
                <IconButton
                  aria-label="add"
                  variant="outlined"
                  color="primary"
                  onClick={handleAddInput}
                  sx={{
                    mt: 5,
                    ml: 3
                  }}
                >
                  <AddIcon />
                </IconButton>
              </Container>
            ))}
            <CardActions sx={{ justifyContent: 'space-between', mb: '30px', mx: '20px' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ width: '50%', m: 'auto' }}
                size="medium"
                endIcon={<Icon />}
              >
                Submit
              </Button>
            </CardActions>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default CreateOrder;
