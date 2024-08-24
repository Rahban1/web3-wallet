import { Wallet } from 'lucide-react'


function Navbar() {
    
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md py-2 mb-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-semibold">Web3 Wallet</span>
            </div>
          </div>
        </div>
      </nav>
  )
}

export default Navbar