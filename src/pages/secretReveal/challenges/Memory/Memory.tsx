import React, { useState, useEffect } from 'react'
import { Gamepad2 } from 'lucide-react'
import type { Message } from '../../../../types'
import { SLButton } from '../../../../components/SLButton'
import styles from './Memory.module.scss'

interface MemoryProps {
  message: Message
  onComplete: () => void
  t: Record<string, string>
}

const EMOJIS = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪']

export const Memory: React.FC<MemoryProps> = ({ 
  onComplete,
  t 
}) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    if (isPlaying) {
      initializeGame()
    }
  }, [isPlaying])

  useEffect(() => {
    if (matchedPairs === 6) {
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }, [matchedPairs, onComplete])

  const initializeGame = () => {
    const cardPairs = EMOJIS.flatMap((emoji, index) => 
      [{ 
        id: emoji,
        emoji,
        isFlipped: false,
        isMatched: false
      },
      { 
        id: `${emoji}-duplicate`,
        emoji,
        isFlipped: false,
        isMatched: false
      }])

    // Shuffle the cards
    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
  }

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length === 2 || // Don't allow flipping while checking a pair
      flippedCards.includes(cardId) || // Don't allow flipping the same card
      cards.find((card) => card.id === cardId).isMatched // Don't allow flipping matched cards
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find((card) => card.id === firstId)
      const secondCard = cards.find((card) => card.id === secondId)

      setMoves(prev => prev + 1)

      if (firstCard.emoji === secondCard.emoji) {
        const updatedCards = cards.map(card => 
            card.id === firstId || card.id === secondId
              ? { ...card, isMatched: true }
              : card)

        setCards(updatedCards)
        setMatchedPairs(prev => prev + 1)
        setFlippedCards([])
      } else {
        // No match
        setTimeout(() => {
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  if (!isPlaying) {
    return (
      <div className={styles.gameChallenge}>
        <div className={styles.iconContainer}>
          <Gamepad2 className={styles.icon} />
        </div>
        <h2 className={styles.title}>{t.playToUnlock}</h2>
        <p className={styles.description}>{t.gameDescriptionChallenge}</p>
        <SLButton
          onClick={() => setIsPlaying(true)}
          variant="game"
          type="button"
          center
        >
          {t.startGame}
        </SLButton>
      </div>
    )
  }

  return (
    <div className={styles.game}>
      <div className={styles.gameHeader}>
        <div className={styles.stat}>
          <span className={styles.label}>{t.moves}</span>
          <span className={styles.value}>{moves}</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.label}>{t.pairs}</span>
          <span className={styles.value}>{matchedPairs}/6</span>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map(card => {
          const showCard = card.isFlipped || card.isMatched || flippedCards.includes(card.id)

          return (
            <button
              key={card.id}
              className={`${styles.card} ${showCard ? styles.flipped : ''} ${card.isMatched ? styles.matched : ''}`}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardFront} />
                <div className={styles.cardBack}>
                  {showCard && 
                      <span className={styles.emoji}>{card.emoji}</span>
                  }
                </div>
              </div>
            </button>
          )}
        )}
      </div>
    </div>
  )
}