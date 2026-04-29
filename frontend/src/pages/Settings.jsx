import { 
  FaChevronLeft, FaAt, FaLock, FaUserShield, FaFingerprint, 
  FaShareAlt, FaBell, FaFileAlt, FaQuestionCircle, FaEnvelope, 
  FaSignOutAlt, FaChevronRight, FaHome, FaHistory, FaCalendarAlt, FaCog, FaMoon, FaSun
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Settings() {
  const navigate = useNavigate();
  
  // بيانات المستخدم
  const [userData] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : { username: "User Profile", email: "........@email.com", role: "Patient" };
  });

  // States لتشغيل الـ Toggles
  const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains("dark"));
  const [biometric, setBiometric] = useState(true);
  const [appAlerts, setAppAlerts] = useState(true);
  const [emailReports, setEmailReports] = useState(false);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    document.documentElement.classList.toggle("dark", newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="min-h-screen pb-28 font-sans transition-colors duration-300 bg-[var(--bg-app)] text-[var(--text-main)]">
      {/* Header */}
      <div className="bg-[var(--bg-card)] p-4 flex items-center border-b border-[var(--border)] sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-[#0B8ED9]"><FaChevronLeft size={16} /></button>
        <h1 className="flex-1 text-center font-bold text-lg pr-4 tracking-tight">Settings</h1>
      </div>

      {/* Profile Section */}
      <div className="flex flex-col items-center py-8">
        <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-[1.8rem] flex items-center justify-center mb-3 shadow-inner">
          <div className="w-12 h-12 bg-[#0B8ED9] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <FaUserShield size={24} />
          </div>
        </div>
        <h2 className="text-xl font-black">{userData.username}</h2>
        <p className="text-[10px] font-bold text-[var(--text-sub)] uppercase tracking-widest mt-1">Privacy Mode Active</p>
      </div>

      <div className="space-y-6">
        {/* Group: Appearance */}
        <SettingsGroup title="Appearance">
          <ToggleRow 
            icon={<FaMoon />} 
            label="Dark Mode" 
            isEnabled={isDark} 
            onToggle={toggleTheme} 
            color="bg-slate-700" 
            isLast 
          />
        </SettingsGroup>

        {/* Group: Account Settings */}
        <SettingsGroup title="Account Settings">
          <SettingRow icon={<FaAt />} label="Email Address" value={userData.email} color="bg-blue-500" />
          <SettingRow icon={<FaLock />} label="Password" color="bg-indigo-500" />
          <SettingRow icon={<FaUserShield />} label="User Role" value={userData.role} color="bg-cyan-500" isLast />
        </SettingsGroup>

        {/* Group: Privacy & Security */}
        <SettingsGroup title="Privacy & Security">
          <ToggleRow 
            icon={<FaFingerprint />} 
            label="Biometric Lock" 
            isEnabled={biometric} 
            onToggle={() => setBiometric(!biometric)} 
            color="bg-emerald-500" 
          />
          <SettingRow icon={<FaShareAlt />} label="Data Sharing" color="bg-teal-500" isLast />
        </SettingsGroup>

        {/* Group: Notifications */}
        <SettingsGroup title="Notification Preferences">
          <ToggleRow 
            icon={<FaBell />} 
            label="App Alerts" 
            isEnabled={appAlerts} 
            onToggle={() => setAppAlerts(!appAlerts)} 
            color="bg-orange-500" 
          />
          <ToggleRow 
            icon={<FaFileAlt />} 
            label="Email Reports" 
            isEnabled={emailReports} 
            onToggle={() => setEmailReports(!emailReports)} 
            color="bg-rose-500" 
            isLast 
          />
        </SettingsGroup>

        {/* Group: Support */}
        <SettingsGroup title="Support">
          <SettingRow icon={<FaQuestionCircle />} label="Help Center" color="bg-slate-500" />
          <SettingRow icon={<FaEnvelope />} label="Contact Us" color="bg-blue-400" isLast />
        </SettingsGroup>

        {/* Log Out */}
        <div className="px-6 mt-8">
           <button 
             onClick={handleLogout}
             className="w-full py-4 bg-[var(--bg-card)] border border-red-100 dark:border-red-900/30 rounded-2xl text-red-500 font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm"
           >
             <FaSignOutAlt className="rotate-180" size={14}/> Log Out
           </button>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg-card)]/80 backdrop-blur-lg border-t border-[var(--border)] p-3 flex justify-around items-center z-50">
        <NavItem icon={<FaHome size={22} />} label="Home" onClick={() => navigate('/home')} />
        <NavItem icon={<FaHistory size={22} />} label="History" />
        <NavItem icon={<FaCalendarAlt size={22} />} label="Schedule" />
        <NavItem icon={<FaCog size={22} />} label="Settings" active />
      </nav>
    </div>
  );
}

// --- المكونات المساعدة لتحقيق التصميم الـ Flat ---

function SettingsGroup({ title, children }) {
  return (
    <div className="px-1">
      <h3 className="text-[10px] font-black text-[var(--text-sub)] uppercase px-5 mb-2 tracking-[0.15em]">{title}</h3>
      <div className="bg-[var(--bg-card)] border-y border-[var(--border)]">{children}</div>
    </div>
  );
}

function SettingRow({ icon, label, value, color, isLast }) {
  return (
    <div className={`flex items-center justify-between py-3.5 px-5 active:bg-slate-50 dark:active:bg-slate-800/50 transition-colors ${!isLast ? 'border-b border-[var(--border)]' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${color} text-white rounded-[0.6rem] flex items-center justify-center shadow-sm`}>{icon}</div>
        <span className="font-semibold text-[13px]">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-[11px] text-[var(--text-sub)] font-medium">{value}</span>}
        <FaChevronRight className="text-slate-300" size={10} />
      </div>
    </div>
  );
}

function ToggleRow({ icon, label, isEnabled, onToggle, color, isLast }) {
  return (
    <div className={`flex items-center justify-between py-3.5 px-5 ${!isLast ? 'border-b border-[var(--border)]' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 ${color} text-white rounded-[0.6rem] flex items-center justify-center shadow-sm`}>{icon}</div>
        <span className="font-semibold text-[13px]">{label}</span>
      </div>
      <button 
        onClick={onToggle} 
        className={`w-11 h-6 rounded-full relative transition-all duration-300 ${isEnabled ? 'bg-[#4CD964]' : 'bg-slate-200 dark:bg-slate-700'}`}
      >
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${isEnabled ? 'left-6' : 'left-1'}`}></div>
      </button>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button onClick={onClick} className={`flex flex-col items-center gap-1 p-1 transition-colors ${active ? 'text-[#0B8ED9]' : 'text-slate-300 dark:text-slate-600'}`}>
      {icon}
      <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}