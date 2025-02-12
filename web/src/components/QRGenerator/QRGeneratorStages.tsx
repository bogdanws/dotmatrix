import { useMemo, useEffect } from 'react';
import { FaLongArrowAltLeft, FaLongArrowAltRight } from 'react-icons/fa';
import IconButton from '../common/IconButton';
import StageButton from '../common/StageButton';
import PrimaryButton from '../common/PrimaryButton';
import AnimatedQRCanvas from '../common/AnimatedQRCanvas';
import { QRMatrix } from '../../types/qr';
import { GENERATOR_STAGES, CANVAS_RENDER_THRESHOLD } from '../../constants/qr';
import ModuleCell from '../common/ModuleCell';

interface QRGeneratorStagesProps {
  currentStage: number;
  setCurrentStage: (stage: number) => void;
  currentMatrix: QRMatrix | null;
  previousMatrix: QRMatrix | null;
  size: number;
  onExport?: () => void;
}

export function QRGeneratorStages({
  currentStage,
  setCurrentStage,
  currentMatrix,
  previousMatrix,
  size,
  onExport
}: QRGeneratorStagesProps) {
  const hasNoChange = useMemo(
    () => previousMatrix && currentMatrix && 
          JSON.stringify(previousMatrix.modules) === JSON.stringify(currentMatrix.modules),
    [previousMatrix, currentMatrix]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && currentStage > 0) {
        setCurrentStage(currentStage - 1);
      } else if (e.key === 'ArrowRight' && currentStage < GENERATOR_STAGES.length - 1) {
        setCurrentStage(currentStage + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStage, setCurrentStage]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl p-6 shadow-xl h-fit">
        <h3 className="text-xl font-semibold mb-6 text-center text-gray-900">Generation Stages</h3>
        <div className="flex flex-col gap-y-1">
          {GENERATOR_STAGES.map((stage, index) => (
            <StageButton
              key={stage}
              active={currentStage === index}
              isLast={index === GENERATOR_STAGES.length - 1}
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
            {GENERATOR_STAGES[currentStage]}
          </h3>
          <IconButton
            onClick={() => currentStage < GENERATOR_STAGES.length - 1 && setCurrentStage(currentStage + 1)}
            disabled={currentStage === GENERATOR_STAGES.length - 1}
          >
            <FaLongArrowAltRight />
          </IconButton>
        </div>

        {currentMatrix && (
          size > CANVAS_RENDER_THRESHOLD ? (
            <AnimatedQRCanvas matrix={currentMatrix} size={size} />
          ) : (
            <div
              className="grid gap-0 bg-white p-4 rounded-lg mt-4 aspect-square"
              style={{ 
                gridTemplateColumns: `repeat(${size}, 1fr)`,
                gridTemplateRows: `repeat(${size}, 1fr)`
              }}
            >
              {currentMatrix.modules.map((row, i) =>
                row.map((cell, j) => (
                  <div key={`${i}-${j}`} className="aspect-square">
                    <ModuleCell cell={!!cell} />
                  </div>
                ))
              )}
            </div>
          )
        )}

        {hasNoChange && (
          <p className="mt-2 text-center text-sm text-gray-600">
            No modules have changed in this step
          </p>
        )}

        {currentStage === GENERATOR_STAGES.length - 1 && onExport && (
          <PrimaryButton className="mt-4" onClick={onExport}>
            Export as Image
          </PrimaryButton>
        )}
      </div>
    </div>
  );
} 