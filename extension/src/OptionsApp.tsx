import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type FormValues = {
  name: string;
  years: number;
  resume?: FileList;
};

export default function OptionsApp() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty }
  } = useForm<FormValues>({
    defaultValues: { name: '', years: 0 }
  });

  const [status, setStatus] = useState<string | null>(null);
  const [resumeName, setResumeName] = useState<string | null>(null);
  const [resumeDataUrl, setResumeDataUrl] = useState<string | null>(null);

  // Load saved values from chrome storage
 useEffect(() => {
  chrome.storage.local.get(
    ['name', 'years', 'resumeDataUrl', 'resumeFileName'],
    (res: { [key: string]: any }) => {

      reset({
        name: typeof res.name === 'string' ? res.name : '',
        years: typeof res.years === 'number' ? res.years : 0
      });

      setResumeDataUrl(
        typeof res.resumeDataUrl === 'string' ? res.resumeDataUrl : null
      );

      setResumeName(
        typeof res.resumeFileName === 'string' ? res.resumeFileName : null
      );
    }
  );
}, [reset]);


  const onSubmit = async (data: FormValues) => {
    setStatus(null);

    const payload: any = {
      name: data.name.trim(),
      years: data.years
    };

    const file = data.resume?.[0];
    if (file) {
      const dataUrl: string = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      payload.resumeDataUrl = dataUrl;
      payload.resumeFileName = file.name;
      setResumeName(file.name);
      setResumeDataUrl(dataUrl);
    }

    chrome.storage.local.set(payload, () => {
      setStatus('Options saved successfully!');
      setTimeout(() => setStatus(null), 2500);
    });
  };

  const handleClearResume = () => {
    chrome.storage.local.remove(['resumeDataUrl', 'resumeFileName'], () => {
      setResumeDataUrl(null);
      setResumeName(null);
      setStatus('Resume removed.');
      setTimeout(() => setStatus(null), 2000);
    });
  };

  const handleDownloadResume = () => {
    if (!resumeDataUrl || !resumeName) return;
    const a = document.createElement('a');
    a.href = resumeDataUrl;
    a.download = resumeName;
    a.click();
  };

  return (
    <div className="p-6 max-w-xl">
      <h1 className="text-xl font-semibold">Outreacher Settings</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">

        <div>
          <label className="block text-sm font-medium">Full Name</label>
          <input
            {...register('name', { required: 'Name is required' })}
            className="mt-1 w-full border p-2 rounded"
            placeholder="Your name"
          />
          {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Years of Experience</label>
          <input
            type="number"
            {...register('years', {
              valueAsNumber: true,
              min: { value: 0, message: 'Must be 0 or greater' }
            })}
            className="mt-1 w-full border p-2 rounded"
          />
          {errors.years && <p className="text-red-600 text-sm">{errors.years.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Resume (PDF/DOC)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            {...register('resume', {
              validate: files =>
                !files?.length || files[0].size <= 2 * 1024 * 1024 || 'Max file size is 2MB'
            })}
            className="mt-1"
          />
          {errors.resume && <p className="text-red-600 text-sm">{errors.resume.message}</p>}

          {resumeName && (
            <div className="mt-2 flex gap-2 text-sm">
              <span><b>{resumeName}</b></span>
              <button type="button" onClick={handleDownloadResume} className="text-blue-600 underline">Download</button>
              <button type="button" onClick={handleClearResume} className="text-red-600 underline">Clear</button>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            disabled={isSubmitting || !isDirty}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isSubmitting ? 'Saving…' : 'Save'}
          </button>

        </div>

        {status && <p className="text-sm text-gray-700">{status}</p>}
      </form>
    </div>
  );
}
