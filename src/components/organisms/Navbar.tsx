import { UserButton } from '@clerk/nextjs'
import { Container } from '../atoms/container'
import { Brand } from '../molecules/Brand'
import { Sidebar } from './Sidebar'

export const Navbar = () => {
  return (
    <nav className="sticky top-0 w-full h-12 border-2 border-white border-y bg-white/40 backdrop-blur backdrop-filter">
      <Container>
        <div className="flex items-center justify-between">
          <Brand />{' '}
          <div className="flex items-center">
            <UserButton />
            <Sidebar />
          </div>
        </div>
      </Container>
    </nav>
  )
}