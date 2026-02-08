import { useLocation } from 'react-router-dom';
import { useStage1 } from '../lib/useStage1';
import ForensicReport from '../components/Stage4_ForensicReport/ForensicReport';

const ForensicReportPage = () => {
  const location = useLocation();
  const { stage1Data, stage2Data, stage3Data } = useStage1();
  const { stage1, stage2, stage3 } = location.state || {};

  // Use context data, fallback to state
  const finalStage1 = stage1Data || stage1 || { extracted_urls: ['https://example.com'] };
  const finalStage2 = stage2Data || stage2 || { overall_threat_score: 95 };
  const finalStage3 = stage3Data || stage3 || { verdict: { riskLevel: 'CRITICAL' } };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto ">
        <ForensicReport 
          stage1Data={finalStage1} 
          stage2Data={finalStage2} 
          stage3Data={finalStage3} 
        />
      </div>
    </div>
  );
};

export default ForensicReportPage;