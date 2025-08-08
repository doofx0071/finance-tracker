'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { transactionService } from '@/lib/database'
import type { Transaction } from '@/lib/types'
import { TRANSACTION_TYPES, CATEGORIES } from '@/lib/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'

export default function TransactionsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [search, setSearch] = useState('')

  // Filters
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')

  // Create/Edit modal state
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [form, setForm] = useState({
    date: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: '',
    notes: ''
  })
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)


  const openCreate = () => {
    setEditing(null)
    setForm({ date: new Date().toISOString().slice(0,10), type: 'expense', category: '', amount: '', notes: '' })
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (t: Transaction) => {
    setEditing(t)
    setForm({
      date: t.date,
      type: t.type,
      category: t.category,
      amount: String(t.amount),
      notes: t.notes || ''
    })
    setFormError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!user) return
    setFormError('')
    if (!form.date || !form.category || !form.amount) {
      setFormError('Date, category, and amount are required.')
      return
    }
    const amountNum = Number(form.amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setFormError('Amount must be a positive number.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        const updated = await transactionService.updateTransaction(editing.id, {
          date: form.date,
          type: form.type,
          category: form.category,
          amount: amountNum,
          notes: form.notes,
        } as any)
        if (updated) {
          setTransactions(prev => prev.map(p => p.id === updated.id ? updated : p))
        }
      } else {
        const created = await transactionService.createTransaction({
          user_id: user.id,
          date: form.date,
          type: form.type,
          category: form.category,
          amount: amountNum,
          notes: form.notes,
        } as any)
        if (created) {
          setTransactions(prev => [created, ...prev])
        }
      }
      setShowModal(false)
    } catch (e) {
      console.error(e)
      setFormError('Failed to save transaction')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this transaction?')) return
    try {
      const ok = await transactionService.deleteTransaction(id)
      if (ok) setTransactions(prev => prev.filter(p => p.id !== id))
    } catch (e) {
      console.error(e)
      setError('Failed to delete transaction')
    }
  }

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.push('/')
      return
    }

    const load = async () => {
      try {
        setLoading(true)
        const data = await transactionService.getTransactions(user.id)
        setTransactions(data)

      } catch (e) {
        console.error(e)
        setError('Failed to load transactions')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user, authLoading, router])

  const filtered = useMemo(() => {
    let list = transactions

    // Search by category or notes
    if (search) {
      const term = search.toLowerCase()
      list = list.filter(t =>
        t.category.toLowerCase().includes(term) ||
        (t.notes || '').toLowerCase().includes(term)
      )
    }

    // Type filter
    if (filterType !== 'all') {
      list = list.filter(t => t.type === filterType)
    }

    // Category filter
    if (filterCategory !== 'all') {
      list = list.filter(t => t.category === filterCategory)
    }

    // Date range filter
    if (startDate) {
      list = list.filter(t => t.date >= startDate)
    }
    if (endDate) {
      list = list.filter(t => t.date <= endDate)
    }

    return list
  }, [transactions, search, filterType, filterCategory, startDate, endDate])

  const totals = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of filtered) {
      if (t.type === 'income') income += Number(t.amount)
      else expense += Number(t.amount)
    }
    return { income, expense, net: income - expense }
  }, [filtered])

  const fmt = new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' })
  const fmtDate = (d: string) => new Date(d).toLocaleDateString()

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <Spinner size="lg" className="mx-auto" />
          <h2 className="text-xl font-semibold">Loading transactions…</h2>
        </div>
      </div>
    )
  }


        {/* Filters */}
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
              <div className="col-span-1">
                <Label className="text-white text-xs">Type</Label>
                <div className="mt-2 flex gap-2">
                  {(['all','income','expense'] as const).map(t => (
                    <button key={t} type="button" onClick={() => setFilterType(t)}
                      className={`px-3 py-2 rounded-md border text-sm transition ${filterType === t ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-700 hover:bg-gray-800'}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div className="col-span-1">
                <Label className="text-white text-xs">Category</Label>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
                  className="mt-2 w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 text-sm">
                  <option value="all">All</option>
                  {Array.from(new Set(CATEGORIES.map(c => c.value))).map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <Label className="text-white text-xs">Start Date</Label>
                <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="col-span-1">
                <Label className="text-white text-xs">End Date</Label>
                <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                  className="mt-2 bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="col-span-1 flex items-end">
                <Button variant="outline" className="w-full border-gray-700 text-white hover:bg-gray-800" onClick={() => { setFilterType('all'); setFilterCategory('all'); setStartDate(''); setEndDate(''); setSearch('') }}>Reset</Button>
              </div>
            </div>
          </CardContent>
        </Card>

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Transactions</h1>
            <p className="text-gray-400">Review and manage your income and expenses</p>
          </div>
          <div className="flex items-center gap-3">
            <Input
              placeholder="Search category or notes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64 bg-gray-900 border-gray-800 text-white placeholder-gray-400"
            />
            <Button
              onClick={openCreate}
              className="bg-white text-black hover:bg-gray-200"
            >
              Add Transaction
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Income</CardTitle>
              <CardDescription className="text-gray-400">Total income</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{fmt.format(totals.income)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Expenses</CardTitle>
              <CardDescription className="text-gray-400">Total expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-400">{fmt.format(totals.expense)}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white text-sm">Net</CardTitle>
              <CardDescription className="text-gray-400">Income - Expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${totals.net >= 0 ? 'text-green-400' : 'text-red-400'}`}>{fmt.format(totals.net)}</div>
            </CardContent>
          </Card>
        </div>

        {/* List */}
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white text-base">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-400">{filtered.length} result(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">{error}</div>
            )}
            {filtered.length === 0 ? (
              <div className="text-gray-400 text-sm">No transactions found.</div>
            ) : (
              <div className="divide-y divide-gray-800">
                {filtered.map((t) => (
                  <div key={t.id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div>
                        <div className="text-white font-medium">{t.category}</div>
                        <div className="text-gray-400 text-xs">{fmtDate(t.date)} • {t.type}</div>
                        {t.notes && <div className="text-gray-400 text-xs mt-1">{t.notes}</div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`font-semibold ${t.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                        {t.type === 'income' ? '+' : '-'}{fmt.format(Number(t.amount))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" className="border-gray-700 text-white hover:bg-gray-800" onClick={() => openEdit(t)}>Edit</Button>
                        <Button size="sm" variant="outline" className="border-red-700 text-red-400 hover:bg-red-900/30" onClick={() => handleDelete(t.id)}>Delete</Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-xl border p-6 shadow-2xl bg-gray-900 border-gray-800">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">{editing ? 'Edit' : 'Add'} Transaction</h3>
                <p className="mt-1 text-sm text-gray-400">Fill in the details below</p>
              </div>
              <button className="h-8 w-8 rounded-md text-lg leading-none text-gray-400 hover:text-white" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {formError && (
              <div className="mt-3 p-2 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">{formError}</div>
            )}

            <div className="mt-4 space-y-3">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date</Label>
                <Input id="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label className="text-white">Type</Label>
                <div className="flex gap-2">
                  {TRANSACTION_TYPES.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => setForm({ ...form, type: t.value })}
                      className={`px-3 py-2 rounded-md border text-sm transition ${form.type === t.value ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-700 hover:bg-gray-800'}`}
                    >{t.label}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-white">Category</Label>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto pr-1">
                  {CATEGORIES.filter(c => c.type === form.type).map(c => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setForm({ ...form, category: c.value })}
                      className={`px-3 py-2 rounded-md border text-sm text-left transition ${form.category === c.value ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-700 hover:bg-gray-800'}`}
                    >{c.value}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount</Label>
                <Input id="amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-white">Notes (optional)</Label>
                <Input id="notes" type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-gray-800 border-gray-700 text-white" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button onClick={handleSave} disabled={saving} className="flex-1 bg-white text-black hover:bg-gray-200">
                  {saving ? 'Saving…' : 'Save'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="flex-1 border-gray-700 text-white hover:bg-gray-800">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

