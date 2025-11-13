import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  totalStudyTime: number
  cardCount: number
  level: number
  experience: number
  joinedAt: Date
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  addStudyTime: (minutes: number) => void
  addCard: (count?: number) => void
}

// 模拟用户数据
const mockUsers = [
  {
    id: '1',
    username: '学习小喵',
    email: 'test@example.com',
    password: '123456',
    totalStudyTime: 1200,
    cardCount: 15,
    level: 3,
    experience: 450,
    joinedAt: new Date('2024-01-01')
  }
]

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true })
        
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const user = mockUsers.find(u => u.email === email && u.password === password)
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user
          set({ 
            user: userWithoutPassword, 
            isAuthenticated: true, 
            isLoading: false 
          })
          return true
        }
        
        set({ isLoading: false })
        return false
      },
      
      register: async (username: string, email: string, password: string) => {
        set({ isLoading: true })
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // 检查邮箱是否已存在
        if (mockUsers.some(u => u.email === email)) {
          set({ isLoading: false })
          return false
        }
        
        const newUser = {
          id: Math.random().toString(36).substring(7),
          username,
          email,
          totalStudyTime: 0,
          cardCount: 0,
          level: 1,
          experience: 0,
          joinedAt: new Date()
        }
        
        set({ 
          user: newUser, 
          isAuthenticated: true, 
          isLoading: false 
        })
        return true
      },
      
      logout: () => set({ user: null, isAuthenticated: false }),
      
      updateUser: (userData) => 
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        })),
      
      addStudyTime: (minutes: number) => {
        const { user } = get()
        if (user) {
          const newTotalTime = user.totalStudyTime + minutes
          
          // 更合理的经验计算：每10分钟获得基础经验，但根据当前等级调整
          const baseExperience = Math.floor(minutes / 10)
          const levelBonus = Math.floor(user.level * 0.5) // 等级越高，额外经验越多
          const streakBonus = Math.floor(minutes / 30) * 2 // 连续学习奖励
          
          const newExperience = user.experience + baseExperience + levelBonus + streakBonus
          
          // 计算升级所需经验：每级经验需求递增
          const getRequiredExpForLevel = (level: number) => {
            return Math.floor(100 * Math.pow(1.2, level - 1))
          }
          
          let currentLevel = user.level
          let currentExp = newExperience
          
          // 检查是否升级
          while (currentExp >= getRequiredExpForLevel(currentLevel)) {
            currentExp -= getRequiredExpForLevel(currentLevel)
            currentLevel++
          }
          
          set({
            user: {
              ...user,
              totalStudyTime: newTotalTime,
              experience: currentExp,
              level: currentLevel
            }
          })
          
          // 如果升级了，返回升级信息（可用于显示升级提示）
          if (currentLevel > user.level) {
            return {
              leveledUp: true,
              newLevel: currentLevel,
              oldLevel: user.level
            }
          }
        }
        return { leveledUp: false }
      },
      
      addCard: (count = 1) => {
        const { user } = get()
        if (user) {
          set({
            user: {
              ...user,
              cardCount: user.cardCount + count
            }
          })
        }
      }
    }),
    {
      name: 'auth-storage'
    }
  )
)