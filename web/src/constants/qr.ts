export const GENERATOR_STAGES = [
  'Format Bits',
  'Timing Patterns',
  'Finder Patterns',
  'Alignment Patterns',
  'Version Information',
  'Data Placement',
  'Final QR Code'
] as const;

export const DECODE_STAGES = [
  'Initial Matrix',
  'Unmasked Matrix',
  'Intermediate Info',
  'Decoded Text'
] as const;

export const ERROR_CORRECTION_LEVELS = ['L', 'M', 'Q', 'H'] as const;

export const QR_MODES = [
  { value: 'auto', label: 'Auto' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'alphanumeric', label: 'Alphanumeric' },
  { value: 'byte', label: 'Byte' },
  { value: 'kanji', label: 'Kanji' }
] as const;

export const CANVAS_RENDER_THRESHOLD = 50; // Size threshold for switching to canvas rendering 