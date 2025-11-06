import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Users, CurrencyCircleDollar, CheckCircle, Calculator } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const [numJuniors, setNumJuniors] = useState<string>('')
  const [numSeniors, setNumSeniors] = useState<string>('')
  const [juniorPayment, setJuniorPayment] = useState<string>('1000')
  const [costWithout, setCostWithout] = useState<string>('')
  const [costWith, setCostWith] = useState<string>('')

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