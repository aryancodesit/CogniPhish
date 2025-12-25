
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AnalysisPage = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:8000/api/stats/');
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch statistics");
            }
        };
        fetchStats();
    }, []);

    if (!data) return <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">Loading Analysis...</div>;

    return (
        <div className="min-h-screen bg-slate-50 text-gray-900 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header className="mb-12">
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Performance Analysis</h1>
                    <p className="text-gray-600">Review your recent session data and calibration.</p>
                </header>

                {/* Insight Card */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border-l-8 border-indigo-600">
                    <h2 className="text-2xl font-bold mb-4 flex items-center">
                        <span className="mr-3">🧐</span>
                        Analyst Insight
                    </h2>
                    <p className="text-xl text-gray-800 leading-relaxed font-medium">
                        {data.insight}
                    </p>
                </div>

                {/* Graph */}
                <div className="bg-white p-6 rounded-2xl shadow-sm h-[500px]">
                    <h3 className="text-lg font-bold text-gray-500 mb-6 uppercase tracking-wide">Dunning-Kruger Analysis: Perception vs Reality</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={data.history}
                            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis
                                dataKey="scenario"
                                label={{ value: 'Expertise / Experience (Trials)', position: 'insideBottom', offset: -10 }}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis
                                label={{ value: 'Knowledge / Performance (%)', angle: -90, position: 'insideLeft' }}
                                domain={[0, 100]}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                formatter={(value, name) => [value + "%", name === "self_estimated" ? "Self-Estimated (Confidence)" : "Actual Knowledge (Accuracy)"]}
                            />
                            <Legend verticalAlign="top" height={36} />

                            {/* Red Line: Self-Estimated Knowledge (Confidence) */}
                            <Line
                                type="monotone"
                                dataKey="self_estimated"
                                stroke="#dc2626"
                                strokeWidth={4}
                                name="Self-Estimated (Confidence)"
                                dot={{ fill: '#dc2626', r: 6 }}
                                activeDot={{ r: 8 }}
                            />

                            {/* Green Line: Actual Knowledge (Accuracy) */}
                            <Line
                                type="step"
                                dataKey="actual"
                                stroke="#16a34a"
                                strokeWidth={4}
                                name="Actual Knowledge (Accuracy)"
                                dot={{ fill: '#16a34a', r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="flex justify-end">
                    <button
                        onClick={() => navigate('/simulation')}
                        className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
                    >
                        Continue Training →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;
