import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  name: string;
  years: number;
  currentRole: string;
  topSkills: string;
  keyAchievement: string;
  portfolioUrl: string;
  location: string;
};

export default function OptionsApp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormValues>({
    defaultValues: {
      name: '',
      years: 0,
      currentRole: '',
      topSkills: '',
      keyAchievement: '',
      portfolioUrl: '',
      location: '',
    },
  });

  const [status, setStatus] = useState<string | null>(null);

  // Load saved values from chrome storage
  useEffect(() => {
    chrome.storage.local.get(
      ['name', 'years', 'currentRole', 'topSkills', 'keyAchievement', 'portfolioUrl', 'location'],
      (res: { [key: string]: any }) => {
        reset({
          name: typeof res.name === 'string' ? res.name : '',
          years: typeof res.years === 'number' ? res.years : 0,
          currentRole: typeof res.currentRole === 'string' ? res.currentRole : '',
          topSkills: typeof res.topSkills === 'string' ? res.topSkills : '',
          keyAchievement: typeof res.keyAchievement === 'string' ? res.keyAchievement : '',
          portfolioUrl: typeof res.portfolioUrl === 'string' ? res.portfolioUrl : '',
          location: typeof res.location === 'string' ? res.location : '',
        });
      }
    );
  }, [reset]);

  const onSubmit = (data: FormValues) => {
    setStatus(null);

    const payload = {
      name: data.name.trim(),
      years: data.years,
      currentRole: data.currentRole.trim(),
      topSkills: data.topSkills.trim(),
      keyAchievement: data.keyAchievement.trim(),
      portfolioUrl: data.portfolioUrl.trim(),
      location: data.location.trim(),
    };

    chrome.storage.local.set(payload, () => {
      setStatus('Options saved successfully!');
      setTimeout(() => setStatus(null), 2500);
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Outreacher Settings</h1>
          <p className="text-gray-600">
            Configure your profile to generate personalized outreach messages
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Required Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm mr-2">
                  Required
                </span>
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    id="name"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="years" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    id="years"
                    type="number"
                    {...register('years', {
                      valueAsNumber: true,
                      min: { value: 0, message: 'Must be 0 or greater' },
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="5"
                  />
                  {errors.years && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {errors.years.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="currentRole"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Current Role/Title *
                </label>
                <input
                  id="currentRole"
                  {...register('currentRole', { required: 'Current role is required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Senior Software Engineer"
                />
                {errors.currentRole && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.currentRole.message}
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="skills">
                  Top Skills *
                </label>
                <input
                  {...register('topSkills', { required: 'Skills are required' })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  id="skills"
                  placeholder="React, Node.js, AWS, Python, TypeScript"
                />
                {errors.topSkills && (
                  <p className="text-red-500 text-sm mt-1 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {errors.topSkills.message}
                  </p>
                )}
                <p className="text-gray-500 text-sm mt-2 flex items-center">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Separate skills with commas
                </p>
              </div>
            </div>

            {/* Optional Section */}
            <div className="pt-6 border-t border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm mr-2">
                  Optional
                </span>
                Additional Details
              </h2>

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="keyAchievement"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Key Achievement
                  </label>
                  <textarea
                    id="keyAchievement"
                    {...register('keyAchievement')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-none"
                    rows={3}
                    placeholder="Led a team of 5 engineers to build a platform serving 1M+ users, reducing load time by 40%"
                  />
                  <p className="text-gray-500 text-sm mt-2 flex items-center">
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Share your most impressive accomplishment
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="portfolioUrl"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Portfolio/Website
                    </label>
                    <input
                      id="portfolioUrl"
                      type="url"
                      {...register('portfolioUrl')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Location
                    </label>
                    <input
                      id="location"
                      {...register('location')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="San Francisco, CA / Remote"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="px-8 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Settings'
                )}
              </button>

              {status && (
                <div className="flex items-center text-green-600 font-medium animate-fade-in">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {status}
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-600 text-sm">
          <p>
            These settings help generate personalized outreach messages for LinkedIn job
            applications
          </p>
        </div>
      </div>
    </div>
  );
}
