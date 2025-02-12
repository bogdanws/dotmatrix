import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import IconButton from '../common/IconButton';
import StageButton from '../common/StageButton';
import AnimatedQRCanvas from '../common/AnimatedQRCanvas';
import { DECODE_STAGES } from '../../constants/qr';
import { QRStageContent } from '../../types/qr';
import { useEffect } from 'react';

interface QRDecodeStagesProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  stageContent: QRStageContent;
}

export function QRDecodeStages({
  currentStage,
  setCurrentStage,
  stageContent
}: QRDecodeStagesProps) {
  const renderStageContent = () => {
    if (!stageContent) return null;

    switch (stageContent.type) {
      case 'matrix':
        return (
          <AnimatedQRCanvas
            matrix={stageContent.data}
            size={stageContent.data.modules.length}
          />
        );
      case 'info':
        return (
          <div className="p-4 space-y-2">
            <div><strong>QR Version:</strong> {stageContent.data.version}</div>
            <div><strong>Error Correction:</strong> {stageContent.data.errorCorrection}</div>
            <div><strong>Mask Pattern:</strong> {stageContent.data.maskPattern}</div>
            <div><strong>Version Information:</strong> {stageContent.data.versionInformation}</div>
            <div><strong>Data Capacity:</strong> {stageContent.data.dataCapacity}</div>
            <div>
              <strong>Data Bits Extracted:</strong>
              <div className="max-h-[200px] overflow-y-auto bg-gray-100 p-2 rounded break-words">
                {stageContent.data.dataBitsExtracted}
              </div>
            </div>
            <div>
              <strong>Data Bits Trimmed:</strong>
              <div className="max-h-[200px] overflow-y-auto bg-gray-100 p-2 rounded break-words">
                {stageContent.data.dataBitsTrimmed}
              </div>
            </div>
          </div>
        );
      case 'text':
        return (
          <p className="text-lg break-words bg-blue-50 p-2 rounded">{stageContent.data}</p>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentStage > 0) {
        setCurrentStage(currentStage - 1);
      } else if (e.key === 'ArrowRight' && currentStage < DECODE_STAGES.length - 1) {
        setCurrentStage(currentStage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStage, setCurrentStage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-xl h-fit">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">Matrix Stages</h3>
        <div className="flex flex-col gap-y-1">
          {DECODE_STAGES.map((stage, index) => (
            <StageButton
              key={stage}
              active={currentStage === index}
              isLast={index === DECODE_STAGES.length - 1}
              onClick={() => setCurrentStage(index)}
            >
              {stage}
            </StageButton>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <IconButton
            onClick={() => currentStage > 0 && setCurrentStage(currentStage - 1)}
            disabled={currentStage === 0}
          >
            <FaLongArrowAltLeft />
          </IconButton>
          <h3 className="text-xl font-semibold text-center text-gray-900">
            {DECODE_STAGES[currentStage]}
          </h3>
          <IconButton
            onClick={() => currentStage < DECODE_STAGES.length - 1 && setCurrentStage(currentStage + 1)}
            disabled={currentStage === DECODE_STAGES.length - 1}
          >
            <FaLongArrowAltRight />
          </IconButton>
        </div>
        {renderStageContent()}
      </div>
    </div>
  );
} 