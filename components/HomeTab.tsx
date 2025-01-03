'use client'

import { useEffect, useState } from 'react'
import Wallet from '@/icons/Wallet'
import PawsLogo from '@/icons/PawsLogo'
import Community from '@/icons/Community'
import Star from '@/icons/Star'
import Image from 'next/image'
import ArrowRight from '@/icons/ArrowRight'
import { sparkles } from '@/images'
import WebApp from "@twa-dev/sdk'

declare global {
  interface Window {
    Telegram?: {
      WebApp: WebApp
    }
  }
}

interface UserData {
  telegramId: string
  firstName: string
  username?: string
  points: number
  rank: string
}

export default function Home() {
  const [user, setUser] = useState<UserData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      const tg = window.Telegram.WebApp
      tg.ready()

      const initDataUnsafe = tg.initDataUnsafe || {}

      if (initDataUnsafe.user) {
        const userData = {
          telegramId: initDataUnsafe.user.id,
          firstName: initDataUnsafe.user.first_name,
          username: initDataUnsafe.user.username,
          points: 4646, // القيمة الافتراضية، يمكنك تحديثها من API لاحقًا
          rank: 'Gold', // قيمة افتراضية
        }
        setUser(userData)
      } else {
        setError('No user data available')
      }
    } else {
      setError('This app should be opened in Telegram')
    }
  }, [])

  const handleIncreasePoints = async () => {
    if (!user) return

    try {
      const res = await fetch('/api/increase-points', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ telegramId: user.telegramId }),
      })
      const data = await res.json()
      if (data.success) {
        setUser({ ...user, points: data.points })
        setNotification('Points increased successfully!')
        setTimeout(() => setNotification(''), 3000)
      } else {
        setError('Failed to increase points')
      }
    } catch (err) {
      setError('An error occurred while increasing points')
    }
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>
  }

  if (!user) return <div className="container mx-auto p-4">Loading...</div>

  return (
    <div className="container mx-auto p-4">
      {/* PAWS Balance */}
      <div className="flex flex-col items-center mt-8">
        <PawsLogo className="w-28 h-28 mb-4" />
        <div className="flex items-center gap-1 text-center">
          <div className="text-6xl font-bold mb-1">{user.points}</div>
          <div className="text-white text-2xl">PAWS</div>
        </div>
        <div className="flex items-center gap-1 text-[#868686] rounded-full px-4 py-1.5 mt-2 cursor-pointer">
          <span>{user.username || 'N/A'}</span>
          <Image src={sparkles} alt="sparkles" width={18} height={18} />
          <span>{user.rank}</span>
          <ArrowRight className="w-6 h-6" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3 px-4 mt-8 mb-8">
        <button
          onClick={handleIncreasePoints}
          className="shine-effect w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between"
        >
          <div className="flex items-center gap-3 font-medium">
            <Star className="w-8 h-8" />
            <span>Increase Points</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </button>

        <button className="w-full bg-[#ffffff0d] border-[1px] border-[#2d2d2e] rounded-lg px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3 font-medium">
            <Community className="w-8 h-8" />
            <span>Join our community</span>
          </div>
          <ArrowRight className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {notification && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          {notification}
        </div>
      )}
    </div>
  )
}
