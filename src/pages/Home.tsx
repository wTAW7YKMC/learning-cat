import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Clock, CheckSquare, Star, TrendingUp } from 'lucide-react'

const Home = () => {
  // 模拟数据
  const stats = {
    todayStudyTime: 120, // 分钟
    todayCompletedTasks: 3,
    totalCards: 15,
    streakDays: 7
  }

  const quickActions = [
    { label: '开始学习', icon: Clock, path: '/timer' },
    { label: '添加任务', icon: CheckSquare, path: '/tasks' },
    { label: '查看卡片', icon: Star, path: '/cards' },
    { label: '学习统计', icon: TrendingUp, path: '/analytics' }
  ]

  return (
    <div className="space-y-6">
      {/* 欢迎区域 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          欢迎使用学习喵！
        </h1>
        <p className="text-gray-600">今天也要努力学习哦！🐱</p>
      </div>

      {/* 数据概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">今日学习</CardTitle>
            <Clock className="h-4 w-4 text-learning-blue" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.floor(stats.todayStudyTime / 60)}小时</div>
            <p className="text-xs text-muted-foreground">
              {stats.todayStudyTime % 60}分钟
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">完成任务</CardTitle>
            <CheckSquare className="h-4 w-4 text-learning-green" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayCompletedTasks}</div>
            <p className="text-xs text-muted-foreground">今日完成</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">卡片收集</CardTitle>
            <Star className="h-4 w-4 text-learning-orange" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCards}</div>
            <p className="text-xs text-muted-foreground">已收集卡片</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">连续打卡</CardTitle>
            <TrendingUp className="h-4 w-4 text-learning-purple" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.streakDays}</div>
            <p className="text-xs text-muted-foreground">天</p>
          </CardContent>
        </Card>
      </div>

      {/* 快速操作 */}
      <Card>
        <CardHeader>
          <CardTitle>快速开始</CardTitle>
          <CardDescription>选择你要进行的操作</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Button
                  key={action.path}
                  variant="outline"
                  className="h-20 flex-col space-y-2"
                  onClick={() => window.location.href = action.path}
                >
                  <Icon className="h-6 w-6" />
                  <span>{action.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 今日任务预览 */}
      <Card>
        <CardHeader>
          <CardTitle>今日待办</CardTitle>
          <CardDescription>今日需要完成的任务</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">数学练习题</h3>
                <p className="text-sm text-gray-500">预计30分钟</p>
              </div>
              <Button size="sm" variant="learning">开始</Button>
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h3 className="font-medium">英语单词背诵</h3>
                <p className="text-sm text-gray-500">预计20分钟</p>
              </div>
              <Button size="sm" variant="outline">稍后</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Home