import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';
import { ACCENT } from './constants';

const INITIAL_CLIENTS = [
  { id: 1, name: 'Savita', color: ACCENT, initials: 'SA' },
  { id: 2, name: 'Mentor House', color: '#60a5fa', initials: 'MH' },
  { id: 3, name: 'Day Program', color: '#a78bfa', initials: 'DP' },
  { id: 4, name: 'Otto', color: '#34d399', initials: 'OT' },
  { id: 5, name: 'Personal', color: '#6b7280', initials: 'ME' },
];

const INITIAL_TAGS = [
  { id: 1, name: 'Fuel', color: '#60a5fa' },
  { id: 2, name: 'Materials', color: ACCENT },
  { id: 3, name: 'Food', color: '#34d399' },
  { id: 4, name: 'Personal', color: '#a78bfa' },
  { id: 5, name: 'Subcontractor', color: '#fb923c' },
  { id: 6, name: 'Utilities', color: '#f87171' },
];

const INITIAL_TRANSACTIONS = [
  { id: 1, clientId: 1, merchant: 'Menards', amount: 84.12, date: 'Apr 14', note: 'Deck boards', receipt: true, invoiced: false },
  { id: 2, clientId: 1, merchant: 'Home Depot', amount: 31.47, date: 'Apr 10', note: 'Paint', receipt: true, invoiced: false },
  { id: 3, clientId: 2, merchant: 'Menards', amount: 203.11, date: 'Apr 16', note: 'Flooring', receipt: true, invoiced: false },
  { id: 4, clientId: 3, merchant: 'Walmart', amount: 67.23, date: 'Apr 15', note: '', receipt: false, invoiced: false },
  { id: 5, clientId: 4, merchant: 'Shell', amount: 61.80, date: 'Apr 13', note: 'Gas', receipt: false, invoiced: false },
  { id: 6, clientId: 1, merchant: 'Lowes', amount: 55.00, date: 'Mar 28', note: '', receipt: true, invoiced: true, invoiceId: 'inv-mar', invoiceLabel: 'March Invoice', invoiceDate: 'Mar 31' },
];

const TRANSACTIONS_KEY = 'uncrumple_transactions';
const CLIENTS_KEY = 'uncrumple_clients';
const TAX_RATE_KEY = 'uncrumple_tax_rate';
const RULES_KEY = 'uncrumple_rules';
const MERCHANTS_KEY = 'uncrumple_merchants';
const CARDS_KEY = 'uncrumple_cards';
const TAGS_KEY = 'uncrumple_tags';
const SETTINGS_KEY = 'uncrumple_settings';
const StoreContext = createContext(null);

const COLORS = [ACCENT, '#60a5fa', '#a78bfa', '#34d399', '#f87171', '#fb923c', '#e879f9', '#22d3ee'];

export function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
}

export function getNextColor(clients) {
  const used = clients.map(c => c.color);
  return COLORS.find(c => !used.includes(c)) || COLORS[clients.length % COLORS.length];
}

