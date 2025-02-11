import { useMemo } from 'react';
import { QRGeneratorForm } from './QRGeneratorForm';
import { QRGeneratorStages } from './QRGeneratorStages';
import CollapsibleSection from '../common/CollapsibleSection';
import { useQRGeneration } from '../../hooks/useQRGeneration';

export function QRGenerator() {
  const {
    qrData,
    currentStage,
    isGenerating,
    setCurrentStage,
    generateQRCode,
    getMatrixForStage,
    exportQRCodeImage
  } = useQRGeneration();

  const currentMatrix = useMemo(() => getMatrixForStage(currentStage), [qrData, currentStage]);
  const previousMatrix = useMemo(
    () => currentStage > 0 ? getMatrixForStage(currentStage - 1) : null,
    [qrData, currentStage]
  );

  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-y-4">
      <div className="bg-white rounded-xl p-6 mb-4 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Generate QR Code</h2>
        <QRGeneratorForm
          onGenerate={generateQRCode}
          isGenerating={isGenerating}
        />
      </div>

      {qrData && (
        <>
          <QRGeneratorStages
            currentStage={currentStage}
            setCurrentStage={setCurrentStage}
            currentMatrix={currentMatrix}
            previousMatrix={previousMatrix}
            size={qrData.size}
            onExport={exportQRCodeImage}
          />

          <CollapsibleSection title="Debug Logs">
            <div>
              <h4 className="font-bold mb-1">QR Generation Debug Logs</h4>
              <pre className="text-xs font-mono overflow-x-auto bg-gray-100 p-2 rounded">
                {qrData.debug_logs}
              </pre>
            </div>
          </CollapsibleSection>
        </>
      )}
    </div>
  );
} 