import React, { useState, useEffect } from 'react'
import styles from './Memory.module.scss'
import { useTranslation } from '../../../hooks'
import { BeforeGame } from '../BeforeGame/BeforeGame'

type MemoryProps = {
  parameters: string
  onComplete: () => void
}

type Card = {
  id: string
  emoji: string
  isFlipped: boolean
  isMatched: boolean
}

const EMOJIS = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪']

export const Memory: React.FC<MemoryProps> = ({ parameters: _parameters, onComplete }) => {
  const t = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const [cards, setCards] = useState<Card[]>([])
  const [flippedCards, setFlippedCards] = useState<string[]>([])
  const [matchedPairs, setMatchedPairs] = useState(0)
  const [moves, setMoves] = useState(0)

  const initializeGame = () => {
    const cardPairs = EMOJIS.flatMap(emoji =>
      [{
        id: emoji,
        emoji,
        isFlipped: false,
        isMatched: false,
      },
      {
        id: `${emoji}-duplicate`,
        emoji,
        isFlipped: false,
        isMatched: false,
      }])

    const shuffledCards = cardPairs.sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
    setFlippedCards([])
    setMatchedPairs(0)
    setMoves(0)
  }

  const handleCardClick = (cardId: string) => {
    if (
      flippedCards.length === 2 // Don't allow flipping while checking a pair
      || flippedCards.includes(cardId) // Don't allow flipping the same card
      || cards.find(card => card.id === cardId)?.isMatched // Don't allow flipping matched cards
    ) {
      return
    }

    const newFlippedCards = [...flippedCards, cardId]
    setFlippedCards(newFlippedCards)

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards
      const firstCard = cards.find(card => card.id === firstId)
      const secondCard = cards.find(card => card.id === secondId)

      setMoves(prev => prev + 1)

      if (firstCard?.emoji === secondCard?.emoji) {
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

  useEffect(() => {
    if (matchedPairs === 6) {
      setTimeout(() => {
        onComplete()
      }, 1000)
    }
  }, [matchedPairs, onComplete])

  if (!isPlaying) {
    return (
      <BeforeGame
        gameName={t.challenges.memory.gameName}
        onPlay={() => {
          initializeGame()
          setIsPlaying(true)
        }}
      />
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
          <span className={styles.value}>
            {matchedPairs}
            /6
          </span>
        </div>
      </div>

      <div className={styles.grid}>
        {cards.map((card) => {
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
                  {showCard
                    && <span className={styles.emoji}>{card.emoji}</span>}
                </div>
              </div>
            </button>
          )
        },
        )}
      </div>
    </div>
  )
}
