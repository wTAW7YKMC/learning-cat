import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { useTaskStore } from '@/stores/taskStore'
import { useAuthStore } from '@/stores/authStore'
import { Play, Pause, Square, Clock, Coffee } from 'lucide-react'

interface TimerProps {
  taskId?: string
  onComplete?: (timeSpent: number) => void
}

const Timer = ({ taskId, onComplete }: TimerProps) => {
  const { tasks, updateTask, completeTask } = useTaskStore()
  const { addStudyTime, addCard } = useAuthStore()
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [timeSpent, setTimeSpent] = useState(0) // 秒
  const [targetTime, setTargetTime] = useState(25 * 60) // 默认25分钟番茄钟
  const [sessionType, setSessionType] = useState<'focus' | 'break'>('focus')

  const currentTask = taskId ? tasks.find(t => t.id === taskId) : null

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning) {
      interval = setInterval(() => {
        setTimeSpent(prev => {
          const newTime = prev + 1
          
          // 检查是否达到目标时间
          if (newTime >= targetTime) {
            handleSessionComplete()
            return 0
          }
          
          return newTime
        })
      }, 1000)
    }
    
    return () => clearInterval(interval)
  }, [isRunning, targetTime])

  const handleSessionComplete = () => {
    setIsRunning(false)
    
    if (sessionType === 'focus') {
      // 专注时间结束，开始休息
      setSessionType('break')
      setTargetTime(5 * 60) // 5分钟休息
      setIsBreak(true)
    } else {
      // 休息时间结束，回到专注
      setSessionType('focus')
      setTargetTime(25 * 60)
      setIsBreak(false)
      
      // 完成任务
      if (currentTask && timeSpent >= currentTask.estimatedTime * 60 * 0.8) {
        const minutesSpent = Math.ceil(timeSpent / 60)
        completeTask(currentTask.id, minutesSpent)
        addStudyTime(minutesSpent)
        
        // 根据难度掉落卡片
        const cardDropChance = Math.random()
        if (currentTask.difficulty === 'easy' && cardDropChance < 0.2) {
          addCard()
        } else if (currentTask.difficulty === 'medium' && cardDropChance < 0.6) {
          addCard()
        } else if (currentTask.difficulty === 'hard' && cardDropChance < 0.9) {
          addCard()
        }
        
        onComplete?.(minutesSpent)
      }
    }
  }

  const startTimer = () => {
    setIsRunning(true)
    if (currentTask && currentTask.status === 'pending') {
      updateTask(currentTask.id, { status: 'in-progress' })
    }
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const stopTimer = () => {
    setIsRunning(false)
    setTimeSpent(0)
    setSessionType('focus')
    setTargetTime(25 * 60)
    setIsBreak(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const progress = (timeSpent / targetTime) * 100
  const remainingTime = targetTime - timeSpent

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-2">
          {isBreak ? <Coffee className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
          {isBreak ? '休息时间' : '专注学习'}
        </CardTitle>
        <CardDescription>
          {currentTask ? `正在学习: ${currentTask.title}` : '自由学习模式'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* 计时器显示 */}
        <div className="text-center">
          <div className="text-6xl font-mono font-bold text-gray-800 mb-2">
            {formatTime(remainingTime)}
          </div>
          <div className="text-sm text-gray-600">
            {sessionType === 'focus' ? '剩余专注时间' : '剩余休息时间'}
          </div>
        </div>

        {/* 进度条 */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isBreak ? 'bg-green-500' : 'bg-learning-blue'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 控制按钮 */}
        <div className="flex justify-center gap-4">
          {!isRunning ? (
            <Button 
              onClick={startTimer}
              className="learning-gradient"
              size="lg"
            >
              <Play className="w-4 h-4 mr-2" />
              开始
            </Button>
          ) : (
            <Button 
              onClick={pauseTimer}
              variant="outline"
              size="lg"
            >
              <Pause className="w-4 h-4 mr-2" />
              暂停
            </Button>
          )}
          
          <Button 
            onClick={stopTimer}
            variant="outline"
            size="lg"
          >
            <Square className="w-4 h-4 mr-2" />
            停止
          </Button>
        </div>

        {/* 任务信息 */}
        {currentTask && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">任务信息</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">预计时长:</span>
                <span className="ml-2 font-medium">{currentTask.estimatedTime}分钟</span>
              </div>
              <div>
                <span className="text-gray-600">难度:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  currentTask.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                  currentTask.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {currentTask.difficulty === 'easy' ? '简单' : 
                   currentTask.difficulty === 'medium' ? '中等' : '困难'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* 番茄钟设置 */}
        <div className="flex gap-2 justify-center">
          <Button 
            variant={targetTime === 25 * 60 ? "default" : "outline"}
            size="sm"
            onClick={() => setTargetTime(25 * 60)}
          >
            25分钟
          </Button>
          <Button 
            variant={targetTime === 45 * 60 ? "default" : "outline"}
            size="sm"
            onClick={() => setTargetTime(45 * 60)}
          >
            45分钟
          </Button>
          <Button 
            variant={targetTime === 60 * 60 ? "default" : "outline"}
            size="sm"
            onClick={() => setTargetTime(60 * 60)}
          >
            60分钟
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default Timer