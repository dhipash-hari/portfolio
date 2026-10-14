import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CyberOpsGame } from '../components/cyberops/CyberOpsGame';
import { CustomCursor } from '../components/common/CustomCursor';

export const CyberOpsPage: React.FC = () => {
  const navigate = useNavigate();

  const handleReturn = () => {
    navigate('/#motion-lab');
  };

  return (
    <div className="min-h-screen bg-[#04060B] text-zinc-100 flex flex-col justify-center items-center p-4 sm:p-8 font-mono select-none relative overflow-x-hidden">
      <CustomCursor />
      <div className="w-full max-w-6xl">
        <CyberOpsGame onExit={handleReturn} initialTheaterMode={false} />
      </div>
    </div>
  );
};

export default CyberOpsPage;
