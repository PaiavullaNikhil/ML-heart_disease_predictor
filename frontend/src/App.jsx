import {
  Activity,
  AlertCircle,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Heart,
  Monitor,
  Shield,
  Stethoscope,
  Target,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import { useState } from 'react';

const App = () => {
  const [formData, setFormData] = useState({
    Age: '',
    Sex: '',
    ChestPainType: '',
    RestingBP: '',
    Cholesterol: '',
    FastingBS: '',
    RestingECG: '',
    MaxHR: '',
    ExerciseAngina: '',
    Oldpeak: '',
    ST_Slope: ''
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      // Validate that all required fields are filled
      const requiredFields = ['Age', 'Sex', 'ChestPainType', 'RestingBP', 'Cholesterol', 'FastingBS', 'RestingECG', 'MaxHR', 'ExerciseAngina', 'Oldpeak', 'ST_Slope'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Convert numeric fields to numbers
      const processedData = {
        ...formData,
        Age: parseInt(formData.Age),
        RestingBP: parseInt(formData.RestingBP),
        Cholesterol: parseInt(formData.Cholesterol),
        FastingBS: parseInt(formData.FastingBS),
        MaxHR: parseInt(formData.MaxHR),
        Oldpeak: parseFloat(formData.Oldpeak)
      };

      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Network response was not ok');
      }
      
      const data = await response.json();
      setPrediction(data);
    } catch (err) {
      setError(err.message || 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      Age: '',
      Sex: '',
      ChestPainType: '',
      RestingBP: '',
      Cholesterol: '',
      FastingBS: '',
      RestingECG: '',
      MaxHR: '',
      ExerciseAngina: '',
      Oldpeak: '',
      ST_Slope: ''
    });
    setPrediction(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-blue-500">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">
                CardioPredict AI
              </h1>
              <p className="text-gray-600 flex items-center justify-center space-x-2">
                <Stethoscope className="w-4 h-4" />
                <span>Advanced Heart Disease Risk Assessment</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Medical Information Banner */}
        <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12 text-blue-100" />
            <div>
              <h2 className="text-2xl font-semibold mb-2">Medical Assessment Form</h2>
              <p className="text-blue-100">
                Please provide accurate medical information for the most reliable prediction. 
                This tool uses advanced machine learning to assess cardiovascular risk factors.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Form Header */}
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <h3 className="text-xl font-semibold text-gray-800">Patient Information</h3>
            </div>
          </div>

          <div className="p-8">
            <div className="space-y-8">
              {/* Demographics Section */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-5 h-5 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Demographics</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>Age (years)</span>
                    </label>
                    <input
                      type="number"
                      name="Age"
                      value={formData.Age}
                      onChange={handleChange}
                      required
                      min="1"
                      max="120"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="Enter age"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 text-pink-500" />
                      <span>Biological Sex</span>
                    </label>
                    <select
                      name="Sex"
                      value={formData.Sex}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select sex</option>
                      <option value="M">Male</option>
                      <option value="F">Female</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Symptoms Section */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 border border-red-100">
                <div className="flex items-center space-x-2 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Symptoms & Pain</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>Chest Pain Type</span>
                    </label>
                    <select
                      name="ChestPainType"
                      value={formData.ChestPainType}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select chest pain type</option>
                      <option value="ATA">Atypical Angina</option>
                      <option value="NAP">Non-Anginal Pain</option>
                      <option value="ASY">Asymptomatic</option>
                      <option value="TA">Typical Angina</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Zap className="w-4 h-4 text-orange-500" />
                      <span>Exercise Induced Angina</span>
                    </label>
                    <select
                      name="ExerciseAngina"
                      value={formData.ExerciseAngina}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select option</option>
                      <option value="Y">Yes</option>
                      <option value="N">No</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Vital Signs Section */}
              <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Monitor className="w-5 h-5 text-green-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Vital Signs</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      <span>Resting Blood Pressure (mmHg)</span>
                    </label>
                    <input
                      type="number"
                      name="RestingBP"
                      value={formData.RestingBP}
                      onChange={handleChange}
                      required
                      min="80"
                      max="200"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 120"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Activity className="w-4 h-4 text-red-500" />
                      <span>Maximum Heart Rate (bpm)</span>
                    </label>
                    <input
                      type="number"
                      name="MaxHR"
                      value={formData.MaxHR}
                      onChange={handleChange}
                      required
                      min="60"
                      max="220"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 150"
                    />
                  </div>
                </div>
              </div>

              {/* Lab Results Section */}
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-100">
                <div className="flex items-center space-x-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Laboratory Results</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Target className="w-4 h-4 text-purple-500" />
                      <span>Cholesterol (mg/dL)</span>
                    </label>
                    <input
                      type="number"
                      name="Cholesterol"
                      value={formData.Cholesterol}
                      onChange={handleChange}
                      required
                      min="100"
                      max="500"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 200"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Fasting Blood Sugar {'>'} 120 mg/dL</span>
                    </label>
                    <select
                      name="FastingBS"
                      value={formData.FastingBS}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select option</option>
                      <option value="1">Yes ({">"}120 mg/dL)</option>
                      <option value="0">No (≤120 mg/dL)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Cardiac Tests Section */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-6 border border-orange-100">
                <div className="flex items-center space-x-2 mb-4">
                  <Activity className="w-5 h-5 text-orange-600" />
                  <h4 className="text-lg font-semibold text-gray-800">Cardiac Tests</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Monitor className="w-4 h-4 text-orange-500" />
                      <span>Resting ECG</span>
                    </label>
                    <select
                      name="RestingECG"
                      value={formData.RestingECG}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select ECG result</option>
                      <option value="Normal">Normal</option>
                      <option value="ST">ST-T Wave Abnormality</option>
                      <option value="LVH">Left Ventricular Hypertrophy</option>
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <TrendingUp className="w-4 h-4 text-yellow-500" />
                      <span>ST Depression (Oldpeak)</span>
                    </label>
                    <input
                      type="number"
                      name="Oldpeak"
                      value={formData.Oldpeak}
                      onChange={handleChange}
                      required
                      min="-3"
                      max="7"
                      step="0.1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="e.g., 1.0"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <BarChart3 className="w-4 h-4 text-green-500" />
                      <span>ST Slope</span>
                    </label>
                    <select
                      name="ST_Slope"
                      value={formData.ST_Slope}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    >
                      <option value="">Select ST slope</option>
                      <option value="Up">Upsloping</option>
                      <option value="Flat">Flat</option>
                      <option value="Down">Downsloping</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-teal-600 text-white py-4 px-8 rounded-xl hover:from-blue-700 hover:to-teal-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-5 h-5" />
                      <span>Analyze Heart Disease Risk</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center space-x-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Reset Form</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 p-6 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-md">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-red-800 font-semibold">Error</p>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Prediction Results */}
        {prediction && (
          <div className="mt-6 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-8 py-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <Stethoscope className="w-6 h-6 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-800">Analysis Results</h3>
              </div>
            </div>
            
            <div className="p-8">
              {/* Main Result */}
              <div className={`p-6 rounded-xl mb-6 border-2 ${
                prediction.prediction === 1 
                  ? 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200' 
                  : 'bg-gradient-to-r from-green-50 to-teal-50 border-green-200'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    prediction.prediction === 1 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {prediction.prediction === 1 ? (
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    ) : (
                      <CheckCircle className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className={`text-2xl font-bold ${
                      prediction.prediction === 1 ? 'text-red-800' : 'text-green-800'
                    }`}>
                      {prediction.prediction_text}
                    </p>
                    <p className={`text-lg ${
                      prediction.prediction === 1 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      Model Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Probability Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-teal-50 p-6 rounded-xl border border-green-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Low Risk Probability</p>
                      <p className="text-3xl font-bold text-green-600">
                        {(prediction.probability.no_disease * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-green-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.probability.no_disease * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-100">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">High Risk Probability</p>
                      <p className="text-3xl font-bold text-red-600">
                        {(prediction.probability.heart_disease * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-red-400 to-red-600 h-3 rounded-full transition-all duration-1000"
                      style={{ width: `${prediction.probability.heart_disease * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Medical Disclaimer */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-blue-800 font-semibold mb-2">Important Medical Notice</p>
                    <p className="text-blue-700 text-sm leading-relaxed">
                      This AI-powered assessment is for educational and screening purposes only. It should not replace professional medical advice, diagnosis, or treatment. 
                      Please consult with a qualified healthcare provider for proper medical evaluation and care. The results are based on the provided information and statistical models.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;