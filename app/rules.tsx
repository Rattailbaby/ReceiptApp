import { ACCENT } from '@/constants';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

const newId = () => String(Date.now() + Math.random());

const IF_TYPES = ['merchant', 'amount', 'card'];
const IF_TYPE_LABELS = { merchant: 'merchant contains', amount: 'amount is over', card: 'card used' };
const THEN_TYPES = ['tag', 'flag'];
const THEN_TYPE_LABELS = { tag: 'tag as', flag: 'flag for review' };

const STRATEGIES = ['Business Only', 'Personal Only', 'Gas Only', 'Mixed'];

const TAG_COLORS = [
  '#60a5fa', '#f59e0b', '#34d399', '#a78bfa',
  '#fb923c', '#f87171', '#e879f9', '#22d3ee',
  '#4ade80', '#facc15',
];

export default function Rules() {
  const router = useRouter();
  const { prefillMerchant } = useLocalSearchParams();
  const store = useStore();

  const [showSheet, setShowSheet] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [ifRows, setIfRows] = useState([]);
  const [thenRows, setThenRows] = useState([]);
  const [openIfDropdown, setOpenIfDropdown] = useState(null);
  const [openThenDropdown, setOpenThenDropdown] = useState(null);
  const [tagModalRowId, setTagModalRowId] = useState(null);
  const [showRuleTagModal, setShowRuleTagModal] = useState(false);
  const [ruleTagSearch, setRuleTagSearch] = useState('');

  const [showCardSheet, setShowCardSheet] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [cardLabel, setCardLabel] = useState('');
  const [cardStrategy, setCardStrategy] = useState(null);

  const [showTagSheet, setShowTagSheet] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [tagName, setTagName] = useState('');
  const [tagColor, setTagColor] = useState(null);

  const loaded = store?.loaded ?? false;

  useEffect(() => {
    if (loaded && prefillMerchant) {
      setIfRows([{ id: newId(), type: 'merchant', value: String(prefillMerchant) }]);
      setThenRows([{ id: newId(), type: 'tag', tagIds: [] }]);
      setShowSheet(true);
    }
  }, [loaded]);

  if (!loaded) return null;

  const rules = store?.rules ?? [];
  const addRule = store?.addRule;
  const editRule = store?.editRule;
  const deleteRule = store?.deleteRule;
  const cards = store?.cards ?? [];
  const addCard = store?.addCard;
  const editCard = store?.editCard;
  const deleteCard = store?.deleteCard;
  const tags = store?.tags ?? [];
  const addTag = store?.addTag;
  const editTag = store?.editTag;
  const deleteTag = store?.deleteTag;
  const transactions = store?.transactions ?? [];

  const allTagsSorted = [...tags]
    .map(tag => ({ ...tag, count: transactions.filter(t => (t.tagIds || []).includes(tag.id)).length }))
    .sort((a, b) => b.count - a.count);
  const topRuleTags = allTagsSorted.slice(0, 8);
  const ruleModalTags = ruleTagSearch.trim().length > 0
    ? allTagsSorted.filter(t => t.name.toLowerCase().includes(ruleTagSearch.toLowerCase()))
    : allTagsSorted;
  const ruleNoMatch = ruleTagSearch.trim().length > 0 && ruleModalTags.length === 0;
  const activeModalTagIds = thenRows.find(r => r.id === tagModalRowId)?.tagIds ?? [];

  // ── IF row helpers ─────────────────────────────────────────────────────────

  const addIfRow = () => {
    setIfRows(prev => [...prev, { id: newId(), type: 'merchant', value: '' }]);
  };

  const removeIfRow = (id) => {
    setIfRows(prev => prev.filter(r => r.id !== id));
    if (openIfDropdown === id) setOpenIfDropdown(null);
  };

  const setIfRowType = (id, type) => {
    setIfRows(prev => prev.map(r => r.id === id ? { ...r, type, value: type === 'card' ? null : '' } : r));
  };

  const setIfRowValue = (id, value) => {
    setIfRows(prev => prev.map(r => r.id === id ? { ...r, value } : r));
  };

  // ── THEN row helpers ───────────────────────────────────────────────────────

  const addThenRow = () => {
    setThenRows(prev => [...prev, { id: newId(), type: 'tag', tagIds: [] }]);
  };

  const removeThenRow = (id) => {
    setThenRows(prev => prev.filter(r => r.id !== id));
    if (openThenDropdown === id) setOpenThenDropdown(null);
  };

  const setThenRowType = (id, type) => {
    setThenRows(prev => prev.map(r => r.id === id ? { ...r, type, tagIds: [] } : r));
  };

  const toggleThenRowTag = (rowId, tagId) => {
    setThenRows(prev => prev.map(r =>
      r.id === rowId
        ? { ...r, tagIds: r.tagIds.includes(tagId) ? r.tagIds.filter(id => id !== tagId) : [...r.tagIds, tagId] }
        : r
    ));
  };

  // ── Rule form ──────────────────────────────────────────────────────────────

  const openAddSheet = () => {
    setEditingRule(null);
    setIfRows([{ id: newId(), type: 'merchant', value: '' }]);
    setThenRows([{ id: newId(), type: 'tag', tagIds: [] }]);
    setOpenIfDropdown(null);
    setOpenThenDropdown(null);
    setTagModalRowId(null);
    setRuleTagSearch('');
    setShowSheet(true);
  };

  const openEditSheet = (rule) => {
    setEditingRule(rule);
    const newIfRows = [];
    if (rule.merchantContains) newIfRows.push({ id: newId(), type: 'merchant', value: rule.merchantContains });
    if (rule.amountOver != null) newIfRows.push({ id: newId(), type: 'amount', value: String(rule.amountOver) });
    if (rule.cardId) newIfRows.push({ id: newId(), type: 'card', value: rule.cardId });
    if (newIfRows.length === 0) newIfRows.push({ id: newId(), type: 'merchant', value: '' });
    const newThenRows = [];
    if (rule.tagIds?.length) newThenRows.push({ id: newId(), type: 'tag', tagIds: rule.tagIds });
    if (rule.flag) newThenRows.push({ id: newId(), type: 'flag', tagIds: [] });
    if (newThenRows.length === 0) newThenRows.push({ id: newId(), type: 'tag', tagIds: [] });
    setIfRows(newIfRows);
    setThenRows(newThenRows);
    setOpenIfDropdown(null);
    setOpenThenDropdown(null);
    setTagModalRowId(null);
    setRuleTagSearch('');
    setShowSheet(true);
  };

  const closeSheet = () => {
    setShowSheet(false);
    setEditingRule(null);
    setIfRows([]);
    setThenRows([]);
    setOpenIfDropdown(null);
    setOpenThenDropdown(null);
  };

  const hasIF = ifRows.some(row => {
    if (row.type === 'merchant') return (row.value || '').trim().length > 0;
    if (row.type === 'amount') return (row.value || '').trim().length > 0;
    if (row.type === 'card') return row.value != null;
    return false;
  });

  const hasTHEN = thenRows.some(row => {
    if (row.type === 'tag') return row.tagIds.length > 0;
    if (row.type === 'flag') return true;
    return false;
  });

  const canSave = hasIF && hasTHEN;

  const handleSave = () => {
    if (!canSave) return;
    const ruleData = {};
    for (const row of ifRows) {
      if (row.type === 'merchant' && (row.value || '').trim()) ruleData.merchantContains = row.value.trim();
      if (row.type === 'amount' && (row.value || '').trim()) ruleData.amountOver = parseFloat(row.value);
      if (row.type === 'card' && row.value != null) ruleData.cardId = row.value;
    }
    const allTagIds = [...new Set(thenRows.filter(r => r.type === 'tag').flatMap(r => r.tagIds))];
    if (allTagIds.length) ruleData.tagIds = allTagIds;
    if (thenRows.some(r => r.type === 'flag')) ruleData.flag = true;
    if (editingRule) {
      editRule(editingRule.id, ruleData);
    } else {
      addRule(ruleData);
    }
    closeSheet();
  };

  const handleDelete = (rule) => {
    const label = rule.merchantContains ? `"${rule.merchantContains}"` : 'this rule';
    Alert.alert('Delete Rule', `Delete ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteRule(rule.id) },
    ]);
  };

  const handleCreateRuleTag = () => {
    const name = ruleTagSearch.trim();
    if (!name || !addTag || !tagModalRowId) return;
    const color = TAG_COLORS[tags.length % TAG_COLORS.length];
    const newTag = addTag({ name, color });
    if (newTag?.id != null) toggleThenRowTag(tagModalRowId, newTag.id);
    setRuleTagSearch('');
  };

  // ── Card management ────────────────────────────────────────────────────────

  const openAddCardSheet = () => { setEditingCard(null); setCardLabel(''); setCardStrategy(null); setShowCardSheet(true); };
  const openEditCardSheet = (card) => { setEditingCard(card); setCardLabel(card.label); setCardStrategy(card.strategy); setShowCardSheet(true); };
  const closeCardSheet = () => { setShowCardSheet(false); setEditingCard(null); };

  const handleSaveCard = () => {
    if (!cardLabel.trim() || !cardStrategy) return;
    if (editingCard) {
      editCard(editingCard.id, { label: cardLabel.trim(), strategy: cardStrategy });
    } else {
      addCard({ label: cardLabel.trim(), strategy: cardStrategy });
    }
    closeCardSheet();
  };

  const handleDeleteCard = (card) => {
    Alert.alert('Delete Card', `Delete "${card.label}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteCard(card.id) },
    ]);
  };

  const canSaveCard = cardLabel.trim().length > 0 && cardStrategy != null;

  // ── Tag management ─────────────────────────────────────────────────────────

  const openAddTagSheet = () => { setEditingTag(null); setTagName(''); setTagColor(null); setShowTagSheet(true); };
  const openEditTagSheet = (tag) => { setEditingTag(tag); setTagName(tag.name); setTagColor(tag.color); setShowTagSheet(true); };
  const closeTagSheet = () => { setShowTagSheet(false); setEditingTag(null); };

  const handleSaveTag = () => {
    if (!tagName.trim() || !tagColor) return;
    if (editingTag) {
      editTag(editingTag.id, { name: tagName.trim(), color: tagColor });
    } else {
      addTag({ name: tagName.trim(), color: tagColor });
    }
    closeTagSheet();
  };

  const handleDeleteTag = (tag) => {
    Alert.alert('Delete Tag', `Delete "${tag.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteTag(tag.id) },
    ]);
  };

  const canSaveTag = tagName.trim().length > 0 && tagColor != null;

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={s.root}>
      <ScrollView>
        <View style={s.header}>
          <TouchableOpacity onPress={() => router.back()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={s.back}>← Back</Text>
          </TouchableOpacity>
          <Text style={s.title}>Rules</Text>
          <Text style={s.subtitle}>Auto-tag transactions by merchant, amount, or card</Text>
        </View>

        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>RULES</Text>
          <TouchableOpacity onPress={openAddSheet}>
            <Text style={s.addBtn}>+ Add Rule</Text>
          </TouchableOpacity>
        </View>

        {rules.length === 0 && (
          <View style={s.emptyBar}>
            <Text style={s.emptyText}>No rules yet.{'\n'}Add a rule to auto-tag transactions.</Text>
          </View>
        )}

        {rules.map(rule => {
          const ruleCard = cards.find(c => c.id === rule.cardId);
          const ruleTags = (rule.tagIds || []).map(tid => tags.find(t => t.id === tid)).filter(Boolean);
          const ifParts = [];
          if (rule.merchantContains) ifParts.push(`"${rule.merchantContains}"`);
          if (rule.amountOver != null) ifParts.push(`>$${rule.amountOver}`);
          if (ruleCard) ifParts.push(ruleCard.label);
          return (
            <View key={rule.id} style={s.ruleRow}>
              <View style={s.ruleInfo}>
                <Text style={s.ruleIf}>IF {ifParts.join(' · ')}</Text>
                <View style={s.ruleThenRow}>
                  {ruleTags.map(tag => (
                    <View key={tag.id} style={[s.ruleTagDot, { backgroundColor: tag.color }]} />
                  ))}
                  {ruleTags.length > 0 && (
                    <Text style={s.ruleThenText}>{ruleTags.map(t => t.name).join(', ')}</Text>
                  )}
                  {rule.flag && <Text style={s.ruleFlagText}>⚑</Text>}
                </View>
              </View>
              <View style={s.ruleButtons}>
                <TouchableOpacity onPress={() => openEditSheet(rule)} hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}>
                  <Text style={s.editBtn}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(rule)} hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}>
                  <Text style={s.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>TAGS</Text>
          <TouchableOpacity onPress={openAddTagSheet}>
            <Text style={s.addBtn}>+ Add Tag</Text>
          </TouchableOpacity>
        </View>

        {tags.length === 0 && (
          <View style={s.emptyBar}>
            <Text style={s.emptyText}>No tags yet.{'\n'}Add tags to categorize your transactions.</Text>
          </View>
        )}

        {tags.map(tag => (
          <View key={tag.id} style={s.ruleRow}>
            <View style={[s.tagColorDot, { backgroundColor: tag.color }]} />
            <View style={s.ruleInfo}>
              <Text style={s.ruleKeyword}>{tag.name}</Text>
            </View>
            <View style={s.ruleButtons}>
              <TouchableOpacity onPress={() => openEditTagSheet(tag)} hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}>
                <Text style={s.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteTag(tag)} hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}>
                <Text style={s.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={s.sectionRow}>
          <Text style={s.sectionLabel}>CARDS</Text>
          <TouchableOpacity onPress={openAddCardSheet}>
            <Text style={s.addBtn}>+ Add Card</Text>
          </TouchableOpacity>
        </View>

        {cards.length === 0 && (
          <View style={s.emptyBar}>
            <Text style={s.emptyText}>No cards yet.{'\n'}Add a card to track which card you use per transaction.</Text>
          </View>
        )}

        {cards.map(card => (
          <View key={card.id} style={s.ruleRow}>
            <View style={s.ruleInfo}>
              <Text style={s.ruleKeyword}>{card.label}</Text>
              <Text style={s.strategyBadge}>{card.strategy}</Text>
            </View>
            <View style={s.ruleButtons}>
              <TouchableOpacity onPress={() => openEditCardSheet(card)} hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}>
                <Text style={s.editBtn}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteCard(card)} hitSlop={{ top: 8, bottom: 8, left: 10, right: 10 }}>
                <Text style={s.deleteBtn}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={{ height: 60 }} />
      </ScrollView>

      {/* Tag management modal */}
      <Modal visible={showTagSheet} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeTagSheet} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.sheet}>
            <Text style={s.sheetLabel}>{editingTag ? 'EDIT TAG' : 'NEW TAG'}</Text>
            <TextInput style={s.input} placeholder="Tag name (e.g. Materials)" placeholderTextColor="#555" value={tagName} onChangeText={setTagName} autoFocus autoCapitalize="words" />
            <Text style={s.assignLabel}>COLOR</Text>
            <View style={s.colorRow}>
              {TAG_COLORS.map(color => (
                <TouchableOpacity key={color} style={[s.colorSwatch, { backgroundColor: color }, tagColor === color && s.colorSwatchSelected]} onPress={() => setTagColor(color)} />
              ))}
            </View>
            <TouchableOpacity style={[s.btnPrimary, !canSaveTag && s.btnDisabled]} onPress={handleSaveTag} disabled={!canSaveTag}>
              <Text style={s.btnPrimaryText}>Save Tag</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnGhost} onPress={closeTagSheet}>
              <Text style={s.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Card management modal */}
      <Modal visible={showCardSheet} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeCardSheet} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={s.sheet}>
            <Text style={s.sheetLabel}>{editingCard ? 'EDIT CARD' : 'NEW CARD'}</Text>
            <TextInput style={s.input} placeholder="Card nickname (e.g. Chase Sapphire)" placeholderTextColor="#555" value={cardLabel} onChangeText={setCardLabel} autoFocus autoCapitalize="words" />
            <Text style={s.assignLabel}>STRATEGY</Text>
            {STRATEGIES.map(strategy => {
              const isSelected = cardStrategy === strategy;
              return (
                <TouchableOpacity key={strategy} style={s.clientRow} onPress={() => setCardStrategy(strategy)} activeOpacity={0.7}>
                  <Text style={[s.clientName, isSelected && s.clientNameSelected]}>{strategy}</Text>
                  {isSelected && <Text style={s.checkmark}>✓</Text>}
                </TouchableOpacity>
              );
            })}
            <View style={{ height: 12 }} />
            <TouchableOpacity style={[s.btnPrimary, !canSaveCard && s.btnDisabled]} onPress={handleSaveCard} disabled={!canSaveCard}>
              <Text style={s.btnPrimaryText}>Save Card</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.btnGhost} onPress={closeCardSheet}>
              <Text style={s.btnGhostText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Rule form modal */}
      <Modal visible={showSheet} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={closeSheet} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={s.ruleKAV}>
          <View style={s.ruleSheet}>
            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={s.ruleSheetContent}>
              <Text style={s.sheetLabel}>{editingRule ? 'EDIT RULE' : 'NEW RULE'}</Text>

              <Text style={s.conditionHeader}>IF</Text>

              {ifRows.map(row => (
                <View key={row.id}>
                  <View style={s.builderRow}>
                    <View style={s.builderRowTop}>
                      <TouchableOpacity
                        style={s.typeBtn}
                        onPress={() => setOpenIfDropdown(prev => prev === row.id ? null : row.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={s.typeBtnText}>{IF_TYPE_LABELS[row.type]}</Text>
                        <Text style={s.dropdownArrow}>▾</Text>
                      </TouchableOpacity>
                      {row.type === 'merchant' && (
                        <TextInput
                          style={s.builderInput}
                          placeholder="e.g. Menards"
                          placeholderTextColor="#555"
                          value={row.value || ''}
                          onChangeText={v => setIfRowValue(row.id, v)}
                          autoCapitalize="none"
                        />
                      )}
                      {row.type === 'amount' && (
                        <TextInput
                          style={s.builderInput}
                          placeholder="e.g. 50"
                          placeholderTextColor="#555"
                          value={row.value || ''}
                          onChangeText={v => setIfRowValue(row.id, v)}
                          keyboardType="decimal-pad"
                        />
                      )}
                      {row.type === 'card' && <View style={{ flex: 1 }} />}
                      <TouchableOpacity onPress={() => removeIfRow(row.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={s.rowRemove}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    {row.type === 'card' && (
                      <View style={[s.chipsRow, { marginTop: 10 }]}>
                        {cards.length === 0 ? (
                          <Text style={s.emptyFieldNote}>No cards saved — add cards below</Text>
                        ) : (
                          cards.map(card => {
                            const isSel = row.value === card.id;
                            return (
                              <TouchableOpacity
                                key={card.id}
                                style={[s.cardChip, isSel && s.cardChipSelected]}
                                onPress={() => setIfRowValue(row.id, isSel ? null : card.id)}
                                activeOpacity={0.7}
                              >
                                <Text style={[s.cardChipText, isSel && s.cardChipTextSelected]}>{card.label}</Text>
                              </TouchableOpacity>
                            );
                          })
                        )}
                      </View>
                    )}
                  </View>
                  {openIfDropdown === row.id && (
                    <View style={s.dropdownMenu}>
                      {IF_TYPES.map((type, idx) => (
                        <TouchableOpacity
                          key={type}
                          style={[s.dropdownItem, idx < IF_TYPES.length - 1 && s.dropdownItemBorder]}
                          onPress={() => { setIfRowType(row.id, type); setOpenIfDropdown(null); }}
                        >
                          <Text style={[s.dropdownItemText, row.type === type && s.dropdownItemActive]}>
                            {IF_TYPE_LABELS[type]}
                          </Text>
                          {row.type === type && <Text style={s.dropdownCheck}>✓</Text>}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              <TouchableOpacity style={s.addRowBtn} onPress={addIfRow} activeOpacity={0.7}>
                <Text style={s.addRowBtnText}>+ Add condition</Text>
              </TouchableOpacity>

              <View style={s.divider} />

              <Text style={s.conditionHeader}>THEN</Text>

              {thenRows.map(row => (
                <View key={row.id}>
                  <View style={s.builderRow}>
                    <View style={s.builderRowTop}>
                      <TouchableOpacity
                        style={s.typeBtn}
                        onPress={() => setOpenThenDropdown(prev => prev === row.id ? null : row.id)}
                        activeOpacity={0.7}
                      >
                        <Text style={s.typeBtnText}>{THEN_TYPE_LABELS[row.type]}</Text>
                        <Text style={s.dropdownArrow}>▾</Text>
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity onPress={() => removeThenRow(row.id)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Text style={s.rowRemove}>✕</Text>
                      </TouchableOpacity>
                    </View>
                    {row.type === 'tag' && (
                      <>
                        {row.tagIds.length > 0 && (
                          <View style={[s.chipsRow, { marginTop: 10 }]}>
                            {row.tagIds.map(tid => {
                              const tag = tags.find(t => t.id === tid);
                              if (!tag) return null;
                              return (
                                <TouchableOpacity
                                  key={tid}
                                  style={[s.tagChip, { borderColor: tag.color, backgroundColor: tag.color }]}
                                  onPress={() => toggleThenRowTag(row.id, tid)}
                                  activeOpacity={0.7}
                                >
                                  <Text style={[s.tagChipText, s.tagChipTextSel]}>{tag.name}</Text>
                                </TouchableOpacity>
                              );
                            })}
                          </View>
                        )}
                        <View style={[s.chipsRow, { marginTop: row.tagIds.length > 0 ? 4 : 10 }]}>
                          {topRuleTags.filter(tag => !row.tagIds.includes(tag.id)).map(tag => (
                            <TouchableOpacity
                              key={tag.id}
                              style={[s.tagChip, { borderColor: tag.color + '66' }]}
                              onPress={() => toggleThenRowTag(row.id, tag.id)}
                              activeOpacity={0.7}
                            >
                              <View style={[s.tagDot, { backgroundColor: tag.color }]} />
                              <Text style={s.tagChipText}>{tag.name}</Text>
                            </TouchableOpacity>
                          ))}
                          <TouchableOpacity
                            style={[s.tagChip, { borderColor: '#444', paddingHorizontal: 12 }]}
                            onPress={() => { setRuleTagSearch(''); setTagModalRowId(row.id); setShowRuleTagModal(true); }}
                            activeOpacity={0.7}
                          >
                            <Text style={[s.tagChipText, { color: '#888' }]}>+</Text>
                          </TouchableOpacity>
                        </View>
                      </>
                    )}
                  </View>
                  {openThenDropdown === row.id && (
                    <View style={s.dropdownMenu}>
                      {THEN_TYPES.map((type, idx) => (
                        <TouchableOpacity
                          key={type}
                          style={[s.dropdownItem, idx < THEN_TYPES.length - 1 && s.dropdownItemBorder]}
                          onPress={() => { setThenRowType(row.id, type); setOpenThenDropdown(null); }}
                        >
                          <Text style={[s.dropdownItemText, row.type === type && s.dropdownItemActive]}>
                            {THEN_TYPE_LABELS[type]}
                          </Text>
                          {row.type === type && <Text style={s.dropdownCheck}>✓</Text>}
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}

              <TouchableOpacity style={s.addRowBtn} onPress={addThenRow} activeOpacity={0.7}>
                <Text style={s.addRowBtnText}>+ Add action</Text>
              </TouchableOpacity>

              <View style={{ height: 16 }} />
              <TouchableOpacity style={[s.btnPrimary, !canSave && s.btnDisabled]} onPress={handleSave} disabled={!canSave}>
                <Text style={s.btnPrimaryText}>Save Rule</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.btnGhost} onPress={closeSheet}>
                <Text style={s.btnGhostText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* Rule tag picker modal */}
      <Modal visible={showRuleTagModal} transparent animationType="slide">
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => { setShowRuleTagModal(false); setTagModalRowId(null); setRuleTagSearch(''); }} />
        <View style={s.sheet}>
          <Text style={s.sheetLabel}>TAGS</Text>
          <ScrollView style={s.tagModalScroll} contentContainerStyle={[s.chipsRow, { paddingBottom: 8 }]} showsVerticalScrollIndicator={false}>
            {ruleModalTags.map(tag => {
              const isSel = activeModalTagIds.includes(tag.id);
              return (
                <TouchableOpacity
                  key={tag.id}
                  style={[s.tagChip, isSel ? { borderColor: tag.color, backgroundColor: tag.color } : { borderColor: tag.color + '66' }]}
                  onPress={() => { if (tagModalRowId) toggleThenRowTag(tagModalRowId, tag.id); }}
                  activeOpacity={0.7}
                >
                  {!isSel && <View style={[s.tagDot, { backgroundColor: tag.color }]} />}
                  <Text style={[s.tagChipText, isSel && s.tagChipTextSel]}>{tag.name}</Text>
                </TouchableOpacity>
              );
            })}
            {ruleNoMatch && (
              <TouchableOpacity style={s.tagCreateBtn} onPress={handleCreateRuleTag} activeOpacity={0.7}>
                <Text style={s.tagCreateText}>+ "{ruleTagSearch.trim()}"</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
          <TextInput
            style={s.tagSearchInput}
            placeholder="Search tags…"
            placeholderTextColor="#555"
            value={ruleTagSearch}
            onChangeText={setRuleTagSearch}
            autoCapitalize="words"
            autoCorrect={false}
          />
          <View style={{ height: 8 }} />
          <TouchableOpacity style={s.btnPrimary} onPress={() => { setShowRuleTagModal(false); setTagModalRowId(null); setRuleTagSearch(''); }}>
            <Text style={s.btnPrimaryText}>Save</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { padding: 24, paddingBottom: 8 },
  backBtn: { alignSelf: 'flex-start', padding: 10, marginLeft: -10, marginBottom: 6 },
  back: { color: '#555', fontSize: 13 },
  title: { color: '#ede9e3', fontSize: 28, fontWeight: '800', marginBottom: 4 },
  subtitle: { color: '#555', fontSize: 13, lineHeight: 20 },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 22, paddingVertical: 12 },
  sectionLabel: { color: '#444', fontSize: 10, letterSpacing: 2 },
  addBtn: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  emptyBar: { marginHorizontal: 16, backgroundColor: '#141418', borderRadius: 14, padding: 24, alignItems: 'center' },
  emptyText: { color: '#444', fontSize: 13, textAlign: 'center', lineHeight: 22 },
  ruleRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, backgroundColor: '#141418', borderRadius: 12, padding: 16 },
  ruleInfo: { flex: 1 },
  ruleIf: { color: '#666', fontSize: 11, marginBottom: 5 },
  ruleThenRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap' },
  ruleTagDot: { width: 8, height: 8, borderRadius: 4 },
  ruleThenText: { color: '#ede9e3', fontSize: 12, fontWeight: '500' },
  ruleFlagText: { color: '#fb923c', fontSize: 11 },
  ruleKeyword: { color: '#ede9e3', fontSize: 14, fontWeight: '600', marginBottom: 5 },
  strategyBadge: { color: '#666', fontSize: 11, marginTop: 3 },
  tagColorDot: { width: 10, height: 10, borderRadius: 5, marginRight: 4 },
  ruleButtons: { flexDirection: 'row', alignItems: 'center', gap: 18 },
  editBtn: { color: ACCENT, fontSize: 12, fontWeight: '600' },
  deleteBtn: { color: '#f87171', fontSize: 14, fontWeight: '700' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  sheet: { backgroundColor: '#151519', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48 },
  sheetLabel: { color: ACCENT, fontSize: 10, letterSpacing: 2, marginBottom: 16 },
  input: { backgroundColor: '#1a1a20', borderRadius: 10, padding: 12, color: '#ede9e3', fontSize: 14, marginBottom: 16, borderWidth: 1, borderColor: '#272730' },
  assignLabel: { color: '#444', fontSize: 10, letterSpacing: 2, marginBottom: 10 },
  clientRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1e1e22', gap: 12 },
  clientName: { flex: 1, color: '#888', fontSize: 15 },
  clientNameSelected: { color: '#ede9e3', fontWeight: '600' },
  checkmark: { color: ACCENT, fontSize: 14, fontWeight: '700' },
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  colorSwatch: { width: 34, height: 34, borderRadius: 17 },
  colorSwatchSelected: { borderWidth: 3, borderColor: '#ede9e3' },
  btnPrimary: { backgroundColor: ACCENT, borderRadius: 11, padding: 15, alignItems: 'center', marginBottom: 8 },
  btnPrimaryText: { color: '#0d0900', fontWeight: '700', fontSize: 14 },
  btnDisabled: { opacity: 0.4 },
  btnGhost: { backgroundColor: '#1c1c22', borderRadius: 11, padding: 15, alignItems: 'center', borderWidth: 1, borderColor: '#2a2a34' },
  btnGhostText: { color: '#ede9e3', fontSize: 14 },
  ruleKAV: { maxHeight: '92%' },
  ruleSheet: { backgroundColor: '#151519', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  ruleSheetContent: { padding: 28, paddingBottom: 48 },
  conditionHeader: { color: ACCENT, fontSize: 13, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#21212a', marginVertical: 16 },
  builderRow: { backgroundColor: '#141418', borderRadius: 10, padding: 12, marginBottom: 8 },
  builderRowTop: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  typeBtn: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#1e1e28', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, flexShrink: 0 },
  typeBtnText: { color: '#ede9e3', fontSize: 12, fontWeight: '500' },
  dropdownArrow: { color: '#555', fontSize: 9 },
  builderInput: { flex: 1, backgroundColor: '#1a1a20', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 10, color: '#ede9e3', fontSize: 13, borderWidth: 1, borderColor: '#272730' },
  rowRemove: { color: '#444', fontSize: 15, fontWeight: '700', paddingLeft: 4 },
  dropdownMenu: { backgroundColor: '#1e1e28', borderRadius: 8, marginTop: 2, marginBottom: 6, borderWidth: 1, borderColor: '#2a2a34', overflow: 'hidden' },
  dropdownItem: { paddingVertical: 11, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' },
  dropdownItemBorder: { borderBottomWidth: 1, borderBottomColor: '#25252f' },
  dropdownItemText: { flex: 1, color: '#888', fontSize: 13 },
  dropdownItemActive: { color: ACCENT, fontWeight: '600' },
  dropdownCheck: { color: ACCENT, fontSize: 12, fontWeight: '700' },
  addRowBtn: { alignSelf: 'flex-start', paddingVertical: 8 },
  addRowBtnText: { color: ACCENT, fontSize: 13, fontWeight: '600' },
  emptyFieldNote: { color: '#555', fontSize: 12, fontStyle: 'italic' },
  cardChip: { paddingVertical: 7, paddingHorizontal: 13, borderRadius: 20, borderWidth: 1, borderColor: '#2a2a3a', marginRight: 4, backgroundColor: '#1a1a24' },
  cardChipSelected: { borderColor: ACCENT, backgroundColor: ACCENT + '18' },
  cardChipText: { color: '#888', fontSize: 13 },
  cardChipTextSelected: { color: ACCENT, fontWeight: '600' },
  chipsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  tagChip: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: '#2a2a3a', backgroundColor: 'transparent' },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  tagChipText: { color: '#888', fontSize: 12 },
  tagChipTextSel: { color: '#0e0e11', fontWeight: '600' },
  tagModalScroll: { maxHeight: 300, marginBottom: 12 },
  tagSearchInput: { backgroundColor: '#1a1a20', borderRadius: 10, padding: 10, color: '#ede9e3', fontSize: 13, marginBottom: 6, borderWidth: 1, borderColor: '#272730' },
  tagCreateBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 16, borderWidth: 1, borderColor: ACCENT + '88', backgroundColor: 'transparent' },
  tagCreateText: { color: ACCENT, fontSize: 12, fontWeight: '600' },
});
