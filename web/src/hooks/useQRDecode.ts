import { useState } from 'react';
import { decodeQR } from '../tools/api';
import { QRDecodeResponse, QRStageContent } from '../types/qr';
import { DECODE_STAGES } from '../constants/qr';

export function useQRDecode() {
  const [decodeData, setDecodeData] = useState<QRDecodeResponse | null>(null);
  const [currentStage, setCurrentStage] = useState(0);
  const [isDecoding, setIsDecoding] = useState(false);

  const decodeQRCode = async (file: File) => {
    try {
      setIsDecoding(true);
      setDecodeData(null);
      setCurrentStage(0);

      const data = await decodeQR(file);
      setDecodeData(data);
    } catch (error) {
      console.error('Error decoding QR code:', error);
      throw error;
    } finally {
      setIsDecoding(false);
    }
  };

  const getStageContent = (): QRStageContent => {
    if (!decodeData) return null;

    switch (currentStage) {
      case 0: {
        const matrix = decodeData.intermediate_stages.initial_matrix;
        return {
          type: 'matrix' as const,
          data: {
            modules: matrix,
            isfunction: matrix.map(row => row.map(() => false))
          }
        };
      }
      case 1: {
        const matrix = decodeData.intermediate_stages.unmasked_matrix;
        return {
          type: 'matrix' as const,
          data: {
            modules: matrix,
            isfunction: matrix.map(row => row.map(() => false))
          }
        };
      }
      case 2:
        return {
          type: 'info' as const,
          data: {
            version: decodeData.intermediate_stages.version,
            errorCorrection: decodeData.intermediate_stages.format_information.error_correction,
            maskPattern: decodeData.intermediate_stages.format_information.mask_pattern,
            versionInformation: decodeData.intermediate_stages.version_information,
            dataCapacity: decodeData.intermediate_stages.data_capacity,
            dataBitsExtracted: decodeData.intermediate_stages.data_bits_extracted,
            dataBitsTrimmed: decodeData.intermediate_stages.data_bits_trimmed
          }
        };
      case 3:
        return {
          type: 'text' as const,
          data: decodeData.intermediate_stages.decoded_text
        };
      default:
        return null;
    }
  };

  return {
    decodeData,
    currentStage,
    isDecoding,
    setCurrentStage,
    decodeQRCode,
    getStageContent,
    maxStage: DECODE_STAGES.length - 1
  };
} 