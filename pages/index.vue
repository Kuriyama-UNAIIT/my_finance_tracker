<template>
  <div class="space-y-16">
    <section class="flex items-center justify-between">
      <h1 class="text-4xl font-extrabold">Summary</h1>
      <div>
        <USelectMenu :items="transactionViewOptions" v-model="selectedView" />
      </div>
    </section>

    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-16">
      <Trend title="Income" color="text-success"
        :amount="incomeTotal" :last-amount="prevIncomeTotal" :loading="pending" />
      <Trend title="Expense" color="text-error"
        :amount="expenseTotal" :last-amount="prevExpenseTotal" :loading="pending" />
      <Trend title="Investments" color="text-success"
        :amount="6000" :last-amount="3000" :loading="pending" />
      <Trend title="Savings" color="text-error"
        :amount="4000" :last-amount="4400" :loading="pending" />
    </section>

    <section class="flex justify-between mb-10">
      <div>
        <h2 class="text-2xl font-extrabold">Transactions</h2>
        <div class="text-muted">
          You have {{ incomeCount }} incomes and {{ expenseCount }} expenses this period
        </div>
      </div>
      <div>
        <UButton
          icon="i-heroicons-plus-circle"
          color="neutral"
          variant="outline"
          label="Add"
          @click="isOpen = true"/>
        <TransactionModal v-model:open="isOpen" @saved="refresh()" />
      </div>
    </section>

    <section v-if="!pending">
      <div v-for="(transactionsOnDay, date) in byDate"
        :key="date" class="mb-10">
        <DailyTransactionSummary :date="date" :transactions="transactionsOnDay" />
        <Transaction v-for="transaction in transactionsOnDay"
          :key="transaction.id"
          :transaction="transaction"
          @edited="refresh()" @deleted="refresh()" />
      </div>
    </section>
    <section v-else>
      <USkeleton class="h-8 w-full mb-2" v-for="i in 4" :key="i" />
    </section>
  </div>
</template>

<script setup>
import { transactionViewOptions } from '~/constants';

const user = useSupabaseUser()

const isOpen = ref(false)

const selectedView = ref(user.value.user_metadata?.transaction_view ?? transactionViewOptions[1])
const { current, previous } = useSelectedTimePeriod(selectedView)

const { pending, refresh, transactions: {
  incomeCount,
  expenseCount,
  incomeTotal,
  expenseTotal,
  grouped: {
    byDate
  }
} } = useFetchTransactions(current)
await refresh()

const { refresh: refreshPrevious, transactions: {
  incomeTotal: prevIncomeTotal,
  expenseTotal: prevExpenseTotal
} } = useFetchTransactions(previous)
await refreshPrevious()

useHead({
  title: 'Top'
})
</script>
