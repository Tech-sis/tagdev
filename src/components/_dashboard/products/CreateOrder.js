import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
// material
import {
  Box,
  Card,
  Link,
  Typography,
  Stack,
  CardContent,
  TextField,
  Button,
  CardActions,
  CardHeader,
  IconButton
} from '@mui/material';
// material icons
import DeleteIcon from '@mui/icons-material/Delete';

import { styled } from '@mui/material/styles';

const CreateOrder = () => {
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [field, setField] = useState('');
  const onClick = (e) => {
    e.preventDefault();
    setShowMore(true);
  };
  const onRemove = (e) => {
    e.preventDefault();
    setShowMore(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProductName('');
    setQuantity(0);
    setShowMore(false);
  };
  const MoreFunction = () => {
    if (showMore) {
      return <More />;
    }
    return null;
  };

  const More = () => (
    <>
      <TextField
        label="Product Name"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        variant="outlined"
        required
        autoFocus
        margin="normal"
      />
      <TextField
        label="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        variant="outlined"
        required
        autoFocus
        margin="normal"
      />
      <TextField
        label="Description"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
        variant="outlined"
        fullWidth
        autoFocus
        margin="normal"
        multiline
        rows={2}
      />
      <IconButton variant="contained" color="primary" onClick={onRemove} aria-label="delete">
        <DeleteIcon />
      </IconButton>
    </>
  );

  return (
    <>
      <div>
        <h1>CreateOrder</h1>
      </div>
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
          {/* <Typography>Product Request Form</Typography> */}
          <TextField
            label="Product Name"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            variant="outlined"
            required
            margin="normal"
          />
          <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            variant="outlined"
            required
            margin="normal"
          />
          <TextField
            label="Description"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={2}
          />
          <MoreFunction />
        </CardContent>
        <CardActions>
          <Button type="submit" variant="outlined" color="primary" onClick={onClick}>
            Add Product
          </Button>
        </CardActions>
        <Button type="submit" variant="contained" color="primary" fullWidth onClick={handleSubmit}>
          Submit
        </Button>
      </Card>
    </>
  );
};

export default CreateOrder;
