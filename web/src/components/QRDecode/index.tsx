import { useState, ChangeEvent } from 'react';
import { QRDecodeForm } from './QRDecodeForm';
import { QRDecodeStages } from './QRDecodeStages';
import CollapsibleSection from '../common/CollapsibleSection';
import { useQRDecode } from '../../hooks/useQRDecode';

export function QRDecode() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const {
    decodeData,
    currentStage,
    isDecoding,
    setCurrentStage,
    decodeQRCode,
    getStageContent
  } = useQRDecode();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-4 mt-8">
      <div className="bg-white rounded-xl p-6 mb-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Decode QR Code</h2>
        <QRDecodeForm
          onDecode={decodeQRCode}
          isDecoding={isDecoding}
          selectedFile={selectedFile}
          onFileChange={handleFileChange}
        />
      </div>

      {decodeData && (
        <>
          <QRDecodeStages
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            stageContent={getStageContent()}
          />

          <CollapsibleSection title="Debug Logs">
            <div>
              <h4 className="font-bold mb-1">QR Image Debug Logs</h4>
              <pre className="text-xs font-mono overflow-x-auto bg-gray-100 p-2 rounded">
                {decodeData.qr_image_debug_logs}
              </pre>
            </div>
            <div>
              <h4 className="font-bold mb-1">QR Decode Debug Logs</h4>
              <pre className="text-xs font-mono overflow-x-auto bg-gray-100 p-2 rounded">
                {decodeData.qr_decode_debug_logs}
              </pre>
            </div>
          </CollapsibleSection>
        </>
      )}
    </div>
  );
} 