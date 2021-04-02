import { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR, OPEN_HEADER, TOGGLE_DRAWER } from './actions';

const defaultState = {
  notifications: [],
  header: false,
  drawer: false,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.key,
            ...action.notification,
          },
        ],
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map(notification => (
          (action.dismissAll || notification.key === action.key)
            ? { ...notification, dismissed: true }
            : { ...notification }
        )),
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.key !== action.key,
        ),
      };
    
    case OPEN_HEADER:
      return {
        ...state,
        header: true,
      };

    case TOGGLE_DRAWER: 
      return {
        ...state,
        drawer: !state.drawer,
      }

    default:
      return state;
  }
};
