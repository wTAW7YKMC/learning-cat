import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Task {
  id: string
  title: string
  estimatedTime: number // 分钟
  difficulty: 'easy' | 'medium' | 'hard'
  priority: 'low' | 'medium' | 'high'
  category: string
  status: 'pending' | 'in-progress' | 'completed' | 'overdue'
  createdAt: Date
  dueDate?: Date
  actualTime?: number // 实际用时（分钟）
  completedAt?: Date
}

interface TaskState {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  startTask: (id: string) => void
  completeTask: (id: string, actualTime: number) => void
  getTasksByStatus: (status: Task['status']) => Task[]
  getTodayTasks: () => Task[]
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: Math.random().toString(36).substring(7),
          createdAt: new Date(),
          status: 'pending'
        }
        set((state) => ({ tasks: [...state.tasks, newTask] }))
      },
      
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          )
        }))
      },
      
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id)
        }))
      },
      
      startTask: (id) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, status: 'in-progress' } : task
          )
        }))
      },
      
      completeTask: (id, actualTime) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id 
              ? { 
                  ...task, 
                  status: 'completed', 
                  actualTime,
                  completedAt: new Date()
                } 
              : task
          )
        }))
      },
      
      getTasksByStatus: (status) => {
        return get().tasks.filter((task) => task.status === status)
      },
      
      getTodayTasks: () => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return get().tasks.filter((task) => {
          const taskDate = new Date(task.createdAt)
          taskDate.setHours(0, 0, 0, 0)
          return taskDate.getTime() === today.getTime()
        })
      }
    }),
    {
      name: 'task-storage'
    }
  )
)