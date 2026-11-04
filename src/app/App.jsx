import { RouterProvider } from 'react-router/dom';
import PerfilProvider from './providers/PerfilProvider';
import ToastProvider from './providers/ToastProvider';
import { router } from './router';

export default function App() {
  return (
    <PerfilProvider>
      <ToastProvider>
        <RouterProvider router={router} />
      </ToastProvider>
    </PerfilProvider>
  );
}
