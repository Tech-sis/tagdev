import React, { useState } from 'react';
// import { Link as RouterLink } from 'react-router-dom';
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
  IconButton
} from '@mui/material';
// material icons
import DeleteIcon from '@mui/icons-material/Delete';
// import { styled } from '@mui/material/styles';
import { db, auth } from '../../../firebase';

const CreateOrder = () => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [description, setDescription] = useState('');
  const [productName1, setProductName1] = useState('');
  const [quantity1, setQuantity1] = useState('');
  const [description1, setDescription1] = useState('');

  const onClick = (e) => {
    e.preventDefault();
    setShowMore(true);
  };
  const onRemove = (e) => {
    e.preventDefault();
    setShowMore(false);
  };

  const orderRef = collection(db, 'orderDetails');
  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      addDoc(orderRef, {
        uid: user.uid,
        createdAt: new Date().toDateString(),
        productName,
        quantity,
        description,
        productName1,
        quantity1,
        description1,
        status: 'pending'
      });
      console.log('order added');
      setProductName('');
      setQuantity('');
      setDescription('');
      setProductName1('');
      setQuantity1('');
      setDescription1('');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
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
          <CardActions sx={{ justifyContent: 'end', mr: '10px' }}>
            <Button variant="outlined" color="primary" onClick={onClick} size="large">
              Add Product
            </Button>
          </CardActions>
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            variant="outlined"
            required
            type="text"
            margin="normal"
            sx={{
              width: '60%',
              mr: 3
            }}
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            variant="outlined"
            required
            type="number"
            margin="normal"
            sx={{
              width: '35%'
            }}
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            fullWidth
            type="text"
            margin="normal"
            sx={{
              mr: 3
            }}
            multiline
            rows={2}
          />
          {showMore && (
            <>
              <TextField
                label="Product Name"
                value={productName1}
                onChange={(e) => setProductName1(e.target.value)}
                variant="outlined"
                required
                type="text"
                margin="normal"
                sx={{
                  width: '60%',
                  mr: 3
                }}
              />
              <TextField
                label="Quantity"
                id="outlined-number"
                value={quantity1}
                onChange={(e) => setQuantity1(e.target.value)}
                variant="outlined"
                required
                type="number"
                margin="normal"
                sx={{
                  width: '35%'
                }}
              />
              <TextField
                label="Description"
                value={description1}
                onChange={(e) => setDescription1(e.target.value)}
                variant="outlined"
                fullWidth
                type="text"
                margin="normal"
                sx={{
                  width: '60%',
                  mr: 3
                }}
                multiline
                rows={2}
              />
              <IconButton
                variant="contained"
                color="primary"
                onClick={onRemove}
                aria-label="delete"
                sx={{ m: '60px 0 0 186px' }}
              >
                <DeleteIcon />
              </IconButton>
            </>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'center', mb: '30px' }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ width: '50%' }}
            size="large"
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default CreateOrder;
