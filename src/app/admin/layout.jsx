import "../(site)/globals.css"
import AdminClientLayout from './AdminClientLayout';

export const metadata = {
  title: 'Admin | EnviteYou',
  description: 'EnviteYou admin dashboard',
  icons: {
    icon: '/icon2.png',
  },
};


export default function AdminLayout({ children }) {
  return <AdminClientLayout>{children}</AdminClientLayout>;
}
