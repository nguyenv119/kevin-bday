'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'

interface AnimatedTextProps {
  text: string
  startDelay?: number
  wordDelay?: number
}

function AnimatedText({ text, startDelay = 0, wordDelay = 0.08 }: AnimatedTextProps) {
  const words = text.split(' ')

  return (
    <>
      {words.map((word, index) => (
        <span
          key={index}
          className="inline-block animate-word-reveal"
          style={{ animationDelay: `${startDelay + index * wordDelay}s` }}
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
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const { data, error: fetchError } = await supabase.rpc('get_birthday_question')
        if (fetchError) throw fetchError
        if (data && data.length > 0) {
          setQuestion(data[0].question)
        }
      } catch (err) {
        console.error('Error fetching question:', err)
      }
    }
    fetchConfig()
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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: queryError } = await supabase.rpc('validate_birthday_password', {
        input_password: password,
      })

      if (queryError) throw queryError

      if (data && data.length > 0) {
        setMessage(data[0].message)
        setPassword('')
      } else {
        setError('Incorrect. Please try again.')
        inputRef.current?.classList.add('animate-shake')
        setTimeout(() => inputRef.current?.classList.remove('animate-shake'), 500)
      }
    } catch (err) {
      setError('Incorrect. Please try again.')
      inputRef.current?.classList.add('animate-shake')
      setTimeout(() => inputRef.current?.classList.remove('animate-shake'), 500)
      console.error('Error validating password:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setMessage('')
    setError('')
    setPassword('')
    inputRef.current?.focus()
  }

  return (
    <main className="min-h-screen bg-[#f7f4f0] flex items-center justify-center p-8">
      <div className="w-full max-w-[380px] text-center">
        {!message ? (
          <div className="animate-fade-in">
            {/* Eyebrow */}
            <p className="font-ui text-[10px] tracking-[0.35em] text-[#9a9390] uppercase mb-8">
              — a special message —
            </p>

            {/* Headline */}
            <h1 className="font-display text-[3.2rem] leading-[1.1] font-light text-[#1a1714] mb-10">
              <AnimatedText
                text="Ahhhhh shiiiih...my boy older"
                startDelay={0.15}
                wordDelay={0.08}
              />
            </h1>

            {/* Accent line */}
            <div className="w-8 h-px bg-[#c65f3f] mx-auto mb-10" />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-7">
              <input
                ref={inputRef}
                id="password"
                type="password"
                value={password}
                onChange={handleInputChange}
                placeholder={question || 'enter the answer...'}
                className={`w-full bg-transparent border-0 border-b pb-3 text-[#1a1714] placeholder:text-[#c4bfba] text-base focus:outline-none transition-colors duration-300 font-ui text-center ${
                  error
                    ? 'border-b-[#c65f3f]'
                    : 'border-b-[#d9d4ce] focus:border-b-[#1a1714]'
                }`}
                style={{ fontSize: '16px' }}
                required
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? 'error-message' : undefined}
                autoComplete="off"
              />

              <button
                ref={buttonRef}
                type="submit"
                disabled={loading || !password.trim()}
                className="w-full py-[14px] border border-[#1a1714] text-[#1a1714] text-[10px] tracking-[0.3em] uppercase font-ui font-medium transition-all duration-300 hover:bg-[#1a1714] hover:text-[#f7f4f0] disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#1a1714]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-3 w-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    unlocking
                  </span>
                ) : (
                  'unlock'
                )}
              </button>

              {error && (
                <p
                  id="error-message"
                  className="text-[#c65f3f] text-xs font-ui tracking-wide animate-fade-in"
                  role="alert"
                  aria-live="polite"
                >
                  {error}
                </p>
              )}
            </form>
          </div>
        ) : (
          <div className="animate-fade-in">
            <p className="font-ui text-[10px] tracking-[0.35em] text-[#9a9390] uppercase mb-10">
              — unlocked —
            </p>

            <p className="font-display text-[1.6rem] font-light text-[#1a1714] leading-relaxed mb-10">
              {message}
            </p>

            <div className="w-8 h-px bg-[#d9d4ce] mx-auto mb-8" />

            <button
              onClick={handleReset}
              className="font-ui text-[10px] tracking-[0.25em] uppercase text-[#9a9390] hover:text-[#1a1714] transition-colors duration-200"
              aria-label="Try again with a different password"
            >
              try again
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
