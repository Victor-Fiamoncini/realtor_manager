import Landing from '@/app/(nondashboard)/landing/page'
import AppNavbar from '@/components/app-navbar'

const HomePage = () => (
  <div className="h-full w-full">
    <AppNavbar />

    <main className="flex h-full w-full flex-col">
      <Landing />
    </main>
  </div>
)

export default HomePage
