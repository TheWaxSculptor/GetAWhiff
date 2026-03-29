import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Platform, ScrollView } from 'react-native';
import { LightSensor } from 'expo-sensors';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { AdBanner } from '../components/AdBanner';

type LightSource = 'LED' | 'Sun' | 'HPS';

// Conversion factors from Lux to PPFD (µmol/m²/s)
const CONVERSION_FACTORS: Record<LightSource, number> = {
  LED: 0.0150, // Standard Full Spectrum LED
  Sun: 0.0185, // Direct Sunlight
  HPS: 0.0122, // High Pressure Sodium (legacy grow lights)
};

export default function PPFDScreen() {
  const [lux, setLux] = useState(0);
  const [source, setSource] = useState<LightSource>('LED');
  const [active, setActive] = useState(false);
  const [hasSensor, setHasSensor] = useState(false);

  useEffect(() => {
    // LightSensor is strictly Android only via expo-sensors unless on highly specific platforms.
    LightSensor.isAvailableAsync().then((available) => setHasSensor(available));

    let subscription: ReturnType<typeof LightSensor.addListener> | null = null;
    
    if (active && hasSensor) {
      LightSensor.setUpdateInterval(500); // 2 updates a sec
      subscription = LightSensor.addListener(({ illuminance }) => {
        setLux(illuminance);
      });
    }

    return () => {
      if (subscription) subscription.remove();
    };
  }, [active, hasSensor]);

  const ppfdValue = Math.round(lux * CONVERSION_FACTORS[source]);

  const getMeterColor = (ppfd: number) => {
    if (ppfd < 200) return '#4FC3F7'; // Seedling (Low)
    if (ppfd < 600) return '#81C784'; // Veg (Good)
    if (ppfd <= 1000) return '#FFB74D'; // Flower (High)
    return Colors.avoid; // Danger/Bleaching
  };

  const getStatusText = (ppfd: number) => {
    if (ppfd < 200) return 'Seedling & Early Veg Zone';
    if (ppfd < 600) return 'Late Veg Zone (Optimal Growth)';
    if (ppfd <= 1000) return 'Heavy Flowering Zone';
    return 'DANGER: Light Burn / Bleaching Zone';
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        <View style={styles.header}>
          <Ionicons name="sunny" size={48} color={Colors.primary} />
          <Text style={styles.title}>PPFD Light Meter</Text>
          <Text style={styles.subtitle}>Optimize natural growth using Photon Flux Density</Text>
        </View>

        {!hasSensor || Platform.OS === 'ios' ? (
          <View style={styles.hardwareWarning}>
            <Ionicons name="hardware-chip-outline" size={32} color={Colors.caution} />
            <Text style={styles.warningTitle}>Hardware Restricted</Text>
            <Text style={styles.warningBody}>
              Apple strictly disables developer access to the ambient light sensor on iOS devices to protect biometric privacy. 
              {'\n\n'}
              This live PPFD meter natively functions only on Android devices via Wakeup Whiff.
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Live Sensor</Text>
              <Switch 
                value={active} 
                onValueChange={setActive} 
                trackColor={{ false: Colors.border, true: Colors.primary }}
              />
            </View>

            <View style={[styles.gaugeContainer, { borderColor: getMeterColor(ppfdValue) }]}>
              <Text style={[styles.gaugeValue, { color: getMeterColor(ppfdValue) }]}>
                {active ? ppfdValue : '--'}
              </Text>
              <Text style={styles.gaugeUnit}>µmol/m²/s</Text>
              {active && <Text style={[styles.gaugeStatus, { color: getMeterColor(ppfdValue) }]}>{getStatusText(ppfdValue)}</Text>}
            </View>

            <View style={styles.sourceSelector}>
              <Text style={styles.sectionTitle}>Select Light Source</Text>
              <View style={styles.tabs}>
                {(Object.keys(CONVERSION_FACTORS) as LightSource[]).map((src) => (
                  <Text 
                    key={src} 
                    style={[styles.tab, source === src && styles.tabActive]}
                    onPress={() => setSource(src)}
                  >
                    {src}
                  </Text>
                ))}
              </View>
            </View>

            <View style={styles.rawLux}>
              <Text style={styles.rawLuxText}>Raw Illuminance: {Math.round(lux)} lux</Text>
            </View>
          </>
        )}

      </ScrollView>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  
  header: { alignItems: 'center', marginBottom: Spacing.xxl, marginTop: Spacing.xl },
  title: { fontFamily: Fonts.extraBold, fontSize: 28, color: Colors.text, marginTop: Spacing.md },
  subtitle: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm },

  hardwareWarning: {
    backgroundColor: Colors.bgCard,
    padding: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderTopWidth: 4,
    borderTopColor: Colors.caution,
  },
  warningTitle: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text, marginTop: Spacing.md, marginBottom: Spacing.sm },
  warningBody: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.bgCardLight, padding: Spacing.lg, borderRadius: Radius.md, marginBottom: Spacing.xl },
  toggleLabel: { fontFamily: Fonts.bold, fontSize: 18, color: Colors.text },

  gaugeContainer: {
    height: 250,
    width: 250,
    borderRadius: 125,
    borderWidth: 8,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    marginBottom: Spacing.xxl,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  gaugeValue: { fontFamily: Fonts.extraBold, fontSize: 64 },
  gaugeUnit: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textSecondary },
  gaugeStatus: { fontFamily: Fonts.medium, fontSize: 12, marginTop: Spacing.md, textAlign: 'center', width: '80%' },

  sourceSelector: { marginBottom: Spacing.xl },
  sectionTitle: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.text, marginBottom: Spacing.md },
  tabs: { flexDirection: 'row', gap: Spacing.sm },
  tab: {
    flex: 1,
    textAlign: 'center',
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.textSecondary,
    backgroundColor: Colors.bgCard,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden'
  },
  tabActive: {
    backgroundColor: Colors.primary,
    color: Colors.white,
    borderColor: Colors.primary,
  },

  rawLux: { alignItems: 'center', marginTop: Spacing.md },
  rawLuxText: { fontFamily: Fonts.regular, fontSize: 14, color: Colors.textMuted },
});
