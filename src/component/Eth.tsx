import  { useState, useEffect } from "react"
import {  HDNodeWallet } from "ethers";
import { Loader2 } from "lucide-react"
import { mnemonicToSeed } from "bip39";

interface EthWalletProps {
  mnemonic: string
}

export default function EthWallet({ mnemonic }: EthWalletProps) {
  const [wallet, setWallet] = useState<{ address: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createWallet = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const seed = await mnemonicToSeed(mnemonic);
        const hdNode = HDNodeWallet.fromSeed(seed);
        const wallet = hdNode.derivePath("m/44'/60'/0'/0/0")
        const address = wallet.address

        setWallet({ address: address })
      } catch (error) {
        console.error("Failed to create wallet:", error)
        setError("Failed to create Ethereum wallet. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    if (mnemonic) {
      createWallet()
    }
  }, [mnemonic])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin h-8 w-8 text-indigo-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Creating Ethereum wallet...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <span className="block sm:inline">{error}</span>
      </div>
    )
  }

  if (!wallet) {
    return null
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Ethereum Public Key</span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <p className="text-sm font-mono break-all">{wallet.address}</p>
      </div>
    </div>
  )
}