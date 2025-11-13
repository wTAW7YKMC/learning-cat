import { NavLink } from 'react-router-dom'
import { 
  Home, 
  CheckSquare, 
  Clock, 
  Star, 
  BarChart3,
  User
} from 'lucide-react'

const Navigation = () => {
  const navItems = [
    { path: '/', label: '首页', icon: Home },
    { path: '/tasks', label: '任务', icon: CheckSquare },
    { path: '/timer', label: '计时', icon: Clock },
    { path: '/cards', label: '卡片', icon: Star },
    { path: '/analytics', label: '统计', icon: BarChart3 },
  ]

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-learning-blue to-learning-orange rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">喵</span>
            </div>
            <span className="text-xl font-bold text-gray-800">学习喵</span>
          </div>

          {/* 导航菜单 */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-gradient-to-r from-learning-blue/20 to-learning-orange/20 text-learning-blue'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {item.label}
                </NavLink>
              )
            })}
          </div>

          {/* 用户信息 */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* 移动端导航 */}
        <div className="md:hidden border-t border-gray-200">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex flex-col items-center px-3 py-2 rounded-lg text-xs transition-colors ${
                      isActive
                        ? 'text-learning-blue'
                        : 'text-gray-600 hover:text-gray-900'
                    }`
                  }
                >
                  <Icon className="w-5 h-5 mb-1" />
                  {item.label}
                </NavLink>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation