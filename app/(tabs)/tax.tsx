import { ACCENT } from '@/constants';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';

const fmt = (n) => '$' + (Number(n) || 0).toFixed(2);

export default function TaxScreen() {
  const router = useRouter();
  const store = useStore();
  const transactions = store?.transactions ?? [];
  const clients = store?.clients ?? [];
  const taxRate = store?.taxRate ?? 22;
  const updateTaxRate = store?.updateTaxRate;

  const [draft, setDraft] = useState(String(taxRate));
  useEffect(() => { setDraft(String(taxRate)); }, [taxRate]);

  const year = new Date().getFullYear();
  const yearTxs = transactions;

  const totalLogged = yearTxs.reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalWithReceipts = yearTxs.filter(t => t.receipt).reduce((s, t) => s + (Number(t.amount) || 0), 0);
  const totalMissing = totalLogged - totalWithReceipts;
  const missingCount = yearTxs.filter(t => !t.receiptUri).length;

  const byClient = clients.map(c => ({
    ...c,
    total: yearTxs.filter(t => t.clientId === c.id).reduce((s, t) => s + (Number(t.amount) || 0), 0),
    count: yearTxs.filter(t => t.clientId === c.id).length,
  })).filter(c => c.count > 0);

  const workTotal = yearTxs
    .filter(t => t.clientId !== 5)
    .reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const estimatedSavings = workTotal * (taxRate / 100);

  return (
    <SafeAreaView style={s.root}>
      <ScrollView>
        <View style={s.header}>
          <Text style={s.sub}>{year} SUMMARY</Text>
          <Text style={s.title}>Tax View</Text>
        </View>

        {/* Tax bracket input */}
        <View style={s.rateCard}>
          <Text style={s.rateLabel}>TAX BRACKET</Text>
          <View style={s.rateRow}>
            <TextInput
              style={s.rateInput}
              value={draft}
              onChangeText={setDraft}
              onBlur={() => {
                const val = parseFloat(draft);
                if (!isNaN(val) && val > 0 && val <= 100) {
                  updateTaxRate(val);
                } else {
                  setDraft(String(taxRate));
                }
              }}
              keyboardType="numeric"
              maxLength={5}
              selectTextOnFocus
            />
            <Text style={s.ratePct}>%</Text>
          </View>
        </View>

        {/* Summary cards */}
        <View style={s.cardRow}>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>TOTAL LOGGED</Text>
            <Text style={s.summaryAmount}>{fmt(totalLogged)}</Text>
            <Text style={s.summarySub}>{yearTxs.length} transactions</Text>
          </View>
          <View style={s.summaryCard}>
            <Text style={s.summaryLabel}>EST. SAVINGS</Text>
            <Text style={[s.summaryAmount, { color: '#22c55e' }]}>{fmt(estimatedSavings)}</Text>
            <Text style={s.summarySub}>at {taxRate}% bracket</Text>
          </View>
        </View>

        <TouchableOpacity onPress={() => router.push('/explore?filter=missing&source=tax')}>
          <View style={[s.summaryCard, { marginHorizontal: 16, marginBottom: 16 }]}>
            <Text style={s.summaryLabel}>MISSING RECEIPTS</Text>
            <Text style={s.summaryAmount}>{fmt(totalMissing)}</Text>
            <Text style={s.summarySub}>~{fmt(totalMissing * (taxRate / 100))} in tax savings not secured</Text>
          </View>
        </TouchableOpacity>

        {/* By client */}
        <Text style={s.sectionLabel}>BY CLIENT</Text>
        {byClient.map(c => (
          <View key={c.id} style={s.clientRow}>
            <View style={[s.avatar, { backgroundColor: c.color + '22' }]}>
              <Text style={[s.avatarText, { color: c.color }]}>{c.initials}</Text>
            </View>
            <View style={s.clientInfo}>
              <Text style={s.clientName}>{c.name}</Text>
              <Text style={s.clientMeta}>{c.count} transactions</Text>
            </View>
            <Text style={s.clientTotal}>{fmt(c.total)}</Text>
          </View>
        ))}

        {/* All transactions */}
        <Text style={s.sectionLabel}>ALL TRANSACTIONS</Text>
        {yearTxs.map(tx => {
          const client = clients.find(c => c.id === tx.clientId);
          return (
            <View key={tx.id} style={s.txRow}>
              <View style={s.txInfo}>
                <Text style={s.txMerchant}>{tx.merchant}</Text>
                <Text style={s.txMeta}>{client?.name} · {tx.date}</Text>
              </View>
              <View style={s.txRight}>
                <Text style={s.txAmount}>{fmt(tx.amount)}</Text>
                {tx.receipt && <Text style={s.receiptTag}>✓</Text>}
              </View>
            </View>
          );
        })}

        {/* Export */}
        <View style={s.exportSection}>
          <Text style={s.sectionLabel}>EXPORT</Text>
          <TouchableOpacity style={s.exportBtn} onPress={() => Alert.alert('Coming soon', 'Export will be available in a future update.')}>
            <Text style={s.exportBtnText}>Export CSV</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.exportBtn, { backgroundColor: '#1c1c22', marginTop: 8 }]} onPress={() => Alert.alert('Coming soon', 'Export will be available in a future update.')}>
            <Text style={[s.exportBtnText, { color: '#ede9e3' }]}>Export PDF Report</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { padding: 24, paddingBottom: 16 },
  sub: { color: '#555', fontSize: 11, letterSpacing: 2, marginBottom: 4 },
  title: { color: '#ede9e3', fontSize: 32, fontWeight: '800' },
  rateCard: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#141418', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#21212a', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rateLabel: { color: '#555', fontSize: 9, letterSpacing: 2 },
  rateRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  rateInput: { color: ACCENT, fontSize: 22, fontWeight: '800', textAlign: 'right', minWidth: 48, padding: 0 },
  ratePct: { color: ACCENT, fontSize: 22, fontWeight: '800' },
  cardRow: { flexDirection: 'row', gap: 10, marginHorizontal: 16, marginBottom: 10 },
  summaryCard: { flex: 1, backgroundColor: '#141418', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#21212a' },
  summaryLabel: { color: '#555', fontSize: 9, letterSpacing: 2, marginBottom: 6 },
  summaryAmount: { color: ACCENT, fontSize: 22, fontWeight: '800', marginBottom: 2 },
  summarySub: { color: '#444', fontSize: 11 },
  sectionLabel: { color: '#444', fontSize: 10, letterSpacing: 2, paddingHorizontal: 22, paddingVertical: 12 },
  clientRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#151518', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontWeight: '700' },
  clientInfo: { flex: 1 },
  clientName: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  clientMeta: { color: '#555', fontSize: 11, marginTop: 2 },
  clientTotal: { color: '#ede9e3', fontSize: 16, fontWeight: '700' },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#151518' },
  txInfo: { flex: 1 },
  txMerchant: { color: '#ede9e3', fontSize: 13, fontWeight: '500' },
  txMeta: { color: '#555', fontSize: 11, marginTop: 2 },
  txRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  txAmount: { color: '#ede9e3', fontSize: 13 },
  receiptTag: { color: '#22c55e', fontSize: 12 },
  exportSection: { marginTop: 8 },
  exportBtn: { marginHorizontal: 16, backgroundColor: ACCENT, borderRadius: 11, padding: 15, alignItems: 'center' },
  exportBtnText: { color: '#0d0900', fontWeight: '700', fontSize: 14 },
});