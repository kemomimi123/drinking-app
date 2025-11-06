import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Users, CurrencyCircleDollar, CheckCircle, Calculator, Info } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

function App() {
  const [numJuniors, setNumJuniors] = useState<string>('')
  const [numSeniors, setNumSeniors] = useState<string>('')
  const [juniorPayment, setJuniorPayment] = useState<string>('1000')
  const [costWithout, setCostWithout] = useState<string>('')
  const [costWith, setCostWith] = useState<string>('')
  const [nomihoudaiPrice, setNomihoudaiPrice] = useState<string>('2000')
  const [alcoholPrice, setAlcoholPrice] = useState<string>('500')
  const [softDrinkPrice, setSoftDrinkPrice] = useState<string>('300')
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const parseNumber = (value: string): number => {
    const parsed = parseInt(value) || 0
    return Math.max(0, parsed)
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ja-JP').format(value)
  }

  const juniors = parseNumber(numJuniors)
  const seniors = parseNumber(numSeniors)
  const juniorPay = parseNumber(juniorPayment)
  const totalWithout = parseNumber(costWithout)
  const totalWith = parseNumber(costWith)
  const nomihoudaiPerPerson = parseNumber(nomihoudaiPrice)
  const alcoholPerDrink = parseNumber(alcoholPrice)
  const softDrinkPerDrink = parseNumber(softDrinkPrice)

  const isValid = juniors >= 0 && seniors > 0 && juniorPay >= 0 && totalWithout > 0 && totalWith > 0

  let seniorCostWithout = 0
  let seniorCostWith = 0
  let hasError = false
  let errorMessage = ''

  if (isValid) {
    const totalJuniorPayment = juniors * juniorPay
    
    if (totalJuniorPayment > totalWithout || totalJuniorPayment > totalWith) {
      hasError = true
      errorMessage = '新人の支払い総額が合計金額を超えています'
    } else {
      const remainingWithout = totalWithout - totalJuniorPayment
      const remainingWith = totalWith - totalJuniorPayment
      
      seniorCostWithout = remainingWithout / seniors
      seniorCostWith = remainingWith / seniors
    }
  }

  const shouldUseNomihoudai = seniorCostWith < seniorCostWithout
  const savings = Math.abs(seniorCostWithout - seniorCostWith)
  const showResults = isValid && !hasError

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Calculator className="text-primary" size={40} weight="duotone" />
            <h1 className="text-3xl font-bold text-foreground">飲み放題判定</h1>
          </div>
          <p className="text-muted-foreground">
            先輩の1人あたり支払額を比較して、飲み放題にするべきか判定します
          </p>
        </div>

        <Collapsible open={isHelpOpen} onOpenChange={setIsHelpOpen} className="mb-6">
          <Card className="overflow-hidden">
            <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors">
              <div className="flex items-center gap-2">
                <Info size={20} weight="duotone" className="text-primary" />
                <span className="font-semibold text-foreground">使い方</span>
              </div>
              <motion.div
                animate={{ rotate: isHelpOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="p-6 pt-0 space-y-4 text-sm">
                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">1</span>
                    参加者の情報を入力
                  </h3>
                  <ul className="space-y-1 ml-8 text-muted-foreground">
                    <li>• 新人の人数（支払額が安い人）</li>
                    <li>• 先輩の人数（比較対象となる人）</li>
                    <li>• 新人1人あたりの支払額（デフォルト: ¥1,000）</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">2</span>
                    ドリンク料金を設定
                  </h3>
                  <ul className="space-y-1 ml-8 text-muted-foreground">
                    <li>• 飲み放題の1人あたり料金（デフォルト: ¥2,000）</li>
                    <li>• 単品アルコール1杯の料金（デフォルト: ¥500）</li>
                    <li>• 単品ソフトドリンク1杯の料金（デフォルト: ¥300）</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                    合計金額を入力
                  </h3>
                  <ul className="space-y-1 ml-8 text-muted-foreground">
                    <li>• 飲み放題なしの合計金額</li>
                    <li>• 飲み放題ありの合計金額</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">4</span>
                    結果を確認
                  </h3>
                  <p className="ml-8 text-muted-foreground">
                    先輩1人あたりの支払額を自動計算し、どちらがお得か判定します。
                  </p>
                </div>

                <div className="mt-4 p-3 bg-accent/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">計算方法:</strong> 合計金額から新人の支払い総額を引いた残りを先輩の人数で割って、1人あたりの金額を算出します。
                  </p>
                </div>

                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">例:</strong> 新人2人（各¥1,000）、先輩3人の場合<br/>
                    飲み放題¥2,000/人、アルコール¥500/杯、ソフトドリンク¥300/杯<br/>
                    飲み放題なし¥10,000、飲み放題あり¥12,000<br/>
                    → なし: (¥10,000 - ¥2,000) ÷ 3 = <strong className="text-foreground">¥2,667/人</strong><br/>
                    → あり: (¥12,000 - ¥2,000) ÷ 3 = <strong className="text-foreground">¥3,334/人</strong><br/>
                    → 結果: <strong className="text-success">飲み放題なしがお得</strong>
                  </p>
                </div>
              </div>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        <Card className="p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Users size={24} weight="duotone" className="text-primary" />
                参加者の構成
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="num-juniors" className="text-base">新人の人数</Label>
                  <Input
                    id="num-juniors"
                    type="number"
                    min="0"
                    value={numJuniors}
                    onChange={(e) => setNumJuniors(e.target.value)}
                    placeholder="0"
                    className="h-12 text-lg"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="num-seniors" className="text-base">先輩の人数</Label>
                  <Input
                    id="num-seniors"
                    type="number"
                    min="1"
                    value={numSeniors}
                    onChange={(e) => setNumSeniors(e.target.value)}
                    placeholder="0"
                    className="h-12 text-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="space-y-2">
                <Label htmlFor="junior-payment" className="text-base">新人1人あたりの支払額</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                  <Input
                    id="junior-payment"
                    type="number"
                    min="0"
                    value={juniorPayment}
                    onChange={(e) => setJuniorPayment(e.target.value)}
                    placeholder="1000"
                    className="h-12 text-lg pl-8"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CurrencyCircleDollar size={24} weight="duotone" className="text-primary" />
                ドリンク料金設定
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nomihoudai-price" className="text-base">飲み放題（1人）</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                    <Input
                      id="nomihoudai-price"
                      type="number"
                      min="0"
                      value={nomihoudaiPrice}
                      onChange={(e) => setNomihoudaiPrice(e.target.value)}
                      placeholder="2000"
                      className="h-12 text-lg pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alcohol-price" className="text-base">単品アルコール</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                    <Input
                      id="alcohol-price"
                      type="number"
                      min="0"
                      value={alcoholPrice}
                      onChange={(e) => setAlcoholPrice(e.target.value)}
                      placeholder="500"
                      className="h-12 text-lg pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="soft-drink-price" className="text-base">単品ソフトドリンク</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                    <Input
                      id="soft-drink-price"
                      type="number"
                      min="0"
                      value={softDrinkPrice}
                      onChange={(e) => setSoftDrinkPrice(e.target.value)}
                      placeholder="300"
                      className="h-12 text-lg pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CurrencyCircleDollar size={24} weight="duotone" className="text-primary" />
                合計金額
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cost-without" className="text-base">飲み放題なし</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                    <Input
                      id="cost-without"
                      type="number"
                      min="0"
                      value={costWithout}
                      onChange={(e) => setCostWithout(e.target.value)}
                      placeholder="0"
                      className="h-12 text-lg pl-8"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost-with" className="text-base">飲み放題あり</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                    <Input
                      id="cost-with"
                      type="number"
                      min="0"
                      value={costWith}
                      onChange={(e) => setCostWith(e.target.value)}
                      placeholder="0"
                      className="h-12 text-lg pl-8"
                    />
                  </div>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {hasError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
                >
                  <p className="text-destructive font-medium">{errorMessage}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Separator className="mb-6" />
                  
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-center">先輩1人あたりの支払額</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        className={`p-6 rounded-lg border-2 transition-colors ${
                          !shouldUseNomihoudai
                            ? 'bg-success/10 border-success'
                            : 'bg-card border-border'
                        }`}
                      >
                        {!shouldUseNomihoudai && (
                          <Badge className="mb-3 bg-success text-success-foreground hover:bg-success">
                            <CheckCircle size={16} weight="fill" className="mr-1" />
                            おすすめ
                          </Badge>
                        )}
                        <div className="text-sm text-muted-foreground mb-2">飲み放題なし</div>
                        <div className="text-3xl font-bold tabular-nums">
                          ¥{formatCurrency(Math.ceil(seniorCostWithout))}
                        </div>
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className={`p-6 rounded-lg border-2 transition-colors ${
                          shouldUseNomihoudai
                            ? 'bg-success/10 border-success'
                            : 'bg-card border-border'
                        }`}
                      >
                        {shouldUseNomihoudai && (
                          <Badge className="mb-3 bg-success text-success-foreground hover:bg-success">
                            <CheckCircle size={16} weight="fill" className="mr-1" />
                            おすすめ
                          </Badge>
                        )}
                        <div className="text-sm text-muted-foreground mb-2">飲み放題あり</div>
                        <div className="text-3xl font-bold tabular-nums">
                          ¥{formatCurrency(Math.ceil(seniorCostWith))}
                        </div>
                      </motion.div>
                    </div>

                    {savings > 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-4 bg-accent/50 rounded-lg"
                      >
                        <p className="text-base font-semibold text-foreground">
                          {shouldUseNomihoudai ? '飲み放題' : '飲み放題なし'}の方が
                          <span className="text-primary text-xl mx-2">
                            ¥{formatCurrency(Math.ceil(savings))}
                          </span>
                          お得です
                        </p>
                      </motion.div>
                    )}

                    {savings <= 1 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center p-4 bg-muted rounded-lg"
                      >
                        <p className="text-base text-muted-foreground">
                          金額はほぼ同じです。お好みで選んでください。
                        </p>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>新人研修の打ち上げ用の計算ツールです</p>
        </div>
      </div>
    </div>
  )
}

export default App