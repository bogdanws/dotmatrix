export interface QRResponse {
  intermediate_stages: {
    after_temporary_format_bits: QRMatrix;
    after_timing_patterns: QRMatrix;
    after_finder_patterns: QRMatrix;
    after_alignment_patterns: QRMatrix;
    after_version_information: QRMatrix;
    after_data_placement: QRMatrix;
    final: QRMatrix;
  };
  version: number;
  error_correction: string;
  mask: number;
  size: number;
  debug_logs: string;
}

export interface QRMatrix {
  modules: number[][];
  isfunction: boolean[][];
}

export interface QRDecodeResponse {
  intermediate_stages: {
    initial_matrix: number[][];
    unmasked_matrix: number[][];
    version: number;
    format_information: { 
      error_correction: string;
      mask_pattern: number;
    };
    version_information: string;
    data_bits_extracted: number[];
    data_capacity: number;
    data_bits_trimmed: number[];
    decoded_text: string;
  };
  qr_image_debug_logs: string;
  qr_decode_debug_logs: string;
}

export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';
export type QRMode = 'auto' | 'numeric' | 'alphanumeric' | 'byte' | 'kanji';

export type QRStageContent = {
  type: 'matrix';
  data: QRMatrix;
} | {
  type: 'info';
  data: {
    version: number;
    errorCorrection: string;
    maskPattern: number;
    versionInformation: string;
    dataCapacity: number;
    dataBitsExtracted: number[];
    dataBitsTrimmed: number[];
  };
} | {
  type: 'text';
  data: string;
} | null; 