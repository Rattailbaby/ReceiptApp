import { useLocalSearchParams, useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Alert, BackHandler, Dimensions, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../store';

const fmt = (n) => '$' + (Number(n) || 0).toFixed(2);

export default function SearchScreen() {
  const store = useStore();
  const router = useRouter();
  const { filter, source, extra, match } = useLocalSearchParams();
  const [query, setQuery] = useState('');
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [openedFromAdd, setOpenedFromAdd] = useState(false);
  const [showTagSubmenu, setShowTagSubmenu] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [sortMode, setSortMode] = useState('newest');
  const [showSortPicker, setShowSortPicker] = useState(false);
  const [sortPosition, setSortPosition] = useState(null);
  const extraFilters = extra ? extra.split(',') : [];
  const matchMode = match === 'any' ? 'any' : 'all';
  const filterChipRef = useRef(null);
  const plusButtonRef = useRef(null);
  const sortChipRef = useRef(null);

  useFocusEffect(useCallback(() => {
    if (source !== 'tax') return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      router.replace('/tax');
      return true;
    });
    return () => sub.remove();
  }, [source]));

  if (!store?.loaded) return null;

  const transactions = Array.isArray(store?.transactions) ? store.transactions : [];
  const clients = Array.isArray(store?.clients) ? store.clients : [];
  const safeClients = clients.filter(c => c && typeof c === 'object' && typeof c.name === 'string');
  const safeTransactions = transactions.filter(t => t && typeof t === 'object');
  const tags = Array.isArray(store?.tags) ? store.tags : [];
  const sortedTagsByUsage = [...tags]
    .map(tag => ({ ...tag, count: safeTransactions.filter(t => (t.tagIds || []).includes(tag.id)).length }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.name.localeCompare(b.name);
    });
  const topTags = sortedTagsByUsage.slice(0, 8);
  const alphabeticalTags = [...tags].sort((a, b) => a.name.localeCompare(b.name));

  const filters = {
    needsAttention: (filter === 'flagged' || filter === 'missing' || filter === 'untagged') ? filter : null,
  };

  const filterLabels = { flagged: 'Flagged for Review', missing: 'Missing Receipts', untagged: 'Untagged' };
  const activeFilterLabel = filterLabels[filters.needsAttention] ?? null;
  const mainFilterColor =
    filters.needsAttention === 'flagged'
      ? '#ff6b6b'
      : filters.needsAttention === 'missing'
      ? '#22c55e'
      : filters.needsAttention === 'untagged'
      ? '#60a5fa'
      : '#d1d5db';

  const filteredByParam = filters.needsAttention === 'flagged'
    ? safeTransactions.filter(t => t.flagged === true)
    : filters.needsAttention === 'missing'
    ? safeTransactions.filter(t => !t.receiptUri)
    : filters.needsAttention === 'untagged'
    ? safeTransactions.filter(t => !t.tagIds || t.tagIds.length === 0)
    : safeTransactions;

  let finalResults;

  if (matchMode === 'all') {
    finalResults = filteredByParam;
    if (extraFilters.length > 0) {
      finalResults = finalResults.filter(t => {
        const predicate = (f) => {
          if (f === 'flagged') return t.flagged === true;
          if (f === 'missing') return !t.receiptUri;
          if (f === 'untagged') return !t.tagIds || t.tagIds.length === 0;
          if (f.startsWith('tag:')) {
            const id = Number(f.split(':')[1]);
            return (t.tagIds || []).includes(id);
          }
          return true;
        };
        return extraFilters.every(predicate);
      });
    }
  } else {
    const activeFilters = [
      ...(filters.needsAttention ? [filters.needsAttention] : []),
      ...extraFilters,
    ];
    if (activeFilters.length > 0) {
      finalResults = safeTransactions.filter(t => {
        const predicate = (f) => {
          if (f === 'flagged') return t.flagged === true;
          if (f === 'missing') return !t.receiptUri;
          if (f === 'untagged') return !t.tagIds || t.tagIds.length === 0;
          if (f.startsWith('tag:')) {
            const id = Number(f.split(':')[1]);
            return (t.tagIds || []).includes(id);
          }
          return true;
        };
        return activeFilters.some(predicate);
      });
    } else {
      finalResults = safeTransactions;
    }
  }

  const results = query.length > 1
    ? finalResults.filter(t => {
        const clientName = safeClients.find(c => c.id === t.clientId)?.name?.toLowerCase() ?? '';
        return (
          (t.merchant?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
          (t.note?.toLowerCase() ?? '').includes(query.toLowerCase()) ||
          clientName.includes(query.toLowerCase())
        );
      })
    : filters.needsAttention || extraFilters.length > 0
    ? finalResults
    : safeTransactions;

  const sortedResults = [...results].sort((a, b) => {
    if (sortMode === 'newest') return (b.id ?? 0) - (a.id ?? 0);
    if (sortMode === 'oldest') return (a.id ?? 0) - (b.id ?? 0);
    if (sortMode === 'amount_high') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
    if (sortMode === 'amount_low') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
    return 0;
  });

  const sortLabel = sortMode === 'newest' ? 'Sort: Newest'
    : sortMode === 'oldest' ? 'Sort: Oldest'
    : sortMode === 'amount_high' ? 'Sort: High'
    : sortMode === 'amount_low' ? 'Sort: Low'
    : 'Sort';

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <Text style={s.title}>Search</Text>
        <TextInput
          style={s.input}
          placeholder="Merchant, client, note…"
          placeholderTextColor="#555"
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>
      <ScrollView>
        <View style={[s.filterLabelRow, { paddingHorizontal: 16 }]}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <TouchableOpacity ref={filterChipRef} onPress={() => {
              if (showFilterPicker) {
                setShowFilterPicker(false);
                return;
              }
              filterChipRef.current?.measureInWindow((x, y, width, height) => {
                setDropdownPosition({
                  top: y + height + 48,
                  left: x,
                  width
                });
                setOpenedFromAdd(false);
                setShowTagSubmenu(false);
                setShowSortPicker(false);
                setShowFilterPicker(true);
              });
            }} activeOpacity={0.7} style={{ alignSelf: 'flex-start', maxWidth: '100%', flexShrink: 1, borderColor: mainFilterColor, borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[s.filterLabel, { fontSize: 13, paddingHorizontal: 0, paddingTop: 0, paddingBottom: 0, color: mainFilterColor, flexShrink: 1 }]} numberOfLines={1} ellipsizeMode="tail">{activeFilterLabel || 'Filters'} {showFilterPicker ? '▴' : '▾'}</Text>
              {filters.needsAttention && (
                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ paddingLeft: 8 }}
                  onPress={() => router.replace(`/explore?extra=${extraFilters.join(',')}&match=${matchMode}`)}
                >
                  <Text style={{ color: mainFilterColor, fontSize: 13, fontWeight: '600' }}>×</Text>
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginRight: 12 }}>
          <TouchableOpacity
            ref={plusButtonRef}
            onPress={() => {
              plusButtonRef.current?.measureInWindow((x, y, width, height) => {
                const dropdownWidth = 230;
                const screenWidth = Dimensions.get('window').width;
                const clampedLeft = Math.min(
                  Math.max(16, x),
                  screenWidth - dropdownWidth - 16
                );
                setDropdownPosition({
                  top: y + height + 48,
                  left: clampedLeft,
                  width
                });
                setOpenedFromAdd(true);
                setShowTagSubmenu(false);
                setShowSortPicker(false);
                setShowFilterPicker(true);
              });
            }}
            activeOpacity={0.7}
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: '#555',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: '#d1d5db', fontSize: 16, fontWeight: '600' }}>+</Text>
          </TouchableOpacity>
          <TouchableOpacity
            ref={sortChipRef}
            onPress={() => {
              sortChipRef.current?.measureInWindow((x, y, width, height) => {
                const dropdownWidth = 200;
                const screenWidth = Dimensions.get('window').width;
                const clampedLeft = Math.min(
                  Math.max(16, x),
                  screenWidth - dropdownWidth - 16
                );
                setSortPosition({ top: y + height + 48, left: clampedLeft, width });
                setShowFilterPicker(false);
                setShowTagSubmenu(false);
                setShowSortPicker(true);
              });
            }}
            activeOpacity={0.7}
            style={{ borderColor: '#555', borderWidth: 1, borderRadius: 999, paddingVertical: 6, paddingHorizontal: 12 }}
          >
            <Text style={{ color: '#d1d5db', fontSize: 13, fontWeight: '600' }}>{sortLabel} {'▾'}</Text>
          </TouchableOpacity>
          </View>
        </View>
        {extraFilters.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, paddingHorizontal: 16, marginTop: 8 }}>
          {extraFilters.map((f, i) => {
            const isTag = f.startsWith('tag:');
            const tagObj = isTag ? tags.find(t => t.id === Number(f.split(':')[1])) : null;
            const chipColor = isTag
              ? (tagObj?.color || '#888')
              : f === 'flagged' ? '#ff6b6b' : f === 'missing' ? '#22c55e' : f === 'untagged' ? '#60a5fa' : '#888';
            const chipBg = isTag
              ? 'transparent'
              : f === 'flagged' ? 'rgba(255,107,107,0.08)' : f === 'missing' ? 'rgba(34,197,94,0.08)' : f === 'untagged' ? 'rgba(96,165,250,0.08)' : 'transparent';
            return (
              <View
                key={i}
                style={{
                  borderWidth: 1,
                  borderColor: chipColor,
                  backgroundColor: chipBg,
                  borderRadius: 999,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                <Text style={{ color: chipColor, marginRight: 6 }}>
                  {isTag ? (tagObj?.name ?? f) : (filterLabels[f] ?? f)}
                </Text>

                <TouchableOpacity
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  style={{ paddingLeft: 8 }}
                  onPress={() => {
                    const updatedList = extraFilters.filter((_, idx) => idx !== i);
                    router.replace(`/explore?filter=${filters.needsAttention || ''}&extra=${updatedList.join(',')}&match=${matchMode}`);
                  }}
                >
                  <Text style={{ color: chipColor }}>×</Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
        )}
        {(filters.needsAttention || extraFilters.length > 0) && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8, paddingHorizontal: 16 }}>
            {((filters.needsAttention ? 1 : 0) + extraFilters.length) >= 2 && (
              <TouchableOpacity
                onPress={() => {
                  const newMode = matchMode === 'all' ? 'any' : 'all';
                  router.replace(`/explore?filter=${filters.needsAttention || ''}&extra=${extraFilters.join(',')}&match=${newMode}`);
                }}
                style={{
                  borderRadius: 999,
                  borderWidth: 1,
                  borderColor: '#444',
                  paddingVertical: 6,
                  paddingHorizontal: 14
                }}
              >
                <Text style={{ color: '#f59e0b', fontSize: 13, fontWeight: '600' }}>
                  Match: {matchMode === 'all' ? 'All' : 'Any'}
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => router.replace('/explore')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              style={{ marginLeft: 'auto' }}
            >
              <Text style={s.filterClearText}>Clear</Text>
            </TouchableOpacity>
          </View>
        )}
        {results.length === 0 && query.length > 1 && (
          <Text style={s.empty}>No results for "{query}"</Text>
        )}
        {results.length === 0 && query.length <= 1 && (
          <Text style={s.empty}>
            {filters.needsAttention === 'missing'
              ? 'All receipts added — nothing missing.'
              : filters.needsAttention === 'untagged'
              ? 'Everything is tagged.'
              : filters.needsAttention === 'flagged'
              ? 'No transactions need review.'
              : 'No transactions yet.'}
          </Text>
        )}
        {sortedResults.map(tx => {
          const client = safeClients.find(c => c.id === tx.clientId);
          return (
            <TouchableOpacity key={tx.id} style={s.row} onPress={() => router.push(`/client-detail?id=${tx.clientId}&txId=${tx.id}&source=explore&returnFilter=${filters.needsAttention || ''}&extra=${extraFilters.join(',')}&match=${matchMode}`)} activeOpacity={0.7}>
              <View style={[s.dot, { backgroundColor: client?.color || '#666' }]} />
              <View style={s.info}>
                <Text style={s.merchant}>{tx.merchant}</Text>
                <Text style={s.meta}>
                  {client?.name}{tx.note ? ' · ' + tx.note : ''} · {tx.date}
                </Text>
              </View>
              <View style={s.right}>
                <Text style={s.amount}>{fmt(tx.amount)}</Text>
                <View style={{ flexDirection: 'row', gap: 4, marginTop: 4 }}>
                  <View style={(tx.tagIds || []).length > 0 ? s.tagDot : s.emptyDot} />
                  <View style={!!tx.receiptUri ? s.receiptDot : s.emptyDot} />
                  {tx.flagged === true && <View style={s.flaggedDot} />}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <View style={{ height: 60 }} />
      </ScrollView>
      {showFilterPicker && dropdownPosition && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setShowFilterPicker(false);
              setShowTagSubmenu(false);
            }}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
          />
          <View style={{
            position: 'absolute',
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            width: 230,
            backgroundColor: '#141418',
            padding: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#2a2a34',
            zIndex: 20
          }}>
            {!showTagSubmenu && (<>
            {openedFromAdd && (
              <Text style={{
                color: '#888',
                fontSize: 12,
                paddingHorizontal: 8,
                paddingVertical: 4
              }}>
                Add filter
              </Text>
            )}
            <Text style={{
              color: '#666',
              fontSize: 11,
              fontWeight: '600',
              paddingHorizontal: 8,
              paddingVertical: 4,
              letterSpacing: 0.5
            }}>
              NEEDS ATTENTION
            </Text>
            {(openedFromAdd
              ? ['flagged','missing','untagged'].filter(f => filters.needsAttention !== f && !extraFilters.includes(f))
              : ['flagged','missing','untagged']
            ).map(f => {
              const isActive = filters.needsAttention === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    backgroundColor: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                    borderLeftWidth: isActive ? 3 : 0,
                    borderLeftColor: isActive ? '#f59e0b' : 'transparent'
                  }}
                  onPress={() => {
                    setShowFilterPicker(false);
                    if (openedFromAdd) {
                      if (filters.needsAttention === f || extraFilters.includes(f)) return;
                      router.replace(`/explore?filter=${filters.needsAttention || ''}&extra=${[...extraFilters, f].join(',')}&match=${matchMode}`);
                    } else {
                      router.replace(`/explore?filter=${f}&extra=${extraFilters.join(',')}&match=${matchMode}`);
                    }
                  }}
                >
                  <Text style={{
                    color: isActive ? '#f59e0b' : '#d1d5db',
                    fontSize: 14,
                    fontWeight: '600'
                  }}>
                    {filterLabels[f]}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <View style={{
              height: 1,
              backgroundColor: '#2a2a34',
              marginVertical: 4
            }} />
            {['Tags', 'Client', 'Merchant'].map(label => (
              <TouchableOpacity
                key={label}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 8,
                  borderRadius: 8
                }}
                onPress={() => {
                  if (label === 'Tags') {
                    setShowTagSubmenu(true);
                    return;
                  }
                  Alert.alert(
                    'Coming soon',
                    `${label} filter will let you narrow transactions by ${label.toLowerCase()}.`
                  );
                }}
              >
                <Text style={{
                  color: '#d1d5db',
                  fontSize: 14,
                  fontWeight: '600'
                }}>
                  {label} {'›'}
                </Text>
              </TouchableOpacity>
            ))}
            </>)}
            {showTagSubmenu && (<>
              <TouchableOpacity
                style={{ paddingVertical: 7, paddingHorizontal: 8, borderRadius: 8 }}
                onPress={() => { setShowTagSubmenu(false); setShowAllTags(false); }}
              >
                <Text style={{ color: '#888', fontSize: 13, fontWeight: '600' }}>
                  {'‹ Back'}
                </Text>
              </TouchableOpacity>
              {topTags.map(tag => {
                const tagFilter = `tag:${tag.id}`;
                const isSelected = extraFilters.includes(tagFilter);
                const tagColor = tag.color || '#666';
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={{
                      paddingVertical: 7,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? tagColor : 'transparent',
                      backgroundColor: isSelected ? tagColor + '14' : 'transparent'
                    }}
                    onPress={() => {
                      const updated = isSelected
                        ? extraFilters.filter(x => x !== tagFilter)
                        : [...extraFilters, tagFilter];
                      router.replace(`/explore?filter=${filters.needsAttention || ''}&extra=${updated.join(',')}&match=${matchMode}`);
                    }}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tagColor }} />
                    <Text style={{ color: isSelected ? tagColor : '#d1d5db', fontSize: 14, fontWeight: '600' }}>
                      {tag.name}
                    </Text>
                    {isSelected && (
                      <Text style={{ color: tagColor, fontSize: 14, fontWeight: '600', marginLeft: 'auto' }}>
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
              <View style={{ height: 1, backgroundColor: '#2a2a34', marginVertical: 4 }} />
              <TouchableOpacity
                style={{ paddingVertical: 7, paddingHorizontal: 8, borderRadius: 8 }}
                onPress={() => {
                  setShowFilterPicker(false);
                  setShowTagSubmenu(false);
                  setShowAllTags(true);
                }}
              >
                <Text style={{ color: '#f59e0b', fontSize: 14, fontWeight: '600' }}>
                  More tags
                </Text>
              </TouchableOpacity>
            </>)}
          </View>
        </>
      )}
      {showSortPicker && sortPosition && (
        <>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setShowSortPicker(false)}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10 }}
          />
          <View style={{
            position: 'absolute',
            top: sortPosition.top,
            left: sortPosition.left,
            width: 200,
            backgroundColor: '#141418',
            padding: 6,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: '#2a2a34',
            zIndex: 20
          }}>
            {[
              { key: 'newest', label: 'Newest' },
              { key: 'oldest', label: 'Oldest' },
              { key: 'amount_high', label: 'Amount high' },
              { key: 'amount_low', label: 'Amount low' },
            ].map(opt => {
              const isActive = sortMode === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={{
                    paddingVertical: 7,
                    paddingHorizontal: 8,
                    borderRadius: 8,
                    backgroundColor: isActive ? 'rgba(245,158,11,0.08)' : 'transparent',
                    borderLeftWidth: isActive ? 3 : 0,
                    borderLeftColor: isActive ? '#f59e0b' : 'transparent'
                  }}
                  onPress={() => {
                    setSortMode(opt.key);
                    setShowSortPicker(false);
                  }}
                >
                  <Text style={{
                    color: isActive ? '#f59e0b' : '#d1d5db',
                    fontSize: 14,
                    fontWeight: '600'
                  }}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </>
      )}
      <Modal
        visible={showAllTags}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllTags(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowAllTags(false)}
          style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }}
        />
        <View style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          maxHeight: '80%',
          backgroundColor: '#141418',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          borderWidth: 1,
          borderColor: '#2a2a34',
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24
        }}>
          <Text style={{
            color: '#666',
            fontSize: 11,
            fontWeight: '600',
            letterSpacing: 0.5,
            marginBottom: 12
          }}>
            TAGS
          </Text>
          <ScrollView>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {alphabeticalTags.map(tag => {
                const tagFilter = `tag:${tag.id}`;
                const isSelected = extraFilters.includes(tagFilter);
                const tagColor = tag.color || '#666';
                return (
                  <TouchableOpacity
                    key={tag.id}
                    style={{
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      borderRadius: 999,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      borderWidth: 1,
                      borderColor: isSelected ? tagColor : '#2a2a34',
                      backgroundColor: isSelected ? tagColor + '14' : 'transparent'
                    }}
                    onPress={() => {
                      const updated = isSelected
                        ? extraFilters.filter(x => x !== tagFilter)
                        : [...extraFilters, tagFilter];
                      router.replace(`/explore?filter=${filters.needsAttention || ''}&extra=${updated.join(',')}&match=${matchMode}`);
                    }}
                  >
                    <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: tagColor }} />
                    <Text style={{ color: isSelected ? tagColor : '#d1d5db', fontSize: 14, fontWeight: '600' }}>
                      {tag.name}
                    </Text>
                    {isSelected && (
                      <Text style={{ color: tagColor, fontSize: 14, fontWeight: '600' }}>
                        ✓
                      </Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <TouchableOpacity
            style={{
              marginTop: 16,
              paddingVertical: 12,
              borderRadius: 8,
              alignItems: 'center',
              backgroundColor: 'rgba(245,158,11,0.08)',
              borderWidth: 1,
              borderColor: '#f59e0b'
            }}
            onPress={() => setShowAllTags(false)}
          >
            <Text style={{ color: '#f59e0b', fontSize: 14, fontWeight: '600' }}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { padding: 24, paddingBottom: 16 },
  title: { color: '#ede9e3', fontSize: 32, fontWeight: '800', marginBottom: 16 },
  input: { backgroundColor: '#141418', borderRadius: 12, padding: 14, color: '#ede9e3', fontSize: 14, borderWidth: 1, borderColor: '#21212a' },
  filterLabel: { color: '#f59e0b', fontSize: 11, letterSpacing: 1, paddingHorizontal: 22, paddingTop: 10, paddingBottom: 4 },
  filterLabelRow: { flexDirection: 'row', alignItems: 'center' },
  filterClearBtn: { paddingHorizontal: 22, paddingTop: 10, paddingBottom: 4, marginLeft: 'auto' },
  filterClearText: { color: '#888', fontSize: 12, fontWeight: '500' },
  empty: { color: '#444', fontSize: 13, textAlign: 'center', marginTop: 60 },
  row: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 22, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#151518', gap: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, flexShrink: 0 },
  info: { flex: 1 },
  merchant: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  meta: { color: '#555', fontSize: 11, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { color: '#ede9e3', fontSize: 14, fontWeight: '500' },
  receiptTag: { color: '#22c55e', fontSize: 10, marginTop: 2 },
  tagDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#60a5fa' },
  receiptDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#22c55e' },
  flaggedDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ff6b6b' },
  emptyDot: { width: 7, height: 7, borderRadius: 4, borderWidth: 1, borderColor: '#333' },
});