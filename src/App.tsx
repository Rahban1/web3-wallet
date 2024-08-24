import { useState } from 'react'
import { generateMnemonic } from 'bip39'
import { Wallet, Plus, Trash2 } from 'lucide-react'
import SolanaWallet from './component/Solana'
import EthWallet from './component/Eth'
import Navbar from './component/Navbar'


type WalletType = 'solana' | 'ethereum'

interface WalletInfo {
  type: WalletType
  id: string
}

export default function Component() {
  const [darkMode, setDarkMode] = useState(false)
  const [mnemonic, setMnemonic] = useState<string[]>(Array(12).fill(''))
  const [isGenerated, setIsGenerated] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [wallets, setWallets] = useState<WalletInfo[]>([])


  const generateNewMnemonic = () => {
    try {
      const newMnemonic = generateMnemonic()
      setMnemonic(newMnemonic.split(' '))
      setIsGenerated(true)
      setError(null)
    } catch (err) {
      setError('Failed to generate mnemonic. Please try again.')
    }
  }

  const addWallet = (type: WalletType) => {
    const newWallet: WalletInfo = {
      type,
      id: `${type}-${Date.now()}`
    }
    setWallets([...wallets, newWallet])
  }

  const removeWallet = (id: string) => {
    setWallets(wallets.filter(wallet => wallet.id !== id))
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Navbar/>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-8">
          <button
            onClick={generateNewMnemonic}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-full transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <Wallet className="inline-block mr-2 h-5 w-5" />
            Generate Mnemonic
          </button>

          {error && (
            <div className="w-full max-w-2xl bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {isGenerated && (
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-center">Your Mnemonic Phrase</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2">
                {mnemonic.map((word, index) => (
                  <div key={index} className="flex items-center bg-blue-500 hover:bg-blue-600 rounded-md p-2 ">
                    <span className="font-mono text-xs sm:text-sm text-gray-500 dark:text-gray-400 mr-2">{index + 1}.</span>
                    <span className="font-semibold text-sm sm:text-base">{word}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="w-full max-w-2xl space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => addWallet('solana')}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 flex items-center"
              >
                <Plus className="inline-block mr-2 h-5 w-5" />
                Add Solana Wallet
              </button>
              <button
                onClick={() => addWallet('ethereum')}
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center"
              >
                <Plus className="inline-block mr-2 h-5 w-5" />
                Add ETH Wallet
              </button>
            </div>
            <div className="space-y-4">
              {wallets.map((wallet) => (
                <div key={wallet.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 border-l-4 ${
                  wallet.type === 'solana' ? 'border-purple-500' : 'border-indigo-500'
                }`}>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-lg sm:text-xl font-bold ${
                      wallet.type === 'solana' ? 'text-purple-500' : 'text-indigo-500'
                    }`}>
                      {wallet.type === 'solana' ? 'Solana Wallet' : 'Ethereum Wallet'}
                    </h3>
                    <button
                      onClick={() => removeWallet(wallet.id)}
                      className="text-gray-500 hover:text-red-500 transition-colors duration-200"
                      aria-label={`Remove ${wallet.type} wallet`}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  {wallet.type === 'solana' ? (
                    <SolanaWallet mnemonic={mnemonic.join(' ')} />
                  ) : (
                    <EthWallet mnemonic={mnemonic.join(' ')} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}