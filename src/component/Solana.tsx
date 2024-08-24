import React, { useState, useEffect } from "react"
import { mnemonicToSeed } from "bip39"
import { derivePath } from "ed25519-hd-key"
import { Keypair, PublicKey } from "@solana/web3.js"
import nacl from "tweetnacl"
import { Loader2 } from "lucide-react"

interface SolanaWalletProps {
  mnemonic: string
}

export default function SolanaWallet({ mnemonic }: SolanaWalletProps) {
  const [wallet, setWallet] = useState<{ publicKey: PublicKey } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const createWallet = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const seed = await mnemonicToSeed(mnemonic)
        const path = `m/44'/501'/0'/0'`
        const derivedSeed = derivePath(path, seed.toString("hex")).key
        const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey
        const keypair = Keypair.fromSecretKey(secret)

        setWallet({ publicKey: keypair.publicKey })
      } catch (error) {
        console.error("Failed to create wallet:", error)
        setError("Failed to create Solana wallet. Please try again.")
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
        <Loader2 className="animate-spin h-8 w-8 text-purple-500" />
        <span className="ml-2 text-gray-600 dark:text-gray-300">Creating Solana wallet...</span>
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
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Solana Address</span>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        <p className="text-sm font-mono break-all">{wallet.publicKey.toBase58()}</p>
      </div>
    </div>
  )
}