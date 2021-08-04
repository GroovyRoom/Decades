import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';


export default function ContainedButtons() {
 
  function handleClick(e) {
    alert('The link was clicked.');
  }
  return (
      <Button onClick={handleClick} variant="contained">Default</Button>
  );
  }

