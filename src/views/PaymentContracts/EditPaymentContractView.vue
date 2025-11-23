<script setup>
import { ref, onMounted } from 'vue'
import { usePaymentContracts } from '@/composables/usePaymentContracts'
import { useContracts } from '@/composables/useContrats'
import { useRouter, useRoute } from 'vue-router'
import Card from '@/components/ui/card/Card.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import Input from '@/components/ui/input/Input.vue'
import Button from '@/components/ui/button/Button.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'

const route = useRoute()
const router = useRouter()
const paymentStore = usePaymentContracts()
const contractStore = useContracts()
const contract_id = ref('')
const montant = ref('')
const methode_paiement = ref('card')
const statut = ref('PENDING')
const date_paiement = ref('')
const reference_transaction = ref('')

onMounted(async () => {
  try {
    await Promise.all([
      paymentStore.fetchPaymentContracts(),
      contractStore.fetchContracts(),
    ])
    const payment = paymentStore.paymentContracts.find(p => p._id === route.params.id || p.id === route.params.id)
    if (payment) {
      contract_id.value = payment.contract_id || ''
      montant.value = payment.montant || ''
      methode_paiement.value = payment.methode_paiement || 'card'
      statut.value = payment.statut || 'PENDING'
      date_paiement.value = payment.date_paiement ? new Date(payment.date_paiement).toISOString().split('T')[0] : ''
      reference_transaction.value = payment.reference_transaction || ''
    } else {
      alert('Paiement non trouvé')
      router.push('/admin/payment-contracts')
    }
  } catch (error) {
    console.error('Error loading payment:', error)
    alert('Erreur lors du chargement: ' + (error.message || 'Erreur inconnue'))
  }
})

const submit = async () => {
  if (!contract_id.value || !montant.value || !date_paiement.value) {
    alert('Le contrat, le montant et la date sont requis')
    return
  }
  try {
    await paymentStore.updatePaymentContract(route.params.id, {
      contract_id: contract_id.value,
      montant: Number(montant.value),
      methode_paiement: methode_paiement.value,
      statut: statut.value,
      date_paiement: date_paiement.value,
      reference_transaction: reference_transaction.value || null
    })
    router.push('/admin/payment-contracts')
  } catch (error) {
    const errorMsg = paymentStore.error || error.message || 'Erreur lors de la mise à jour'
    alert('Erreur: ' + errorMsg)
    console.error('Error updating payment contract:', error)
  }
}
</script>

<template>
  <AdminLayout>
    <div class="p-6">
      <Card class="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Modifier le paiement</CardTitle>
        </CardHeader>
        <CardContent class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contrat *</label>
            <Select v-model="contract_id">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un contrat" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem v-for="contract in contractStore.contracts" :key="contract._id || contract.id" :value="contract._id || contract.id">
                  Contrat #{{ (contract._id || contract.id).slice(-6) }} - {{ contract.amount }} TND
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Montant *</label>
            <Input v-model="montant" type="number" min="0" step="0.01" placeholder="Montant en TND" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Méthode de paiement *</label>
            <Select v-model="methode_paiement">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une méthode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="card">Carte bancaire</SelectItem>
                <SelectItem value="cash">Espèces</SelectItem>
                <SelectItem value="transfer">Virement</SelectItem>
                <SelectItem value="check">Chèque</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Statut *</label>
            <Select v-model="statut">
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">En attente</SelectItem>
                <SelectItem value="PAID">Payé</SelectItem>
                <SelectItem value="FAILED">Échoué</SelectItem>
                <SelectItem value="REFUNDED">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date de paiement *</label>
            <Input v-model="date_paiement" type="date" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Référence transaction</label>
            <Input v-model="reference_transaction" placeholder="Référence (optionnel)" />
          </div>
          <div class="flex gap-2">
            <Button variant="outline" @click="router.push('/admin/payment-contracts')">Annuler</Button>
            <Button class="bg-orange-600 hover:bg-orange-700 text-white" @click="submit">Mettre à jour</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  </AdminLayout>
</template>

