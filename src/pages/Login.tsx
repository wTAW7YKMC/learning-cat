import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'

const Login = () => {
  const navigate = useNavigate()
  const { login, register, isLoading } = useAuthStore()
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // 表单验证
    if (!formData.email || !formData.password) {
      setError('请填写邮箱和密码')
      return
    }

    if (!isLogin && !formData.username) {
      setError('请填写用户名')
      return
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setError('两次输入的密码不一致')
      return
    }

    try {
      let success
      if (isLogin) {
        success = await login(formData.email, formData.password)
        if (!success) {
          setError('邮箱或密码错误')
        } else {
          navigate('/')
        }
      } else {
        success = await register(formData.username, formData.email, formData.password)
        if (!success) {
          setError('该邮箱已被注册')
        } else {
          navigate('/')
        }
      }
    } catch (err) {
      setError('网络错误，请重试')
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-learning-blue to-learning-orange rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">喵</span>
          </div>
          <CardTitle className="text-2xl">学习喵</CardTitle>
          <CardDescription>
            {isLogin ? '欢迎回来！' : '创建新账户'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="username" className="text-sm font-medium">
                  用户名
                </label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="输入用户名"
                  value={formData.username}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="text-sm font-medium">
                邮箱
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="输入邮箱"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-sm font-medium">
                密码
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="输入密码"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
            
            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  确认密码
                </label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="再次输入密码"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full learning-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isLogin ? '登录中...' : '注册中...'}
                </>
              ) : (
                isLogin ? '登录' : '注册'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-learning-blue hover:underline"
            >
              {isLogin ? '还没有账户？立即注册' : '已有账户？立即登录'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login