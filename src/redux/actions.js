export const ENQUEUE_SNACKBAR = 'ENQUEUE_SNACKBAR';
export const CLOSE_SNACKBAR = 'CLOSE_SNACKBAR';
export const REMOVE_SNACKBAR = 'REMOVE_SNACKBAR';
export const OPEN_HEADER = 'OPEN_HEADER';
export const TOGGLE_DRAWER = 'TOGGLE_DRAWER';

export const enqueueSnackbar = (notification) => {
    const key = notification.options && notification.options.key;

    return {
        type: ENQUEUE_SNACKBAR,
        notification: {
            ...notification,
            key: key || new Date().getTime() + Math.random(),
        },
    };
};

export const closeSnackbar = key => ({
    type: CLOSE_SNACKBAR,
    dismissAll: !key, // dismiss all if no key has been defined
    key,
});

export const removeSnackbar = key => ({
    type: REMOVE_SNACKBAR,
    key,
});

export const openHeader = event => {
  return {
    type: OPEN_HEADER,
    event,
  };
};

export const toggleDrawer = event => {
  return {
    type: TOGGLE_DRAWER,
    event,
  };
};