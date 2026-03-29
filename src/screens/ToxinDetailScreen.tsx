import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
// @ts-ignore
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { getToxinReportById, ToxinReport } from '../api/toxinApi';
import { AdBanner } from '../components/AdBanner';

type ParamList = { ToxinDetail: { reportId: string } };

export default function ToxinDetailScreen() {
  const route = useRoute<RouteProp<ParamList, 'ToxinDetail'>>();
  const navigation = useNavigation();
  const { reportId } = route.params;

  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ToxinReport | null>(null);

  useEffect(() => {
    loadReport();
  }, [reportId]);

  const loadReport = async () => {
    setLoading(true);
    const data = await getToxinReportById(reportId);
    setReport(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.error} />
        <Text style={styles.loadingText}>Running safety scan...</Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="warning-outline" size={64} color={Colors.textSecondary} />
        <Text style={styles.errorText}>Could not load safety report.</Text>
        <Text style={styles.backButton} onPress={() => navigation.goBack()}>Go Back</Text>
      </View>
    );
  }

  const getVerdictColor = (verdict: string) => {
    if (verdict === 'Safe') return Colors.safe;
    if (verdict === 'Caution') return Colors.caution;
    return Colors.avoid;
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Header Block */}
        <View style={[styles.header, { backgroundColor: getVerdictColor(report.verdict) + '22' }]}>
          <View style={styles.verdictBadge}>
            <Ionicons 
              name={report.verdict === 'Safe' ? 'shield-checkmark' : 'skull'} 
              size={32} 
              color={getVerdictColor(report.verdict)} 
            />
            <Text style={[styles.verdictText, { color: getVerdictColor(report.verdict) }]}>
              {report.verdict.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.summary}>{report.summary}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Raw Text Scanned</Text>
          <Text style={styles.rawIngredientsText}>{report.detectedText}</Text>

          <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>Hazard Breakdown</Text>
          {report.hazards.length === 0 ? (
            <View style={styles.allClear}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.safe} />
              <Text style={styles.allClearText}>No harmful chemicals detected!</Text>
            </View>
          ) : (
            <View style={styles.hazardList}>
              {report.hazards.map((hazard, index) => (
                <View key={index} style={styles.hazardCard}>
                  <View style={styles.hazardHeader}>
                    <Text style={styles.hazardChemical}>{hazard.chemical}</Text>
                    <View style={[styles.riskBadge, { backgroundColor: hazard.riskLevel === 'High Risk' ? Colors.avoid : Colors.caution }]}>
                      <Text style={styles.riskBadgeText}>{hazard.riskLevel}</Text>
                    </View>
                  </View>
                  <Text style={styles.hazardReason}>{hazard.reason}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <AdBanner />
    </View>
  );
}

const styles = StyleSheet.create({
  // Notebook style container with parchment background
  container: { flex: 1, backgroundColor: '#fdf5e6' },
  // Centered loading/error container retains background
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fdf5e6' },
  loadingText: { fontFamily: Fonts.medium, color: Colors.textSecondary, marginTop: Spacing.md },
  errorText: { fontFamily: Fonts.medium, color: Colors.text, fontSize: 16, marginVertical: Spacing.md },
  backButton: { fontFamily: Fonts.bold, color: Colors.white, backgroundColor: Colors.surface, padding: Spacing.md, borderRadius: Radius.md, overflow: 'hidden' },
  // Add a subtle parchment texture to scroll view
  scroll: { paddingBottom: Spacing.xxl, backgroundColor: '#fdf5e6' },

  // Header mimics a notebook title block with a handwritten feel
  header: {
    padding: Spacing.lg,
    paddingTop: Spacing.xl,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: '#d4a373', // warm brown for notebook edge
    backgroundColor: '#fff8dc', // light cream for title area
  },
  verdictBadge: {
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  verdictText: {
    fontFamily: Fonts.extraBold,
    fontSize: 28,
    marginTop: 4,
    letterSpacing: 2,
  },
  summary: {
    fontFamily: Fonts.medium,
    fontSize: 16,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Content area uses lined paper effect via background image (placeholder) and handwritten font
  content: {
    padding: Spacing.lg,
    backgroundColor: '#fffaf0',
    // future: add backgroundImage: 'url(../assets/notebook_lines.png)'
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 18,
    color: Colors.text,
    marginBottom: Spacing.md,
    // optional underline to simulate notebook headings
    borderBottomWidth: 1,
    borderBottomColor: '#d4a373',
    paddingBottom: 4,
  },
  rawIngredientsText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    lineHeight: 20,
    color: Colors.textMuted,
    backgroundColor: Colors.bgCardLight,
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // All clear box styled like a notebook sticky note
  allClear: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6ffe6', // light green sticky note
    padding: Spacing.md,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.safe,
    borderStyle: 'dashed',
  },
  allClearText: {
    fontFamily: Fonts.semiBold,
    color: Colors.safeFg,
    marginLeft: Spacing.sm,
  },

  hazardList: {
    gap: Spacing.md,
  },
  // Hazard cards get a notebook margin note look
  hazardCard: {
    backgroundColor: '#fff8e1', // soft yellow paper
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.avoid,
    borderStyle: 'dashed',
  },
  hazardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  hazardChemical: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.text,
    flex: 1,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  riskBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  hazardReason: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
