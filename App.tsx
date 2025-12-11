import React, { useState } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { Button } from './components/Button';
import { addChristmasHat } from './services/geminiService';
import { AppState } from './types';
import { Wand2, Download, RefreshCw, AlertCircle, Share2, Gift, Check } from 'lucide-react';

// Define available hat colors
const HAT_COLORS = [
  { name: 'Red', hex: '#D42426', value: 'Red' },
  { name: 'Green', hex: '#165B33', value: 'Green' },
  { name: 'Blue', hex: '#2563EB', value: 'Blue' },
  { name: 'Gold', hex: '#F59E0B', value: 'Gold' },
  { name: 'Pink', hex: '#EC4899', value: 'Pink' },
  { name: 'Purple', hex: '#9333EA', value: 'Purple' },
];

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [generatedMimeType, setGeneratedMimeType] = useState<string>('image/png');
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const [selectedColor, setSelectedColor] = useState<string>('Red');
  const [error, setError] = useState<string | null>(null);

  // Helper to determine closest supported aspect ratio
  const calculateAspectRatio = (width: number, height: number): string => {
    const ratio = width / height;
    const supportedRatios = [
      { id: "1:1", value: 1.0 },
      { id: "4:3", value: 4/3 },
      { id: "3:4", value: 3/4 },
      { id: "16:9", value: 16/9 },
      { id: "9:16", value: 9/16 },
    ];

    // Find the ratio with the minimum difference
    const closest = supportedRatios.reduce((prev, curr) => {
      return (Math.abs(curr.value - ratio) < Math.abs(prev.value - ratio) ? curr : prev);
    });

    return closest.id;
  };

  const handleImageSelect = (base64: string, mimeType: string) => {
    setOriginalImage(base64);
    setImageMimeType(mimeType);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setError(null);

    // Create an image object to get dimensions
    const img = new Image();
    img.onload = () => {
      const bestRatio = calculateAspectRatio(img.width, img.height);
      console.log(`Detected dimensions: ${img.width}x${img.height}, Ratio: ${img.width/img.height}, Selected: ${bestRatio}`);
      setAspectRatio(bestRatio);
    };
    img.src = base64;
  };

  const handleClear = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setAppState(AppState.IDLE);
    setError(null);
    setSelectedColor('Red'); // Reset color
  };

  const handleGenerate = async () => {
    if (!originalImage || !imageMimeType) return;

    setAppState(AppState.GENERATING);
    setError(null);

    try {
      // Pass the calculated aspect ratio and selected color to the service
      const result = await addChristmasHat(originalImage, imageMimeType, aspectRatio, selectedColor);
      
      const fullGeneratedUrl = `data:${result.mimeType};base64,${result.base64}`;
      setGeneratedImage(fullGeneratedUrl);
      setGeneratedMimeType(result.mimeType);
      setAppState(AppState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong while generating the image.");
      setAppState(AppState.ERROR);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    // Determine extension from mime type
    const ext = generatedMimeType.split('/')[1] || 'png';
    
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `merry-style-christmas-${selectedColor.toLowerCase()}-${Date.now()}.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = async () => {
    if (!generatedImage) return;

    try {
      const response = await fetch(generatedImage);
      const blob = await response.blob();
      const ext = generatedMimeType.split('/')[1] || 'png';
      const file = new File([blob], `merry-christmas.${ext}`, { type: generatedMimeType });

      if (navigator.share) {
        await navigator.share({
          files: [file],
          title: 'MerryStyle Christmas Photo',
          text: 'Check out this festive photo I made with MerryStyle AI!',
        });
      } else {
        alert("Sharing isn't supported on this device/browser, but you can still download the image!");
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-christmas-snow font-sans pb-20">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-10">
        
        {/* Intro Section */}
        <div className="text-center mb-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-4 tracking-tight">
            Add a <span className="text-christmas-red">Christmas Hat</span> <br/>to Any Photo
          </h2>
          <p className="text-lg text-slate-600">
            Upload a portrait, pet photo, or avatar, and our AI will seamlessly blend a festive hat with your image's unique style.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Left Column: Input */}
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">1</span>
                Upload Image
              </h3>
              <ImageUploader 
                onImageSelect={handleImageSelect} 
                onClear={handleClear} 
                selectedImage={originalImage} 
              />
            </div>

            {originalImage && appState !== AppState.SUCCESS && (
               <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 animate-fade-in">
                 <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">2</span>
                  Customize & Generate
                </h3>
                 
                 {/* Color Selection */}
                 <div className="mb-6">
                   <label className="block text-sm font-semibold text-slate-700 mb-3">
                     Choose Hat Color
                   </label>
                   <div className="flex flex-wrap gap-3">
                     {HAT_COLORS.map((color) => (
                       <button
                         key={color.name}
                         onClick={() => setSelectedColor(color.value)}
                         className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                           selectedColor === color.value 
                             ? 'ring-2 ring-offset-2 ring-slate-400 scale-110 shadow-md' 
                             : 'hover:scale-105 hover:shadow-sm'
                         }`}
                         style={{ backgroundColor: color.hex }}
                         title={color.name}
                         type="button"
                       >
                         {selectedColor === color.value && (
                           <Check size={16} className="text-white drop-shadow-md" strokeWidth={3} />
                         )}
                       </button>
                     ))}
                   </div>
                 </div>

                 <p className="text-slate-600 mb-6 text-sm border-t border-slate-100 pt-4">
                   Ready to make it festive? The AI will analyze the lighting and art style to place the perfect <span style={{ color: HAT_COLORS.find(c => c.value === selectedColor)?.hex }} className="font-bold">{selectedColor.toLowerCase()}</span> hat.
                 </p>
                 <Button 
                   onClick={handleGenerate} 
                   isLoading={appState === AppState.GENERATING}
                   className="w-full"
                   icon={<Wand2 size={20} />}
                 >
                   {appState === AppState.GENERATING ? 'Adding Magic...' : 'Add Christmas Hat'}
                 </Button>
               </div>
            )}
            
            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Output */}
          <div className="flex flex-col gap-6">
             <div className={`bg-white p-6 rounded-3xl shadow-sm border border-slate-200 min-h-[400px] flex flex-col ${!generatedImage ? 'justify-center items-center' : ''}`}>
               <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2 w-full">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-xs">3</span>
                  Result
                </h3>

                {!generatedImage ? (
                  <div className="flex flex-col items-center text-center text-slate-400 max-w-xs">
                    {appState === AppState.GENERATING ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-christmas-green/20 border-t-christmas-green rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-600 font-medium">Painting with snowflakes...</p>
                        <p className="text-xs text-slate-400 mt-2">This may take a few seconds</p>
                      </div>
                    ) : (
                      <>
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                          <Gift size={32} className="text-slate-300" />
                        </div>
                        <p>Your festive transformation will appear here</p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col gap-6 w-full animate-fade-in">
                    <div className="relative w-full aspect-square md:aspect-video rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 group">
                      <img 
                        src={generatedImage} 
                        alt="Generated" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <Button 
                        onClick={handleDownload} 
                        variant="secondary"
                        icon={<Download size={18} />}
                      >
                        Download
                      </Button>
                      <Button 
                        onClick={handleShare} 
                        variant="primary"
                        icon={<Share2 size={18} />}
                        className="hidden sm:inline-flex"
                      >
                        Share
                      </Button>
                      <Button 
                        onClick={() => {
                          setGeneratedImage(null);
                          setAppState(AppState.IDLE);
                        }} 
                        variant="outline"
                        icon={<RefreshCw size={18} />}
                      >
                        Try Again
                      </Button>
                      {/* Mobile-only Share button to take full width if needed, or rely on the grid above */}
                      <Button 
                        onClick={handleShare} 
                        variant="primary"
                        icon={<Share2 size={18} />}
                        className="sm:hidden"
                      >
                        Share
                      </Button>
                    </div>
                  </div>
                )}
             </div>
          </div>
        </div>
        
        {/* Features/Tips */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-red-100 text-christmas-red flex items-center justify-center mb-4">
               <Wand2 size={20} />
             </div>
             <h4 className="font-bold text-slate-800 mb-2">Style Match</h4>
             <p className="text-sm text-slate-600">The AI matches the texture, lighting, and art style of your original image.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-green-100 text-christmas-green flex items-center justify-center mb-4">
               <Share2 size={20} />
             </div>
             <h4 className="font-bold text-slate-800 mb-2">Easy Sharing</h4>
             <p className="text-sm text-slate-600">Download your festive photos instantly and share them with friends and family.</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
             <div className="w-10 h-10 rounded-full bg-yellow-100 text-christmas-gold flex items-center justify-center mb-4">
               <Gift size={20} />
             </div>
             <h4 className="font-bold text-slate-800 mb-2">Custom Colors</h4>
             <p className="text-sm text-slate-600">Choose from Red, Green, Blue, Gold, and more to match your outfit or mood.</p>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;