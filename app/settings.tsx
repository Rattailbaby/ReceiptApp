import { ACCENT } from '@/constants';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../store';

export default function Settings() {
  const router = useRouter();
  const store = useStore();
  const settings = store?.settings ?? { roundNumberGas: false };
  const updateSettings = store?.updateSettings;

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={s.back}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={s.title}>Settings</Text>
      </View>
      <ScrollView>
        <Text style={s.sectionLabel}>DETECTION</Text>
        <View style={s.row}>
          <View style={s.rowInfo}>
            <Text style={s.rowTitle}>Round Number Gas Detection</Text>
            <Text style={s.rowDesc}>If you always stop gas on even or repeating numbers, the app will automatically tag those purchases as Fuel</Text>
          </View>
          <Switch
            value={settings.roundNumberGas}
            onValueChange={v => updateSettings('roundNumberGas', v)}
            trackColor={{ false: '#2a2a34', true: ACCENT + '88' }}
            thumbColor={settings.roundNumberGas ? ACCENT : '#555'}
          />
        </View>

        <Text style={s.sectionLabel}>RULES</Text>
        <TouchableOpacity style={s.linkRow} onPress={() => router.push('/rules')}>
          <Text style={s.rowTitle}>Manage Rules</Text>
          <Text style={s.rowArrow}>›</Text>
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#0e0e11' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingBottom: 12, gap: 16 },
  back: { color: ACCENT, fontSize: 17, fontWeight: '500' },
  title: { color: '#ede9e3', fontSize: 22, fontWeight: '800', flex: 1 },
  sectionLabel: { color: '#444', fontSize: 10, letterSpacing: 2, paddingHorizontal: 22, paddingTop: 20, paddingBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141418', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16, gap: 12 },
  linkRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141418', marginHorizontal: 16, marginBottom: 8, borderRadius: 12, padding: 16 },
  rowInfo: { flex: 1 },
  rowTitle: { color: '#ede9e3', fontSize: 15, fontWeight: '600', marginBottom: 4, flex: 1 },
  rowDesc: { color: '#888', fontSize: 12, lineHeight: 17 },
  rowArrow: { color: '#444', fontSize: 22 },
});
