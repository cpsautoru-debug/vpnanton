import { useState, useEffect, useCallback } from 'react';

interface Server {
  id: string;
  country: string;
  city: string;
  flag: string;
  ping: number;
  load: number;
}

const servers: Server[] = [
  { id: '1', country: 'Нидерланды', city: 'Амстердам', flag: '🇳🇱', ping: 24, load: 35 },
  { id: '2', country: 'Германия', city: 'Франкфурт', flag: '🇩🇪', ping: 31, load: 42 },
  { id: '3', country: 'США', city: 'Нью-Йорк', flag: '🇺🇸', ping: 89, load: 67 },
  { id: '4', country: 'Великобритания', city: 'Лондон', flag: '🇬🇧', ping: 38, load: 28 },
  { id: '5', country: 'Япония', city: 'Токио', flag: '🇯🇵', ping: 145, load: 51 },
  { id: '6', country: 'Сингапур', city: 'Сингапур', flag: '🇸🇬', ping: 162, load: 19 },
  { id: '7', country: 'Канада', city: 'Торонто', flag: '🇨🇦', ping: 95, load: 44 },
  { id: '8', country: 'Швеция', city: 'Стокгольм', flag: '🇸🇪', ping: 42, load: 22 },
  { id: '9', country: 'Швейцария', city: 'Цюрих', flag: '🇨🇭', ping: 35, load: 31 },
  { id: '10', country: 'Финляндия', city: 'Хельсинки', flag: '🇫🇮', ping: 48, load: 15 },
];

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server>(servers[0]);
  const [showServers, setShowServers] = useState(false);
  const [downloadSpeed, setDownloadSpeed] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState(0);
  const [dataUsed, setDataUsed] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [pulseAnimation, setPulseAnimation] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isConnected) {
      interval = setInterval(() => {
        setDownloadSpeed(Math.random() * 50 + 30);
        setUploadSpeed(Math.random() * 15 + 5);
        setDataUsed(prev => prev + Math.random() * 0.5);
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      setDownloadSpeed(0);
      setUploadSpeed(0);
    }
    return () => clearInterval(interval);
  }, [isConnected]);

  const handleConnect = useCallback(() => {
    if (isConnecting) return;
    if (isConnected) {
      setIsConnected(false);
      setDataUsed(0);
      setSessionTime(0);
      return;
    }
    setIsConnecting(true);
    setPulseAnimation(true);
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      setPulseAnimation(false);
    }, 2500);
  }, [isConnected, isConnecting]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getLoadColor = (load: number) => {
    if (load < 30) return 'text-green-400';
    if (load < 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getLoadBarColor = (load: number) => {
    if (load < 30) return 'bg-green-400';
    if (load < 60) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-950 text-white flex flex-col items-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full transition-all duration-1000 ${
          isConnected ? 'bg-emerald-500/10 blur-3xl' : isConnecting ? 'bg-blue-500/10 blur-3xl' : 'bg-gray-500/5 blur-3xl'
        }`}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent"></div>
      </div>

      {/* Header */}
      <header className="w-full max-w-4xl mx-auto px-4 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-blue-500 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">FreeVPN</h1>
            <p className="text-xs text-gray-400">Безопасный & Бесплатный</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
            isConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400'
          }`}>
            {isConnected ? '● Защищено' : '○ Не защищено'}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 flex flex-col items-center justify-center relative z-10">
        
        {/* Connection status */}
        <div className="text-center mb-8">
          <p className={`text-sm font-medium mb-2 transition-colors duration-500 ${
            isConnected ? 'text-emerald-400' : isConnecting ? 'text-blue-400' : 'text-gray-400'
          }`}>
            {isConnected ? 'Подключено' : isConnecting ? 'Подключение...' : 'Нажмите для подключения'}
          </p>
          {isConnected && (
            <p className="text-2xl font-mono text-white/80">{formatTime(sessionTime)}</p>
          )}
        </div>

        {/* Power button */}
        <div className="relative mb-10">
          {/* Pulse rings */}
          {pulseAnimation && (
            <>
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/50 animate-ping"></div>
              <div className="absolute inset-[-8px] rounded-full border-2 border-blue-400/30 animate-ping" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute inset-[-16px] rounded-full border-2 border-blue-400/10 animate-ping" style={{ animationDelay: '0.6s' }}></div>
            </>
          )}
          {isConnected && (
            <div className="absolute inset-[-4px] rounded-full bg-emerald-500/20 animate-pulse"></div>
          )}
          
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className={`relative w-40 h-40 rounded-full flex items-center justify-center transition-all duration-500 transform hover:scale-105 active:scale-95 ${
              isConnected
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-[0_0_60px_rgba(16,185,129,0.4)]'
                : isConnecting
                ? 'bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_60px_rgba(59,130,246,0.4)] animate-pulse'
                : 'bg-gradient-to-br from-gray-700 to-gray-800 shadow-[0_0_40px_rgba(0,0,0,0.5)] hover:shadow-[0_0_60px_rgba(100,100,100,0.3)]'
            }`}
          >
            <div className={`absolute inset-1 rounded-full border-2 ${
              isConnected ? 'border-emerald-400/30' : isConnecting ? 'border-blue-400/30' : 'border-gray-600/30'
            }`}></div>
            
            {isConnecting ? (
              <svg className="w-16 h-16 text-white animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <svg className={`w-16 h-16 transition-colors duration-500 ${isConnected ? 'text-white' : 'text-gray-300'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isConnected ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-12.728 0l12.728-12.728M5.636 18.364l12.728-12.728" />
                )}
              </svg>
            )}
          </button>
        </div>

        {/* Server selector */}
        <div className="w-full max-w-sm mb-8">
          <button
            onClick={() => setShowServers(!showServers)}
            className="w-full bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 flex items-center justify-between hover:bg-gray-800/80 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{selectedServer.flag}</span>
              <div className="text-left">
                <p className="text-sm font-semibold text-white">{selectedServer.country}</p>
                <p className="text-xs text-gray-400">{selectedServer.city} • {selectedServer.ping}ms</p>
              </div>
            </div>
            <svg className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showServers ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Server list */}
          {showServers && (
            <div className="mt-2 bg-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-2xl overflow-hidden max-h-80 overflow-y-auto">
              {servers.map(server => (
                <button
                  key={server.id}
                  onClick={() => {
                    setSelectedServer(server);
                    setShowServers(false);
                  }}
                  className={`w-full p-3 flex items-center justify-between hover:bg-gray-700/50 transition-colors duration-200 ${
                    selectedServer.id === server.id ? 'bg-emerald-500/10 border-l-2 border-emerald-400' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{server.flag}</span>
                    <div className="text-left">
                      <p className="text-sm font-medium text-white">{server.country}</p>
                      <p className="text-xs text-gray-400">{server.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Пинг</p>
                      <p className={`text-sm font-mono ${server.ping < 50 ? 'text-green-400' : server.ping < 100 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {server.ping}ms
                      </p>
                    </div>
                    <div className="w-16">
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-gray-500">Нагрузка</span>
                        <span className={`text-xs ${getLoadColor(server.load)}`}>{server.load}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full transition-all duration-500 ${getLoadBarColor(server.load)}`} style={{ width: `${server.load}%` }}></div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Stats */}
        {isConnected && (
          <div className="w-full max-w-sm grid grid-cols-2 gap-3 mb-8">
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{downloadSpeed.toFixed(1)}</p>
              <p className="text-xs text-gray-400">Мбит/с ↓</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <div className="flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-emerald-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-white">{uploadSpeed.toFixed(1)}</p>
              <p className="text-xs text-gray-400">Мбит/с ↑</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{dataUsed.toFixed(1)}</p>
              <p className="text-xs text-gray-400">МБ использовано</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-white">{selectedServer.ping}</p>
              <p className="text-xs text-gray-400">ms задержка</p>
            </div>
          </div>
        )}

        {/* Features */}
        {!isConnected && !isConnecting && (
          <div className="w-full max-w-sm grid grid-cols-3 gap-3">
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🔒</div>
              <p className="text-xs text-gray-300">AES-256</p>
              <p className="text-[10px] text-gray-500">Шифрование</p>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">⚡</div>
              <p className="text-xs text-gray-300">Без лимитов</p>
              <p className="text-[10px] text-gray-500">Скорость</p>
            </div>
            <div className="bg-gray-800/40 border border-gray-700/30 rounded-xl p-3 text-center">
              <div className="text-2xl mb-1">🌍</div>
              <p className="text-xs text-gray-300">10 стран</p>
              <p className="text-[10px] text-gray-500">Серверы</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl mx-auto px-4 py-4 text-center relative z-10">
        <p className="text-xs text-gray-500">
          FreeVPN © 2024 • Ваша конфиденциальность — наш приоритет
        </p>
        <div className="flex items-center justify-center gap-4 mt-2">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            No Logs
          </span>
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Без рекламы
          </span>
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
            </svg>
            10 стран
          </span>
        </div>
      </footer>
    </div>
  );
}

export default App;
