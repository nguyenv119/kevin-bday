'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface Sparkle {
  id: number
  x: number
  y: number
  size: number
  color: string
  delay: number
}

interface AnimatedTextProps {
  text: string
  startDelay?: number
  wordDelay?: number
}

function AnimatedText({ text, startDelay = 0, wordDelay = 0.05 }: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block animate-word-jump"
          style={{
            animationDelay: `${startDelay + index * wordDelay}s`,
          }}
        >
          {word}
          {index < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </>
  )
}

export default function Home() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [question, setQuestion] = useState('')
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [hasTyped, setHasTyped] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('birthday_config')
          .select('question')
          .single()

        if (fetchError) throw fetchError
        if (data?.question) {
          setQuestion(data.question)
        }
      } catch (err) {
        console.error('Error fetching question:', err)
      }
    }

    fetchConfig()

    // Create sparkles
    const colors = ['#ff6b6b', '#a78bfa', '#60a5fa']
    const newSparkles: Sparkle[] = []
    for (let i = 0; i < 8; i++) {
      newSparkles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 12,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.8,
      })
    }
    setSparkles(newSparkles)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !message) {
        setPassword('')
        setError('')
        inputRef.current?.focus()
      }
      if (e.key === 'Enter' && password.trim() && !loading && !message) {
        buttonRef.current?.click()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [password, loading, message])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    setError('')
    if (!hasTyped && e.target.value.length > 0) {
      setHasTyped(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: queryError } = await supabase
        .from('birthday_config')
        .select('password, message')
        .eq('password', password)
        .single()

      if (queryError) {
        throw queryError
      }

      if (data) {
        setMessage(data.message)
        setPassword('')
      } else {
        setError('Incorrect password. Please try again.')
        inputRef.current?.classList.add('animate-shake')
        setTimeout(() => {
          inputRef.current?.classList.remove('animate-shake')
        }, 500)
      }
    } catch (err) {
      setError('Incorrect password. Please try again.')
      inputRef.current?.classList.add('animate-shake')
      setTimeout(() => {
        inputRef.current?.classList.remove('animate-shake')
      }, 500)
      console.error('Error validating password:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessage('')
    setError('')
    setPassword('')
    setHasTyped(false)
    inputRef.current?.focus()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Noise texture overlay */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      {/* Floating sparkles */}
      {sparkles.map((sparkle, index) => (
        <div
          key={sparkle.id}
          className="absolute pointer-events-none"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            animationDelay: `${sparkle.delay}s`,
          }}
          aria-hidden="true"
        >
          <svg
            width={sparkle.size}
            height={sparkle.size}
            viewBox="0 0 24 24"
            fill="none"
            className={`${
              index % 3 === 0
                ? 'animate-float'
                : index % 3 === 1
                ? 'animate-float-delayed'
                : 'animate-float-slow'
            } animate-pulse-glow`}
            style={{ color: sparkle.color, opacity: 0.7 }}
          >
            <path
              d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
              fill="currentColor"
            />
          </svg>
        </div>
      ))}

      <div className="max-w-[440px] w-full max-[480px]:w-[90vw] text-center relative z-10">
        {!message ? (
          <div className="animate-scale-in">
            <div>
              <h1 className="text-[56px] font-bold text-white mb-12 drop-shadow-lg tracking-[-0.02em] leading-tight">
                <AnimatedText 
                  text="Ahhhhh shiiiih...my boy older" 
                  startDelay={0.1}
                  wordDelay={0.05}
                />
              </h1>
            </div>

            <div
              className="bg-white rounded-[24px] p-12 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),0_8px_10px_-6px_rgb(0_0_0_/_0.1)] relative"
              style={{
                boxShadow: `
                  0 20px 25px -5px rgb(0 0 0 / 0.1),
                  0 8px 10px -6px rgb(0 0 0 / 0.1),
                  inset 0 0 0 1px rgb(255 255 255 / 0.05)
                `,
              }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <input
                    ref={inputRef}
                    id="password"
                    type="password"
                    value={password}
                    onChange={handleInputChange}
                    placeholder={question || 'Enter the answer...'}
                    className={`w-full h-14 px-5 border-2 rounded-xl text-base transition-all duration-200 ease-out focus:outline-none ${
                      error
                        ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/20'
                        : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20'
                    } ${
                      hasTyped && !error ? 'scale-[1.01]' : ''
                    }`}
                    style={{
                      fontSize: '16px',
                      transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                    required
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? 'error-message' : undefined}
                    autoComplete="off"
                  />
                </div>
                <button
                  ref={buttonRef}
                  type="submit"
                  disabled={loading || !password.trim()}
                  className="w-full h-14 bg-gradient-to-br from-[#ff6b6b] to-[#ee5a6f] text-white font-semibold text-sm uppercase tracking-[0.05em] rounded-xl transition-all duration-200 ease-out disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                  style={{
                    boxShadow: '0 4px 14px 0 rgba(255, 107, 107, 0.39)',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading && password.trim()) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow =
                        '0 6px 20px 0 rgba(255, 107, 107, 0.5)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow =
                      '0 4px 14px 0 rgba(255, 107, 107, 0.39)'
                  }}
                  onMouseDown={(e) => {
                    if (!loading && password.trim()) {
                      e.currentTarget.style.transform = 'translateY(0)'
                    }
                  }}
                  onMouseUp={(e) => {
                    if (!loading && password.trim()) {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }
                  }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span>UNLOCKING...</span>
                      </>
                    ) : (
                      'UNLOCK'
                    )}
                  </span>
                  {loading && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse-glow" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </button>
                {error && (
                  <div
                    id="error-message"
                    className="flex items-center justify-center gap-2 text-red-600 text-sm animate-fade-in"
                    role="alert"
                    aria-live="polite"
                  >
                    <svg
                      className="w-5 h-5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{error}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        ) : (
          <div className="animate-scale-in">
            <div className="bg-white rounded-[24px] p-12 shadow-[0_20px_25px_-5px_rgb(0_0_0_/_0.1),0_8px_10px_-6px_rgb(0_0_0_/_0.1)] relative">
              <div className="space-y-6">
                <div className="border-l-4 border-[#ff6b6b] pl-6 py-2">
                  <p className="text-xl md:text-2xl text-slate-600 leading-relaxed text-left">
                    {message}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-slate-600 hover:text-[#ff6b6b] transition-colors duration-200 underline font-medium text-sm"
                  aria-label="Try again with a different password"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
