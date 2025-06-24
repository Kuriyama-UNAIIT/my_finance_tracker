<template>
  <div class="space-y-16">
    <section class="flex items-center justify-between">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelectMenu :items="transactionViewOptions" v-model="selectedView" />
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16">
      <Trend title="Income" :amount="incomeTotal" :last-amount="2000" :loading="isLoading" />
      <Trend title="Expense" :amount="expenseTotal" :last-amount="2000" :loading="isLoading" />
      <Trend title="Investments" :amount="6000" :last-amount="3000" :loading="isLoading" />
      <Trend title="Savings" :amount="4000" :last-amount="4400" :loading="isLoading" />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-muted">
          You have {{ incomeCount }} incomes and {{ ExpenseCount }} expenses this period
        </div>
      </div>
      <div>
        <UButton icon="i-heroicons-plus-circle" color="neutral" variant="outline" label="Add" />
      </div>
    </section>

    <section v-if="!isLoading">
      <div v-for="(transactionsOnDay, date) in transactionsGroupedByDate"
        :key="date" class="mb-10">
        <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
        <Transaction v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @deleted="refreshTransactions()" />
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';
const selectedView = ref(transactionViewOptions[1])

const supabase = useSupabaseClient()
const transactions = ref([])
const isLoading = ref(false)

const income = computed(
  () => transactions.value.filter(t => t.type === 'Income')
)
const expense = computed(
  () => transactions.value.filter(t => t.type === 'Expense')
)

const incomeCount = computed(() => income.value.length)
const ExpenseCount = computed(() => expense.value.length)

const incomeTotal = computed(
  () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)
const expenseTotal = computed(
  () => expense.value.reduce((sum, transaction) => sum + transaction.amount, 0)
)

const fetchTransactions = async () => {
  isLoading.value = true
  try {
    const { data } = await useAsyncData('transactions', async () => {
      const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .order('created_at', { ascending: false })

      if (error) return []
      return data
    })

    return data.value
  } finally {
    isLoading.value = false
  }
}

const refreshTransactions = async () => transactions.value = await fetchTransactions()

await refreshTransactions()

const transactionsGroupedByDate = computed(() => {
  let grouped = {}

  for (const transaction of transactions.value) {
    const date = new Date(transaction.created_at).toISOString().split('T')[0]

    if (!grouped[date]) {
      grouped[date] = []
    }

    grouped[date].push(transaction)
  }

  return grouped
})

useHead({
  title: 'Top'
})
</script>
