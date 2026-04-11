import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Animated } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Fonts, Spacing, Radius } from '../theme';
import { identifyPlant } from '../api/plantApi';
import { analyzeToxins } from '../api/toxinApi';

type RootStackParamList = {
  Scan: undefined;
  ProductDetail: { barcode: string };
  PlantDetail: { plantId: string };
  ToxinDetail: { reportId: string };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Scan'>;
type ScanMode = 'barcode' | 'plant' | 'toxins';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [mode, setMode] = useState<ScanMode>('barcode');
  const [processing, setProcessing] = useState(false);
  const [zoom, setZoom] = useState(0);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const navigation = useNavigation<NavigationProp>();
  const isFocused = useIsFocused();
  const cameraRef = useRef<CameraView>(null);
  const scanAnim = useRef(new Animated.Value(0)).current;

  const animatedStyle = {
    opacity: scanAnim,
    transform: [{ scale: scanAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) }],
  };

  if (!permission) {
    return <View style={styles.centerContainer}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-outline" size={64} color={Colors.ink} style={{ marginBottom: Spacing.md }} />
        <Text style={styles.textMessage}>Permission Required</Text>
        <Text style={styles.subtext}>Scan codes and identify plants</Text>
        <TouchableOpacity style={styles.grantBtnWrapper} onPress={requestPermission}>
          <Text style={styles.grantButton}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarcodeScanned = async (data: string) => {
    if (processing || mode !== 'barcode') return;
    setScannedCode(data);
    setProcessing(true);
    Animated.sequence([
      Animated.timing(scanAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.delay(800),
      Animated.timing(scanAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start();
    let photoBase64: string | undefined;
    try {
      const photo = await cameraRef.current?.takePictureAsync({ quality: 0.3, base64: true });
      photoBase64 = photo?.base64;
    } catch (e) { console.warn('Snapshot failed', e); }
    setTimeout(() => {
      navigation.navigate('ProductDetail', { barcode: data, imageUri: photoBase64 } as any);
      setProcessing(false);
      setScannedCode(null);
    }, 1200);
  };

  const handleCaptureImage = async () => {
    if (processing || !cameraRef.current || mode === 'barcode') return;
    setProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.5, base64: true });
      if (!photo || !photo.base64) throw new Error('Failed to take photo');
      if (mode === 'plant') {
        const plant = await identifyPlant(photo.base64);
        navigation.navigate('PlantDetail', { plantId: plant.id });
      } else if (mode === 'toxins') {
        const report = await analyzeToxins(photo.base64);
        navigation.navigate('ToxinDetail', { reportId: report.id });
      }
    } catch (e) { console.warn('Image Analysis failed', e); }
    finally { setProcessing(false); }
  };

  return (
    <View style={styles.container}>
      {isFocused && (
        <View style={StyleSheet.absoluteFillObject}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFillObject}
            zoom={zoom}
            onBarcodeScanned={mode === 'barcode' && !processing ? (event) => { if (!processing) handleBarcodeScanned(event.data); } : undefined}
            barcodeScannerSettings={{ barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e', 'qr', 'code128', 'code39'] }}
          />
          <View style={styles.overlay} pointerEvents="box-none">
            <View style={styles.toggleContainer} pointerEvents="auto">
              <TouchableOpacity style={[styles.toggleBtn, mode === 'barcode' && styles.toggleActive]} onPress={() => setMode('barcode')}>
                <Ionicons name="barcode-outline" size={20} color={mode === 'barcode' ? Colors.white : Colors.textMuted} />
                <Text style={[styles.toggleText, mode === 'barcode' && styles.toggleTextActive]}>Barcode</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, mode === 'plant' && styles.toggleActive]} onPress={() => setMode('plant')}>
                <Ionicons name="leaf-outline" size={20} color={mode === 'plant' ? Colors.white : Colors.textMuted} />
                <Text style={[styles.toggleText, mode === 'plant' && styles.toggleTextActive]}>Grow ID</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.toggleBtn, mode === 'toxins' && styles.toggleActive]} onPress={() => setMode('toxins')}>
                <Ionicons name="warning-outline" size={20} color={mode === 'toxins' ? Colors.white : Colors.textMuted} />
                <Text style={[styles.toggleText, mode === 'toxins' && styles.toggleTextActive]}>Toxins</Text>
              </TouchableOpacity>
            </View>
            {processing ? (
              <View style={styles.processingContainer}>
                <ActivityIndicator size="large" color={mode === 'barcode' ? Colors.primary : Colors.accentGreen} />
                <Text style={styles.processingText}>
                  {mode === 'barcode' ? 'Looking up product...' : mode === 'plant' ? 'Analyzing cannabis morphology...' : 'Scanning for safety hazards...'}
                </Text>
              </View>
            ) : mode === 'barcode' ? (
              <View style={styles.overlayContent} pointerEvents="none">
                <View style={styles.scanTarget}>
                  <View style={[styles.corner, styles.topLeft]} />
                  <View style={[styles.corner, styles.topRight]} />
                  <View style={[styles.corner, styles.bottomLeft]} />
                  <View style={[styles.corner, styles.bottomRight]} />
                </View>
                <Text style={styles.instruction}>Align barcode inside the frame</Text>
              </View>
            ) : (
              <View style={styles.overlayContent} pointerEvents="box-none">
                <View style={[styles.scanTarget, styles.plantTarget]} pointerEvents="none">
                  <Ionicons name="scan-outline" size={150} color="rgba(255,255,255,0.3)" />
                </View>
                <Text style={styles.instruction} pointerEvents="none">
                  {mode === 'plant' ? 'Point at whole plant — detects Sativa / Indica / Hybrid' : 'Capture text on an ingredient label'}
                </Text>
                <View pointerEvents="auto" style={{ position: 'absolute', bottom: 50 }}>
                  <TouchableOpacity style={styles.captureButtonOuter} onPress={handleCaptureImage}>
                    <View style={styles.captureButtonInner} />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            {scannedCode && (
              <Animated.View style={[styles.scanSticker, animatedStyle]}>
                <Ionicons name="checkmark-circle" size={40} color={Colors.white} />
                <Text style={styles.stickerTitle}>CODE CAPTURED</Text>
                <Text style={styles.stickerCode}>{scannedCode}</Text>
              </Animated.View>
            )}
            <View style={styles.zoomContainer}>
              <TouchableOpacity onPress={() => setZoom(Math.min(zoom + 0.1, 1))} style={styles.zoomBtn}>
                <Ionicons name="add" size={24} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.zoomDivider} />
              <TouchableOpacity onPress={() => setZoom(Math.max(zoom - 0.1, 0))} style={styles.zoomBtn}>
                <Ionicons name="remove" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.zoomText}>{Math.round(zoom * 100)}%</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.bg, padding: Spacing.xl },
  textMessage: { fontFamily: Fonts.bold, textAlign: 'center', fontSize: 20, color: Colors.ink, marginBottom: Spacing.sm },
  subtext: { fontFamily: Fonts.regular, textAlign: 'center', fontSize: 16, color: Colors.ink, marginBottom: Spacing.xl },
  grantBtnWrapper: { marginTop: Spacing.md },
  grantButton: { backgroundColor: Colors.highlightBrown, color: Colors.white, fontFamily: Fonts.medium, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, borderRadius: Radius.full, overflow: 'hidden' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
  overlayContent: { flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center' },
  toggleContainer: { position: 'absolute', top: 50, flexDirection: 'row', backgroundColor: 'rgba(20,20,40,0.9)', borderRadius: Radius.full, padding: 6, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', zIndex: 100 },
  toggleBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, paddingHorizontal: 12, borderRadius: Radius.full },
  toggleActive: { backgroundColor: Colors.surface },
  toggleText: { fontFamily: Fonts.medium, color: Colors.textMuted, marginLeft: 6, fontSize: 13 },
  toggleTextActive: { color: Colors.white, fontFamily: Fonts.bold },
  scanTarget: { width: 250, height: 150, backgroundColor: 'transparent' },
  plantTarget: { width: 250, height: 350, justifyContent: 'center', alignItems: 'center' },
  corner: { position: 'absolute', width: 20, height: 20, borderColor: Colors.accentGreen },
  topLeft: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 12 },
  topRight: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 12 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 12 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 12 },
  instruction: { fontFamily: Fonts.medium, color: Colors.white, fontSize: 16, marginTop: Spacing.xl, backgroundColor: 'rgba(0,0,0,0.5)', paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: Radius.md, overflow: 'hidden', textAlign: 'center' },
  captureButtonOuter: { position: 'absolute', bottom: 50, width: 70, height: 70, borderRadius: 35, borderWidth: 4, borderColor: Colors.white, justifyContent: 'center', alignItems: 'center' },
  captureButtonInner: { width: 54, height: 54, borderRadius: 27, backgroundColor: Colors.white },
  processingContainer: { alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)', padding: Spacing.xl, borderRadius: Radius.lg },
  processingText: { fontFamily: Fonts.bold, color: Colors.white, marginTop: Spacing.md, fontSize: 16 },
  zoomContainer: { position: 'absolute', right: 20, top: '35%', backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: Radius.md, padding: 10, alignItems: 'center', gap: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  zoomBtn: { padding: 8 },
  zoomDivider: { width: 20, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  zoomText: { fontFamily: Fonts.bold, color: Colors.white, fontSize: 10, marginTop: 4 },
  scanSticker: { position: 'absolute', backgroundColor: 'rgba(0,0,0,0.85)', padding: 30, borderRadius: Radius.lg, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.accentGreen },
  stickerTitle: { fontFamily: Fonts.bold, color: Colors.white, marginTop: 10, fontSize: 18, letterSpacing: 2 },
  stickerCode: { fontFamily: Fonts.handwritten, color: Colors.accentGreen, fontSize: 24, marginTop: 6 },
});
