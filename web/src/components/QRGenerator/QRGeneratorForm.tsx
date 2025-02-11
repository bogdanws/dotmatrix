import { useState } from 'react';
import PrimaryButton from '../common/PrimaryButton';
import { ErrorCorrectionLevel, QRMode } from '../../types/qr';
import { ERROR_CORRECTION_LEVELS, QR_MODES } from '../../constants/qr';

interface QRGeneratorFormProps {
  onGenerate: (params: {
    text: string;
    errorCorrection: ErrorCorrectionLevel;
    version: number;
    mask: number;
    mode: QRMode;
  }) => void;
  isGenerating: boolean;
}

export function QRGeneratorForm({ onGenerate, isGenerating }: QRGeneratorFormProps) {
  const [text, setText] = useState('');
  const [advancedOptionsVisible, setAdvancedOptionsVisible] = useState(false);
  const [version, setVersion] = useState<number>(-1);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('L');
  const [mask, setMask] = useState<number>(-1);
  const [mode, setMode] = useState<QRMode>('auto');

  const handleSubmit = () => {
    onGenerate({
      text,
      errorCorrection,
      version,
      mask,
      mode
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">Text to encode</label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to encode"
          className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
        />
      </div>

      <button
        onClick={() => setAdvancedOptionsVisible(!advancedOptionsVisible)}
        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 hover:bg-gray-200 transition-all text-sm font-medium"
      >
        {advancedOptionsVisible ? 'Hide advanced options ↑' : 'Show advanced options ↓'}
      </button>

      {advancedOptionsVisible && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Version</label>
            <select
              value={version}
              onChange={(e) => setVersion(Number(e.target.value))}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={-1}>Auto</option>
              {Array.from({ length: 40 }, (_, i) => i + 1).map((v) => (
                <option key={v} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Error Correction</label>
            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {ERROR_CORRECTION_LEVELS.map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Mask</label>
            <select
              value={mask}
              onChange={(e) => setMask(Number(e.target.value))}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={-1}>Auto</option>
              {Array.from({ length: 8 }, (_, i) => i).map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">Mode</label>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as QRMode)}
              className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {QR_MODES.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <PrimaryButton onClick={handleSubmit} disabled={isGenerating || !text}>
        {isGenerating ? 'Generating...' : 'Generate QR'}
      </PrimaryButton>
    </div>
  );
} 