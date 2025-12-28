import { useEffect, useState } from "react";

type ProfileData = {
  fullName: string;
  role: string;
  company: string;
  url: string;
};


export default function PopupApp() {
  const [user, setUser] = useState<{ name: string; years: number } | null>(null);
  const [isLinkedIn, setIsLinkedIn] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProfile = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id!, { type: "GET_PROFILE" }, res => {
        setProfile(res);
      });
    });
  };

  const handleGenerate = async () => {
    if (!profile || !user) return;

    setLoading(true);
    console.log(user , profile);

    // const res = await axios.post("http://localhost:4000/generate", {
    //   user,
    //   profile
    // });

    // setMessage(res.data.message);
    setLoading(false);
  };


  useEffect(() => {
    fetchProfile();
  }, []);



  // Load options data
  useEffect(() => {
    chrome.storage.local.get(["name", "years"], res => {
      setUser({
        name: typeof res.name === 'string' ? res.name : '',
        years: typeof res.years === 'number' ? res.years : 0
      });
    });
  }, []);
  useEffect(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const url = tabs[0]?.url || "";
    setIsLinkedIn(url.includes("https://www.linkedin.com/jobs/search/?"));
  });
}, []);

  if (!isLinkedIn) {
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
        <p className="text-sm text-gray-600 mt-5">
          Open a LinkedIn profile to use Outreacher.
        </p>
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


      {profile && (
        <div className="text-xs text-gray-600 mt-2">
          {profile.fullName} • {profile.role}
        </div>
      )}

      <button
        onClick={handleGenerate}
        className="mt-3 w-full bg-blue-600 text-white py-2 rounded"
      >
        {loading ? "Generating..." : "Generate Message"}
      </button>

      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        className="mt-3 w-full h-40 border rounded p-2 text-sm"
        placeholder="Your outreach message will appear here..."
      />
    </div>
  );
}