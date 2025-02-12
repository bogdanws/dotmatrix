import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PrimaryButton from '../common/PrimaryButton';
import { ToggleSwitch } from '../common/ToggleSwitch';
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
  const [customVersionEnabled, setCustomVersionEnabled] = useState(false);
  const [version, setVersion] = useState<number>(-1);
  const [errorCorrection, setErrorCorrection] = useState<ErrorCorrectionLevel>('L');
  const [mask, setMask] = useState<number>(-1);
  const [mode, setMode] = useState<QRMode>('auto');

  const handleSubmit = () => {
    onGenerate({
      text,
      errorCorrection,
      version: customVersionEnabled ? version : -1,
      mask,
      mode,
    });
  };

  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Text to encode
        </label>
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

      <AnimatePresence>
        {advancedOptionsVisible && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden"
          >
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                QR Code Version
              </label>
              <div className="flex flex-col md:flex-row md:items-center md:gap-4 mb-2">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">Auto</span>
                  <ToggleSwitch 
                    checked={customVersionEnabled} 
                    onToggle={(newValue) => { 
                      setCustomVersionEnabled(newValue); 
                      setVersion(newValue ? 1 : -1);
                    }} 
                    id="version-toggle" 
                  />
                  <span className="text-gray-600">Custom</span>
                </div>
                {customVersionEnabled && (
                  <input
                    type="number"
                    value={version}
                    onChange={(e) => setVersion(Number(e.target.value) || 1)}
                    className="mt-2 md:mt-0 p-3 w-full md:w-auto bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
                    min={1}
                    max={40}
                    placeholder="Enter version (1-40)"
                  />
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Determine the QR code's size and capacity. Use auto for optimal version or custom for manual selection.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">
                Error Correction
              </label>
              <select
                value={errorCorrection}
                onChange={(e) => setErrorCorrection(e.target.value as ErrorCorrectionLevel)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {ERROR_CORRECTION_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">A higher error correction level improves QR code resilience but reduces capacity.</p>
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
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Select a mask pattern to optimize contrast or choose auto for default masking.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Mode</label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as QRMode)}
                className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {QR_MODES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Choose the encoding mode; auto mode selects the best based on your input text.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <PrimaryButton onClick={handleSubmit} disabled={isGenerating || !text}>
        {isGenerating ? 'Generating...' : 'Generate QR'}
      </PrimaryButton>
    </div>
  );
}