"use client"

import React, { useEffect, useState } from 'react'
import { Card } from './ui/card'
import { createPortal } from 'react-dom'
import { useTranslate } from '@/hooks/use-translate'
import { Skeleton } from './ui/skeleton'
import { TRANSLATE_TEXT_LIMIT } from '@/constants/Constraint'
import { TranslationMessage } from './ui/TranslationMessage'

interface Position {
  x: number
  y: number
  placement: 'top' | 'bottom'
}

export function SelectionPopup() {
  const [selectedText, setSelectedText] = useState<string>('')
  const [position, setPosition] = useState<Position>({ x: 0, y: 0, placement: 'top' })
  const [isVisible, setIsVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showTranslation, setShowTranslation] = useState(false)
  const { translatedText, translate, translationLoading } = useTranslate()

  useEffect(() => {
    const handleSelection = () => {
      setIsLoading(true)

      const selection = window.getSelection()
      const text = selection?.toString().trim()

      if (!text) {
        setIsVisible(false)
        return
      }

      const range = selection?.getRangeAt(0)
      const rect = range?.getBoundingClientRect()

      if (rect) {
        const popupHeight = 200 // max height of popup
        const offset = 10 // distance from selection
        const spaceAbove = rect.top
        // const spaceBelow = window.innerHeight - rect.bottom
        
        // Determine if popup should appear above or below
        const placement = spaceAbove > popupHeight + offset ? 'top' : 'bottom'
        
        setPosition({
          x: rect.left + window.scrollX + (rect.width / 2),
          y: placement === 'top' 
            ? rect.top + window.scrollY - offset // position above
            : rect.bottom + window.scrollY + offset, // position below
          placement
        })
        setSelectedText(text)
        setIsVisible(true)

        if (text.length <= TRANSLATE_TEXT_LIMIT){
          setShowTranslation(true)
          // Fetch translation
          translate(text, 'zh-hant').then(() => {
            // Translation complete, do nothing
          })
        } else {
          setShowTranslation(false)
        }

        setIsLoading(false)
      }
    }

    document.addEventListener('mouseup', handleSelection)
    return () => document.removeEventListener('mouseup', handleSelection)
  }, [translate])

  if (!isVisible) return null

  // Use portal to render outside normal DOM hierarchy
  return createPortal(
    <Card
      className="fixed transform -translate-x-1/2 shadow-lg bg-background border z-50
                 w-[300px] sm:w-[320px] md:w-[360px] lg:w-[400px] 
                 min-h-[100px] max-h-[200px] overflow-y-auto
                 mx-auto p-4"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, ${position.placement === 'top' ? '-100%' : '0'})`,
      }}
    >
      <div className="w-full h-full flex flex-col items-start">
        {translationLoading || isLoading ? (
          <>
            <Skeleton className="h-3 my-1 w-24" />
            <Skeleton className="h-6 w-36" />
          </>
        ) : <>{showTranslation ? <>
          <p 
            className="text-xs text-gray-500 break-words font-extralight max-w-full" 
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              maxHeight: '2.5em'  // Adjust line height for better space control
            }}
          >
            {selectedText}
          </p>
          {translatedText && (
            <p className="text-base break-words mt-2 font-normal">{translatedText}</p>
          )}
        </> : (<TranslationMessage />)}
      </>
      }
      </div>
    </Card>,
    document.body
  )
}
