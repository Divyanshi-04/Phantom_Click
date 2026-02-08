import { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateForensicReport } from '../../lib/apiClient';
import { FileCheck, Shield, AlertTriangle, Download, Database, Activity, ChevronLeft } from 'lucide-react';

const ForensicReport = ({ stage1Data, stage2Data, stage3Data }) => {
  console.log('Stage1Data:', stage1Data);
  console.log('Stage2Data:', stage2Data);
  console.log('Stage3Data:', stage3Data);

  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = async () => {
    console.log('Generating report with data:', { stage1: stage1Data, stage2: stage2Data, stage3: stage3Data });

    if (stage3Data?.verdict?.riskLevel !== 'CRITICAL') {
      setError('Report requires CRITICAL risk level');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateForensicReport({
        stage1: stage1Data,
        stage2: stage2Data,
        stage3: stage3Data
      });
      console.log('Report generated:', data);
      setReport(data);
    } catch (err) {
      console.log('Error generating report:', err);
      setError('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0f2f35]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-200/20 rounded-full blur-3xl"></div>
      </div>

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          {/* Left — Back */}
          <Link
            to="/replay"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#c74343] transition"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Scam Replay
          </Link>

          {/* Right — Info badge */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-3xl bg-red-50 border border-red-200">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-sm font-medium text-red-700">Critical Threat Analysis</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-16 pb-8 relative">
        {/* Title Section */}
        <div className="text-center mb-16">
          <div className="relative">
            {/* Heading row */}
            <div className="flex items-center justify-center gap-3 mb-4">
              {/* Left icons */}
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>

              <div className="p-2 rounded-lg bg-orange-50 border border-orange-200 shadow-sm hover:shadow-md transition-shadow ml-2">
                <Shield className="w-4 h-4 text-orange-600" />
              </div>

              {/* Title with subtle glow */}
              <h1 className="text-4xl font-semibold text-[#0f2f35] px-2 ml-5 mr-5 relative">
                Forensic Report
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#c74343] to-transparent rounded-full" />
              </h1>

              {/* Right icons */}
              <div className="p-2 rounded-lg bg-yellow-50 border border-yellow-200 shadow-sm hover:shadow-md transition-shadow mr-2">
                <FileCheck className="w-4 h-4 text-yellow-600" />
              </div>

              <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm hover:shadow-md transition-shadow">
                <Database className="w-5 h-5 text-red-600" />
              </div>
            </div>

            <p className="text-lg text-[#c74343] mt-5 max-w-xl mx-auto flex items-center justify-center gap-2">
              <Activity className="w-4 h-4" />
              Comprehensive threat documentation
              <span className="text-[#e67373]">•</span>
              Legal evidence format
              <FileCheck className="w-4 h-4" />
            </p>
          </div>
        </div>

        {/* Data Preview Cards */}
        <div className="max-w-4xl mx-auto mb-8">
          <h3 className="text-lg font-semibold mb-4 text-[#0f2f35]">Analysis Data Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 bg-blue-50 rounded-xl border border-blue-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-blue-900 mb-2">Stage 1: Collection</h4>
              <p className="text-sm text-blue-700">URLs Extracted: {stage1Data?.extracted_urls?.length || 0}</p>
            </div>
            <div className="p-6 bg-green-50 rounded-xl border border-green-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-green-900 mb-2">Stage 2: Analysis</h4>
              <p className="text-sm text-green-700">Threat Score: {stage2Data?.overall_threat_score || 'N/A'}</p>
            </div>
            <div className="p-6 bg-red-50 rounded-xl border border-red-200 shadow-sm hover:shadow-md transition-shadow">
              <h4 className="font-semibold text-red-900 mb-2">Stage 3: Verdict</h4>
              <p className="text-sm text-red-700">Risk Level: {stage3Data?.verdict?.riskLevel || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        {!report && (
          <div className="max-w-2xl mx-auto">
            <button
              onClick={handleGenerate}
              disabled={loading || stage3Data?.verdict?.riskLevel !== 'CRITICAL'}
              className="w-full bg-[#c74343] text-white py-4 rounded-lg font-semibold text-lg shadow hover:opacity-95 disabled:bg-gray-300 transition flex items-center justify-center gap-2"
            >
              <FileCheck className="w-5 h-5" />
              {loading ? 'Generating Forensic Report...' : 'Generate Forensic Report'}
            </button>
            {stage3Data?.verdict?.riskLevel !== 'CRITICAL' && (
              <p className="text-center text-red-600 mt-4">
                ⚠️ Forensic reports are only available for CRITICAL risk level threats
              </p>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-50 bg-white/70 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-6">
              <div className="w-14 h-14 border-4 border-[#c74343]/20 border-t-[#c74343] rounded-full animate-spin" />
              <p className="text-[#c74343] font-medium text-lg">
                Compiling forensic documentation…
              </p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 font-medium">⚠️ {error}</p>
          </div>
        )}

        {/* Report Success */}
        {report && (
          <div className="max-w-2xl mx-auto mt-8 p-8 bg-green-50 rounded-xl border border-green-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-8 h-8 text-green-600" />
              <h3 className="text-xl font-semibold text-green-900">Report Generated Successfully!</h3>
            </div>
            <p className="text-green-700 mb-6">
              Case ID: <span className="font-mono font-semibold">{report.caseId}</span>
            </p>
            
              <a
              href={`http://localhost:5000${report.downloadUrl}`}
              download
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-green-700 transition"
            >
              <Download className="w-5 h-5" />
              Download Forensic Report (PDF)
            </a>

          </div>
        )}

        {/* Footer Info */}
        <div className="mt-10 text-center text-base text-[#c74343] font-medium">
          <p>📋 Forensic reports include complete threat analysis and evidence for legal proceedings</p>
        </div>
      </div>
    </div>
  );
};

export default ForensicReport;