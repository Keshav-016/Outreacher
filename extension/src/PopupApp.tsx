import { useEffect, useState } from 'react';

type ProfileData = {
  fullName: string;
  role: string;
  company: string;
  skills: string[];
  url: string;
};

export default function PopupApp() {
  const [user, setUser] = useState<{
    name: string;
    years: number;
    currentRole: string;
    topSkills: string;
    keyAchievement?: string;
    portfolioUrl?: string;
    location?: string;
  } | null>(null);
  const [isLinkedIn, setIsLinkedIn] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const fetchProfile = (attempt = 0) => {
    if (attempt > 5) {
      setError('Unable to load job details. Please refresh the LinkedIn page and try again.');
      return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_PROFILE' }, (res) => {
          if (chrome.runtime.lastError) {
            console.log(`Retry ${attempt + 1}: Content script not ready`);
            setRetryCount(attempt + 1);
            setTimeout(() => fetchProfile(attempt + 1), 800);
            return;
          }

          // Check if we got valid profile data with company and role
          if (res && res?.company && res?.role) {
            setProfile(res);
            setError(null);
            setRetryCount(0);
          } else {
            // Data incomplete, retry
            console.log(`Retry ${attempt + 1}: Profile data incomplete`);
            setRetryCount(attempt + 1);
            setTimeout(() => fetchProfile(attempt + 1), 800);
          }
        });
      }
    });
  };

  const handleGenerate = async () => {
    if (!profile || !user) return;

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:4000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user, profile }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate message');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulatedMessage = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              if (data.chunk) {
                accumulatedMessage += data.chunk;
                setMessage(accumulatedMessage);
              }
              if (data.done) {
                setLoading(false);
                return;
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Failed to generate message:', error);
      setMessage('Error: Unable to generate message. Make sure the backend server is running.');
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Load options data
  useEffect(() => {
    chrome.storage.local.get(
      ['name', 'years', 'currentRole', 'topSkills', 'keyAchievement', 'portfolioUrl', 'location'],
      (res) => {
        setUser({
          name: typeof res.name === 'string' ? res.name : '',
          years: typeof res.years === 'number' ? res.years : 0,
          currentRole: typeof res.currentRole === 'string' ? res.currentRole : '',
          topSkills: typeof res.topSkills === 'string' ? res.topSkills : '',
          keyAchievement: typeof res.keyAchievement === 'string' ? res.keyAchievement : undefined,
          portfolioUrl: typeof res.portfolioUrl === 'string' ? res.portfolioUrl : undefined,
          location: typeof res.location === 'string' ? res.location : undefined,
        });
      }
    );
  }, []);
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const url = tabs[0]?.url || '';
      setIsLinkedIn(url.includes('linkedin.com/jobs'));
    });
  }, []);

  if (!isLinkedIn || !profile || !profile.company || !profile.role) {
    return (
      <div className="w-[320px] p-4 ">
        <div className="flex justify-between items-center">
          <h1 className="font-semibold text-lg">Outreacher</h1>

          <button
            onClick={() => chrome.runtime.openOptionsPage()}
            className="text-gray-500 hover:text-gray-800 text-3xl"
            title="Settings"
          >
            ⚙
          </button>
        </div>
        {isLinkedIn ? (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Loading job details...
            {retryCount > 0 && ` (attempt ${retryCount}/5)`}
          </div>
        ) : (
          <div className="mt-3 text-xs text-gray-500 text-center">
            Please open a LinkedIn job post in a new tab.
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-[360px] p-4">
      <div className="flex justify-between">
        <h1 className="font-semibold text-lg">Outreacher</h1>

        <button
          onClick={() => chrome.runtime.openOptionsPage()}
          className="text-gray-500 hover:text-gray-800 text-3xl"
          title="Settings"
        >
          ⚙
        </button>
      </div>

      {retryCount > 0 && !profile && !error && (
        <div className="mt-3 text-xs text-gray-500 text-center">
          Loading job details... (attempt {retryCount}/5)
        </div>
      )}

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
          <p className="text-xs text-red-600">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setRetryCount(0);
              fetchProfile(0);
            }}
            className="mt-2 text-xs text-blue-600 underline"
          >
            Try Again
          </button>
        </div>
      )}

      {profile && (
        <div className="mt-2 space-y-2">
          <div className="text-sm font-medium">{profile.role}</div>
          <div className="text-xs text-gray-600">{profile.company}</div>
          {profile.skills.length > 0 && (
            <div className="text-xs">
              <span className="font-medium">Skills: </span>
              <span className="text-gray-600">{profile.skills.join(', ')}</span>
            </div>
          )}
        </div>
      )}

      <button onClick={handleGenerate} className="mt-3 w-full bg-blue-600 text-white py-2 rounded">
        {loading ? 'Generating...' : 'Generate Message'}
      </button>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="mt-3 w-full h-40 border rounded p-2 text-sm"
        placeholder="Your outreach message will appear here..."
      />
    </div>
  );
}
