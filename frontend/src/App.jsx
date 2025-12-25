
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import {
  Shield, AlertTriangle, CheckCircle, HelpCircle, Menu, Search, SlidersHorizontal, Settings, Grid,
  Plus, Inbox, Clock, Star, Send, File, ChevronDown, Tag, ArrowLeft, Archive, AlertOctagon, Trash2, Mail,
  Printer, ExternalLink, CornerUpLeft, MoreVertical, Forward, Calendar, Lightbulb, CheckSquare
} from 'lucide-react';
import HomePage from './HomePage';
import AnalysisPage from './AnalysisPage';

// --- Simulation Component (Formerly specific parts of App) ---

const EmailClient = ({ scenario, onDecide, loading, sessionCount }) => {
  // Helper for Sidebar Items
  const SidebarItem = ({ icon: Icon, label, active, count }) => (
    <div className={`flex items-center justify-between px-6 py-1.5 cursor-pointer rounded-r-full mr-2 ${active ? 'bg-[#fce8e6] text-[#d93025] font-semibold' : 'hover:bg-gray-100 text-gray-700'}`}>
      <div className="flex items-center space-x-4">
        <Icon size={18} className={active ? "text-[#d93025]" : "text-gray-500"} />
        <span>{label}</span>
      </div>
      {count && <span className="text-xs transition">{count}</span>}
    </div>
  );

  const IconButton = ({ icon: Icon, className }) => (
    <button className={`p-2 rounded-full hover:bg-gray-100 text-gray-600 ${className}`}>
      <Icon size={20} />
    </button>
  );

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  if (!scenario) return <div className="p-10 text-center">No emails to review.</div>;

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      {/* 1. Header */}
      <header className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
        <div className="flex items-center w-64 pl-2">
          <div className="p-3 mr-2 rounded-full hover:bg-gray-100 cursor-pointer">
            <Menu size={24} className="text-gray-600" />
          </div>
          <img src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x_r2.png" alt="Gmail" className="h-10" />
        </div>

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="bg-[#f1f3f4] flex items-center px-4 py-3 rounded-lg focus-within:bg-white focus-within:shadow-md transition-shadow">
            <Search size={20} className="text-gray-500 mr-3" />
            <input type="text" placeholder="Search mail" className="bg-transparent outline-none w-full text-gray-700 placeholder-gray-500" />
            <SlidersHorizontal size={20} className="text-gray-500 ml-3" />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 pl-4 w-64 justify-end">
          <IconButton icon={HelpCircle} />
          <IconButton icon={Settings} />
          <IconButton icon={Grid} />
          <div className="w-8 h-8 bg-purple-600 rounded-full text-white flex items-center justify-center font-bold text-sm ml-2">U</div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* 2. Left Sidebar */}
        <div className="w-64 flex-shrink-0 flex flex-col py-4 pr-2 overflow-y-auto hidden md:flex">
          <div className="pl-4 mb-4">
            <button className="flex items-center space-x-3 bg-white border border-gray-200 hover:shadow-md transition text-slate-800 font-medium py-3 px-6 rounded-full shadow-sm">
              {/* Google's multi-color plus is hard to replicate exactly without an SVG, using a colored icon */}
              <span className="text-3xl font-light text-red-500 leading-none pb-1">+</span>
              <span className="text-sm font-medium tracking-wide">Compose</span>
            </button>
          </div>

          <SidebarItem icon={Inbox} label="Inbox" active count={10 - (sessionCount % 10)} />
          <SidebarItem icon={Clock} label="Snoozed" />
          <SidebarItem icon={Star} label="Starred" />
          <SidebarItem icon={Send} label="Sent" />
          <SidebarItem icon={File} label="Drafts" count="14" />
          <SidebarItem icon={ChevronDown} label="More" />

          <div className="mt-4 px-6 text-sm font-medium text-gray-500 mb-2">Labels</div>
          <SidebarItem icon={Tag} label="Work" />
          <SidebarItem icon={Tag} label="Personal" />
        </div>

        {/* 3. Main Content */}
        <div className="flex-1 flex flex-col bg-white min-w-0">
          {/* Toolbar */}
          <div className="h-12 border-b border-gray-200 flex items-center justify-between px-4">
            <div className="flex items-center space-x-4 pl-2 text-gray-600">
              <IconButton icon={ArrowLeft} />
              <div className="flex items-center space-x-1 border-l border-gray-300 pl-2 ml-2">
                <IconButton icon={Archive} />
                <IconButton icon={AlertOctagon} />
                <IconButton icon={Trash2} />
              </div>
              <div className="flex items-center space-x-1 border-l border-gray-300 pl-2 ml-2">
                <IconButton icon={Mail} />
                <IconButton icon={Clock} />
                <IconButton icon={CheckCircle} />
              </div>
            </div>
            <div className="text-sm text-gray-500 pr-4">1-16 of 16</div>
          </div>

          {/* Email View */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 max-w-5xl">
              {/* Subject Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h1 className="text-[1.375rem] text-gray-900 font-normal">{scenario.subject}</h1>
                  <span className="bg-[#ddd] text-xs px-2 py-[2px] rounded-sm text-gray-600 text-[11px] font-medium flex items-center">
                    Inbox <span className="ml-[6px] text-gray-500 text-[10px] cursor-pointer">x</span>
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-500">
                  <IconButton icon={Printer} />
                  <IconButton icon={ExternalLink} />
                </div>
              </div>

              {/* Sender Details */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {scenario.sender_display ? scenario.sender_display[0].toUpperCase() : '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between">
                    <div className="flex items-center space-x-2 truncate">
                      <span className="font-bold text-gray-900 text-[0.9rem]">{scenario.sender_display}</span>
                      <span className="text-sm text-gray-600 truncate">&lt;{scenario.sender_address}&gt;</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 flex-shrink-0">
                      <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (0 minutes ago)</span>
                      <div className="flex space-x-1">
                        <IconButton icon={Star} className="!p-1" />
                        <IconButton icon={CornerUpLeft} className="!p-1" />
                        <IconButton icon={MoreVertical} className="!p-1" />
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">to me <span className="text-[10px] ml-1">▼</span></div>
                </div>
              </div>

              {/* The Email Content Body */}
              <div className="pl-14 text-gray-800 leading-relaxed font-sans mb-8 text-[0.9rem]">
                <div dangerouslySetInnerHTML={{ __html: scenario.body_html }} />

                {/* Mock Smart Replies */}
                <div className="mt-8 flex flex-wrap gap-2">
                  {["Sure, I'll take a look.", "Thanks for letting me know.", "Reported."].map(reply => (
                    <button key={reply} className="border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-600 hover:bg-gray-50 font-medium transition cursor-pointer">
                      {reply}
                    </button>
                  ))}
                </div>
              </div>


              {/* Action Buttons */}
              <div className="pl-14 flex space-x-3 mb-12">
                <button className="flex items-center space-x-2 border border-gray-300 rounded px-6 py-2 text-gray-700 font-medium hover:bg-gray-50 shadow-sm">
                  <CornerUpLeft size={16} />
                  <span>Reply</span>
                </button>
                <button className="flex items-center space-x-2 border border-gray-300 rounded px-6 py-2 text-gray-700 font-medium hover:bg-gray-50 shadow-sm">
                  <Forward size={16} />
                  <span>Forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Right Sidebar (Add-ons) */}
        <div className="w-14 border-l border-gray-200 flex-col items-center py-4 space-y-6 hidden lg:flex bg-white">
          <IconButton icon={Calendar} className="text-blue-600" />
          <IconButton icon={Lightbulb} className="text-yellow-500" />
          <IconButton icon={CheckSquare} className="text-blue-500" />
          <div className="w-8 h-0.5 bg-gray-200"></div>
          <IconButton icon={Plus} />
        </div>
      </div>
    </div>
  );
};

