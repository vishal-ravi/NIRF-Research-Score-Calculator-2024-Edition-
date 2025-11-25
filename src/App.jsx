import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';
import './index.css';

const NIRFCalculator = () => {
  const [inputs, setInputs] = useState({
    frq: 684,
    p: 1230,
    cc: 9850,
    top25: 300,
    patents: 41,
    funding: 12.1,
    sdg: 28.2
  });

  const [benchmarks, setBenchmarks] = useState({
    pubRatio: 13.0,
    citRatio: 60.0,
    q1Perc: 75,
    patents: 410,
    funding: 270
  });

  const [scores, setScores] = useState({
    pu: 0, qp: 0, ipr: 0, fppp: 0, sdg: 0, total: 0
  });

  const [radarChart, setRadarChart] = useState(null);
  const [barChart, setBarChart] = useState(null);
  const [analysis, setAnalysis] = useState('Enter your data to see insights.');

  useEffect(() => {
    calculateScores();
  }, [inputs, benchmarks]);

  useEffect(() => {
    initCharts();
    return () => {
      if (radarChart) radarChart.destroy();
      if (barChart) barChart.destroy();
    };
  }, []);

  useEffect(() => {
    updateCharts();
  }, [scores]);

  const calculateScores = () => {
    const myPubRatio = inputs.p / inputs.frq;
    let pu = 30 * (myPubRatio / benchmarks.pubRatio);
    pu = Math.min(pu, 30);

    const myCitRatio = inputs.cc / inputs.frq;
    let qp_a = 15 * (myCitRatio / benchmarks.citRatio);
    
    const myQ1Ratio = (inputs.p > 0) ? (inputs.top25 / inputs.p) * 100 : 0;
    let qp_b = 15 * (myQ1Ratio / benchmarks.q1Perc);
    
    let qp = Math.min(qp_a + qp_b, 30);

    let ipr = 15 * (inputs.patents / benchmarks.patents);
    ipr = Math.min(ipr, 15);

    let fppp = 15 * (inputs.funding / benchmarks.funding);
    fppp = Math.min(fppp, 15);

    let sdg = 10 * (inputs.sdg / 100);
    sdg = Math.min(sdg, 10);

    const total = pu + qp + ipr + fppp + sdg;

    setScores({ pu, qp, ipr, fppp, sdg, total });
    updateAnalysis(pu, qp, ipr, fppp, total);
  };

  const updateAnalysis = (pu, qp, ipr, fppp, total) => {
    let msg = `Your current total score is <b>${total.toFixed(2)}</b>. `;
    
    if (inputs.frq > 500 && pu < 10) {
      msg += `Your <b>Faculty Base (${inputs.frq})</b> is quite large, which is diluting your Publication Score (PU). `;
    }
    
    if (fppp < 2) {
      msg += `<b>Funding (FPPP)</b> is a weak area. The benchmark is very high (₹270 Cr). `;
    } else if (fppp > 10) {
      msg += `<b>Excellent Funding!</b> Your research grants are competitive. `;
    }

    if (qp > pu + 5) {
      msg += `Your <b>Quality (QP)</b> is much higher than Quantity. This is a good sign! `;
    }

    setAnalysis(msg);
  };

  const initCharts = () => {
    const radarCtx = document.getElementById('radarChart')?.getContext('2d');
    if (radarCtx) {
      const radar = new Chart(radarCtx, {
        type: 'radar',
        data: {
          labels: ['Publications (PU)', 'Quality (QP)', 'IPR', 'Funding (FPPP)', 'SDG'],
          datasets: [
            {
              label: 'Your Score (%)',
              data: [0, 0, 0, 0, 0],
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              borderColor: 'rgba(37, 99, 235, 1)',
              pointBackgroundColor: 'rgba(37, 99, 235, 1)',
              borderWidth: 2
            },
            {
              label: 'Topper Benchmark',
              data: [100, 100, 100, 100, 100],
              backgroundColor: 'rgba(156, 163, 175, 0.1)',
              borderColor: 'rgba(156, 163, 175, 0.5)',
              borderDash: [5, 5],
              pointRadius: 0,
              borderWidth: 1
            }
          ]
        },
        options: {
          scales: {
            r: {
              beginAtZero: true,
              max: 100,
              ticks: { display: false }
            }
          }
        }
      });
      setRadarChart(radar);
    }

    const barCtx = document.getElementById('barChart')?.getContext('2d');
    if (barCtx) {
      const bar = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: ['PU', 'QP', 'IPR', 'FPPP', 'SDG'],
          datasets: [
            {
              label: 'Marks Obtained',
              data: [0, 0, 0, 0, 0],
              backgroundColor: ['#9333ea', '#16a34a', '#ca8a04', '#dc2626', '#4f46e5'],
              borderRadius: 4
            }
          ]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 35 }
          },
          plugins: { legend: { display: false } }
        }
      });
      setBarChart(bar);
    }
  };

  const updateCharts = () => {
    if (radarChart) {
      const pu_perc = (scores.pu / 30) * 100;
      const qp_perc = (scores.qp / 30) * 100;
      const ipr_perc = (scores.ipr / 15) * 100;
      const fppp_perc = (scores.fppp / 15) * 100;
      const sdg_perc = (scores.sdg / 10) * 100;

      radarChart.data.datasets[0].data = [pu_perc, qp_perc, ipr_perc, fppp_perc, sdg_perc];
      radarChart.update();
    }

    if (barChart) {
      barChart.data.datasets[0].data = [scores.pu, scores.qp, scores.ipr, scores.fppp, scores.sdg];
      barChart.update();
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setInputs({ ...inputs, [id]: parseFloat(value) || 0 });
  };

  const handleBenchmarkChange = (e) => {
    const { id, value } = e.target;
    setBenchmarks({ ...benchmarks, [id]: parseFloat(value) || 0 });
  };

  return (
    <div className="p-4 md:p-8 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">NIRF Ranking Calculator</h1>
          <p className="text-gray-600 mt-2">Research & Professional Practice (RP) Parameter</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Inputs */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Data Form */}
            <div className="bg-white p-6 rounded-lg shadow border-t-4 border-blue-600">
              <h2 className="text-xl font-bold mb-4 text-gray-800">📚 Your Institution Data</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Faculty Count (FRQ)</label>
                  <input 
                    type="number" 
                    id="frq" 
                    value={inputs.frq}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total regular faculty members</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Publications (P)</label>
                  <input 
                    type="number" 
                    id="p" 
                    value={inputs.p}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Scopus/Web of Science (3 years)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Total Citations (CC)</label>
                  <input 
                    type="number" 
                    id="cc" 
                    value={inputs.cc}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Total citations in previous 3 years</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Top 25% Papers (TOP25P)</label>
                  <input 
                    type="number" 
                    id="top25" 
                    value={inputs.top25}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Count of papers in Q1 Journals</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Patents (Granted + Published)</label>
                  <input 
                    type="number" 
                    id="patents" 
                    value={inputs.patents}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Avg. Annual Funding (₹ Crores)</label>
                  <input 
                    type="number" 
                    id="funding" 
                    value={inputs.funding}
                    onChange={handleInputChange}
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">Sponsored Research + Consultancy</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">SDG Alignment (%)</label>
                  <input 
                    type="number" 
                    id="sdg" 
                    value={inputs.sdg}
                    onChange={handleInputChange}
                    max="100"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">% of papers mapped to SDGs</p>
                </div>
              </div>
            </div>

            {/* Benchmarks Toggle */}
            <div className="bg-gray-50 p-6 rounded-lg border">
              <details className="cursor-pointer">
                <summary className="font-semibold text-gray-700 flex justify-between items-center">
                  <span>⚙️ Edit Topper Benchmarks</span>
                  <span>▼</span>
                </summary>
                <div className="mt-4 space-y-3 text-sm">
                  <p className="text-xs text-gray-500 mb-2">Adjust based on current year's leader.</p>
                  
                  <div>
                    <label className="block font-medium">Topper Papers/Faculty Ratio</label>
                    <input 
                      type="number" 
                      id="pubRatio" 
                      value={benchmarks.pubRatio}
                      onChange={handleBenchmarkChange}
                      step="0.1"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div>
                    <label className="block font-medium">Topper Citations/Faculty Ratio</label>
                    <input 
                      type="number" 
                      id="citRatio" 
                      value={benchmarks.citRatio}
                      onChange={handleBenchmarkChange}
                      step="0.1"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Topper Quality % (Q1)</label>
                    <input 
                      type="number" 
                      id="q1Perc" 
                      value={benchmarks.q1Perc}
                      onChange={handleBenchmarkChange}
                      step="1"
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Topper Total Patents</label>
                    <input 
                      type="number" 
                      id="patents" 
                      value={benchmarks.patents}
                      onChange={handleBenchmarkChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div>
                    <label className="block font-medium">Topper Avg. Funding (₹ Cr)</label>
                    <input 
                      type="number" 
                      id="funding" 
                      value={benchmarks.funding}
                      onChange={handleBenchmarkChange}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>
              </details>
            </div>
          </div>

          {/* Right Column: Results & Charts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center border-b-4 border-purple-500">
                <h3 className="text-sm font-bold text-gray-500">PU (Qty)</h3>
                <p className="text-2xl font-bold text-purple-600">{scores.pu.toFixed(2)}</p>
                <span className="text-xs text-gray-400">Max: 30</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center border-b-4 border-green-500">
                <h3 className="text-sm font-bold text-gray-500">QP (Quality)</h3>
                <p className="text-2xl font-bold text-green-600">{scores.qp.toFixed(2)}</p>
                <span className="text-xs text-gray-400">Max: 30</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center border-b-4 border-yellow-500">
                <h3 className="text-sm font-bold text-gray-500">IPR</h3>
                <p className="text-2xl font-bold text-yellow-600">{scores.ipr.toFixed(2)}</p>
                <span className="text-xs text-gray-400">Max: 15</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center border-b-4 border-red-500">
                <h3 className="text-sm font-bold text-gray-500">FPPP</h3>
                <p className="text-2xl font-bold text-red-600">{scores.fppp.toFixed(2)}</p>
                <span className="text-xs text-gray-400">Max: 15</span>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center border-b-4 border-indigo-500">
                <h3 className="text-sm font-bold text-gray-500">SDG</h3>
                <p className="text-2xl font-bold text-indigo-600">{scores.sdg.toFixed(2)}</p>
                <span className="text-xs text-gray-400">Max: 10</span>
              </div>
            </div>

            {/* Main Total Score */}
            <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Total Research Score (RP)</h2>
                <p className="text-gray-400 text-sm">National Institutional Ranking Framework</p>
              </div>
              <div className="text-right">
                <span className="text-4xl font-bold text-blue-400">{scores.total.toFixed(2)}</span>
                <span className="text-gray-500 text-lg">/ 100</span>
              </div>
            </div>

            {/* Chart Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-gray-700 mb-4">Performance vs Topper</h3>
                <canvas id="radarChart"></canvas>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="font-bold text-gray-700 mb-4">Score Contribution</h3>
                <canvas id="barChart"></canvas>
              </div>
            </div>

            {/* Analysis Box */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="font-bold text-blue-800 mb-2">💡 Quick Analysis</h3>
              <p className="text-sm text-blue-900 leading-relaxed" dangerouslySetInnerHTML={{ __html: analysis }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NIRFCalculator;
