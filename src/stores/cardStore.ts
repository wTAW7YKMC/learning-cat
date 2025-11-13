import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Card {
  id: string
  name: string
  description: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  theme: 'academic' | 'action' | 'slice-of-life' | 'fantasy'
  subject: 'math' | 'english' | 'science' | 'history' | 'art' | 'music'
  imageUrl: string
  obtainedAt: Date
  isDuplicated: boolean
}

interface CardState {
  cards: Card[]
  cardLibrary: Card[] // 所有可收集的卡片
  addCard: (card: Omit<Card, 'id' | 'obtainedAt' | 'isDuplicated'>) => void
  removeCard: (cardId: string) => void
  markAsDuplicated: (cardId: string) => void
  getCardsByRarity: (rarity: Card['rarity']) => Card[]
  getCardsByTheme: (theme: Card['theme']) => Card[]
  getCardsBySubject: (subject: Card['subject']) => Card[]
  getCollectionProgress: () => {
    total: number
    collected: number
    progress: number
    byRarity: Record<Card['rarity'], { total: number; collected: number }>
  }
  generateRandomCard: (difficulty: 'easy' | 'medium' | 'hard') => Card | null
}

// 预定义的卡片库
const predefinedCards: Omit<Card, 'id' | 'obtainedAt' | 'isDuplicated'>[] = [
  // 普通卡
  {
    name: '数学小天才',
    description: '掌握基础数学知识的小天才',
    rarity: 'common',
    theme: 'academic',
    subject: 'math',
    imageUrl: '/cards/math-genius.png'
  },
  {
    name: '英语单词王',
    description: '词汇量丰富的英语达人',
    rarity: 'common',
    theme: 'academic',
    subject: 'english',
    imageUrl: '/cards/english-master.png'
  },
  {
    name: '科学探索者',
    description: '热爱科学实验的小科学家',
    rarity: 'common',
    theme: 'academic',
    subject: 'science',
    imageUrl: '/cards/science-explorer.png'
  },
  
  // 稀有卡
  {
    name: '历史时光旅行者',
    description: '穿越历史长河的博学者',
    rarity: 'rare',
    theme: 'fantasy',
    subject: 'history',
    imageUrl: '/cards/history-traveler.png'
  },
  {
    name: '艺术创意家',
    description: '充满创意的艺术天才',
    rarity: 'rare',
    theme: 'slice-of-life',
    subject: 'art',
    imageUrl: '/cards/art-creator.png'
  },
  
  // 史诗卡
  {
    name: '全能学霸',
    description: '各科成绩优异的全能学生',
    rarity: 'epic',
    theme: 'academic',
    subject: 'math',
    imageUrl: '/cards/all-rounder.png'
  },
  {
    name: '音乐大师',
    description: '精通多种乐器的音乐天才',
    rarity: 'epic',
    theme: 'slice-of-life',
    subject: 'music',
    imageUrl: '/cards/music-master.png'
  },
  
  // 传说卡
  {
    name: '智慧之神',
    description: '掌握所有知识的智慧化身',
    rarity: 'legendary',
    theme: 'fantasy',
    subject: 'math',
    imageUrl: '/cards/wisdom-god.png'
  }
]

export const useCardStore = create<CardState>()(
  persist(
    (set, get) => ({
      cards: [],
      cardLibrary: predefinedCards.map((card, index) => ({
        ...card,
        id: `card-${index}`,
        obtainedAt: new Date(),
        isDuplicated: false
      })),

      addCard: (cardData) => {
        const newCard: Card = {
          ...cardData,
          id: Math.random().toString(36).substring(7),
          obtainedAt: new Date(),
          isDuplicated: false
        }
        
        // 检查是否已拥有此卡
        const existingCard = get().cards.find(card => 
          card.name === newCard.name && card.rarity === newCard.rarity
        )
        
        if (existingCard) {
          // 标记为重复卡
          set(state => ({
            cards: state.cards.map(card => 
              card.id === existingCard.id 
                ? { ...card, isDuplicated: true }
                : card
            )
          }))
        } else {
          set(state => ({ cards: [...state.cards, newCard] }))
        }
      },

      removeCard: (cardId) => {
        set(state => ({
          cards: state.cards.filter(card => card.id !== cardId)
        }))
      },

      markAsDuplicated: (cardId) => {
        set(state => ({
          cards: state.cards.map(card =>
            card.id === cardId ? { ...card, isDuplicated: true } : card
          )
        }))
      },

      getCardsByRarity: (rarity) => {
        return get().cards.filter(card => card.rarity === rarity)
      },

      getCardsByTheme: (theme) => {
        return get().cards.filter(card => card.theme === theme)
      },

      getCardsBySubject: (subject) => {
        return get().cards.filter(card => card.subject === subject)
      },

      getCollectionProgress: () => {
        const { cards, cardLibrary } = get()
        const total = cardLibrary.length
        const collected = new Set(cards.map(card => card.name)).size
        const progress = total > 0 ? (collected / total) * 100 : 0
        
        const byRarity = {
          common: { total: cardLibrary.filter(c => c.rarity === 'common').length, collected: 0 },
          rare: { total: cardLibrary.filter(c => c.rarity === 'rare').length, collected: 0 },
          epic: { total: cardLibrary.filter(c => c.rarity === 'epic').length, collected: 0 },
          legendary: { total: cardLibrary.filter(c => c.rarity === 'legendary').length, collected: 0 }
        }
        
        // 计算每个稀有度的收集数量
        cards.forEach(card => {
          if (!byRarity[card.rarity].collected) {
            byRarity[card.rarity].collected = 1
          }
        })
        
        return { total, collected, progress, byRarity }
      },

      generateRandomCard: (difficulty) => {
        const { cards: _cards } = get()
        const random = Math.random()
        
        let rarity: Card['rarity'] = 'common'
        
        // 根据难度设置掉落概率
        if (difficulty === 'easy') {
          if (random < 0.2) rarity = 'common'
        } else if (difficulty === 'medium') {
          if (random < 0.5) rarity = 'common'
          else if (random < 0.6) rarity = 'rare'
        } else if (difficulty === 'hard') {
          if (random < 0.4) rarity = 'common'
          else if (random < 0.7) rarity = 'rare'
          else if (random < 0.8) rarity = 'epic'
          else if (random < 0.9) rarity = 'legendary'
        }
        
        // 从对应稀有度的卡片中随机选择
        const availableCards = predefinedCards.filter(card => card.rarity === rarity)
        
        if (availableCards.length === 0) return null
        
        const randomCard = availableCards[Math.floor(Math.random() * availableCards.length)]
        
        return {
          ...randomCard,
          id: Math.random().toString(36).substring(7),
          obtainedAt: new Date(),
          isDuplicated: false
        }
      }
    }),
    {
      name: 'card-storage'
    }
  )
)