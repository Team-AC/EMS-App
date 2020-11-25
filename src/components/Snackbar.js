import React, {useEffect} from 'react';
import {
  Snackbar,
  SnackbarContent,
  IconButton,
  CheckCircleIcon,
  CloseIcon,
  ErrorIcon,
  InfoWrapper
} from "./SnackbarStyle";

export default ({status, msg}) => {
  const [open, setOpen] = React.useState(false)
  useEffect(
    () => {
      setOpen(true);
    },
    [status]
  );
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }

  return (
    <div>
      <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left"
      }}
      open={open}
      autoHideDuration={2000}
      onClose={handleClose}
    >
      <SnackbarContent
        status={status}
        contentprops={{
          "aria-describedby": "message-id"
        }}
        // prettier-ignore
        message={(
          <InfoWrapper id='message-id'>
            {status === 'success' ?
              <CheckCircleIcon /> :
              <ErrorIcon />
            }
            {msg || `Form submission status: ${status}`}
          </InfoWrapper>
        )}
        action={[
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    </Snackbar>
    </div>
  )
}