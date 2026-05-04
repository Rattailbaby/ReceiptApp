import { ACCENT } from '@/constants';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, BackHandler, Dimensions, Image, Keyboard, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

const fmt = (n) => '$' + (Number(n) || 0).toFixed(2);

const TAG_CYCLE_COLORS = ['#60a5fa', ACCENT, '#34d399', '#a78bfa', '#fb923c', '#f87171', '#e879f9', '#22d3ee'];
const MIN_SHEET_HEIGHT = Dimensions.get('window').height * 0.82;

export default function ClientDetail() {
  const { id, addTx, txId, source, returnFilter, extra, match } = useLocalSearchParams();
  const router = useRouter();
  const store = useStore();
  const exploreReturnUrl = `/explore?filter=${returnFilter}&extra=${extra ?? ''}&match=${match ?? ''}`;
  const transactions = store?.transactions ?? [];
  const clients = store?.clients ?? [];
  const addTransaction = store?.addTransaction;
  const markInvoiced = store?.markInvoiced;
  const editTransaction = store?.editTransaction;
  const deleteTransaction = store?.deleteTransaction;
  const bulkDeleteTransactions = store?.bulkDeleteTransactions;
  const bulkMoveTransactions = store?.bulkMoveTransactions;
  const savedMerchants = store?.savedMerchants ?? [];
  const cards = store?.cards ?? [];
  const tags = store?.tags ?? [];
  const addTag = store?.addTag;

  const client = clients.find(c => c.id === Number(id));

  const [showInvoiceConfirm, setShowInvoiceConfirm] = useState(false);
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [invoiceNote, setInvoiceNote] = useState('');
  const [search, setSearch] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [receiptUri, setReceiptUri] = useState(null);

  // Transaction detail / edit sheet
  const [selectedTx, setSelectedTx] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editMerchant, setEditMerchant] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');

  // Multi-select
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showMoveSheet, setShowMoveSheet] = useState(false);
  const [showReceiptViewer, setShowReceiptViewer] = useState(false);
  const [merchantSuggestions, setMerchantSuggestions] = useState([]);
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [selectedTagIds, setSelectedTagIds] = useState([]);
  const [editTagIds, setEditTagIds] = useState([]);
  const [tagSearch, setTagSearch] = useState('');
  const [showTagModal, setShowTagModal] = useState(false);
  const [tagModalForEdit, setTagModalForEdit] = useState(false);

  const noteInputRef = useRef(null);
  const amountInputRef = useRef(null);
  const editAmountInputRef = useRef(null);
  const addFormScrollRef = useRef(null);
  const tagSearchRef = useRef(null);

  useEffect(() => {
    if (addTx === '1') setShowAddSheet(true);
    if (txId) {
      const tx = transactions.find(t => String(t.id) === String(txId));
      if (tx) { setSelectedTx(tx); setIsEditing(false); }
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (showReceiptViewer) { setShowReceiptViewer(false); return true; }
        if (isEditing) { setIsEditing(false); return true; }
        if (selectedTx) { closeTxDetail(); return true; }
        if (showAddSheet) { setShowAddSheet(false); return true; }
        if (showInvoiceConfirm) { setShowInvoiceConfirm(false); return true; }
        if (showMoveSheet) { setShowMoveSheet(false); return true; }
        if (showTagModal) { setShowTagModal(false); setTagSearch(''); setTagModalForEdit(false); return true; }
        return false;
      };
      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [showReceiptViewer, isEditing, selectedTx, showAddSheet, showInvoiceConfirm, showMoveSheet, showTagModal])
  );

  if (!client) return (
    <SafeAreaView style={s.root}>
      <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <Text style={s.back}>← Back</Text>
      </TouchableOpacity>
      <Text style={{ color: '#444', textAlign: 'center', marginTop: 40, fontSize: 14 }}>Client not found.</Text>
    </SafeAreaView>
  );

  const safeTxs = transactions.filter(t => t && t.clientId != null && t.amount != null);
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

  const otherClients = clients.filter(c => c && c.name && c.id !== client.id);

  const allTagsSorted = [...tags]
    .map(tag => ({ ...tag, count: transactions.filter(t => (t.tagIds || []).includes(tag.id)).length }))
    .sort((a, b) => b.count - a.count);

  const topTags = allTagsSorted.slice(0, 8);

  const activeTagIds = tagModalForEdit ? editTagIds : selectedTagIds;

  const modalTags = tagSearch.trim().length > 0
    ? allTagsSorted.filter(t => t.name.toLowerCase().includes(tagSearch.toLowerCase()))
    : allTagsSorted;

  const noMatch = tagSearch.trim().length > 0 && modalTags.length === 0;

  // ── Add transaction ──────────────────────────────────────────────────────────

  const openAddSheet = () => {
    setMerchant('');
    setAmount('');
    setNote('');
    setReceiptUri(null);
    setMerchantSuggestions([]);
    setSelectedCardId(null);
    setSelectedTagIds([]);
    setTagSearch('');
    setShowAddSheet(true);
  };

  const handleMerchantChange = (text) => {
    setMerchant(text);
    const trimmed = text.trim();
    if (!trimmed) {
      setMerchantSuggestions([]);
      return;
    }
    const lower = trimmed.toLowerCase();
    const matches = savedMerchants
      .filter(m => m.toLowerCase().includes(lower) && m.toLowerCase() !== lower)
      .slice(0, 4);
    setMerchantSuggestions(matches);
  };

  const toggleTag = (tagId) => {
    setSelectedTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const toggleEditTag = (tagId) => {
    setEditTagIds(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  const handleCreateTag = () => {
    const name = tagSearch.trim();
    if (!name || !addTag) return;
    const color = TAG_CYCLE_COLORS[tags.length % TAG_CYCLE_COLORS.length];
    const newTag = addTag({ name, color });
    if (newTag?.id != null) {
      if (tagModalForEdit) {
        setEditTagIds(prev => [...prev, newTag.id]);
      } else {
        setSelectedTagIds(prev => [...prev, newTag.id]);
      }
    }
    setTagSearch('');
    tagSearchRef.current?.focus();
  };

  const takePhoto = async () => {
    Keyboard.dismiss();
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera permission is required to take receipt photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      setReceiptUri(result.assets[0].uri);
    }
  };

  const saveTransaction = () => {
    if (!merchant.trim()) {
      Alert.alert('Missing info', 'Please enter a merchant name.');
      return;
    }
    const parsedAmount = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Missing info', 'Please enter a valid amount.');
      return;
    }
    if (!addTransaction) return;

    const doSave = () => {
      addTransaction({
        clientId: client.id,
        merchant: merchant.trim(),
        amount: parsedAmount,
        note: note.trim(),
        receipt: !!receiptUri,
        receiptUri,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        invoiced: false,
        cardId: selectedCardId,
        tagIds: selectedTagIds,
      });
      setShowAddSheet(false);
    };

    if (!receiptUri && !note.trim()) {
      Alert.alert(
        "Don't forget to add a note!",
        "A note helps you remember what this purchase was for when you have no receipt.",
        [
          { text: 'Add Note', onPress: () => noteInputRef.current?.focus() },
          { text: 'Dismiss', style: 'cancel', onPress: doSave },
        ]
      );
      return;
    }
    doSave();
  };

  // ── Transaction detail / edit ────────────────────────────────────────────────

  const openTxDetail = (tx) => {
    if (multiSelect) {
      toggleSelect(tx.id);
      return;
    }
    setSelectedTx(tx);
    setIsEditing(false);
  };

  const closeTxDetail = () => {
    setSelectedTx(null);
    setIsEditing(false);
    if (source === 'explore') {
      router.replace(exploreReturnUrl);
    }
  };

  const startEditing = () => {
    setEditMerchant(selectedTx?.merchant ?? '');
    setEditAmount(String(selectedTx?.amount ?? ''));
    setEditNote(selectedTx?.note ?? '');
    setEditTagIds(selectedTx?.tagIds ?? []);
    setIsEditing(true);
  };

  const saveTxEdit = () => {
    if (!editMerchant.trim()) {
      Alert.alert('Missing info', 'Merchant name is required.');
      return;
    }
    const parsedAmount = parseFloat(editAmount.replace(/[^0-9.]/g, ''));
    if (!parsedAmount || parsedAmount <= 0) {
      Alert.alert('Missing info', 'Please enter a valid amount.');
      return;
    }
    editTransaction?.(selectedTx.id, {
      merchant: editMerchant.trim(),
      amount: parsedAmount,
      note: editNote.trim(),
      tagIds: editTagIds,
    });
    // Update local ref so the view sheet shows fresh values immediately
    setSelectedTx(prev => prev ? { ...prev, merchant: editMerchant.trim(), amount: parsedAmount, note: editNote.trim(), tagIds: editTagIds } : null);
    setIsEditing(false);
    if (source === 'explore' && returnFilter) {
      router.replace(exploreReturnUrl);
    }
  };

  const txNeedsCleanup = (tx) => !tx?.receiptUri || !(tx?.tagIds?.length) || tx?.flagged === true;

  const addReceiptToTx = async () => {
    const txId = selectedTx?.id;
    const capturedTagIds = selectedTx?.tagIds ?? [];
    const capturedFlagged = selectedTx?.flagged;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Camera permission is required to take receipt photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      editTransaction?.(txId, { receipt: true, receiptUri: uri });
      setSelectedTx(prev => prev ? { ...prev, receipt: true, receiptUri: uri } : null);
      if (source === 'explore' && returnFilter) {
        if (uri && capturedTagIds.length > 0 && capturedFlagged !== true) {
          router.replace(exploreReturnUrl);
        }
      }
    }
  };

  // ── Multi-select ─────────────────────────────────────────────────────────────

  const enterMultiSelect = (txId) => {
    setMultiSelect(true);
    setSelectedIds([txId]);
  };

  const toggleSelect = (txId) => {
    setSelectedIds(prev =>
      prev.includes(txId) ? prev.filter(i => i !== txId) : [...prev, txId]
    );
  };

  const exitMultiSelect = () => {
    setMultiSelect(false);
    setSelectedIds([]);
    setShowMoveSheet(false);
  };

  const deleteSelected = () => {
    Alert.alert(
      'Delete transactions',
      `Delete ${selectedIds.length} transaction${selectedIds.length !== 1 ? 's' : ''}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { bulkDeleteTransactions?.(selectedIds); exitMultiSelect(); } },
      ]
    );
  };

  const moveSelected = (targetClientId) => {
    bulkMoveTransactions?.(selectedIds, targetClientId);
    exitMultiSelect();
  };

  const allVisibleSelected = filteredPending.length > 0 && filteredPending.every(tx => selectedIds.includes(tx.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPending.map(tx => tx.id));
    }
  };

  const deleteSingleTx = () => {
    Alert.alert(
      'Delete transaction',
      `Delete "${selectedTx?.merchant}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => { deleteTransaction?.(selectedTx.id); closeTxDetail(); } },
      ]
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  const txMissingReceipt = !!selectedTx && !selectedTx.receiptUri;
  const txMissingTags = !!selectedTx && !(selectedTx?.tagIds?.length);

  return (
    <SafeAreaView style={s.root}>
      <ScrollView>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.back}>← Back</Text>
          </TouchableOpacity>
          <View style={s.headerRow}>
            {client.photoUri ? (
              <Image source={{ uri: client.photoUri }} style={[s.avatar, { overflow: 'hidden' }]} resizeMode="cover" />
            ) : (
              <View style={[s.avatar, { backgroundColor: client.color + '22' }]}>
                <Text style={[s.avatarText, { color: client.color }]}>{client.initials}</Text>
              </View>
            )}
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
            <Text style={s.emptyText}>No pending transactions.{'\n'}Tap + to add one.</Text>
          </View>
        )}

        {filteredPending.length > 0 && (
          <>
            <View style={s.sectionLabelRow}>
              <Text style={s.sectionLabel}>PENDING</Text>
            </View>
            {multiSelect && (
              <TouchableOpacity style={s.selectAllRow} onPress={toggleSelectAll}>
                <View style={[s.checkbox, allVisibleSelected && s.checkboxSelected]}>
                  {allVisibleSelected && <Text style={s.checkboxTick}>✓</Text>}
                </View>
                <Text style={s.selectAllText}>{allVisibleSelected ? 'Deselect All' : 'Select All'}</Text>
              </TouchableOpacity>
            )}
            {filteredPending.map(tx => {
              const isSelected = selectedIds.includes(tx.id);
              return (
                <TouchableOpacity
                  key={tx.id}
                  style={[s.txRow, isSelected && s.txRowSelected]}
                  onPress={() => openTxDetail(tx)}
                  onLongPress={() => enterMultiSelect(tx.id)}
                  activeOpacity={0.7}
                >
                  {multiSelect && (
                    <View style={[s.checkbox, isSelected && s.checkboxSelected]}>
                      {isSelected && <Text style={s.checkboxTick}>✓</Text>}
                    </View>
                  )}
                  <View style={s.txInfo}>
                    <Text style={s.txMerchant}>{tx.merchant}</Text>
                    <Text style={s.txMeta}>{tx.date}{tx.note ? ' · ' + tx.note : ''}</Text>
                    {(tx.tagIds || []).length > 0 && (
                      <View style={s.txTagRow}>
                        {(tx.tagIds || []).map(tid => {
                          const tag = tags.find(t => t.id === tid);
                          if (!tag) return null;
                          return (
                            <View key={tid} style={s.txTagChip}>
                              <View style={[s.txTagDot, { backgroundColor: tag.color }]} />
                              <Text style={[s.txTagText, { color: tag.color }]}>{tag.name}</Text>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                  <View style={s.txRight}>
                    <Text style={s.txAmount}>{fmt(tx.amount)}</Text>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      <View style={(tx.tagIds || []).length > 0 ? s.tagIndicatorDot : s.noReceiptDot} />
                      <View style={!!tx.receiptUri ? s.receiptDot : s.noReceiptDot} />
                      {tx.flagged === true && <View style={s.flaggedIndicatorDot} />}
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {Object.keys(invoicedGroups).length > 0 && (
          <>
            <Text style={s.sectionLabel}>INVOICE HISTORY</Text>
            {Object.entries(invoicedGroups).map(([invoiceId, txs]) => {
              const total = txs.reduce((sum, t) => sum + Number(t.amount), 0);
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

      {multiSelect ? (
        <View style={s.multiBar}>
          <Text style={s.multiBarCount}>
            {selectedIds.length} {selectedIds.length === 1 ? 'transaction' : 'transactions'} selected
          </Text>
          <View style={s.multiBarRow}>
            <TouchableOpacity
              style={[s.multiBarDelete, selectedIds.length === 0 && s.multiBarDisabled]}
              onPress={deleteSelected}
              disabled={selectedIds.length === 0}
            >
              <Text style={s.multiBarDeleteText}>Delete Selected</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.multiBarMove, selectedIds.length === 0 && s.multiBarDisabled]}
              onPress={() => setShowMoveSheet(true)}
              disabled={selectedIds.length === 0}
            >
              <Text style={s.multiBarMoveText}>Move to Client</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.multiBarCancelBtn} onPress={exitMultiSelect}>
              <Text style={s.multiBarCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (!showAddSheet && !selectedTx && (
        <TouchableOpacity style={s.addBtn} onPress={openAddSheet}>
          <Text style={s.addBtnText}>+ Add Transaction</Text>
        </TouchableOpacity>
      ))}

      {/* Invoice confirm */}
      <Modal visible={showInvoiceConfirm} transparent animationType="slide" onRequestClose={() => setShowInvoiceConfirm(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowInvoiceConfirm(false)} />
        <View style={s.sheet}>
          <Text style={s.sheetTitle}>Mark as invoiced?</Text>
          <Text style={s.sheetSub}>
            This will archive {pending.length} transactions for {client.name} totaling {fmt(pendingTotal)}. Slate resets for next month.
          </Text>
          <TextInput
            style={s.noteInput}
            placeholder="Invoice note (optional)…"
            placeholderTextColor="#555"
            value={invoiceNote}
            onChangeText={setInvoiceNote}
          />
          <TouchableOpacity style={s.btnPrimary} onPress={() => {
            if (markInvoiced) markInvoiced(client.id, invoiceNote);
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

      {/* Add transaction */}
      <Modal visible={showAddSheet} transparent animationType="slide" onRequestClose={() => setShowAddSheet(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowAddSheet(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[s.sheet, { maxHeight: '95%', minHeight: MIN_SHEET_HEIGHT }]}>
            <ScrollView ref={addFormScrollRef} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            <Text style={s.sheetLabel}>ADD TO {client.name.toUpperCase()}</Text>
            <TextInput
              style={s.noteInput}
              placeholder="Merchant name (e.g. Menards)"
              placeholderTextColor="#555"
              value={merchant}
              onChangeText={handleMerchantChange}
              onBlur={() => setMerchantSuggestions([])}
              autoCapitalize="words"
              returnKeyType="next"
              onSubmitEditing={() => amountInputRef.current?.focus()}
              blurOnSubmit={false}
            />
            {merchantSuggestions.length > 0 && (
              <View style={[s.suggestionsBox, { maxHeight: 160 }]}>
                <ScrollView
                  keyboardShouldPersistTaps="handled"
                  nestedScrollEnabled
                >
                  {merchantSuggestions.map((name, i) => (
                    <TouchableOpacity
                      key={i}
                      style={[
                        s.suggestionRow,
                        i === merchantSuggestions.length - 1 && { borderBottomWidth: 0 }
                      ]}
                      onPress={() => {
                        setMerchant(name);
                        setMerchantSuggestions([]);
                        Keyboard.dismiss();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={s.suggestionText}>{name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
            <TextInput
              ref={amountInputRef}
              style={s.noteInput}
              placeholder="Amount (e.g. 84.12)"
              placeholderTextColor="#555"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              returnKeyType="done"
              blurOnSubmit={true}
              onSubmitEditing={() => setTimeout(() => addFormScrollRef.current?.scrollToEnd({ animated: true }), 150)}
            />
            <TextInput
              ref={noteInputRef}
              style={s.noteInput}
              placeholder="Note (optional)"
              placeholderTextColor="#555"
              value={note}
              onChangeText={setNote}
            />
            {cards.length > 0 && (
              <>
                <Text style={s.cardPickerLabel}>CARD USED</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cardChipsScroll} contentContainerStyle={{ paddingBottom: 2 }}>
                  {cards.map(card => {
                    const isSelected = selectedCardId === card.id;
                    return (
                      <TouchableOpacity
                        key={card.id}
                        style={[s.cardChip, isSelected && s.cardChipSelected]}
                        onPress={() => setSelectedCardId(isSelected ? null : card.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={[s.cardChipText, isSelected && s.cardChipTextSelected]}>{card.label}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
                <View style={{ height: 8 }} />
              </>
            )}
            <>
              <Text style={s.tagPickerLabel}>TAGS</Text>
              {selectedTagIds.length > 0 && (
                <View style={s.tagChipsWrap}>
                  {selectedTagIds.map(tid => {
                    const tag = tags.find(t => t.id === tid);
                    if (!tag) return null;
                    return (
                      <TouchableOpacity
                        key={tid}
                        style={[s.tagChip, { borderColor: tag.color, backgroundColor: tag.color }]}
                        onPress={() => toggleTag(tid)}
                        activeOpacity={0.7}
                      >
                        <Text style={[s.tagChipText, s.tagChipTextSel]}>{tag.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
              <View style={s.tagChipsWrap}>
                {topTags.filter(tag => !selectedTagIds.includes(tag.id)).map(tag => (
                  <TouchableOpacity
                    key={tag.id}
                    style={[s.tagChip, { borderColor: tag.color + '66' }]}
                    onPress={() => toggleTag(tag.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[s.tagDot, { backgroundColor: tag.color }]} />
                    <Text style={s.tagChipText}>{tag.name}</Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[s.tagChip, { borderColor: '#444', paddingHorizontal: 12 }]}
                  onPress={() => { setTagSearch(''); setTagModalForEdit(false); setShowTagModal(true); }}
                  activeOpacity={0.7}
                >
                  <Text style={[s.tagChipText, { color: '#888' }]}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={{ height: 8 }} />
            </>
            {receiptUri && (
              <Image source={{ uri: receiptUri }} style={{ width: '100%', height: 120, borderRadius: 10, marginBottom: 12 }} resizeMode="cover" />
            )}
            <TouchableOpacity style={s.btnGhost} onPress={takePhoto}>
              <Text style={s.btnGhostText}>{receiptUri ? '📷 Retake Photo' : '📷 Take Receipt Photo'}</Text>
            </TouchableOpacity>
            <View style={{ height: 8 }} />
            <TouchableOpacity style={s.btnPrimary} onPress={saveTransaction}>
              <Text style={s.btnPrimaryText}>Save Transaction</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddSheet(false)}>
              <Text style={s.skipText}>Cancel</Text>
            </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Transaction detail / edit */}
      <Modal visible={!!selectedTx} transparent animationType="slide" onRequestClose={() => { if (isEditing) { setIsEditing(false); } else { closeTxDetail(); } }}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeTxDetail} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={[s.sheet, { maxHeight: '95%', minHeight: MIN_SHEET_HEIGHT }]}>
            {!isEditing ? (
              <>
                <View style={s.sheetHeaderRow}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 }}>
                    <Text style={[s.sheetLabel, { marginBottom: 0 }]}>TRANSACTION</Text>
                    {client && <Text style={{ color: '#888', fontSize: 12 }} numberOfLines={1}>{client.name}</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    {/* TEMP TEST BUTTON - remove before release */}
                    <TouchableOpacity
                      onPress={() => {
                        if (!selectedTx || !addTransaction) return;
                        const baseNote = selectedTx.note ? selectedTx.note + ' __test_clone__' : '__test_clone__';
                        const baseMerchant = (selectedTx.merchant || '').replace(/ Copy(?: \d+)?$/, '');
                        const escaped = baseMerchant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                        const copyRegex = new RegExp('^' + escaped + ' Copy(?: \\d+)?$');
                        const existingCopies = transactions.filter(t => t && t.clientId === selectedTx.clientId && typeof t.merchant === 'string' && copyRegex.test(t.merchant)).length;
                        const newMerchant = existingCopies === 0 ? baseMerchant + ' Copy' : baseMerchant + ' Copy ' + (existingCopies + 1);
                        addTransaction({
                          clientId: selectedTx.clientId,
                          merchant: newMerchant,
                          amount: selectedTx.amount,
                          date: selectedTx.date,
                          note: baseNote,
                          receipt: selectedTx.receipt,
                          receiptUri: selectedTx.receiptUri,
                          invoiced: selectedTx.invoiced,
                          cardId: selectedTx.cardId,
                          tagIds: selectedTx.tagIds,
                          flagged: selectedTx.flagged,
                        });
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={{ color: '#444', fontSize: 16 }}>⧉</Text>
                    </TouchableOpacity>
                    {/* END TEMP TEST BUTTON */}
                    <TouchableOpacity onPress={deleteSingleTx} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={s.trashBtnText}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={s.detailMerchant}>{selectedTx?.merchant}</Text>
                <Text style={s.detailAmount}>{fmt(selectedTx?.amount)}</Text>
                <Text style={s.detailDate}>{selectedTx?.date}</Text>
                {selectedTx?.flagged === true && (
                  <View style={s.flaggedBadge}>
                    <Text style={s.flaggedBadgeText}>⚑ Needs review</Text>
                  </View>
                )}
                <Text style={s.detailMetaRow}>
                  <Text style={{ color: selectedTx?.tagIds?.length ? '#60a5fa' : '#888' }}>{selectedTx?.tagIds?.length ? 'Tags added' : 'No tags'}</Text>
                  {' • '}
                  <Text style={{ color: selectedTx?.receiptUri ? '#22c55e' : '#888' }}>{selectedTx?.receiptUri ? 'Receipt attached' : 'No receipt'}</Text>
                </Text>
                {selectedTx?.flagged === true && (
                  <TouchableOpacity
                    style={s.markReviewedBtn}
                    onPress={() => {
                      editTransaction?.(selectedTx.id, { flagged: false });
                      setSelectedTx(prev => prev ? { ...prev, flagged: false } : null);
                      if (source === 'explore' && returnFilter === 'flagged') {
                        const updated = { ...selectedTx, flagged: false };
                        if (!txNeedsCleanup(updated)) {
                          router.replace(exploreReturnUrl);
                        }
                      }
                    }}
                  >
                    <Text style={s.markReviewedText}>✓ Mark Reviewed</Text>
                  </TouchableOpacity>
                )}
                {source === 'explore' && returnFilter === 'flagged' && (txMissingReceipt || txMissingTags) && (
                  <>
                    <TouchableOpacity style={[(!selectedTx?.flagged && txMissingReceipt) ? s.btnPrimary : s.btnGhost, { marginBottom: 8 }, !txMissingReceipt && { opacity: 0.3 }]} onPress={addReceiptToTx}>
                      <Text style={(!selectedTx?.flagged && txMissingReceipt) ? s.btnPrimaryText : [s.btnGhostText, { color: '#888' }]}>Add Receipt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[(!selectedTx?.flagged && !txMissingReceipt && txMissingTags) ? s.btnPrimary : s.btnGhost, { marginBottom: 12 }, (!selectedTx?.flagged && txMissingReceipt && txMissingTags) && { opacity: 0.6 }, !txMissingTags && { opacity: 0.3 }]} onPress={() => { setTagSearch(''); setEditTagIds(selectedTx?.tagIds ?? []); setTagModalForEdit(true); setShowTagModal(true); }}>
                      <Text style={(!selectedTx?.flagged && !txMissingReceipt && txMissingTags) ? s.btnPrimaryText : [s.btnGhostText, { color: '#888' }]}>Add Tags</Text>
                    </TouchableOpacity>
                  </>
                )}
                {source === 'explore' && returnFilter === 'untagged' && (txMissingReceipt || txMissingTags) && (
                  <>
                    <TouchableOpacity style={[txMissingTags ? s.btnPrimary : s.btnGhost, { marginBottom: 8 }, !txMissingTags && { opacity: 0.3 }]} onPress={() => { setTagSearch(''); setEditTagIds(selectedTx?.tagIds ?? []); setTagModalForEdit(true); setShowTagModal(true); }}>
                      <Text style={txMissingTags ? s.btnPrimaryText : [s.btnGhostText, { color: '#888' }]}>Add Tags</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[(!txMissingTags && txMissingReceipt) ? s.btnPrimary : s.btnGhost, { marginBottom: 12 }, (txMissingTags && txMissingReceipt) && { opacity: 0.6 }, !txMissingReceipt && { opacity: 0.3 }]} onPress={addReceiptToTx}>
                      <Text style={(!txMissingTags && txMissingReceipt) ? s.btnPrimaryText : [s.btnGhostText, { color: '#888' }]}>Add Receipt</Text>
                    </TouchableOpacity>
                  </>
                )}
                {source === 'explore' && returnFilter === 'missing' && (txMissingReceipt || txMissingTags) && (
                  <>
                    <TouchableOpacity style={[txMissingReceipt ? s.btnPrimary : s.btnGhost, { marginBottom: 8 }, !txMissingReceipt && { opacity: 0.3 }]} onPress={addReceiptToTx}>
                      <Text style={txMissingReceipt ? s.btnPrimaryText : [s.btnGhostText, { color: '#888' }]}>Add Receipt</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[(!txMissingReceipt && txMissingTags) ? s.btnPrimary : s.btnGhost, { marginBottom: 12 }, (txMissingReceipt && txMissingTags) && { opacity: 0.6 }, !txMissingTags && { opacity: 0.3 }]} onPress={() => { setTagSearch(''); setEditTagIds(selectedTx?.tagIds ?? []); setTagModalForEdit(true); setShowTagModal(true); }}>
                      <Text style={(!txMissingReceipt && txMissingTags) ? s.btnPrimaryText : [s.btnGhostText, { color: '#888' }]}>Add Tags</Text>
                    </TouchableOpacity>
                  </>
                )}
                {!!(selectedTx?.tagIds?.length) && (
                  <View style={s.detailTagRow}>
                    {(selectedTx.tagIds || []).map(tid => {
                      const tag = tags.find(t => t.id === tid);
                      if (!tag) return null;
                      return (
                        <View key={tid} style={[s.detailTagChip, { borderColor: tag.color + '66', backgroundColor: tag.color + '18' }]}>
                          <View style={[s.txTagDot, { backgroundColor: tag.color }]} />
                          <Text style={[s.detailTagText, { color: tag.color }]}>{tag.name}</Text>
                        </View>
                      );
                    })}
                  </View>
                )}
                {!!selectedTx?.note && <Text style={s.detailNote}>{selectedTx.note}</Text>}
                {!!(selectedTx?.cardId && cards.find(c => c.id === selectedTx.cardId)) && (
                  <Text style={s.detailCard}>Card: {cards.find(c => c.id === selectedTx.cardId).label}</Text>
                )}
                {!!selectedTx?.receiptUri && (
                  <>
                    <TouchableOpacity onPress={() => setShowReceiptViewer(true)} activeOpacity={0.85}>
                      <Image source={{ uri: selectedTx.receiptUri }} style={s.receiptThumb} resizeMode="cover" />
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
                      <TouchableOpacity style={[s.btnGhost, { flex: 1 }]} onPress={addReceiptToTx}>
                        <Text style={s.btnGhostText}>Replace Receipt</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[s.btnGhost, { flex: 1 }]}
                        onPress={() => Alert.alert(
                          'Remove Receipt',
                          'Remove this receipt photo from the transaction?',
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Remove', style: 'destructive', onPress: () => {
                              editTransaction?.(selectedTx.id, { receipt: false, receiptUri: null });
                              setSelectedTx(prev => prev ? { ...prev, receipt: false, receiptUri: null } : null);
                            }},
                          ]
                        )}
                      >
                        <Text style={[s.btnGhostText, { color: '#ff6b6b' }]}>Remove Receipt</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                <View style={s.detailActions}>
                  {!selectedTx?.receiptUri && (
                    <TouchableOpacity style={s.addReceiptBtn} onPress={addReceiptToTx}>
                      <Text style={s.addReceiptBtnText}>📷 Add Receipt</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={s.editBtn} onPress={startEditing}>
                    <Text style={s.editBtnText}>Edit</Text>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={s.addRuleLink}
                  onPress={() => {
                    const m = selectedTx?.merchant;
                    closeTxDetail();
                    router.push({ pathname: '/rules', params: { prefillMerchant: m } });
                  }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={s.addRuleLinkText}>+ Add Rule</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnGhost} onPress={closeTxDetail}>
                  <Text style={s.btnGhostText}>Done</Text>
                </TouchableOpacity>
              </>
            ) : (
              <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                <Text style={s.sheetLabel}>EDIT TRANSACTION</Text>
                <TextInput
                  style={s.noteInput}
                  placeholder="Merchant name"
                  placeholderTextColor="#555"
                  value={editMerchant}
                  onChangeText={setEditMerchant}
                  autoCapitalize="words"
                  returnKeyType="next"
                  onSubmitEditing={() => editAmountInputRef.current?.focus()}
                  blurOnSubmit={false}
                />
                <TextInput
                  ref={editAmountInputRef}
                  style={s.noteInput}
                  placeholder="Amount"
                  placeholderTextColor="#555"
                  value={editAmount}
                  onChangeText={setEditAmount}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  blurOnSubmit={true}
                />
                <TextInput
                  style={s.noteInput}
                  placeholder="Note (optional)"
                  placeholderTextColor="#555"
                  value={editNote}
                  onChangeText={setEditNote}
                />
                <Text style={s.tagPickerLabel}>TAGS</Text>
                {editTagIds.length > 0 && (
                  <View style={s.tagChipsWrap}>
                    {editTagIds.map(tid => {
                      const tag = tags.find(t => t.id === tid);
                      if (!tag) return null;
                      return (
                        <TouchableOpacity
                          key={tid}
                          style={[s.tagChip, { borderColor: tag.color, backgroundColor: tag.color }]}
                          onPress={() => toggleEditTag(tid)}
                          activeOpacity={0.7}
                        >
                          <Text style={[s.tagChipText, s.tagChipTextSel]}>{tag.name}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
                <View style={s.tagChipsWrap}>
                  {topTags.filter(tag => !editTagIds.includes(tag.id)).map(tag => (
                    <TouchableOpacity
                      key={tag.id}
                      style={[s.tagChip, { borderColor: tag.color + '66' }]}
                      onPress={() => toggleEditTag(tag.id)}
                      activeOpacity={0.7}
                    >
                      <View style={[s.tagDot, { backgroundColor: tag.color }]} />
                      <Text style={s.tagChipText}>{tag.name}</Text>
                    </TouchableOpacity>
                  ))}
                  <TouchableOpacity
                    style={[s.tagChip, { borderColor: '#444', paddingHorizontal: 12 }]}
                    onPress={() => { setTagSearch(''); setTagModalForEdit(true); setShowTagModal(true); }}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.tagChipText, { color: '#888' }]}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ height: 8 }} />
                <TouchableOpacity style={s.btnPrimary} onPress={saveTxEdit}>
                  <Text style={s.btnPrimaryText}>Save Changes</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.btnGhost} onPress={() => setIsEditing(false)}>
                  <Text style={s.btnGhostText}>Cancel</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Move to client picker */}
      <Modal visible={showMoveSheet} transparent animationType="slide" onRequestClose={() => setShowMoveSheet(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowMoveSheet(false)} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>MOVE TO CLIENT</Text>
          <Text style={s.sheetSub}>Moving {selectedIds.length} transaction{selectedIds.length !== 1 ? 's' : ''}</Text>
          <ScrollView style={s.clientPickerScroll} showsVerticalScrollIndicator={false}>
            {otherClients.map(c => (
              <TouchableOpacity key={c.id} style={s.clientPickerRow} onPress={() => moveSelected(c.id)}>
                <View style={[s.clientPickerDot, { backgroundColor: c.color }]} />
                <Text style={s.clientPickerName}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={s.btnGhost} onPress={() => setShowMoveSheet(false)}>
            <Text style={s.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Tag picker modal */}
      <Modal visible={showTagModal} transparent animationType="slide" onRequestClose={() => { setShowTagModal(false); setTagSearch(''); setTagModalForEdit(false); }}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => { setShowTagModal(false); setTagSearch(''); setTagModalForEdit(false); }} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>{noMatch ? 'Create Tag' : 'Tags'}</Text>
          <ScrollView style={s.tagModalScroll} contentContainerStyle={[s.tagChipsWrap, { paddingBottom: 8 }]} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {modalTags.map(tag => {
              const isSel = activeTagIds.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[s.tagChip, isSel ? { borderColor: tag.color, backgroundColor: tag.color } : { borderColor: tag.color + '66' }]}
                  onPress={() => {
                    if (tagModalForEdit) {
                      toggleEditTag(tag.id);
                    } else {
                      toggleTag(tag.id);
                    }
                  }}
                  activeOpacity={0.7}
                >
                  {!isSel && <View style={[s.tagDot, { backgroundColor: tag.color }]} />}
                  <Text style={[s.tagChipText, isSel && s.tagChipTextSel]}>{tag.name}</Text>
                </TouchableOpacity>
              );
            })}
            {noMatch && (
              <TouchableOpacity style={s.tagCreateBtn} onPress={handleCreateTag} activeOpacity={0.7}>
                <Text style={s.tagCreateText}>+ "{tagSearch.trim()}"</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <TextInput
            ref={tagSearchRef}
            style={s.tagSearchInput}
            placeholder="Search or create tags…"
            placeholderTextColor="#555"
            value={tagSearch}
            onChangeText={setTagSearch}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <View style={{ height: 8 }} />
          <TouchableOpacity style={s.btnPrimary} onPress={() => {
            if (noMatch) {
              handleCreateTag();
              return;
            }
            if (tagModalForEdit && selectedTx?.id) {
              editTransaction?.(selectedTx.id, { tagIds: editTagIds });
              setSelectedTx(prev => prev ? { ...prev, tagIds: editTagIds } : null);
              if (source === 'explore' && returnFilter) {
                if (!!selectedTx?.receiptUri && editTagIds.length > 0 && selectedTx?.flagged !== true) {
                  router.replace(exploreReturnUrl);
                }
              }
            }
            setShowTagModal(false);
            setTagSearch('');
            setTagModalForEdit(false);
          }}>
            <Text style={s.btnPrimaryText}>{noMatch ? 'Create Tag' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Full-screen receipt viewer */}
      <Modal visible={showReceiptViewer} transparent={false} animationType="fade" onRequestClose={() => setShowReceiptViewer(false)}>
        <View style={s.viewerRoot}>
          <ScrollView
            contentContainerStyle={s.viewerScroll}
            maximumZoomScale={3}
            minimumZoomScale={1}
            centerContent
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image source={{ uri: selectedTx?.receiptUri }} style={s.viewerImage} resizeMode="contain" />
          </ScrollView>
          <TouchableOpacity style={s.viewerClose} onPress={() => setShowReceiptViewer(false)}>
            <Text style={s.viewerCloseText}>✕</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { padding: 24, paddingBottom: 12 },
  backBtn: { alignSelf: 'flex-start', padding: 10, marginLeft: -10, marginBottom: 6 },
  back: { color: '#555', fontSize: 13 },
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
  sectionLabelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionLabel: { color: '#444', fontSize: 10, letterSpacing: 2, paddingHorizontal: 22, paddingVertical: 10 },
  selectAllRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e1e22', gap: 12 },
  selectAllText: { color: '#888', fontSize: 13 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#151518' },
  txRowSelected: { backgroundColor: '#1a1808' },
  checkbox: { width: 22, height: 22, borderRadius: 11, borderWidth: 1.5, borderColor: '#444', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: ACCENT, borderColor: ACCENT },
  checkboxTick: { color: '#0d0900', fontSize: 12, fontWeight: '800' },
  txInfo: { flex: 1 },
  txMerchant: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  txMeta: { color: '#555', fontSize: 11, marginTop: 2 },
  txRight: { alignItems: 'flex-end', gap: 6 },
  txAmount: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  receiptDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  noReceiptDot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1, borderColor: '#333' },
  tagIndicatorDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#60a5fa' },
  flaggedIndicatorDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff6b6b' },
  flaggedBadge: { alignSelf: 'flex-start', backgroundColor: '#3a1014', borderColor: '#ff6b6b99', borderWidth: 1, borderRadius: 8, paddingVertical: 4, paddingHorizontal: 10, marginBottom: 6 },
  flaggedBadgeText: { color: '#ff6b6b', fontSize: 13, fontWeight: '600', letterSpacing: 0.3 },
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
  multiBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#151519', borderTopWidth: 1, borderTopColor: '#21212a', flexDirection: 'column', paddingHorizontal: 12, paddingTop: 10, paddingBottom: 38, gap: 8 },
  multiBarCount: { color: ACCENT, fontSize: 11, textAlign: 'center', letterSpacing: 1 },
  multiBarRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  multiBarDelete: { flex: 1, backgroundColor: '#2a1414', borderRadius: 10, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: '#441919' },
  multiBarMove: { flex: 1, backgroundColor: ACCENT, borderRadius: 10, paddingVertical: 13, alignItems: 'center' },
  multiBarCancelBtn: { flex: 0.8, backgroundColor: '#1c1c22', borderRadius: 10, paddingVertical: 13, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a34' },
  multiBarDisabled: { opacity: 0.35 },
  multiBarDeleteText: { color: '#ff6b6b', fontSize: 12, fontWeight: '600' },
  multiBarMoveText: { color: '#0d0900', fontSize: 12, fontWeight: '700' },
  multiBarCancelText: { color: '#888', fontSize: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: '#151519', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48 },
  sheetHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  trashBtnText: { fontSize: 18, opacity: 0.7 },
  sheetLabel: { color: ACCENT, fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  sheetTitle: { color: '#ede9e3', fontSize: 22, fontWeight: '800', marginBottom: 8 },
  sheetSub: { color: '#666', fontSize: 13, lineHeight: 20, marginBottom: 16 },
  noteInput: { backgroundColor: '#1a1a20', borderRadius: 10, padding: 12, color: '#ede9e3', fontSize: 14, marginBottom: 8, borderWidth: 1, borderColor: '#272730' },
  btnPrimary: { backgroundColor: ACCENT, borderRadius: 11, padding: 15, alignItems: 'center', marginBottom: 8 },
  btnPrimaryText: { color: '#0d0900', fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: '#1c1c22', borderRadius: 11, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a34' },
  btnGhostText: { color: '#ede9e3', fontSize: 14 },
  btnDelete: { backgroundColor: 'transparent', borderRadius: 11, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#662222' },
  btnDeleteText: { color: '#ff6b6b', fontSize: 14, fontWeight: '600' },
  skipText: { color: '#555', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
  detailActions: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginBottom: 16 },
  addReceiptBtn: { backgroundColor: '#0d2010', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#1a4020' },
  addReceiptBtnText: { color: '#22c55e', fontSize: 13, fontWeight: '600' },
  markReviewedBtn: { backgroundColor: '#1a1500', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#f59e0b33', alignSelf: 'flex-start', marginBottom: 12 },
  markReviewedText: { color: '#f59e0b', fontSize: 13, fontWeight: '600' },
  editBtn: { backgroundColor: '#1c1c22', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14, borderWidth: 1, borderColor: '#2a2a34' },
  editBtnText: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  addRuleLink: { alignSelf: 'flex-start', marginBottom: 12 },
  addRuleLinkText: { color: '#555', fontSize: 12 },
  detailMerchant: { color: '#ede9e3', fontSize: 22, fontWeight: '800', marginBottom: 4 },
  detailAmount: { color: ACCENT, fontSize: 32, fontWeight: '800', marginBottom: 6 },
  detailDate: { color: '#555', fontSize: 12, marginBottom: 4 },
  detailMetaRow: { color: '#888', fontSize: 12, marginBottom: 8 },
  detailNote: { color: '#888', fontSize: 13, marginBottom: 12 },
  detailCard: { color: '#666', fontSize: 12, marginBottom: 10 },
  receiptStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  receiptThumb: { width: '100%', height: 200, borderRadius: 10, marginBottom: 20 },
  receiptStatusLabel: { color: '#666', fontSize: 12 },
  clientPickerScroll: { maxHeight: 280, marginBottom: 12 },
  clientPickerRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#1e1e22', gap: 14 },
  clientPickerDot: { width: 12, height: 12, borderRadius: 6 },
  clientPickerName: { color: '#ede9e3', fontSize: 15, fontWeight: '500' },
  suggestionsBox: { backgroundColor: '#1e1e28', borderRadius: 8, marginTop: -8, marginBottom: 8, borderWidth: 1, borderColor: '#2a2a3a', overflow: 'hidden' },
  suggestionRow: { paddingVertical: 10, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#25252f' },
  suggestionText: { color: '#ede9e3', fontSize: 14 },
  cardPickerLabel: { color: '#444', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  cardChipsScroll: { flexGrow: 0, marginBottom: 4 },
  cardChip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 20, borderWidth: 1, borderColor: '#2a2a3a', marginRight: 8, backgroundColor: '#1a1a24' },
  cardChipSelected: { borderColor: ACCENT, backgroundColor: ACCENT + '18' },
  cardChipText: { color: '#888', fontSize: 13 },
  cardChipTextSelected: { color: ACCENT, fontWeight: '600' },
  tagPickerLabel: { color: '#444', fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  tagChipsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 6 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#2a2a3a', backgroundColor: 'transparent' },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagChipText: { color: '#888', fontSize: 12 },
  tagChipTextSel: { color: '#0e0e11', fontWeight: '600' },
  tagModalScroll: { maxHeight: 300, marginBottom: 12 },
  tagSearchInput: { backgroundColor: '#1a1a20', borderRadius: 10, padding: 10, color: '#ede9e3', fontSize: 13, marginBottom: 6, borderWidth: 1, borderColor: '#272730' },
  tagCreateBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: ACCENT + '88', backgroundColor: 'transparent' },
  tagCreateText: { color: ACCENT, fontSize: 12, fontWeight: '600' },
  txTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: 4 },
  txTagChip: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingVertical: 2, paddingHorizontal: 5, backgroundColor: '#1a1a20', borderRadius: 8 },
  txTagDot: { width: 5, height: 5, borderRadius: 3 },
  txTagText: { fontSize: 10, fontWeight: '500' },
  detailTagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4, marginBottom: 12 },
  detailTagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, paddingHorizontal: 10, borderRadius: 14, borderWidth: 1 },
  detailTagText: { fontSize: 12, fontWeight: '500' },
  viewerRoot: { flex: 1, backgroundColor: '#000' },
  viewerScroll: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  viewerImage: { width: '100%', height: '100%' },
  viewerClose: { position: 'absolute', top: 52, right: 20, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  viewerCloseText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
