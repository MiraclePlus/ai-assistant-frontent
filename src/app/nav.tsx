import Navbar from './navbar';
import { getServerSession } from 'next-auth/next';

const user = {
  name: 'Tom Cook',
  email: 'tom@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

export default async function Nav() {
  const session = await getServerSession();
  return <Navbar user={session?.user || user} />;
}
