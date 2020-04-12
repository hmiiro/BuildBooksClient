import React from 'react';
import { Spinner } from 'reactstrap';

const LoadingSpinner = props => {
  return (
    <div>
      <Spinner color="primary" />
      <Spinner color="success" />
      <Spinner color="danger" />
      <Spinner color="warning" />
      <Spinner color="info" />
    </div>
  );
};

export default LoadingSpinner;