const DecisionPanel = ({ onDetect }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] p-4 flex justify-center items-center space-x-8 z-50">
      <div className="text-gray-700 font-medium">Is this email safe?</div>
      <button
        onClick={() => onDetect('PHISHING')}
        className="flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-full font-bold transition transform hover:scale-105 shadow-lg"
      >
        <AlertTriangle className="mr-2 h-5 w-5" />
        Report Phishing
      </button>
      <button
        onClick={() => onDetect('SAFE')}
        className="flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold transition transform hover:scale-105 shadow-lg"
      >
        <CheckCircle className="mr-2 h-5 w-5" />
        Mark as Safe
      </button>
    </div>
  );
};

const ConfidenceModal = ({ onSubmit, onCancel }) => {
  const [level, setLevel] = useState(5);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl animate-fade-in-up">
        <h3 className="text-xl font-bold mb-4 text-center">How confident are you?</h3>
        <p className="text-gray-600 mb-6 text-center text-sm">Rate your certainty from 1 (Guessing) to 10 (Certain).</p>

        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-gray-400">Low</span>
          <span className="text-2xl font-bold text-blue-600">{level}</span>
          <span className="text-xs font-bold text-gray-400">High</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={level}
          onChange={(e) => setLevel(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mb-8"
        />

        <button
          onClick={() => onSubmit(level)}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-md transition"
        >
          Confirm Decision
        </button>
        <button
          onClick={onCancel}
          className="w-full py-2 mt-2 text-gray-500 hover:text-gray-700 text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const FeedbackModal = ({ result, onNext }) => {
  if (!result) return null;

  const isGood = result.is_correct;
  const color = isGood ? 'text-green-600' : 'text-red-600';
  const bgColor = isGood ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-4">
      <div className={`max-w-2xl w-full ${bgColor} p-8 rounded-2xl shadow-xl text-center border-2 ${isGood ? 'border-green-100' : 'border-red-100'}`}>
        <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isGood ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
          {isGood ? <CheckCircle size={40} /> : <AlertTriangle size={40} />}
        </div>

        <h2 className={`text-4xl font-extrabold mb-2 ${color}`}>{result.feedback_header}</h2>
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">{result.feedback_message}</p>

        <div className="grid grid-cols-2 gap-4 text-left bg-white p-6 rounded-xl shadow-sm mb-8">
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold">Difficulty</div>
            <div className="text-xl font-bold text-gray-800">{result.difficulty}/10</div>
          </div>
          <div>
            <div className="text-xs text-gray-400 uppercase tracking-wide font-bold">Risk Score</div>
            <div className="text-xl font-bold text-purple-600">{result.risk_score}</div>
          </div>
          {!isGood && (
            <div className="col-span-2 mt-2 pt-4 border-t border-gray-100">
              <div className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-1">What was the trap?</div>
              <div className="text-gray-800 italic">"{result.trap_explanation}"</div>
            </div>
          )}
        </div>

        <button
          onClick={onNext}
          className="px-8 py-4 bg-gray-900 text-white text-lg font-bold rounded-xl hover:bg-black transition shadow-lg flex items-center justify-center mx-auto"
        >
          {/* Changed this text to be generic as logic handles routing */}
          Continue
        </button>
      </div>
    </div>
  );
};

// --- Main Simulation Page Controller ---

function SimulationPage() {
  const [scenario, setScenario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [decision, setDecision] = useState(null);
  const [showConfidence, setShowConfidence] = useState(false);
  const [result, setResult] = useState(null);
  const [sessionCount, setSessionCount] = useState(0);

  const navigate = useNavigate();

  const fetchScenario = async () => {
    // Check session limit
    if (sessionCount > 0 && sessionCount % 10 === 0) {
      navigate('/analysis');
      return;
    }

    setLoading(true);
    setScenario(null);
    setDecision(null);
    setShowConfidence(false);
    setResult(null);

    try {
      const res = await axios.get('http://127.0.0.1:8000/api/scenario/fresh/');
      setScenario(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScenario();
  }, [sessionCount]);

  const handleDecision = (type) => {
    setDecision(type);
    setShowConfidence(true);
  };

  const handleSubmit = async (confidenceLevel) => {
    setShowConfidence(false);
    try {
      const payload = {
        scenario_id: scenario.id,
        user_choice: decision,
        confidence_level: confidenceLevel
      };
      const res = await axios.post('http://127.0.0.1:8000/api/submit/', payload);
      setResult(res.data);
    } catch (err) {
      alert("Error submitting result");
      console.error(err);
    }
  };

  const handleNext = () => {
    setSessionCount(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-gray-900">
      <main className="h-screen w-full">
        <EmailClient scenario={scenario} loading={loading} sessionCount={sessionCount} />
      </main>

      {!loading && !result && (
        <DecisionPanel onDetect={handleDecision} />
      )}

      {showConfidence && (
        <ConfidenceModal onSubmit={handleSubmit} onCancel={() => setShowConfidence(false)} />
      )}

      {result && (
        <FeedbackModal result={result} onNext={handleNext} />
      )}
    </div>
  );
}

// --- App Router ---

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/simulation" element={<SimulationPage />} />
        <Route path="/analysis" element={<AnalysisPage />} />
      </Routes>
    </Router>
  );
}

export default App;
