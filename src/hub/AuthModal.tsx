import React, { useState } from 'react';
import { X, Mail, Lock, User, Building2, AlertCircle, CheckCircle } from 'lucide-react';

interface Department {
  id: string;
  name: string;
  slug: string;
}

interface AuthModalProps {
  mode: 'signin' | 'signup';
  onClose: () => void;
  onSuccess: (user: any) => void;
  departments: Department[];
}

const AuthModal: React.FC<AuthModalProps> = ({ mode, onClose, onSuccess, departments }) => {
  const [currentMode, setCurrentMode] = useState(mode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    departmentId: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (currentMode === 'signup') {
      if (!formData.fullName) {
        newErrors.fullName = 'Full name is required';
      }
      if (!formData.departmentId) {
        newErrors.departmentId = 'Please select a department';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    setTimeout(() => {
      if (currentMode === 'signin') {
        const users = JSON.parse(localStorage.getItem('hub_users') || '[]');

        // Check for super admin test account
        if (formData.email === 'admin@curacel.com' && formData.password === 'admin123') {
          const dept = departments.find(d => d.slug === 'people-ops');
          const superAdmin = {
            id: 'super-admin',
            email: 'admin@curacel.com',
            fullName: 'Super Admin',
            departmentId: dept?.id || departments[0].id,
            role: 'super_admin',
            status: 'approved',
          };
          onSuccess(superAdmin);
          setLoading(false);
          return;
        }

        // Check registered users
        const user = users.find((u: any) => u.email === formData.email && u.password === formData.password);
        if (user) {
          if (user.status === 'pending') {
            setErrors({ email: 'Your account is pending approval. Please wait for approval from your department lead.' });
            setLoading(false);
            return;
          }
          onSuccess(user);
        } else {
          setErrors({ email: 'Invalid email or password' });
        }
      } else {
        // Sign up - store user as pending
        const users = JSON.parse(localStorage.getItem('hub_users') || '[]');
        const newUser = {
          id: Date.now().toString(),
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          departmentId: formData.departmentId,
          role: 'user',
          status: 'pending',
        };
        users.push(newUser);
        localStorage.setItem('hub_users', JSON.stringify(users));
        setSignupSuccess(true);
        setTimeout(() => {
          onClose();
        }, 3000);
      }
      setLoading(false);
    }, 1500);
  };

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  if (signupSuccess) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Account Created!</h3>
          <p className="text-gray-600 mb-2">
            Your account has been created successfully and is pending approval.
          </p>
          <p className="text-sm text-gray-500">
            Your department lead or People Ops team will review and approve your account shortly.
            You'll receive an email notification once approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentMode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {currentMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
              </div>
              {errors.fullName && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.fullName}</span>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="you@curacel.com"
              />
            </div>
            {errors.email && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && (
              <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          {currentMode === 'signup' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <select
                  value={formData.departmentId}
                  onChange={(e) => handleChange('departmentId', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg ${
                    errors.departmentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select your department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
              </div>
              {errors.departmentId && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{errors.departmentId}</span>
                </div>
              )}
            </div>
          )}

          {currentMode === 'signup' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">Account Approval Required</p>
              <p>
                Your account will be reviewed by your department lead or People Ops team before activation.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? 'Processing...'
              : currentMode === 'signin'
              ? 'Sign In'
              : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setCurrentMode(currentMode === 'signin' ? 'signup' : 'signin')}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            {currentMode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
