import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ProductionCalculator = () => {
    const [darkMode, setDarkMode] = useState(false);
    const [startWeight, setStartWeight] = useState(35274.0);
    const [stopWeight, setStopWeight] = useState(38322.4);
    const [startTime, setStartTime] = useState('07:20');
    const [stopTime, setStopTime] = useState('14:50');
    const [idleTime, setIdleTime] = useState(0.5);
    const [pieceHotLength, setPieceHotLength] = useState(4.5);
    const [partsPerBox, setPartsPerBox] = useState(6);
    const [productionRate, setProductionRate] = useState(120);

    // Calculated values
    const [totalWeight, setTotalWeight] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [actualRuntime, setActualRuntime] = useState(0);
    const [weightPerHour, setWeightPerHour] = useState(0);
    const [totalFeet, setTotalFeet] = useState(0);
    const [possiblePieces, setPossiblePieces] = useState(0);
    const [possibleBoxes, setPossibleBoxes] = useState(0);
    const [nominalYield, setNominalYield] = useState(0);
    const [actualBoxes, setActualBoxes] = useState(156);
    const [actualPieces, setActualPieces] = useState(0);
    const [difference, setDifference] = useState(0);
    const [scrapTime, setScrapTime] = useState(0);
    // No need for efficiency in state as it's calculated directly when needed
    // Removed hourly data state

    const parseTimeString = (timeStr) => {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return hours + minutes / 60;
    };

    const formatTimeString = (decimalHours) => {
        const hours = Math.floor(decimalHours);
        const minutes = Math.round((decimalHours - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Using useCallback to memoize the function and prevent infinite re-renders
    const calculateValues = React.useCallback(() => {
        // Calculate total weight
        const weightDiff = stopWeight - startWeight;
        setTotalWeight(weightDiff);

        // Calculate total hours
        const startTimeDecimal = parseTimeString(startTime);
        const stopTimeDecimal = parseTimeString(stopTime);
        let hoursDiff = stopTimeDecimal - startTimeDecimal;
        if (hoursDiff < 0) hoursDiff += 24; // Handle overnight

        setTotalHours(hoursDiff);

        // Calculate actual runtime (excluding idle time)
        const runtime = hoursDiff - idleTime;
        setActualRuntime(runtime);

        // Calculate weight per hour
        const wph = weightDiff / runtime;
        setWeightPerHour(wph);

        // Calculate total feet produced
        const feetPerHour = productionRate * 60;
        const totalFt = feetPerHour * runtime;
        setTotalFeet(totalFt);

        // Calculate possible pieces based on hot cut length
        const possiblePcs = totalFt / pieceHotLength;
        setPossiblePieces(possiblePcs);

        // Calculate possible boxes
        const posBoxes = possiblePcs / partsPerBox;
        setPossibleBoxes(posBoxes);

        // Calculate actual pieces
        const actualPcs = actualBoxes * partsPerBox;
        setActualPieces(actualPcs);

        // Calculate nominal yield per hour
        const nomYield = posBoxes / runtime;
        setNominalYield(nomYield);

        // Calculate difference between possible and actual boxes
        const diff = posBoxes - actualBoxes;
        setDifference(diff);

        // Calculate scrap time based on difference and nominal yield
        const scrpTime = diff / nomYield;
        setScrapTime(scrpTime);

        // Efficiency is calculated directly when needed in the render

        // Hourly data generation removed
    }, [startWeight, stopWeight, startTime, stopTime,
        idleTime, pieceHotLength, partsPerBox, productionRate, actualBoxes]);

    useEffect(() => {
        calculateValues();
    }, [calculateValues]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const mainBgColor = darkMode ? 'bg-gray-900' : 'bg-gray-50';
    const cardBgColor = darkMode ? 'bg-gray-800' : 'bg-white';
    const textColor = darkMode ? 'text-gray-100' : 'text-gray-800';
    const labelColor = darkMode ? 'text-gray-300' : 'text-gray-700';
    const headingColor = darkMode ? 'text-blue-400' : 'text-blue-600';
    const borderColor = darkMode ? 'border-gray-700' : 'border-gray-200';
    const inputBgColor = darkMode ? 'bg-gray-700' : 'bg-white';
    const inputBorderColor = darkMode ? 'border-gray-600' : 'border-gray-300';
    const effectivePercentage = (actualBoxes / possibleBoxes) * 100;

    const getEfficiencyColor = (percentage) => {
        if (percentage >= 95) return darkMode ? 'text-green-400' : 'text-green-600';
        if (percentage >= 85) return darkMode ? 'text-blue-400' : 'text-blue-600';
        if (percentage >= 75) return darkMode ? 'text-yellow-400' : 'text-yellow-600';
        return darkMode ? 'text-red-400' : 'text-red-600';
    };

    const performanceData = [
        { name: 'Actual', value: actualBoxes },
        { name: 'Possible', value: possibleBoxes },
    ];

    return (
        <div className={`p-4 min-h-screen ${mainBgColor} transition-all duration-300`}>
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className={`text-3xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-800'} transition-colors duration-300`}>
                        Brad's Calculator
                    </h1>
                    <button
                        onClick={toggleDarkMode}
                        className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-blue-700 text-white' : 'bg-blue-100 text-blue-800'} transition-colors duration-300`}
                    >
                        {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className={`${cardBgColor} p-6 rounded-lg shadow-lg transition-all duration-300 col-span-1`}>
                        <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>Input Values</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Start Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={startWeight}
                                    onChange={(e) => setStartWeight(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Stop Weight (lbs)</label>
                                <input
                                    type="number"
                                    value={stopWeight}
                                    onChange={(e) => setStopWeight(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Start Time</label>
                                <input
                                    type="time"
                                    value={startTime}
                                    onChange={(e) => setStartTime(e.target.value)}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Stop Time</label>
                                <input
                                    type="time"
                                    value={stopTime}
                                    onChange={(e) => setStopTime(e.target.value)}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Down Time (hours)</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={idleTime}
                                    onChange={(e) => setIdleTime(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Production Rate (ft/min)</label>
                                <input
                                    type="number"
                                    value={productionRate}
                                    onChange={(e) => setProductionRate(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Piece Hot Length (ft)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={pieceHotLength}
                                    onChange={(e) => setPieceHotLength(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Pieces Per Box</label>
                                <input
                                    type="number"
                                    value={partsPerBox}
                                    onChange={(e) => setPartsPerBox(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${labelColor} mb-1`}>Actual Boxes Completed</label>
                                <input
                                    type="number"
                                    value={actualBoxes}
                                    onChange={(e) => setActualBoxes(Number(e.target.value))}
                                    className={`block w-full rounded-md ${inputBgColor} ${inputBorderColor} border shadow-sm focus:border-blue-500 focus:ring-blue-500 ${textColor}`}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={`${cardBgColor} p-6 rounded-lg shadow-lg transition-all duration-300 col-span-2`}>
                        <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>Production Summary</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className={`text-sm ${labelColor}`}>Total Weight:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{totalWeight.toFixed(1)} lbs</div>

                                        <div className={`text-sm ${labelColor}`}>Total Hours:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{totalHours.toFixed(2)} hrs</div>

                                        <div className={`text-sm ${labelColor}`}>Actual Runtime:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{actualRuntime.toFixed(2)} hrs</div>

                                        <div className={`text-sm ${labelColor}`}>Weight Per Hour:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{weightPerHour.toFixed(2)} lbs/hr</div>

                                        <div className={`text-sm ${labelColor}`}>Total Feet:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{totalFeet.toFixed(0)} ft</div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="space-y-3">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className={`text-sm ${labelColor}`}>Possible Pieces:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{possiblePieces.toFixed(0)} pieces</div>

                                        <div className={`text-sm ${labelColor}`}>Possible Boxes:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{possibleBoxes.toFixed(2)} boxes</div>

                                        <div className={`text-sm ${labelColor}`}>Actual Pieces:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{actualPieces.toFixed(0)} pieces</div>

                                        <div className={`text-sm ${labelColor}`}>Nominal Yield:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{nominalYield.toFixed(2)} boxes/hr</div>

                                        <div className={`text-sm ${labelColor}`}>Box Efficiency:</div>
                                        <div className={`text-sm font-semibold ${getEfficiencyColor(effectivePercentage)}`}>
                                            {effectivePercentage.toFixed(2)}%
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`mt-6 pt-4 border-t ${borderColor}`}>
                            <h3 className={`text-lg font-semibold mb-4 ${headingColor}`}>Performance Analysis</h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className={`text-sm ${labelColor}`}>Difference:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{difference.toFixed(2)} boxes</div>

                                        <div className={`text-sm ${labelColor}`}>Scrap Time:</div>
                                        <div className={`text-sm font-semibold ${textColor}`}>{scrapTime.toFixed(2)} hrs</div>

                                        <div className={`text-sm ${labelColor}`}>Piece Efficiency:</div>
                                        <div className={`text-sm font-semibold ${getEfficiencyColor((actualPieces / possiblePieces) * 100)}`}>
                                            {((actualPieces / possiblePieces) * 100).toFixed(2)}%
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart
                                            data={performanceData}
                                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#444" : "#ccc"} />
                                            <XAxis dataKey="name" stroke={darkMode ? "#ccc" : "#333"} />
                                            <YAxis stroke={darkMode ? "#ccc" : "#333"} />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: darkMode ? '#444' : '#fff',
                                                    borderColor: darkMode ? '#555' : '#ccc',
                                                    color: darkMode ? '#ccc' : '#333',
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="value" name="Boxes" fill={darkMode ? "#3B82F6" : "#1D4ED8"} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Hourly Production Tracking chart removed */}

                <div className={`${cardBgColor} p-6 rounded-lg shadow-lg transition-all duration-300`}>
                    <h2 className={`text-xl font-semibold mb-4 ${headingColor}`}>Formula Explanation</h2>
                    <div className={`text-sm ${textColor} grid grid-cols-1 md:grid-cols-2 gap-4`}>
                        <div>
                            <p className="mb-2"><span className="font-medium">1. Total Weight</span> = Stop Weight - Start Weight</p>
                            <p className="mb-2"><span className="font-medium">2. Total Hours</span> = Stop Time - Start Time</p>
                            <p className="mb-2"><span className="font-medium">3. Actual Runtime</span> = Total Hours - Idle Time</p>
                            <p className="mb-2"><span className="font-medium">4. Weight Per Hour</span> = Total Weight / Actual Runtime</p>
                            <p className="mb-2"><span className="font-medium">5. Total Feet</span> = Production Rate (ft/min) × 60 × Actual Runtime</p>
                        </div>
                        <div>
                            <p className="mb-2"><span className="font-medium">6. Possible Pieces</span> = Total Feet / Piece Hot Length</p>
                            <p className="mb-2"><span className="font-medium">7. Possible Boxes</span> = Possible Pieces / Pieces Per Box</p>
                            <p className="mb-2"><span className="font-medium">8. Actual Pieces</span> = Actual Boxes × Pieces Per Box</p>
                            <p className="mb-2"><span className="font-medium">9. Nominal Yield</span> = Possible Boxes / Actual Runtime</p>
                            <p className="mb-2"><span className="font-medium">10. Difference</span> = Possible Boxes - Actual Boxes</p>
                            <p className="mb-2"><span className="font-medium">11. Scrap Time</span> = Difference / Nominal Yield</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductionCalculator;