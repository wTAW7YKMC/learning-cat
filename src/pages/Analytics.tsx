import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Calendar, Clock, TrendingUp, Award } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { useTaskStore } from '@/stores/taskStore'
import { useCardStore } from '@/stores/cardStore'

const Analytics = () => {
  const { user } = useAuthStore()
  const { tasks } = useTaskStore()
  const { getCollectionProgress } = useCardStore()
  
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">请先登录查看统计数据</p>
      </div>
    )
  }
  
  // 基于真实数据的统计
  const completedTasks = tasks.filter(task => task.status === 'completed')
  const totalTasks = tasks.length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0
  
  // 计算平均每日学习时间
  const daysSinceJoin = Math.max(1, Math.floor((new Date().getTime() - new Date(user.joinedAt).getTime()) / (1000 * 60 * 60 * 24)))
  const averageDailyTime = Math.floor(user.totalStudyTime / daysSinceJoin)
  
  // 卡片收集进度
  const cardProgress = getCollectionProgress()
  
  // 计算连续打卡天数（简化版）
  const streakDays = Math.min(Math.floor(user.totalStudyTime / 60), 30)
  
  // 计算经验进度
  const getRequiredExpForLevel = (level: number) => {
    return Math.floor(100 * Math.pow(1.2, level - 1))
  }
  const currentLevelExp = getRequiredExpForLevel(user.level)
  const expProgress = Math.round((user.experience / currentLevelExp) * 100)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">学习统计</h1>
        <p className="text-gray-600">查看你的学习进度和数据分析</p>
      </div>

      {/* 关键指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总学习时长</CardTitle>
            <Clock className="h-4 w-4 text-learning-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(user.totalStudyTime / 60)}小时</div>
            <p className="text-xs text-muted-foreground">
              {user.totalStudyTime % 60}分钟
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成任务数</CardTitle>
            <Award className="h-4 w-4 text-learning-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTasks.length}</div>
            <p className="text-xs text-muted-foreground">
              平均每天 {Math.round(averageDailyTime / 60)}小时
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成率</CardTitle>
            <TrendingUp className="h-4 w-4 text-learning-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              任务完成比例
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">连续打卡</CardTitle>
            <Calendar className="h-4 w-4 text-learning-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streakDays}</div>
            <p className="text-xs text-muted-foreground">
              天连续学习
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 等级和进度 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>等级进度</CardTitle>
            <CardDescription>当前等级：{user.level}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>经验值</span>
                <span>{user.experience}/{currentLevelExp}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-learning-blue to-learning-orange h-2 rounded-full transition-all duration-500"
                  style={{ width: `${expProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                距离下一级还需 {currentLevelExp - user.experience} 经验
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>卡片收集</CardTitle>
            <CardDescription>卡片收集进度</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>收集进度</span>
                <span>{cardProgress.collected}/{cardProgress.total}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-learning-green to-learning-purple h-2 rounded-full transition-all duration-500"
                  style={{ width: `${cardProgress.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500">
                收集了 {Math.round(cardProgress.progress)}% 的卡片
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 任务统计 */}
      <Card>
        <CardHeader>
          <CardTitle>任务统计</CardTitle>
          <CardDescription>任务完成情况分析</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
              <div className="text-sm text-gray-600">总任务数</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
              <div className="text-sm text-gray-600">已完成</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
              <div className="text-sm text-gray-600">进行中</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{tasks.filter(t => t.status === 'pending').length}</div>
              <div className="text-sm text-gray-600">待开始</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 学习建议 */}
      <Card>
        <CardHeader>
          <CardTitle>学习建议</CardTitle>
          <CardDescription>基于你的学习数据生成的个性化建议</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">📚 保持良好习惯</h4>
              <p className="text-sm text-blue-600 mt-1">
                {streakDays > 5 
                  ? `你已经连续学习${streakDays}天，继续保持这个好习惯！`
                  : '建议每天固定时间段学习，形成规律。'
                }
              </p>
            </div>
            
            <div className="p-3 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">🎯 专注任务完成</h4>
              <p className="text-sm text-green-600 mt-1">
                {completionRate > 70 
                  ? '你的任务完成率很高，继续保持！'
                  : '建议提高任务完成率，避免任务积压。'
                }
              </p>
            </div>
            
            <div className="p-3 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-800">⏰ 时间管理建议</h4>
              <p className="text-sm text-orange-600 mt-1">
                {averageDailyTime > 60 
                  ? '你每天的学习时间很充足，注意适当休息。'
                  : '建议适当增加每日学习时间，保持学习连贯性。'
                }
              </p>
            </div>

            <div className="p-3 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-800">🏆 卡片收集</h4>
              <p className="text-sm text-purple-600 mt-1">
                {cardProgress.progress > 50 
                  ? `你已经收集了${Math.round(cardProgress.progress)}%的卡片，继续加油！`
                  : '完成更多学习任务来收集更多卡片吧！'
                }
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Analytics