export function StoreProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [rules, setRules] = useState([]);
  const [savedMerchants, setSavedMerchants] = useState([]);
  const [cards, setCards] = useState([]);
  const [tags, setTags] = useState([]);
  const [taxRate, setTaxRate] = useState(22);
  const [settings, setSettings] = useState({ roundNumberGas: false });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(TRANSACTIONS_KEY),
      AsyncStorage.getItem(CLIENTS_KEY),
      AsyncStorage.getItem(TAX_RATE_KEY),
      AsyncStorage.getItem(RULES_KEY),
      AsyncStorage.getItem(MERCHANTS_KEY),
      AsyncStorage.getItem(CARDS_KEY),
      AsyncStorage.getItem(TAGS_KEY),
      AsyncStorage.getItem(SETTINGS_KEY),
    ]).then(([rawTx, rawCl, rawRate, rawRules, rawMerchants, rawCards, rawTags, rawSettings]) => {
      if (rawTx) {
        try {
          const parsed = JSON.parse(rawTx);
          const clean = (parsed || []).filter(t => t && t.id);
          setTransactions(clean.length > 0 ? clean : INITIAL_TRANSACTIONS);
        } catch (e) {
          setTransactions(INITIAL_TRANSACTIONS);
        }
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
      }

      if (rawCl) {
        try {
          const parsed = JSON.parse(rawCl);
          const clean = (parsed || []).filter(c => c && c.id && c.name);
          setClients(clean.length > 0 ? clean : INITIAL_CLIENTS);
        } catch (e) {
          setClients(INITIAL_CLIENTS);
        }
      } else {
        setClients(INITIAL_CLIENTS);
      }

      if (rawRate) {
        const parsed = parseFloat(rawRate);
        if (!isNaN(parsed) && parsed > 0 && parsed <= 100) setTaxRate(parsed);
      }

      if (rawRules) {
        try {
          const parsed = JSON.parse(rawRules);
          setRules(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setRules([]);
        }
      }

      if (rawMerchants) {
        try {
          const parsed = JSON.parse(rawMerchants);
          setSavedMerchants(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setSavedMerchants([]);
        }
      }

      if (rawCards) {
        try {
          const parsed = JSON.parse(rawCards);
          setCards(Array.isArray(parsed) ? parsed : []);
        } catch (e) {
          setCards([]);
        }
      }

      if (rawTags) {
        try {
          const parsed = JSON.parse(rawTags);
          setTags(Array.isArray(parsed) ? parsed : INITIAL_TAGS);
        } catch (e) {
          setTags(INITIAL_TAGS);
        }
      } else {
        setTags(INITIAL_TAGS);
      }

      if (rawSettings) {
        try {
          const parsed = JSON.parse(rawSettings);
          setSettings(prev => ({ ...prev, ...parsed }));
        } catch (e) {}
      }

      setLoaded(true);
    });
  }, []);

  const updateTaxRate = (rate) => {
    setTaxRate(rate);
    AsyncStorage.setItem(TAX_RATE_KEY, String(rate));
  };

  const updateSettings = (key, value) => {
    setSettings(prev => {
      const updated = { ...prev, [key]: value };
      AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const saveTx = (updated) => {
    AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(updated));
  };

  const saveCl = (updated) => {
    AsyncStorage.setItem(CLIENTS_KEY, JSON.stringify(updated));
  };

  const saveRules = (updated) => {
    AsyncStorage.setItem(RULES_KEY, JSON.stringify(updated));
  };

  const saveMerchantsToStorage = (updated) => {
    AsyncStorage.setItem(MERCHANTS_KEY, JSON.stringify(updated));
  };

  const addMerchant = (name) => {
    const trimmed = (name || '').trim();
    if (!trimmed) return;
    setSavedMerchants(prev => {
      if (prev.includes(trimmed)) return prev;
      const updated = [...prev, trimmed];
      saveMerchantsToStorage(updated);
      return updated;
    });
  };

  const getSavedMerchants = () => savedMerchants;

  const saveCards = (updated) => {
    AsyncStorage.setItem(CARDS_KEY, JSON.stringify(updated));
  };

  const addCard = (card) => {
    setCards(prev => {
      const updated = [...prev, { ...card, id: Date.now() }];
      saveCards(updated);
      return updated;
    });
  };

  const editCard = (id, changes) => {
    setCards(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...changes } : c);
      saveCards(updated);
      return updated;
    });
  };

  const deleteCard = (id) => {
    setCards(prev => {
      const updated = prev.filter(c => c.id !== id);
      saveCards(updated);
      return updated;
    });
  };

  const saveTags = (updated) => {
    AsyncStorage.setItem(TAGS_KEY, JSON.stringify(updated));
  };

  const addTag = (tag) => {
    const newTag = { ...tag, id: Date.now() };
    setTags(prev => {
      const updated = [...prev, newTag];
      saveTags(updated);
      return updated;
    });
    return newTag;
  };

  const editTag = (id, changes) => {
    setTags(prev => {
      const updated = prev.map(t => t.id === id ? { ...t, ...changes } : t);
      saveTags(updated);
      return updated;
    });
  };

  const deleteTag = (id) => {
    setTags(prev => {
      const updated = prev.filter(t => t.id !== id);
      saveTags(updated);
      return updated;
    });
  };

  const addTransaction = (tx) => {
    const merchantLower = (tx.merchant || '').toLowerCase();
    const txAmount = Number(tx.amount) || 0;

    let appliedClientId = tx.clientId;
    const mergedTagIds = [...(tx.tagIds || [])];
    let isFlagged = false;

    for (const rule of rules) {
      const hasIf = rule.merchantContains || rule.amountOver != null || rule.cardId;
      if (!hasIf) continue;
      let matches = true;
      if (rule.merchantContains && !merchantLower.includes(rule.merchantContains.toLowerCase())) matches = false;
      if (rule.amountOver != null && txAmount <= Number(rule.amountOver)) matches = false;
      if (rule.cardId && tx.cardId !== rule.cardId) matches = false;
      if (matches) {
        if (rule.assignToClientId) appliedClientId = rule.assignToClientId;
        if (rule.tagIds?.length) rule.tagIds.forEach(tid => { if (!mergedTagIds.includes(tid)) mergedTagIds.push(tid); });
        if (rule.flag) isFlagged = true;
      }
    }

    const GAS_STATIONS = ['shell', 'bp', 'marathon', 'speedway', 'exxon', 'mobil', "casey's", 'kwik trip'];
    if (settings.roundNumberGas && txAmount > 0) {
      const isGas = GAS_STATIONS.some(g => merchantLower.includes(g));
      const isRound = txAmount % 1 === 0;
      const isRepeating = Math.floor(txAmount) === Math.round((txAmount % 1) * 100);
      if (isGas && (isRound || isRepeating)) {
        const fuelTag = tags.find(t => t.name === 'Fuel');
        if (fuelTag && !mergedTagIds.includes(fuelTag.id)) mergedTagIds.push(fuelTag.id);
      }
    }

    const newTx = { ...tx, id: Date.now(), clientId: appliedClientId, tagIds: mergedTagIds, flagged: isFlagged };
    addMerchant(tx.merchant);
    setTransactions(prev => {
      const updated = [newTx, ...prev.filter(t => t && t.id)];
      saveTx(updated);
      return updated;
    });
  };

  const deleteTransaction = (id) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t && t.id && t.id !== id);
      saveTx(updated);
      return updated;
    });
  };

  const moveTransaction = (id, newClientId) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t && t.id).map(t => t.id === id ? { ...t, clientId: newClientId } : t);
      saveTx(updated);
      return updated;
    });
  };

  const editTransaction = (id, changes) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t && t.id).map(t => t.id === id ? { ...t, ...changes } : t);
      saveTx(updated);
      return updated;
    });
  };

  const bulkDeleteTransactions = (ids) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t && t.id && !ids.includes(t.id));
      saveTx(updated);
      return updated;
    });
  };

  const bulkMoveTransactions = (ids, newClientId) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t && t.id).map(t => ids.includes(t.id) ? { ...t, clientId: newClientId } : t);
      saveTx(updated);
      return updated;
    });
  };

  const markInvoiced = (clientId, invoiceNote) => {
    const invoiceId = 'inv-' + Date.now();
    const client = clients.find(c => c && c.id === clientId);
    const label = invoiceNote || (client?.name + ' Invoice');
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setTransactions(prev => {
      const updated = prev.filter(t => t && t.id).map(t =>
        t.clientId === clientId && !t.invoiced
          ? { ...t, invoiced: true, invoiceId, invoiceLabel: label, invoiceDate: today }
          : t
      );
      saveTx(updated);
      return updated;
    });
  };

  const addRule = (rule) => {
    setRules(prev => {
      const updated = [...prev, { ...rule, id: Date.now() }];
      saveRules(updated);
      return updated;
    });
  };

  const editRule = (id, changes) => {
    setRules(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, ...changes } : r);
      saveRules(updated);
      return updated;
    });
  };

  const deleteRule = (id) => {
    setRules(prev => {
      const updated = prev.filter(r => r.id !== id);
      saveRules(updated);
      return updated;
    });
  };

  const addClient = (name) => {
    const newClient = {
      id: Date.now(),
      name: name.trim(),
      color: getNextColor(clients),
      initials: getInitials(name.trim()),
    };
    setClients(prev => {
      const updated = [...prev.filter(c => c && c.id && c.name), newClient];
      saveCl(updated);
      return updated;
    });
    return newClient;
  };

  const editClient = (id, name, color) => {
    setClients(prev => {
      const updated = prev.filter(c => c && c.id && c.name).map(c => c.id === id
        ? { ...c, name: name.trim(), initials: getInitials(name.trim()), ...(color ? { color } : {}) }
        : c
      );
      saveCl(updated);
      return updated;
    });
  };

  const deleteClient = (id) => {
    setClients(prev => {
      const updated = prev.filter(c => c && c.id && c.name && c.id !== id);
      saveCl(updated);
      return updated;
    });
  };

  const updateClientPhoto = (id, photoUri) => {
    setClients(prev => {
      const updated = prev.filter(c => c && c.id && c.name).map(c => c.id === id ? { ...c, photoUri } : c);
      saveCl(updated);
      return updated;
    });
  };

  return (
    <StoreContext.Provider value={{
      transactions: transactions.filter(t => t && t.id),
      addTransaction, markInvoiced,
      deleteTransaction, moveTransaction, editTransaction,
      bulkDeleteTransactions, bulkMoveTransactions,
      clients: clients.filter(c => c && c.id && c.name),
      addClient, editClient, deleteClient, updateClientPhoto,
      rules, addRule, editRule, deleteRule,
      savedMerchants, getSavedMerchants, addMerchant,
      cards, addCard, editCard, deleteCard,
      tags, addTag, editTag, deleteTag,
      taxRate, updateTaxRate,
      settings, updateSettings,
      loaded
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}