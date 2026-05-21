import { createBrowserRouter } from 'react-router-dom';
import { ConfirmEmailPage }  from '../pages/confirm-email/ui/ConfirmEmailPage';
import { ResetPasswordPage } from '../pages/reset-password/ui/ResetPasswordPage';

export const router = createBrowserRouter([
  { path: '/confirm-email',  element: <ConfirmEmailPage /> },
  { path: '/reset-password', element: <ResetPasswordPage /> },
  { path: '*',               element: <ConfirmEmailPage /> },
]);
