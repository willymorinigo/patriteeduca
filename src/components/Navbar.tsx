import React from "react";
import { 
  GraduationCap, 
  FileText, 
  Users, 
  AlertTriangle, 
  BookOpen, 
  Sparkles, 
  Download, 
  Upload,
  Calendar,
  Cloud,
  CloudCheck,
  MapPin
} from "lucide-react";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  reinforcementCount: number;
  studentCount: number;
  isCloudSynced?: boolean;
  onExportData: () => void;
  onImportData: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  reinforcementCount,
  studentCount,
  isCloudSynced = true,
  onExportData,
  onImportData,
}) => {
  const currentDate = new Date().toLocaleDateString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const navItems = [
    {
      id: "solver",
      label: "Resolvelo Paso a Paso",
      icon: GraduationCap,
      badge: null,
      desc: "Explicación como en el pizarrón",
    },
    {
      id: "worksheets",
      label: "Generar Prácticas & PDF",
      icon: FileText,
      badge: null,
      desc: "Fichas imprimibles para WhatsApp",
    },
    {
      id: "students",
      label: "Mis Alumnos",
      icon: Users,
      badge: studentCount,
      desc: "Registro y seguimiento individual",
    },
    {
      id: "reinforcements",
      label: "Temas a Reforzar",
      icon: AlertTriangle,
      badge: reinforcementCount,
      badgeColor: "bg-amber-500 text-white",
      desc: "Detección de dificultades",
    },
    {
      id: "curriculum",
      label: "Contenidos PBA & Tips",
      icon: BookOpen,
      badge: null,
      desc: "Diseño curricular y atajos",
    },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Deep Slate Navy Professional Header */}
      <div className="bg-[#0F172A] text-slate-100 px-4 sm:px-6 py-3 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Teacher Branding */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0 ring-2 ring-blue-400/30">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-base sm:text-lg text-white tracking-tight leading-tight">
                  Patric-IA te Educa
                </h1>
                <span className="bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-blue-400" />
                  PBA · Primaria y Secundaria
                </span>
                <span className="hidden md:flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" title="Los cambios se guardan y sincronizan automáticamente en la nube para todos los dispositivos y links compartidos">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Nube Activa (Firebase)
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Plataforma Pedagógica y Generador de Ejercicios · Prof. Patricia Morinigo
              </p>
            </div>
          </div>

          {/* Right actions: Date, Teacher Avatar, Backup/Restore */}
          <div className="flex items-center gap-3 text-xs">
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80 text-slate-300">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span className="capitalize">{currentDate}</span>
            </div>

            {/* Profile pill */}
            <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/80">
              <div className="w-6 h-6 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                PM
              </div>
              <div className="text-left leading-tight">
                <div className="text-[11px] font-semibold text-white">Patricia Morinigo</div>
                <div className="text-[10px] text-slate-400">Docente Particular</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onExportData}
                title="Descargar copia de seguridad de alumnos y temas"
                className="bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-200 hover:text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-700 text-xs font-medium"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Respaldar</span>
              </button>
              <button
                onClick={onImportData}
                title="Restaurar copia de seguridad"
                className="bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all text-slate-200 hover:text-white px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 border border-slate-700 text-xs font-medium"
              >
                <Upload className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Importar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <nav className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-white" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
                {item.badge !== null && item.badge > 0 && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-bold leading-none ${
                      isActive 
                        ? "bg-white/25 text-white" 
                        : item.badgeColor || "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};

