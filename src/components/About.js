import React from 'react';
import Snackbar from './Snackbar.js';
import { Button } from '@material-ui/core';


export default () => {
  const [status, setStatusBase] = React.useState("");
  const setStatus = msg => setStatusBase({ msg, date: new Date() });

  return (
    <div style={{ marginTop: "70px" }}>
      <h2>About Us</h2>
      <Button
        type = "submit"
        onClick={() => {
          setStatus("success");
        }}
        setStatus = {setStatus}
      >
        Open
      </Button>
      {status ? <Snackbar key={status.date} status={status.msg} /> : null}
    </div>
  )
}

