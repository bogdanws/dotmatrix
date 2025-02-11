import { useState } from 'react';
import { generateQR } from '../tools/api';
import { QRResponse, ErrorCorrectionLevel, QRMode, QRMatrix } from '../types/qr';
import { GENERATOR_STAGES } from '../constants/qr';

interface UseQRGenerationProps {
  text: string;
  errorCorrection: ErrorCorrectionLevel;
  version: number;
  mask: number;
  mode: QRMode;
}

export function useQRGeneration() {
  const [qrData, setQrData] = useState<QRResponse | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateQRCode = async ({
    text,
    errorCorrection,
    version,
    mask,
    mode
  }: UseQRGenerationProps) => {
    try {
      setIsGenerating(true);
      setCurrentStage(0);

      const data = await generateQR(text, errorCorrection, version, mask, mode);
      setQrData(data);
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  const getMatrixForStage = (stage: number): QRMatrix | null => {
    if (!qrData) return null;
    switch (stage) {
      case 0:
        return qrData.intermediate_stages.after_temporary_format_bits;
      case 1:
        return qrData.intermediate_stages.after_timing_patterns;
      case 2:
        return qrData.intermediate_stages.after_finder_patterns;
      case 3:
        return qrData.intermediate_stages.after_alignment_patterns;
      case 4:
        return qrData.intermediate_stages.after_version_information;
      case 5:
        return qrData.intermediate_stages.after_data_placement;
      case 6:
        return qrData.intermediate_stages.final;
      default:
        return null;
    }
  };

  const exportQRCodeImage = () => {
    if (!qrData) return;
    const finalStage = qrData.intermediate_stages.final;
    const size = finalStage.modules.length;
    const scale = 10;
    const padding = 3;
    const canvas = document.createElement('canvas');
    canvas.width = (size + 2 * padding) * scale;
    canvas.height = (size + 2 * padding) * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const cellValue = finalStage.modules[i][j];
        ctx.fillStyle = cellValue ? '#000' : '#fff';
        ctx.fillRect((j + padding) * scale, (i + padding) * scale, scale, scale);
      }
    }

    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'qr-code.png';
    link.click();
  };

  return {
    qrData,
    currentStage,
    isGenerating,
    setCurrentStage,
    generateQRCode,
    getMatrixForStage,
    exportQRCodeImage,
    maxStage: GENERATOR_STAGES.length - 1
  };
} 