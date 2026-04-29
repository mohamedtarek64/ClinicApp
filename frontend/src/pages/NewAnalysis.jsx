import { useState, useEffect } from "react";
import { FaArrowLeft, FaCloudUploadAlt, FaFileMedical, FaDna, FaCheckCircle, FaSpinner, FaHeartbeat, FaInfo, FaArrowRight, FaShieldAlt, FaWaveSquare } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { aiService } from "../services/api";

export default function NewAnalysis() {
  const navigate = useNavigate();
  const [disease, setDisease] = useState("heart");
  const [formData, setFormData] = useState({});

  const diseaseOptions = [
    { id: "heart", name: "Heart Disease", icon: <FaHeartbeat /> },
    { id: "diabetes", name: "Diabetes", icon: <FaFileMedical /> },
    { id: "kidney", name: "Kidney Disease", icon: <FaStethoscope /> }
  ];

  const featureConfig = {
    heart: [
      { id: "HadAngina", label: "Chest Pain (Angina)?", type: "select", options: ["No", "Yes"] },
      { id: "BMI", label: "BMI (Body Mass Index)", type: "number", step: "0.1" },
      { id: "SmokerStatus", label: "Smoking Status", type: "select", options: ["Never smoked", "Former smoker", "Current smoker"] },
      { id: "AgeCategory", label: "Age Category", type: "select", options: ["Age 18 to 24", "Age 40 to 44", "Age 65 to 69"] }
    ],
    diabetes: [
      { id: "HbA1c_level", label: "HbA1c Level", type: "number", step: "0.1" },
      { id: "blood_glucose_level", label: "Blood Glucose Level", type: "number" },
      { id: "age", label: "Age", type: "number" },
      { id: "bmi", label: "BMI", type: "number", step: "0.1" }
    ],
    kidney: [
      { id: "bp", label: "Blood Pressure", type: "number" },
      { id: "sg", label: "Specific Gravity", type: "number", step: "0.001" },
      { id: "hemo", label: "Hemoglobin", type: "number", step: "0.1" }
    ]
  };

  const handleStartAnalysis = async () => {
    setIsScanning(true);
    setProgress(20);
    setError("");

    try {
      setProgress(50);
      
      // Merge user inputs with some safe defaults for the AI model
      const predictionData = {
        ...formData
      };

      const result = await aiService.predict(disease, predictionData);
      
      setProgress(90);
      setResultData(result);
      setTimeout(() => {
        setIsScanning(false);
        setShowResult(true);
      }, 800);

    } catch (err) {
      setError(err.detail || "AI Engine failed to process the request.");
      setIsScanning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-[#1A365D] font-sans selection:bg-[#3182CE] selection:text-white pb-10">
      
      {/* Soft Background Gradients */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-[120px] -z-10 opacity-60"></div>
      <div className="fixed bottom-0 left-0 w-[300px] h-[300px] bg-green-50 rounded-full blur-[100px] -z-10 opacity-60"></div>

      {/* Header - Minimal & Floating */}
      <header className="flex items-center justify-between p-6 max-w-4xl mx-auto">
        <button onClick={() => navigate("/home")} className="w-12 h-12 bg-white/70 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-sm border border-white/50 hover:bg-white transition-all text-[#2D3748]">
          <FaArrowLeft size={18} />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-extrabold tracking-tight text-[#2D3748]">New Analysis</h1>
          <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Healix AI Engine</p>
        </div>
        <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 border border-blue-500/20">
          <FaShieldAlt size={18} />
        </div>
      </header>

      <main className="max-w-xl mx-auto p-6 space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        {/* Step 1: Disease Selection */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5 relative group transition-all hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/30">1</div>
            <h2 className="text-sm font-bold opacity-70 uppercase tracking-wider">Select Target Analysis</h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {diseaseOptions.map(opt => (
              <button 
                key={opt.id}
                onClick={() => { setDisease(opt.id); setFormData({}); }}
                className={`flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all gap-2 ${disease === opt.id ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white/50 border-transparent text-slate-400 hover:bg-white'}`}
              >
                <div className="text-xl">{opt.icon}</div>
                <span className="text-[9px] font-black uppercase tracking-tighter">{opt.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 2: Biological Features */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 shadow-xl shadow-blue-900/5">
           <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-blue-500/30">2</div>
            <h2 className="text-sm font-bold opacity-70 uppercase tracking-wider">Biological Features</h2>
          </div>
          
          <div className="space-y-4">
            {featureConfig[disease].map(field => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{field.label}</label>
                {field.type === "select" ? (
                  <select 
                    className="w-full bg-white/60 border border-blue-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm text-blue-900 appearance-none"
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                  >
                    <option value="" disabled>Select Option</option>
                    {field.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : (
                  <input 
                    type="number"
                    step={field.step || "1"}
                    className="w-full bg-white/60 border border-blue-100 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-blue-500/5 transition-all font-bold text-sm text-blue-900"
                    placeholder={`Enter ${field.label}`}
                    value={formData[field.id] || ""}
                    onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                  />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Action Button */}
        <button 
          onClick={handleStartAnalysis}
          disabled={Object.keys(formData).length < featureConfig[disease].length || isScanning}
          className={`w-full py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-2xl ${ Object.keys(formData).length >= featureConfig[disease].length && !isScanning ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-blue-500/40 hover:scale-[1.02] active:scale-95' : 'bg-gray-300 text-white cursor-not-allowed shadow-none'}`}
        >
          {isScanning ? "Processing Analysis..." : "Start AI Engine"}
        </button>
        {error && <p className="text-red-500 text-[10px] font-black text-center mt-4 uppercase tracking-widest">{error}</p>}
      </main>

      {/* --- Loading Overlay (Techy & Clean) --- */}
      {isScanning && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center p-12">
          <div className="relative w-40 h-40">
             <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
             <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center">
                <FaDna className="text-blue-500 text-4xl animate-pulse" />
             </div>
          </div>
          <h2 className="mt-8 text-2xl font-black text-blue-900 tracking-tight">Healix AI</h2>
          <p className="text-sm font-bold text-blue-500/60 uppercase tracking-[0.4em] mt-2">Analyzing: {progress}%</p>
        </div>
      )}

      {/* --- Result Dashboard (Apple Style Cleanliness) --- */}
      {showResult && (
        <div className="fixed inset-0 bg-[#001529]/40 backdrop-blur-sm z-[110] flex items-center justify-center p-6">
          <div className="bg-white/95 backdrop-blur-2xl w-full max-w-lg rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-500 max-h-[90vh] overflow-y-auto">
            
            <div className="text-center mb-8">
               <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaFileMedical size={30} />
               </div>
               <h2 className="text-3xl font-black text-blue-900 tracking-tight">Diagnosis Ready</h2>
               <p className="text-sm text-blue-500/60 font-bold uppercase mt-1 tracking-widest italic">Report #HX-2026</p>
            </div>

            {/* Visual Health Card */}
            <div className={`bg-gradient-to-br ${resultData?.prediction === 1 ? 'from-red-600 to-red-400' : 'from-blue-600 to-blue-400'} rounded-3xl p-6 text-white mb-8 shadow-xl shadow-blue-500/30 flex justify-between items-center relative overflow-hidden group`}>
               <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase opacity-60">Risk Level</p>
                  <h3 className="text-4xl font-black italic">{resultData?.risk_level.toUpperCase()}</h3>
                  <p className="text-xs font-bold mt-2">{resultData?.label}</p>
               </div>
               <FaHeartbeat size={80} className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-700" />
            </div>

            {/* Metrics List */}
            <div className="space-y-4 mb-8">
               <ResultRow 
                 label="Prediction" 
                 value={resultData?.prediction === 1 ? "Positive" : "Negative"} 
                 status={resultData?.prediction === 1 ? "Concern" : "Healthy"} 
                 color={resultData?.prediction === 1 ? "text-red-500" : "text-green-500"} 
               />
               <ResultRow 
                 label="Probability" 
                 value={`${(resultData?.probability * 100).toFixed(1)}%`} 
                 status="Confidence" 
                 color="text-blue-500" 
               />
               <ResultRow 
                 label="Model Version" 
                 value={resultData?.model_version} 
                 status="Verified" 
                 color="text-slate-400" 
               />
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
               <button onClick={() => navigate('/chat')} className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all flex items-center justify-center gap-3">
                  Talk to AI Assistant <FaArrowRight />
               </button>
               <button onClick={() => setShowResult(false)} className="w-full py-4 text-blue-900/40 font-black text-[10px] uppercase tracking-widest hover:text-blue-900 transition-colors">Dismiss Report</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRow({ label, value, status, color }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
      <div>
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}</h4>
        <p className="text-lg font-black text-blue-900 italic">{value}</p>
      </div>
      <span className={`text-[10px] font-black uppercase px-3 py-1 bg-white rounded-full shadow-sm border border-gray-100 ${color}`}>
        {status}
      </span>
    </div>
  );
}