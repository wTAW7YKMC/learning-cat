import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useTaskStore } from '@/stores/taskStore'
import { Plus, Play } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const Tasks = () => {
  const { tasks, addTask, startTask } = useTaskStore()
  const navigate = useNavigate()
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    estimatedTime: 30,
    difficulty: 'medium' as const,
    priority: 'medium' as const,
    category: '学习'
  })

  const handleAddTask = () => {
    if (newTask.title.trim()) {
      addTask(newTask)
      setNewTask({
        title: '',
        estimatedTime: 30,
        difficulty: 'medium',
        priority: 'medium',
        category: '学习'
      })
      setIsAddingTask(false)
    }
  }

  const pendingTasks = tasks.filter(task => task.status === 'pending')
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress')
  const completedTasks = tasks.filter(task => task.status === 'completed')

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">任务管理</h1>
          <p className="text-gray-600">管理你的学习任务和进度</p>
        </div>
        <Button onClick={() => setIsAddingTask(true)} className="learning-gradient">
          <Plus className="w-4 h-4 mr-2" />
          添加任务
        </Button>
      </div>

      {/* 添加任务表单 */}
      {isAddingTask && (
        <Card>
          <CardHeader>
            <CardTitle>添加新任务</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">任务名称</label>
              <Input
                placeholder="例如：刷数学练习题P20-30"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">预计时长（分钟）</label>
                <Input
                  type="number"
                  value={newTask.estimatedTime}
                  onChange={(e) => setNewTask({...newTask, estimatedTime: parseInt(e.target.value) || 30})}
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">难度</label>
                <select 
                  className="w-full p-2 border rounded-md"
                  value={newTask.difficulty}
                  onChange={(e) => setNewTask({...newTask, difficulty: e.target.value as any})}
                >
                  <option value="easy">简单</option>
                  <option value="medium">中等</option>
                  <option value="hard">困难</option>
                </select>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button onClick={handleAddTask} className="learning-gradient">保存</Button>
              <Button variant="outline" onClick={() => setIsAddingTask(false)}>取消</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 待执行任务 */}
      <Card>
        <CardHeader>
          <CardTitle>待执行任务 ({pendingTasks.length})</CardTitle>
          <CardDescription>等待开始的学习任务</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无待执行任务</p>
          ) : (
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>预计 {task.estimatedTime} 分钟</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        task.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                        task.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {task.difficulty === 'easy' ? '简单' : task.difficulty === 'medium' ? '中等' : '困难'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="learning"
                      onClick={() => {
                        startTask(task.id)
                        navigate(`/timer?taskId=${task.id}`)
                      }}
                    >
                      <Play className="w-4 h-4 mr-1" />
                      开始学习
                    </Button>
                    <Button size="sm" variant="outline">编辑</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 进行中任务 */}
      <Card>
        <CardHeader>
          <CardTitle>进行中任务 ({inProgressTasks.length})</CardTitle>
          <CardDescription>正在执行的学习任务</CardDescription>
        </CardHeader>
        <CardContent>
          {inProgressTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无进行中任务</p>
          ) : (
            <div className="space-y-3">
              {inProgressTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-blue-50">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>预计 {task.estimatedTime} 分钟</span>
                      <span className="text-blue-600">进行中...</span>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">继续计时</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 已完成任务 */}
      <Card>
        <CardHeader>
          <CardTitle>已完成任务 ({completedTasks.length})</CardTitle>
          <CardDescription>已完成的学习任务</CardDescription>
        </CardHeader>
        <CardContent>
          {completedTasks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">暂无已完成任务</p>
          ) : (
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task.id} className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
                  <div className="flex-1">
                    <h3 className="font-medium">{task.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <span>实际用时 {task.actualTime} 分钟</span>
                      <span className="text-green-600">已完成 ✓</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default Tasks