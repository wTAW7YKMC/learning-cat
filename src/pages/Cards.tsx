import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useCardStore } from '@/stores/cardStore'
import { Search, Grid, List, Star, Zap, Crown, Book } from 'lucide-react'

const Cards = () => {
  const { 
    cards, 
    getCollectionProgress
  } = useCardStore()
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterRarity, setFilterRarity] = useState<string>('all')
  const [filterTheme, setFilterTheme] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  const progress = getCollectionProgress()
  
  // 过滤卡片
  const filteredCards = cards.filter(card => {
    const matchesRarity = filterRarity === 'all' || card.rarity === filterRarity
    const matchesTheme = filterTheme === 'all' || card.theme === filterTheme
    const matchesSearch = searchTerm === '' || 
      card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesRarity && matchesTheme && matchesSearch
  })
  
  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return <Book className="w-4 h-4" />
      case 'rare': return <Star className="w-4 h-4" />
      case 'epic': return <Zap className="w-4 h-4" />
      case 'legendary': return <Crown className="w-4 h-4" />
      default: return <Book className="w-4 h-4" />
    }
  }
  
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-300 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }
  
  const getRarityTextColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600'
      case 'rare': return 'text-blue-600'
      case 'epic': return 'text-purple-600'
      case 'legendary': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* 收集进度 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>卡片收集进度</span>
            <span className="text-lg font-bold">{progress.collected}/{progress.total}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 总进度条 */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>总进度</span>
                <span>{Math.round(progress.progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-learning-blue h-3 rounded-full transition-all duration-500"
                  style={{ width: `${progress.progress}%` }}
                />
              </div>
            </div>
            
            {/* 稀有度进度 */}
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(progress.byRarity).map(([rarity, data]) => (
                <div key={rarity} className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {getRarityIcon(rarity)}
                    <span className="text-xs font-medium capitalize">{rarity}</span>
                  </div>
                  <div className="text-sm">{data.collected}/{data.total}</div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className={`h-1 rounded-full ${
                        rarity === 'common' ? 'bg-gray-400' :
                        rarity === 'rare' ? 'bg-blue-400' :
                        rarity === 'epic' ? 'bg-purple-400' : 'bg-yellow-400'
                      }`}
                      style={{ width: `${(data.collected / data.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 筛选和搜索 */}
      <Card>
        <CardHeader>
          <CardTitle>卡片图鉴</CardTitle>
          <CardDescription>浏览你收集的所有卡片</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 搜索框 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索卡片名称或描述..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-learning-blue"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* 筛选器 */}
            <div className="flex flex-wrap gap-2">
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={filterRarity}
                onChange={(e) => setFilterRarity(e.target.value)}
              >
                <option value="all">全部稀有度</option>
                <option value="common">普通</option>
                <option value="rare">稀有</option>
                <option value="epic">史诗</option>
                <option value="legendary">传说</option>
              </select>
              
              <select 
                className="px-3 py-2 border rounded-lg text-sm"
                value={filterTheme}
                onChange={(e) => setFilterTheme(e.target.value)}
              >
                <option value="all">全部主题</option>
                <option value="academic">学术</option>
                <option value="action">热血</option>
                <option value="slice-of-life">治愈</option>
                <option value="fantasy">奇幻</option>
              </select>
              
              <div className="flex gap-2 ml-auto">
                <Button 
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 卡片列表 */}
      {filteredCards.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Book className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500">
              {cards.length === 0 ? '还没有收集到任何卡片' : '没有找到匹配的卡片'}
            </p>
            <p className="text-sm text-gray-400 mt-2">
              完成学习任务来收集更多卡片吧！
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={viewMode === 'grid' ? 
          "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : 
          "space-y-4"
        }>
          {filteredCards.map((card) => (
            <Card 
              key={card.id} 
              className={`border-2 ${getRarityColor(card.rarity)} ${
                card.isDuplicated ? 'opacity-70' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* 卡片图片占位 */}
                  <div className={`w-16 h-16 rounded-lg border-2 ${getRarityColor(card.rarity)} flex items-center justify-center`}>
                    {getRarityIcon(card.rarity)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{card.name}</h3>
                      {card.isDuplicated && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          重复
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <span className={`font-medium capitalize ${getRarityTextColor(card.rarity)}`}>
                        {card.rarity === 'common' ? '普通' :
                         card.rarity === 'rare' ? '稀有' :
                         card.rarity === 'epic' ? '史诗' : '传说'}
                      </span>
                      <span className="text-gray-500">
                        {card.theme === 'academic' ? '学术' :
                         card.theme === 'action' ? '热血' :
                         card.theme === 'slice-of-life' ? '治愈' : '奇幻'}
                      </span>
                      <span className="text-gray-500">
                        {card.subject === 'math' ? '数学' :
                         card.subject === 'english' ? '英语' :
                         card.subject === 'science' ? '科学' :
                         card.subject === 'history' ? '历史' :
                         card.subject === 'art' ? '艺术' : '音乐'}
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-400 mt-2">
                      获得时间: {card.obtainedAt.toLocaleDateString('zh-CN')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default Cards