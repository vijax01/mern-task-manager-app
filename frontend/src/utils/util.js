import { toast } from 'react-toastify';

export const notify = (message, type = 'default') => {
  if (toast[type]) {
    toast[type](message);
  } else {
    toast(message);
  }
};