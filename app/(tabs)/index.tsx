import { ACCENT } from '@/constants';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Dimensions, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';

const fmt = (n) => '$' + (Number(n) || 0).toFixed(2);

const COLORS = [
  ACCENT, '#60a5fa', '#a78bfa', '#34d399',
  '#f87171', '#fb923c', '#e879f9', '#22d3ee',
  '#818cf8', '#4ade80', '#facc15', '#f472b6',
];

const TILE_WIDTH = (Dimensions.get('window').width - 42) / 2;

export default function App() {
  const router = useRouter();
  const store = useStore();

  const [showAddClient, setShowAddClient] = useState(false);
  const [showClientMenu, setShowClientMenu] = useState(false);
  const [showEditClient, setShowEditClient] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [newClientName, setNewClientName] = useState('');
  const [editName, setEditName] = useState('');
  const [tileView, setTileView] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddSearch, setQuickAddSearch] = useState('');
  const [clientMultiSelect, setClientMultiSelect] = useState(false);
  const [selectedClientIds, setSelectedClientIds] = useState([]);

  const loaded = store?.loaded ?? false;
  if (!loaded) return null;

  const transactions = store?.transactions ?? [];
  const clients = store?.clients ?? [];
  const safeClients = Array.isArray(clients) ? clients.filter(c => c && c.name) : [];
  const addClient = store?.addClient;
  const editClient = store?.editClient;
  const deleteClient = store?.deleteClient;
  const updateClientPhoto = store?.updateClientPhoto;

  const quickAddClients = quickAddSearch.length > 0
    ? safeClients.filter(c => c.name.toLowerCase().includes(quickAddSearch.toLowerCase()))
    : safeClients;

  const handleAddClient = () => {
    if (!newClientName.trim()) return;
    addClient(newClientName);
    setNewClientName('');
    setShowAddClient(false);
  };

  const handleLongPress = (client) => {
    if (clientMultiSelect) {
      toggleClientSelection(client.id);
      return;
    }
    setClientMultiSelect(true);
    setSelectedClientIds([client.id]);
  };

  const handleEdit = () => {
    if (!selectedClient) return;
    setEditName(selectedClient.name);
    setShowClientMenu(false);
    setShowEditClient(true);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    if (!selectedClient?.id || !selectedClient?.name) return;
    editClient(selectedClient.id, editName);
    setShowEditClient(false);
    setSelectedClient(null);
  };

  const handleDelete = () => {
    if (!selectedClient?.id || !selectedClient?.name) return;
    setShowClientMenu(false);
    Alert.alert(
      'Delete Client',
      `Delete ${selectedClient.name}? Their transactions will remain in your records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            deleteClient(selectedClient.id);
            setSelectedClient(null);
          }
        },
      ]
    );
  };

  const handleColorChange = (color) => {
    if (!selectedClient?.id || !selectedClient?.name) return;
    editClient(selectedClient.id, selectedClient.name, color);
    setShowColorPicker(false);
    setSelectedClient(null);
  };

  const handleQuickAddSelect = (client) => {
    setShowQuickAdd(false);
    setQuickAddSearch('');
    router.push(`/client-detail?id=${client.id}&addTx=1`);
  };

  const handleChangePhoto = async () => {
    if (!selectedClient?.id) return;
    setShowClientMenu(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Photo library access is required to choose a client photo.');
      setSelectedClient(null);
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      updateClientPhoto(selectedClient.id, result.assets[0].uri);
    }
    setSelectedClient(null);
  };

  const toggleClientSelection = (id) => {
    setSelectedClientIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    const count = selectedClientIds.length;
    if (count === 0) return;
    Alert.alert(
      'Delete clients',
      `Delete ${count} client${count > 1 ? 's' : ''}? Their transactions will remain in your records.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete', style: 'destructive',
          onPress: () => {
            selectedClientIds.forEach(id => deleteClient(id));
            setClientMultiSelect(false);
            setSelectedClientIds([]);
          }
        },
      ]
    );
  };

  const handleCancelMultiSelect = () => {
    setClientMultiSelect(false);
    setSelectedClientIds([]);
  };

  const clientTotal = (id) =>
    transactions.filter(t => t?.clientId === id && !t?.invoiced).reduce((s, t) => s + (Number(t?.amount) || 0), 0);

  const outstandingTotal = (clients ?? [])
    .filter(c => c?.name && c.name !== 'Personal')
    .reduce((s, c) => s + clientTotal(c.id), 0);

  const safeTx = transactions.filter(t => t && t.id);
  const flaggedCount = safeTx.filter(t => t.flagged).length;
  const missingReceiptCount = safeTx.filter(t => !t.receiptUri && !t.note).length;
  const untaggedCount = safeTx.filter(t => !t.tagIds?.length).length;
  const needsAttentionItems = [
    flaggedCount > 0 ? { label: `${flaggedCount} flagged for review`, filter: 'flagged' } : null,
    missingReceiptCount > 0 ? { label: `${missingReceiptCount} missing receipts`, filter: 'missing' } : null,
    untaggedCount > 0 ? { label: `${untaggedCount} untagged`, filter: 'untagged' } : null,
  ].filter(Boolean);

  return (
    <SafeAreaView style={s.root}>
      <ScrollView>
        <View style={s.header}>
          <Text style={s.headerSub}>{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase()}</Text>
          <View style={s.headerTitleRow}>
            <Text style={s.headerTitle}>Uncrumple</Text>
            <TouchableOpacity onPress={() => router.push('/settings')} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={s.settingsIcon}>⚙</Text>
            </TouchableOpacity>
          </View>
          <View style={s.outstandingBar}>
            <Text style={s.outstandingLabel}>OUTSTANDING</Text>
            <Text style={s.outstandingAmount}>{fmt(outstandingTotal)}</Text>
          </View>
        </View>

        {needsAttentionItems.length > 0 && (
          <View style={s.attentionSection}>
            <Text style={s.attentionLabel}>NEEDS ATTENTION</Text>
            {needsAttentionItems.map(item => (
              <TouchableOpacity key={item.filter} style={s.attentionRow} onPress={() => router.push(`/explore?filter=${item.filter}`)}>
                <View style={s.attentionDot} />
                <Text style={s.attentionText}>{item.label}</Text>
                <Text style={s.attentionArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>CLIENTS</Text>
          <View style={s.sectionActions}>
            <TouchableOpacity
              onPress={() => setTileView(v => !v)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={s.viewToggleText}>{tileView ? '☰' : '⊞'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowAddClient(true)}>
              <Text style={s.addClientBtn}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>

        {tileView ? (
          <View style={s.tileGrid}>
            {safeClients.filter(c => c && c.name).map(client => (
              <TouchableOpacity
                key={client.id}
                style={[s.tileCard, clientMultiSelect && selectedClientIds.includes(client.id) && s.cardSelected]}
                onPress={() => clientMultiSelect ? toggleClientSelection(client.id) : router.push(`/client-detail?id=${client.id}`)}
                onLongPress={() => handleLongPress(client)}
                delayLongPress={400}
                activeOpacity={0.7}
              >
                {client.photoUri ? (
                  <Image source={{ uri: client.photoUri }} style={[s.tileAvatar, { overflow: 'hidden' }]} resizeMode="cover" />
                ) : (
                  <View style={[s.tileAvatar, { backgroundColor: client.color + '22' }]}>
                    <Text style={[s.tileAvatarText, { color: client.color }]}>{client.initials}</Text>
                  </View>
                )}
                <Text style={s.tileName} numberOfLines={1}>{client.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          safeClients.filter(c => c && c.name).map(client => (
            <TouchableOpacity
              key={client.id}
              style={[s.card, clientMultiSelect && selectedClientIds.includes(client.id) && s.cardSelected]}
              onPress={() => clientMultiSelect ? toggleClientSelection(client.id) : router.push(`/client-detail?id=${client.id}`)}
              onLongPress={() => handleLongPress(client)}
              delayLongPress={400}
            >
              {client.photoUri ? (
                <Image source={{ uri: client.photoUri }} style={[s.avatar, { overflow: 'hidden' }]} resizeMode="cover" />
              ) : (
                <View style={[s.avatar, { backgroundColor: client.color + '22' }]}>
                  <Text style={[s.avatarText, { color: client.color }]}>{client.initials}</Text>
                </View>
              )}
              <View style={s.cardInfo}>
                <Text style={s.cardName}>{client.name}</Text>
                <Text style={s.cardMeta}>
                  {transactions.filter(t => t?.clientId === client.id && !t?.invoiced).length} pending
                </Text>
              </View>
              <View style={s.cardRight}>
                <Text style={s.cardAmount}>{fmt(clientTotal(client.id))}</Text>
                <Text style={s.cardArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {safeClients.length === 0 && (
          <Text style={{ color: '#444', textAlign: 'center', marginTop: 40, paddingHorizontal: 24, fontSize: 14, lineHeight: 20 }}>
            No clients yet. Add your first client to start tracking work.
          </Text>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {clientMultiSelect ? (
        <View style={s.multiBar}>
          <Text style={s.multiBarCount}>{selectedClientIds.length} selected</Text>
          <TouchableOpacity style={s.multiBarDelete} onPress={handleDeleteSelected}>
            <Text style={s.multiBarDeleteText}>Delete Selected</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.multiBarCancel} onPress={handleCancelMultiSelect}>
            <Text style={s.multiBarCancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={s.fab} onPress={() => setShowQuickAdd(true)}>
          <Text style={s.fabText}>+</Text>
        </TouchableOpacity>
      )}

      {/* Client long press menu */}
      <Modal visible={showClientMenu} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setShowClientMenu(false)}>
          <View style={s.overlay} />
        </TouchableWithoutFeedback>
        <View style={s.menuSheet}>
          {selectedClient && (
            <>
              <View style={s.menuHeader}>
                {selectedClient.photoUri ? (
                  <Image source={{ uri: selectedClient.photoUri }} style={[s.avatar, { overflow: 'hidden' }]} resizeMode="cover" />
                ) : (
                  <View style={[s.avatar, { backgroundColor: selectedClient.color + '22' }]}>
                    <Text style={[s.avatarText, { color: selectedClient.color }]}>{selectedClient.initials}</Text>
                  </View>
                )}
                <Text style={s.menuTitle}>{selectedClient.name}</Text>
              </View>
              <TouchableOpacity style={s.menuItem} onPress={handleEdit}>
                <Text style={s.menuItemText}>✏️  Edit Name</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.menuItem} onPress={() => { setShowClientMenu(false); setShowColorPicker(true); }}>
                <Text style={s.menuItemText}>🎨  Change Color</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.menuItem} onPress={handleChangePhoto}>
                <Text style={s.menuItemText}>🖼️  Change Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.menuItem} onPress={handleDelete}>
                <Text style={[s.menuItemText, { color: '#f87171' }]}>🗑️  Delete Client</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowClientMenu(false)}>
                <Text style={s.skipText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      {/* Edit name modal */}
      <Modal visible={showEditClient} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowEditClient(false)} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>EDIT CLIENT</Text>
          <TextInput
            style={s.noteInput}
            value={editName}
            onChangeText={setEditName}
            autoFocus
            autoCapitalize="words"
            placeholderTextColor="#555"
          />
          <TouchableOpacity style={s.btnPrimary} onPress={handleSaveEdit}>
            <Text style={s.btnPrimaryText}>Save</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={() => setShowEditClient(false)}>
            <Text style={s.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Color picker modal */}
      <Modal visible={showColorPicker} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowColorPicker(false)} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>PICK A COLOR</Text>
          <Text style={s.sheetTitle}>Choose color for {selectedClient?.name}</Text>
          <View style={s.colorGrid}>
            {COLORS.map(color => (
              <TouchableOpacity
                key={color}
                style={[s.colorSwatch, { backgroundColor: color }]}
                onPress={() => handleColorChange(color)}
              />
            ))}
          </View>
          <TouchableOpacity style={s.btnGhost} onPress={() => setShowColorPicker(false)}>
            <Text style={s.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Add client modal */}
      <Modal visible={showAddClient} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setShowAddClient(false)} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>NEW CLIENT</Text>
          <Text style={s.sheetTitle}>Add a client</Text>
          <TextInput
            style={s.noteInput}
            placeholder="Client or job name…"
            placeholderTextColor="#555"
            value={newClientName}
            onChangeText={setNewClientName}
            autoFocus
            autoCapitalize="words"
          />
          <TouchableOpacity style={s.btnPrimary} onPress={handleAddClient}>
            <Text style={s.btnPrimaryText}>Add Client</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={() => setShowAddClient(false)}>
            <Text style={s.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Quick-add transaction: pick a client */}
      <Modal visible={showQuickAdd} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => { setShowQuickAdd(false); setQuickAddSearch(''); }} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>ADD TRANSACTION</Text>
          <Text style={s.sheetTitle}>Pick a client</Text>
          <TextInput
            style={s.noteInput}
            placeholder="Search clients…"
            placeholderTextColor="#555"
            value={quickAddSearch}
            onChangeText={setQuickAddSearch}
            autoFocus
            autoCapitalize="words"
          />
          <ScrollView style={s.quickAddScroll} showsVerticalScrollIndicator={false}>
            {quickAddClients.map(c => (
              <TouchableOpacity key={c.id} style={s.quickAddRow} onPress={() => handleQuickAddSelect(c)}>
                {c.photoUri ? (
                  <Image source={{ uri: c.photoUri }} style={[s.avatar, { overflow: 'hidden' }]} resizeMode="cover" />
                ) : (
                  <View style={[s.avatar, { backgroundColor: c.color + '22' }]}>
                    <Text style={[s.avatarText, { color: c.color }]}>{c.initials}</Text>
                  </View>
                )}
                <Text style={s.quickAddClientName}>{c.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <TouchableOpacity style={s.btnGhost} onPress={() => { setShowQuickAdd(false); setQuickAddSearch(''); }}>
            <Text style={s.btnGhostText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { padding: 24, paddingBottom: 16 },
  headerSub: { color: '#555', fontSize: 11, letterSpacing: 2, marginBottom: 4 },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  headerTitle: { color: '#ede9e3', fontSize: 32, fontWeight: '800' },
  settingsIcon: { color: '#555', fontSize: 22 },
  outstandingBar: { backgroundColor: '#141418', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#21212a' },
  outstandingLabel: { color: '#555', fontSize: 10, letterSpacing: 2, marginBottom: 4 },
  outstandingAmount: { color: ACCENT, fontSize: 28, fontWeight: '800' },
  attentionSection: { marginHorizontal: 16, marginBottom: 4 },
  attentionLabel: { color: '#444', fontSize: 10, letterSpacing: 2, marginBottom: 8, marginTop: 4 },
  attentionRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141418', borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 6, gap: 10 },
  attentionDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: ACCENT },
  attentionText: { flex: 1, color: '#ccc', fontSize: 13 },
  attentionArrow: { color: '#444', fontSize: 18 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 10 },
  sectionLabel: { color: '#444', fontSize: 10, letterSpacing: 2 },
  sectionActions: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  viewToggleText: { color: '#888', fontSize: 18 },
  addClientBtn: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  tileGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, gap: 10 },
  tileCard: { width: TILE_WIDTH, backgroundColor: '#141418', borderRadius: 14, paddingVertical: 22, paddingHorizontal: 12, alignItems: 'center', gap: 12 },
  tileAvatar: { width: 60, height: 60, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  tileAvatarText: { fontSize: 20, fontWeight: '700' },
  tileName: { color: '#ede9e3', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  card: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 10, backgroundColor: '#141418', borderRadius: 14, padding: 16, gap: 12 },
  avatar: { width: 42, height: 42, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 13, fontWeight: '700' },
  cardInfo: { flex: 1 },
  cardName: { color: '#ede9e3', fontSize: 15, fontWeight: '600' },
  cardMeta: { color: '#555', fontSize: 12, marginTop: 2 },
  cardRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  cardAmount: { color: '#ede9e3', fontSize: 17, fontWeight: '700' },
  cardArrow: { color: '#444', fontSize: 20 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  menuSheet: { backgroundColor: '#151519', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48, position: 'absolute', bottom: 0, left: 0, right: 0 },
  menuHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  menuTitle: { color: '#ede9e3', fontSize: 18, fontWeight: '700' },
  menuItem: { paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#1e1e26' },
  menuItemText: { color: '#ede9e3', fontSize: 15 },
  sheet: { backgroundColor: '#151519', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48, position: 'absolute', bottom: 0, left: 0, right: 0 },
  sheetLabel: { color: ACCENT, fontSize: 10, letterSpacing: 2, marginBottom: 8 },
  sheetTitle: { color: '#ede9e3', fontSize: 22, fontWeight: '800', marginBottom: 16 },
  skipText: { color: '#555', fontSize: 13, textAlign: 'center', paddingVertical: 12 },
  noteInput: { backgroundColor: '#1a1a20', borderRadius: 10, padding: 12, color: '#ede9e3', fontSize: 14, marginBottom: 16, borderWidth: 1, borderColor: '#272730' },
  btnPrimary: { backgroundColor: ACCENT, borderRadius: 11, padding: 15, alignItems: 'center', marginBottom: 8 },
  btnPrimaryText: { color: '#0d0900', fontWeight: '700', fontSize: 14 },
  btnGhost: { backgroundColor: '#1c1c22', borderRadius: 11, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a34' },
  btnGhostText: { color: '#ede9e3', fontSize: 14 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20, justifyContent: 'center' },
  colorSwatch: { width: 48, height: 48, borderRadius: 24 },
  fab: { position: 'absolute', bottom: 30, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center', elevation: 4 },
  fabText: { color: '#0d0900', fontSize: 30, fontWeight: '700', lineHeight: 36 },
  quickAddScroll: { maxHeight: 300, marginBottom: 16 },
  quickAddRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: '#1e1e22', gap: 12 },
  quickAddClientName: { color: '#ede9e3', fontSize: 15, fontWeight: '500', flex: 1 },
  cardSelected: { borderWidth: 2, borderColor: ACCENT },
  multiBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#151519', borderTopWidth: 1, borderTopColor: '#21212a', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, paddingBottom: 28, gap: 10 },
  multiBarCount: { color: '#888', fontSize: 13, flex: 1 },
  multiBarDelete: { backgroundColor: '#f87171', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  multiBarDeleteText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  multiBarCancel: { backgroundColor: '#1c1c22', borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, borderWidth: 1, borderColor: '#2a2a34' },
  multiBarCancelText: { color: '#ede9e3', fontSize: 13 },
});
