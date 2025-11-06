import { useState, useMemo } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Users, CurrencyCircleDollar, CheckCircle, Calculator, Info, BeerBottle, ForkKnife } from '@phosphor-icons/react'
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
  const [nomihoudaiPrice, setNomihoudaiPrice] = useState<string>('2000')
  const [alcoholDrinksPerPerson, setAlcoholDrinksPerPerson] = useState<string>('4')
  const [softDrinksPerPerson, setSoftDrinksPerPerson] = useState<string>('2')
  const [alcoholPrice, setAlcoholPrice] = useState<string>('500')
  const [softDrinkPrice, setSoftDrinkPrice] = useState<string>('300')
  const [foodCostPerPerson, setFoodCostPerPerson] = useState<string>('3000')
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
  const nomihoudaiPerPerson = parseNumber(nomihoudaiPrice)
  const alcoholPerDrink = parseNumber(alcoholPrice)
  const softDrinkPerDrink = parseNumber(softDrinkPrice)
  const alcoholDrinks = parseNumber(alcoholDrinksPerPerson)
  const softDrinks = parseNumber(softDrinksPerPerson)
  const foodCost = parseNumber(foodCostPerPerson)

  const totalPeople = juniors + seniors

  const calculations = useMemo(() => {
    if (totalPeople === 0 || seniors === 0) {
      return {
        isValid: false,
        hasError: false,
        errorMessage: '',
        totalWithout: 0,
        totalWith: 0,
        seniorCostWithout: 0,
        seniorCostWith: 0,
      }
    }

    const totalFoodCost = totalPeople * foodCost

    const totalWithoutDrinkCost = totalPeople * (alcoholDrinks * alcoholPerDrink + softDrinks * softDrinkPerDrink)
    const totalWithout = totalFoodCost + totalWithoutDrinkCost

    const totalWithDrinkCost = totalPeople * nomihoudaiPerPerson
    const totalWith = totalFoodCost + totalWithDrinkCost

    const totalJuniorPayment = juniors * juniorPay

    let hasError = false
    let errorMessage = ''
    let seniorCostWithout = 0
    let seniorCostWith = 0

    if (totalJuniorPayment > totalWithout || totalJuniorPayment > totalWith) {
      hasError = true
      errorMessage = '新人の支払い総額が合計金額を超えています'
    } else {
      const remainingWithout = totalWithout - totalJuniorPayment
      const remainingWith = totalWith - totalJuniorPayment

      seniorCostWithout = remainingWithout / seniors
      seniorCostWith = remainingWith / seniors
    }

    return {
      isValid: true,
      hasError,
      errorMessage,
      totalWithout,
      totalWith,
      seniorCostWithout,
      seniorCostWith,
    }
  }, [juniors, seniors, juniorPay, foodCost, alcoholDrinks, softDrinks, alcoholPerDrink, softDrinkPerDrink, nomihoudaiPerPerson, totalPeople])

  const { isValid, hasError, errorMessage, totalWithout, totalWith, seniorCostWithout, seniorCostWith } = calculations

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
                    料理・ドリンク設定
                  </h3>
                  <ul className="space-y-1 ml-8 text-muted-foreground">
                    <li>• 1人あたりの料理代（デフォルト: ¥3,000）</li>
                    <li>• 1人あたりのアルコール杯数（デフォルト: 4杯）</li>
                    <li>• 1人あたりのソフトドリンク杯数（デフォルト: 2杯）</li>
                    <li>• 単品アルコール1杯の料金（デフォルト: ¥500）</li>
                    <li>• 単品ソフトドリンク1杯の料金（デフォルト: ¥300）</li>
                    <li>• 飲み放題の1人あたり料金（デフォルト: ¥2,000）</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">3</span>
                    結果を確認
                  </h3>
                  <p className="ml-8 text-muted-foreground">
                    入力されたパラメータから合計金額を自動計算し、先輩1人あたりの支払額を比較してどちらがお得か判定します。
                  </p>
                </div>

                <div className="mt-4 p-3 bg-accent/30 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">計算方法:</strong> 料理代とドリンク代の合計から新人の支払い総額を引いた残りを先輩の人数で割って、1人あたりの金額を算出します。
                  </p>
                </div>

                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong className="text-foreground">例:</strong> 新人2人（各¥1,000）、先輩3人、全員で料理¥3,000/人の場合<br/>
                    アルコール4杯/人(¥500/杯)、ソフトドリンク2杯/人(¥300/杯)、飲み放題¥2,000/人<br/>
                    → なし: 料理¥15,000 + ドリンク¥13,000 = ¥28,000、(¥28,000 - ¥2,000) ÷ 3 = <strong className="text-foreground">¥8,667/人</strong><br/>
                    → あり: 料理¥15,000 + 飲み放題¥10,000 = ¥25,000、(¥25,000 - ¥2,000) ÷ 3 = <strong className="text-foreground">¥7,667/人</strong><br/>
                    → 結果: <strong className="text-success">飲み放題がお得</strong>
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
                <ForkKnife size={24} weight="duotone" className="text-primary" />
                料理代
              </h2>
              <div className="space-y-2">
                <Label htmlFor="food-cost" className="text-base">1人あたりの料理代</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">¥</span>
                  <Input
                    id="food-cost"
                    type="number"
                    min="0"
                    value={foodCostPerPerson}
                    onChange={(e) => setFoodCostPerPerson(e.target.value)}
                    placeholder="3000"
                    className="h-12 text-lg pl-8"
                  />
                </div>
                <p className="text-xs text-muted-foreground">居酒屋の平均的な料理代は¥2,500〜¥3,500/人程度です</p>
              </div>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <BeerBottle size={24} weight="duotone" className="text-primary" />
                ドリンク設定
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="alcohol-drinks" className="text-base">アルコール（杯/人）</Label>
                    <Input
                      id="alcohol-drinks"
                      type="number"
                      min="0"
                      value={alcoholDrinksPerPerson}
                      onChange={(e) => setAlcoholDrinksPerPerson(e.target.value)}
                      placeholder="4"
                      className="h-12 text-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="soft-drinks" className="text-base">ソフトドリンク（杯/人）</Label>
                    <Input
                      id="soft-drinks"
                      type="number"
                      min="0"
                      value={softDrinksPerPerson}
                      onChange={(e) => setSoftDrinksPerPerson(e.target.value)}
                      placeholder="2"
                      className="h-12 text-lg"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  
                  <div className="space-y-6">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h3 className="text-sm font-semibold text-muted-foreground mb-3">計算された合計金額</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-card p-3 rounded border border-border">
                          <div className="text-xs text-muted-foreground mb-1">飲み放題なし</div>
                          <div className="text-lg font-bold tabular-nums text-foreground">
                            ¥{formatCurrency(Math.ceil(totalWithout))}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            料理¥{formatCurrency(totalPeople * foodCost)} + ドリンク¥{formatCurrency(totalPeople * (alcoholDrinks * alcoholPerDrink + softDrinks * softDrinkPerDrink))}
                          </div>
                        </div>
                        <div className="bg-card p-3 rounded border border-border">
                          <div className="text-xs text-muted-foreground mb-1">飲み放題あり</div>
                          <div className="text-lg font-bold tabular-nums text-foreground">
                            ¥{formatCurrency(Math.ceil(totalWith))}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            料理¥{formatCurrency(totalPeople * foodCost)} + 飲み放題¥{formatCurrency(totalPeople * nomihoudaiPerPerson)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-center mb-4">先輩1人あたりの支払額</h2>
                      
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
                          className="text-center p-4 bg-accent/50 rounded-lg mt-4"
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
                          className="text-center p-4 bg-muted rounded-lg mt-4"
                        >
                          <p className="text-base text-muted-foreground">
                            金額はほぼ同じです。お好みで選んでください。
                          </p>
                        </motion.div>
                      )}
                    </div>
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