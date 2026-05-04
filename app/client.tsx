import { ACCENT } from '@/constants';
import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

const fmt = (n) => '$' + (Number(n) || 0).toFixed(2);

const DEMO = [
  { merchant: 'Menards', amount: 84.12 },
  { merchant: 'Amazon', amount: 23.99 },
  { merchant: 'Shell', amount: 54.10 },
  { merchant: 'Walmart', amount: 112.34 },
  { merchant: 'Home Depot', amount: 67.50 },
];

export default function ClientScreen({ client, transactions, onBack, onInvoice }) {
  const store = useStore();
  const addTransaction = store?.addTransaction;
  const [showInvoiceConfirm, setShowInvoiceConfirm] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [invoiceNote, setInvoiceNote] = useState('');
  const [search, setSearch] = useState('');
  const [demoIdx, setDemoIdx] = useState(0);
  const [notif, setNotif] = useState(null);
  const [note, setNote] = useState('');

  const safeTxs = (transactions || []).filter(t => t && t.clientId != null && t.amount != null);
  const pending = safeTxs.filter(t => t.clientId === client.id && !t.invoiced);
  const invoiced = safeTxs.filter(t => t.clientId === client.id && t.invoiced);
  const pendingTotal = pending.reduce((s, t) => s + Number(t.amount), 0);

  const filteredPending = search.length > 1
    ? pending.filter(t => t.merchant?.toLowerCase().includes(search.toLowerCase()) || (t.note || '').toLowerCase().includes(search.toLowerCase()))
    : pending;

  const filteredInvoiced = search.length > 1
    ? invoiced.filter(t => t.merchant?.toLowerCase().includes(search.toLowerCase()) || (t.note || '').toLowerCase().includes(search.toLowerCase()))
    : invoiced;

  const invoicedGroups = filteredInvoiced.reduce((groups, t) => {
    const key = t.invoiceId || 'unknown';
    if (!groups[key]) groups[key] = [];
    groups[key].push(t);
    return groups;
  }, {});

  const simulateAdd = () => {
    const n = DEMO[demoIdx % DEMO.length];
    setDemoIdx(i => i + 1);
    setNotif(n);
    setNote('');
    setShowAddSheet(true);
  };

  const saveAdd = (hasReceipt) => {
    if (!addTransaction || !notif) return;
    addTransaction({
      clientId: client.id,
      merchant: notif.merchant,
      amount: notif.amount,
      note,
      receipt: hasReceipt,
      date: 'Today',
      invoiced: false,
    });
    setShowAddSheet(false);
  };

  return (
    <SafeAreaView style={s.root}>
      <ScrollView>
        <View style={s.header}>
          <TouchableOpacity onPress={onBack}>
            <Text style={s.back}>← Back</Text>
          </TouchableOpacity>
          <View style={s.headerRow}>
            <View style={[s.avatar, { backgroundColor: client.color + '22' }]}>
              <Text style={[s.avatarText, { color: client.color }]}>{client.initials}</Text>
            </View>
            <Text style={s.title}>{client.name}</Text>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
          <TextInput
            style={s.searchInput}
            placeholder="Search transactions…"
            placeholderTextColor="#555"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
        </View>

        {pending.length > 0 && (
          <View style={s.invoiceBar}>
            <View>
              <Text style={s.invoiceLabel}>READY TO INVOICE</Text>
              <Text style={s.invoiceTotal}>{fmt(pendingTotal)}</Text>
              <Text style={s.invoiceSub}>{pending.length} transactions</Text>
            </View>
            <TouchableOpacity style={s.invoiceBtn} onPress={() => setShowInvoiceConfirm(true)}>
              <Text style={s.invoiceBtnText}>Invoice →</Text>
            </TouchableOpacity>
          </View>
        )}

        {pending.length === 0 && search.length === 0 && (
          <View style={s.emptyBar}>
            <Text style={s.emptyText}>No pending transactions.{'\n'}Everything has been invoiced.</Text>
          </View>
        )}

        {filteredPending.length > 0 && (
          <>
            <Text style={s.sectionLabel}>PENDING</Text>
            {filteredPending.map(tx => (
              <View key={tx.id} style={s.txRow}>
                <View style={s.txInfo}>
                  <Text style={s.txMerchant}>{tx.merchant}</Text>
                  <Text style={s.txMeta}>{tx.date}{tx.note ? ' · ' + tx.note : ''}</Text>
                </View>
                <View style={s.txRight}>
                  <Text style={s.txAmount}>{fmt(tx.amount)}</Text>
                  <View style={tx.receipt ? s.receiptDot : s.noReceiptDot} />
                </View>
              </View>
            ))}
          </>
        )}

        {Object.keys(invoicedGroups).length > 0 && (
          <>
            <Text style={s.sectionLabel}>INVOICE HISTORY</Text>
            {Object.entries(invoicedGroups).map(([invoiceId, txs]) => {
              const total = txs.reduce((s, t) => s + Number(t.amount), 0);
              return (
                <View key={invoiceId} style={s.invoiceGroup}>
                  <View style={s.invoiceGroupHeader}>
                    <Text style={s.invoiceGroupTitle}>{txs[0].invoiceLabel || 'Invoice'}</Text>
                    <Text style={s.invoiceGroupTotal}>{fmt(total)}</Text>
                  </View>
                  <Text style={s.invoiceGroupMeta}>{txs.length} transactions · {txs[0].invoiceDate || ''}</Text>
                  {txs.map(tx => (
                    <View key={tx.id} style={s.invoiceGroupTx}>
                      <Text style={s.invoiceGroupTxName}>{tx.merchant}{tx.note ? ' · ' + tx.note : ''}</Text>
                      <Text style={s.invoiceGroupTxAmount}>{fmt(tx.amount)}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      <TouchableOpacity style={s.addBtn} onPress={simulateAdd}>
        <Text style={s.addBtnText}>+ Add Transaction</Text>
      </TouchableOpacity>

      <Modal visible={showInvoiceConfirm} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowInvoiceConfirm(false)} />
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>Mark as invoiced?</Text>
          <Text style={s.sheetSub}>
            This will archive {pending.length} transactions for {client.name} totaling {fmt(pendingTotal)}. Slate resets for next month but everything stays in your records.
          </Text>
          <TextInput
            style={s.noteInput}
            placeholder="Invoice note (optional)…"
            placeholderTextColor="#555"
            value={invoiceNote}
            onChangeText={setInvoiceNote}
          />
          <TouchableOpacity style={s.btnPrimary} onPress={() => {
            onInvoice(client.id, invoiceNote);
            setShowInvoiceConfirm(false);
            setInvoiceNote('');
          }}>
            <Text style={s.btnPrimaryText}>Yes, mark as invoiced</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={() => setShowInvoiceConfirm(false)}>
            <Text style={s.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={showAddSheet} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowAddSheet(false)} />
        <View style={s.sheet}>
          {notif && (
            <>
              <Text style={s.sheetLabel}>ADD TO {client.name.toUpperCase()}</Text>
              <Text style={s.sheetTitle}>{fmt(notif.amount)}</Text>
              <Text style={s.sheetSub}>at {notif.merchant}</Text>
              <TextInput
                style={s.noteInput}
                placeholder="Add a note (optional)…"
                placeholderTextColor="#555"
                value={note}
                onChangeText={setNote}
              />
              <Text style={[s.sheetSub, { fontSize: 11, letterSpacing: 1, marginBottom: 12 }]}>GOT A RECEIPT?</Text>
              <TouchableOpacity style={s.btnPrimary} onPress={() => saveAdd(true)}>
                <Text style={s.btnPrimaryText}>📷  Take Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnGhost} onPress={() => saveAdd(false)}>
                <Text style={s.btnGhostText}>Save Without Receipt</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAddSheet(false)}>
                <Text style={s.skipText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { padding: 24, paddingBottom: 12 },
  back: { color: '#555', fontSize: 13, marginBottom: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  avatar: { width: 44, height: 44, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700' },
  title: { color: '#ede9e3', fontSize: 28, fontWeight: '800' },
  searchInput: { backgroundColor: '#141418', borderRadius: 11, padding: 13, color: '#ede9e3', fontSize: 14, borderWidth: 1, borderColor: '#21212a' },
  invoiceBar: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#1a1808', borderRadius: 14, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: ACCENT + '33' },
  invoiceLabel: { color: ACCENT, fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  invoiceTotal: { color: '#ede9e3', fontSize: 26, fontWeight: '800' },
  invoiceSub: { color: '#666', fontSize: 12, marginTop: 2 },
  invoiceBtn: { backgroundColor: ACCENT, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 18 },
  invoiceBtnText: { color: '#0d0900', fontWeight: '700', fontSize: 13 },
  emptyBar: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#141418', borderRadius: 14, padding: 24, alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 13, textAlign: 'center', lineHeight: 22 },
  sectionLabel: { color: '#444', fontSize: 10, letterSpacing: 2, paddingHorizontal: 22, paddingVertical: 10 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#151518' },
  txInfo: { flex: 1 },
  txMerchant: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  txMeta: { color: '#555', fontSize: 11, marginTop: 2 },
  txRight: { alignItems: 'flex-end', gap: 6 },
  txAmount: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  receiptDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  noReceiptDot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1, borderColor: '#333' },
  invoiceGroup: { marginHorizontal: 16, marginBottom: 10, backgroundColor: '#141418', borderRadius: 12, padding: 16 },
  invoiceGroupHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  invoiceGroupTitle: { color: '#ede9e3', fontSize: 14, fontWeight: '600' },
  invoiceGroupTotal: { color: ACCENT, fontSize: 14, fontWeight: '700' },
  invoiceGroupMeta: { color: '#555', fontSize: 11, marginBottom: 12 },
  invoiceGroupTx: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderTopWidth: 1, borderTopColor: '#1e1e22' },
  invoiceGroupTxName: { color: '#888', fontSize: 12, flex: 1, marginRight: 8 },
  invoiceGroupTxAmount: { color: '#888', fontSize: 12 },
  addBtn: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: ACCENT, borderRadius: 50, paddingVertical: 14, paddingHorizontal: 28 },
  addBtnText: { color: '#0d0900', fontWeight: '700', fontSize: 14 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: '#151519', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48 },
  sheetLabel: { color: ACCENT, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  sheetTitle: { color: '#ede9e3', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  sheetSub: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  noteInput: { backgroundColor: '#1a1a20', borderRadius: 10, padding: 12, color: '#ede9e3', fontSize: 14, marginBottom: 16, borderWidth: 1, borderColor: '#272730' },
  btnPrimary: { backgroundColor: ACCENT, borderRadius: 11, padding: 15, alignItems: 'center', marginBottom: 8 },
  btnPrimaryText: { color: '#0d0900', fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: '#1c1c22', borderRadius: 11, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a34' },
  btnGhostText: { color: '#ede9e3', fontSize: 14 },
  skipText: { color: '#555', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
});