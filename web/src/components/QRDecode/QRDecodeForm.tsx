import { ChangeEvent } from 'react';
import PrimaryButton from '../common/PrimaryButton';

interface QRDecodeFormProps {
  onDecode: (file: File) => void;
  isDecoding: boolean;
  selectedFile: File | null;
  onFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export function QRDecodeForm({
  onDecode,
  isDecoding,
  selectedFile,
  onFileChange
}: QRDecodeFormProps) {
  return (
    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-1">
          Select QR Code Image
        </label>
        <input 
          type="file" 
          accept="image/*"
          onChange={onFileChange}
          className="w-full p-0 file:p-3 file:mr-4 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out shadow-sm hover:shadow-md"
        />
      </div>
      <PrimaryButton 
        onClick={() => selectedFile && onDecode(selectedFile)} 
        disabled={isDecoding || !selectedFile}
      >
        {isDecoding ? 'Decoding...' : 'Decode QR'}
      </PrimaryButton>
    </div>
  );
} 