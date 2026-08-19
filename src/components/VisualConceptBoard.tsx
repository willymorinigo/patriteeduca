import React, { useState } from "react";
import { Subject } from "../types";
import { 
  Scale, 
  PieChart as PieIcon, 
  TrendingUp, 
  Triangle, 
  Type as TextIcon, 
  Volume2, 
  Car, 
  Compass, 
  Atom, 
  Layers, 
  Sparkles, 
  Check, 
  ArrowRight,
  Lightbulb,
  Info
} from "lucide-react";

interface VisualConceptBoardProps {
  subject: Subject;
  topicTitle: string;
  gradeName?: string;
  goldenRule?: string;
  everydayAnalogy?: string;
  practicalExample?: {
    statement: string;
    stepByStepSolution: string;
  };
}

export const VisualConceptBoard: React.FC<VisualConceptBoardProps> = ({
  subject,
  topicTitle,
  gradeName,
  goldenRule,
  everydayAnalogy,
  practicalExample,
}) => {
  const normTopic = topicTitle.toLowerCase();
  const [interactiveStep, setInteractiveStep] = useState<number>(0);
  const [fractionValue, setFractionValue] = useState<number>(3); // 3 out of 4 default
  const [slopeValue, setSlopeValue] = useState<number>(2); // for linear functions

  // Detect which visual diagram best matches the topic
  const isEquation = normTopic.includes("ecuaci") || normTopic.includes("despeje") || normTopic.includes("lineal") || normTopic.includes("incógnita");
  const isFraction = normTopic.includes("fracci") || normTopic.includes("racional") || normTopic.includes("decimal") || normTopic.includes("porcentaje") || normTopic.includes("proporci");
  const isFunction = normTopic.includes("funci") || normTopic.includes("recta") || normTopic.includes("pendiente") || normTopic.includes("cartesiano") || normTopic.includes("parábola");
  const isPythagoras = normTopic.includes("pitág") || normTopic.includes("triáng") || normTopic.includes("trigono") || normTopic.includes("ángulo") || normTopic.includes("hipotenusa");
  const isSyntax = subject === "Prácticas del Lenguaje" && (normTopic.includes("sint") || normTopic.includes("oraci") || normTopic.includes("sujeto") || normTopic.includes("predicado") || normTopic.includes("objeto") || normTopic.includes("modificador"));
  const isAccentuation = normTopic.includes("acentu") || normTopic.includes("tilde") || normTopic.includes("aguda") || normTopic.includes("grave") || normTopic.includes("esdrúj") || normTopic.includes("sílaba");
  const isKinematics = subject === "Física" && (normTopic.includes("mru") || normTopic.includes("velocidad") || normTopic.includes("movimiento") || normTopic.includes("aceleraci") || normTopic.includes("cinemát"));
  const isForces = subject === "Física" && (normTopic.includes("fuerza") || normTopic.includes("newton") || normTopic.includes("dinám") || normTopic.includes("peso") || normTopic.includes("rozamiento"));
  const isChemistry = subject === "Química" || normTopic.includes("lewis") || normTopic.includes("iónic") || normTopic.includes("covalent") || normTopic.includes("átomo") || normTopic.includes("valencia") || normTopic.includes("enlace");

  return (
    <div className="space-y-4">
      {/* 1. VISUAL INTERACTIVE CHALKBOARD / CANVAS */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#93c5fd_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        {/* Top Header of the Chalkboard */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Pizarra Gráfica Didáctica · {subject}
            </span>
          </div>
          <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {gradeName || "PBA"}
          </span>
        </div>

        {/* --- MODEL 1: EQUATIONS BALANCE SCALE --- */}
        {isEquation && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Scale className="w-4 h-4" /> La Ecuación como Balanza en Equilibrio
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Toda ecuación mantiene la igualdad estricta. Lo que aplicás a la izquierda, debés aplicarlo a la derecha.
              </p>
            </div>

            {/* SVG Balance Scale */}
            <div className="flex justify-center items-center py-3">
              <svg viewBox="0 0 360 160" className="w-full max-w-sm h-36">
                {/* Fulcrum base and pillar */}
                <polygon points="180,85 165,145 195,145" fill="#475569" stroke="#64748b" strokeWidth="2" />
                <rect x="150" y="145" width="60" height="10" rx="3" fill="#334155" />
                
                {/* Center Pivot Point with Equal Sign */}
                <circle cx="180" cy="85" r="14" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
                <text x="180" y="90" textAnchor="middle" fill="#ffffff" fontSize="14" fontWeight="bold">=</text>

                {/* Lever Bar (Horizontal Balance) */}
                <line x1="50" y1="85" x2="310" y2="85" stroke="#cbd5e1" strokeWidth="5" strokeLinecap="round" />

                {/* Left Strings & Pan */}
                <line x1="70" y1="85" x2="50" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="70" y1="85" x2="90" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="70" cy="120" rx="35" ry="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

                {/* Left Pan Contents */}
                {interactiveStep === 0 && (
                  <g>
                    <rect x="42" y="98" width="26" height="18" rx="4" fill="#3b82f6" />
                    <text x="55" y="111" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">2x</text>
                    <rect x="72" y="100" width="22" height="16" rx="4" fill="#f59e0b" />
                    <text x="83" y="112" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">+7</text>
                  </g>
                )}
                {interactiveStep === 1 && (
                  <g>
                    <rect x="57" y="98" width="26" height="18" rx="4" fill="#3b82f6" />
                    <text x="70" y="111" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">2x</text>
                  </g>
                )}
                {interactiveStep === 2 && (
                  <g>
                    <circle cx="70" cy="106" r="12" fill="#10b981" />
                    <text x="70" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">x</text>
                  </g>
                )}

                {/* Right Strings & Pan */}
                <line x1="290" y1="85" x2="270" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                <line x1="290" y1="85" x2="310" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                <ellipse cx="290" cy="120" rx="35" ry="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />

                {/* Right Pan Contents */}
                {interactiveStep === 0 && (
                  <g>
                    <rect x="275" y="96" width="30" height="20" rx="4" fill="#10b981" />
                    <text x="290" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">19</text>
                  </g>
                )}
                {interactiveStep === 1 && (
                  <g>
                    <rect x="272" y="96" width="36" height="20" rx="4" fill="#10b981" />
                    <text x="290" y="110" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">19 - 7 = 12</text>
                  </g>
                )}
                {interactiveStep === 2 && (
                  <g>
                    <rect x="275" y="96" width="30" height="20" rx="4" fill="#10b981" />
                    <text x="290" y="110" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">6</text>
                  </g>
                )}
              </svg>
            </div>

            {/* Interactive Step Buttons */}
            <div className="grid grid-cols-3 gap-2 text-center pt-1">
              <button
                onClick={() => setInteractiveStep(0)}
                className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                  interactiveStep === 0
                    ? "bg-blue-600 border-blue-400 text-white shadow-md"
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                1. Planteo: 2x + 7 = 19
              </button>
              <button
                onClick={() => setInteractiveStep(1)}
                className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                  interactiveStep === 1
                    ? "bg-blue-600 border-blue-400 text-white shadow-md"
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                2. Restar 7: 2x = 12
              </button>
              <button
                onClick={() => setInteractiveStep(2)}
                className={`p-2 rounded-xl text-xs font-semibold transition-all border ${
                  interactiveStep === 2
                    ? "bg-emerald-600 border-emerald-400 text-white shadow-md"
                    : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-800"
                }`}
              >
                3. Despeje: x = 6 ✓
              </button>
            </div>
          </div>
        )}

        {/* --- MODEL 2: FRACTIONS PIZZA & BARS --- */}
        {isFraction && !isEquation && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <PieIcon className="w-4 h-4" /> Partes de un Todo & Equivalencias
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                El denominador indica en cuántas partes iguales se divide la unidad, y el numerador cuántas partes tomamos.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center py-2">
              {/* Circular Fraction SVG */}
              <div className="flex flex-col items-center justify-center p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <svg viewBox="0 0 120 120" className="w-28 h-28">
                  {/* Outer circle */}
                  <circle cx="60" cy="60" r="50" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
                  
                  {/* Slices for 4 parts */}
                  {/* Slice 1 (Top Right) */}
                  <path d="M60,60 L60,10 A50,50 0 0,1 110,60 Z" fill={fractionValue >= 1 ? "#3b82f6" : "#334155"} stroke="#0f172a" strokeWidth="1.5" />
                  {/* Slice 2 (Bottom Right) */}
                  <path d="M60,60 L110,60 A50,50 0 0,1 60,110 Z" fill={fractionValue >= 2 ? "#3b82f6" : "#334155"} stroke="#0f172a" strokeWidth="1.5" />
                  {/* Slice 3 (Bottom Left) */}
                  <path d="M60,60 L60,110 A50,50 0 0,1 10,60 Z" fill={fractionValue >= 3 ? "#3b82f6" : "#334155"} stroke="#0f172a" strokeWidth="1.5" />
                  {/* Slice 4 (Top Left) */}
                  <path d="M60,60 L10,60 A50,50 0 0,1 60,10 Z" fill={fractionValue >= 4 ? "#3b82f6" : "#334155"} stroke="#0f172a" strokeWidth="1.5" />

                  {/* Center Dot */}
                  <circle cx="60" cy="60" r="4" fill="#ffffff" />
                </svg>
                <div className="mt-2 text-center">
                  <span className="text-base font-extrabold text-blue-400">{fractionValue}/4</span>
                  <span className="text-2xs text-slate-400 block">({(fractionValue * 25)}% del total)</span>
                </div>
              </div>

              {/* Fraction comparison bar */}
              <div className="space-y-3 p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-2xs font-bold text-slate-300 uppercase block">Comparación de Equivalencia:</span>
                
                {/* 1/2 bar */}
                <div>
                  <div className="flex justify-between text-2xs text-slate-400 mb-1">
                    <span>1/2 (Mitad)</span>
                    <span className="font-semibold text-emerald-400">50%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-700 rounded-md overflow-hidden flex">
                    <div className="w-1/2 bg-emerald-500 h-full"></div>
                    <div className="w-1/2 bg-slate-700 h-full"></div>
                  </div>
                </div>

                {/* 3/4 bar */}
                <div>
                  <div className="flex justify-between text-2xs text-slate-400 mb-1">
                    <span>3/4 (Tres cuartos)</span>
                    <span className="font-semibold text-blue-400">75%</span>
                  </div>
                  <div className="w-full h-3.5 bg-slate-700 rounded-md overflow-hidden flex">
                    <div className="w-3/4 bg-blue-500 h-full"></div>
                    <div className="w-1/4 bg-slate-700 h-full"></div>
                  </div>
                </div>

                {/* Interactive selector */}
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      onClick={() => setFractionValue(n)}
                      className={`flex-1 py-1 rounded-lg text-2xs font-bold transition-all ${
                        fractionValue === n ? "bg-blue-600 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      {n}/4
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODEL 3: CARTESIAN LINEAR FUNCTION --- */}
        {isFunction && !isEquation && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" /> Función Lineal: y = m·x + b
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                La pendiente (<span className="text-blue-400 font-bold">m</span>) indica la inclinación y la ordenada (<span className="text-amber-400 font-bold">b</span>) el punto de corte en el eje Y.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center py-2">
              <svg viewBox="0 0 200 160" className="w-52 h-40 bg-slate-950 rounded-xl border border-slate-800 p-2">
                {/* Grid Lines */}
                <line x1="20" y1="40" x2="180" y2="40" stroke="#1e293b" strokeWidth="1" />
                <line x1="20" y1="80" x2="180" y2="80" stroke="#334155" strokeWidth="1.5" />
                <line x1="20" y1="120" x2="180" y2="120" stroke="#1e293b" strokeWidth="1" />
                
                <line x1="60" y1="20" x2="60" y2="140" stroke="#1e293b" strokeWidth="1" />
                <line x1="100" y1="20" x2="100" y2="140" stroke="#334155" strokeWidth="1.5" />
                <line x1="140" y1="20" x2="140" y2="140" stroke="#1e293b" strokeWidth="1" />

                {/* Axes Labels */}
                <text x="185" y="84" fill="#94a3b8" fontSize="9" fontWeight="bold">X</text>
                <text x="96" y="15" fill="#94a3b8" fontSize="9" fontWeight="bold">Y</text>

                {/* The Line */}
                {slopeValue === 2 && (
                  <line x1="30" y1="130" x2="170" y2="30" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                )}
                {slopeValue === -1 && (
                  <line x1="30" y1="30" x2="170" y2="130" stroke="#f43f5e" strokeWidth="3" strokeLinecap="round" />
                )}
                {slopeValue === 0 && (
                  <line x1="20" y1="60" x2="180" y2="60" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />
                )}

                {/* Y-Intercept dot (b) */}
                <circle cx="100" cy="60" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                <text x="108" y="58" fill="#f59e0b" fontSize="8" fontWeight="bold">b = 1 (Corte Y)</text>
              </svg>

              <div className="space-y-2 text-xs">
                <span className="text-2xs font-bold text-slate-400 uppercase block">Seleccionar Comportamiento:</span>
                <button
                  onClick={() => setSlopeValue(2)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    slopeValue === 2 ? "bg-blue-600/80 border-blue-400 text-white" : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  📈 Pendiente Positiva (m &gt; 0): Recta Creciente
                </button>
                <button
                  onClick={() => setSlopeValue(-1)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    slopeValue === -1 ? "bg-rose-600/80 border-rose-400 text-white" : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  📉 Pendiente Negativa (m &lt; 0): Recta Decreciente
                </button>
                <button
                  onClick={() => setSlopeValue(0)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg border font-medium transition-all ${
                    slopeValue === 0 ? "bg-emerald-600/80 border-emerald-400 text-white" : "bg-slate-800 border-slate-700 text-slate-300"
                  }`}
                >
                  ➖ Pendiente Nula (m = 0): Recta Horizontal Constante
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- MODEL 4: PYTHAGORAS TRIANGLE --- */}
        {isPythagoras && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Triangle className="w-4 h-4" /> Teorema de Pitágoras: a² + b² = c²
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                En todo triángulo rectángulo, la suma de los cuadrados de los catetos es igual al cuadrado de la hipotenusa.
              </p>
            </div>

            <div className="flex justify-center py-2">
              <svg viewBox="0 0 240 140" className="w-full max-w-xs h-36">
                {/* Right Triangle */}
                <polygon points="50,110 180,110 50,30" fill="rgba(59, 130, 246, 0.2)" stroke="#38bdf8" strokeWidth="2.5" />
                
                {/* 90 degree corner square */}
                <rect x="50" y="98" width="12" height="12" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                <circle cx="56" cy="104" r="1.5" fill="#94a3b8" />

                {/* Cateto Vertical (a) */}
                <text x="32" y="75" fill="#f59e0b" fontSize="10" fontWeight="bold">a = 3</text>
                
                {/* Cateto Horizontal (b) */}
                <text x="110" y="126" fill="#f59e0b" fontSize="10" fontWeight="bold">b = 4</text>

                {/* Hipotenusa (c) */}
                <text x="125" y="65" fill="#10b981" fontSize="11" fontWeight="bold">c = 5 (Hipotenusa)</text>
              </svg>
            </div>

            <div className="bg-slate-800/90 border border-slate-700 p-2.5 rounded-xl text-center font-mono text-xs text-emerald-300">
              3² (9) + 4² (16) = 25 ⇒ √25 = 5
            </div>
          </div>
        )}

        {/* --- MODEL 5: SYNTACTIC ANALYSIS TREE (LENGUA) --- */}
        {isSyntax && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <TextIcon className="w-4 h-4" /> Estructura Sintáctica en Capas
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                La oración bimembre se divide en Sujeto (quién) y Predicado (qué hace), con concordancia obligatoria en persona y número.
              </p>
            </div>

            {/* Visual Sentence Block Diagram */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              {/* Outer Brackets (Oración Bimembre) */}
              <div className="flex items-center justify-between text-2xs font-mono text-slate-400 px-1 border-b border-slate-800 pb-1">
                <span>[ ORACIÓN BIMEMBRE (O.B.) ]</span>
                <span className="text-emerald-400 font-bold">Concordancia: Plural 3ª pers.</span>
              </div>

              {/* Main Split: Sujeto & Predicado */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
                {/* SUJETO */}
                <div className="md:col-span-5 bg-blue-950/70 border-2 border-blue-500/80 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-extrabold text-blue-300 uppercase tracking-wider">
                      Sujeto Expreso Simple (S.E.S.)
                    </span>
                  </div>
                  <div className="flex items-end justify-around text-center pt-1 font-mono">
                    <div>
                      <span className="text-xs text-white font-bold block">Los</span>
                      <span className="text-3xs text-blue-300 font-extrabold bg-blue-900/90 px-1 py-0.5 rounded">M.D.</span>
                    </div>
                    <div>
                      <span className="text-xs text-amber-300 font-extrabold block">alumnos</span>
                      <span className="text-3xs text-amber-300 font-extrabold bg-amber-950 border border-amber-500 px-1.5 py-0.5 rounded">NÚCLEO</span>
                    </div>
                    <div>
                      <span className="text-xs text-white font-bold block">de Patricia</span>
                      <span className="text-3xs text-blue-300 font-extrabold bg-blue-900/90 px-1 py-0.5 rounded">M.I.</span>
                    </div>
                  </div>
                </div>

                {/* PREDICADO */}
                <div className="md:col-span-7 bg-rose-950/70 border-2 border-rose-500/80 rounded-xl p-2.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-extrabold text-rose-300 uppercase tracking-wider">
                      Predicado Verbal Simple (P.V.S.)
                    </span>
                  </div>
                  <div className="flex items-end justify-around text-center pt-1 font-mono">
                    <div>
                      <span className="text-xs text-emerald-300 font-extrabold block">resolvieron</span>
                      <span className="text-3xs text-emerald-300 font-extrabold bg-emerald-950 border border-emerald-500 px-1.5 py-0.5 rounded">N.V.</span>
                    </div>
                    <div>
                      <span className="text-xs text-white font-bold block">la guía</span>
                      <span className="text-3xs text-rose-300 font-extrabold bg-rose-900/90 px-1 py-0.5 rounded">O.D.</span>
                    </div>
                    <div>
                      <span className="text-xs text-white font-bold block">ayer</span>
                      <span className="text-3xs text-slate-300 font-extrabold bg-slate-800 px-1 py-0.5 rounded">C.C.Tiempo</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tip box */}
              <div className="text-2xs bg-slate-900/90 p-2 rounded-lg text-slate-300 flex items-center gap-2 border border-slate-800">
                <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  <strong>Prueba del Objeto Directo (O.D.):</strong> Se reemplaza por <em>lo/la/los/las</em> ("Los alumnos <strong>la</strong> resolvieron ayer").
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --- MODEL 6: SEGA ACCENTUATION PODIUM --- */}
        {isAccentuation && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Volume2 className="w-4 h-4" /> Podio Mnemotécnico S-E-G-A
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Determiná la sílaba tónica (fuerte) y verificá la regla de tildación según la letra final.
              </p>
            </div>

            {/* SEGA 4-column podium */}
            <div className="grid grid-cols-4 gap-1.5 text-center">
              {/* S */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2 flex flex-col justify-between">
                <span className="text-base font-black text-slate-400">S</span>
                <span className="text-3xs text-slate-400 uppercase font-bold">Sobreesdrújula</span>
                <div className="bg-slate-900 rounded p-1 my-1.5 text-2xs font-mono text-slate-300">
                  Anterior a la antepenúltima
                </div>
                <span className="text-3xs font-bold text-emerald-400 bg-emerald-950/80 py-0.5 rounded">SIEMPRE TILDE</span>
              </div>

              {/* E */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2 flex flex-col justify-between">
                <span className="text-base font-black text-amber-400">E</span>
                <span className="text-3xs text-amber-400 uppercase font-bold">Esdrújula</span>
                <div className="bg-slate-900 rounded p-1 my-1.5 text-2xs font-mono text-slate-300">
                  Antepenúltima (ej: MÚ-si-ca)
                </div>
                <span className="text-3xs font-bold text-emerald-400 bg-emerald-950/80 py-0.5 rounded">SIEMPRE TILDE</span>
              </div>

              {/* G */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2 flex flex-col justify-between">
                <span className="text-base font-black text-blue-400">G</span>
                <span className="text-3xs text-blue-400 uppercase font-bold">Grave</span>
                <div className="bg-slate-900 rounded p-1 my-1.5 text-2xs font-mono text-slate-300">
                  Penúltima (ej: ÁR-bol)
                </div>
                <span className="text-3xs font-bold text-amber-300 bg-amber-950/80 py-0.5 rounded">SI NO TERMINA EN N, S, VOCAL</span>
              </div>

              {/* A */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-2 flex flex-col justify-between">
                <span className="text-base font-black text-rose-400">A</span>
                <span className="text-3xs text-rose-400 uppercase font-bold">Aguda</span>
                <div className="bg-slate-900 rounded p-1 my-1.5 text-2xs font-mono text-slate-300">
                  Última (ej: can-CIÓN)
                </div>
                <span className="text-3xs font-bold text-rose-300 bg-rose-950/80 py-0.5 rounded">SI TERMINA EN N, S, VOCAL</span>
              </div>
            </div>
          </div>
        )}

        {/* --- MODEL 7: PHYSICS KINEMATICS MRU --- */}
        {isKinematics && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Car className="w-4 h-4" /> Cinemática: Movimiento Rectilíneo Uniforme (MRU)
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Velocidad constante (<span className="text-emerald-400 font-bold">a = 0</span>). El móvil recorre distancias iguales en tiempos iguales.
              </p>
            </div>

            {/* Visual Highway Track */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <svg viewBox="0 0 320 80" className="w-full h-20">
                {/* Road surface */}
                <rect x="10" y="45" width="300" height="25" rx="3" fill="#1e293b" />
                <line x1="20" y1="57" x2="300" y2="57" stroke="#fbbf24" strokeWidth="2" strokeDasharray="8 6" />

                {/* Car */}
                <rect x="40" y="32" width="36" height="16" rx="4" fill="#3b82f6" />
                <rect x="48" y="24" width="20" height="10" rx="3" fill="#60a5fa" />
                <circle cx="48" cy="48" r="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />
                <circle cx="68" cy="48" r="4" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />

                {/* Velocity Vector Arrow */}
                <line x1="80" y1="38" x2="130" y2="38" stroke="#10b981" strokeWidth="2.5" markerEnd="url(#arrow)" />
                <text x="90" y="30" fill="#10b981" fontSize="9" fontWeight="bold">v = 20 m/s</text>

                {/* Position Marker */}
                <line x1="40" y1="68" x2="40" y2="78" stroke="#94a3b8" strokeWidth="1" />
                <text x="40" y="78" fill="#94a3b8" fontSize="7" textAnchor="middle">x₀ = 0 m</text>

                <line x1="280" y1="68" x2="280" y2="78" stroke="#94a3b8" strokeWidth="1" />
                <text x="280" y="78" fill="#94a3b8" fontSize="7" textAnchor="middle">x = 400 m</text>
              </svg>

              {/* Triangle Mnemonic */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                  <span className="text-2xs text-slate-400 block">Distancia:</span>
                  <span className="font-bold text-blue-400">d = v · t</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                  <span className="text-2xs text-slate-400 block">Velocidad:</span>
                  <span className="font-bold text-emerald-400">v = d / t</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg">
                  <span className="text-2xs text-slate-400 block">Conversión:</span>
                  <span className="font-bold text-amber-400">km/h ÷ 3,6 = m/s</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODEL 8: FORCES & FREE BODY DIAGRAM (FÍSICA) --- */}
        {isForces && !isKinematics && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Compass className="w-4 h-4" /> Diagrama de Cuerpo Libre & Ley de Newton
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                2ª Ley de Newton: <span className="text-emerald-400 font-bold">Fuerza Neta = masa × aceleración</span> (F = m · a).
              </p>
            </div>

            <div className="flex justify-center py-2">
              <svg viewBox="0 0 240 150" className="w-full max-w-xs h-36">
                {/* Surface */}
                <line x1="30" y1="120" x2="210" y2="120" stroke="#475569" strokeWidth="2" />

                {/* Mass Block */}
                <rect x="95" y="70" width="50" height="50" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <text x="120" y="100" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold">m = 5 kg</text>

                {/* Normal Force (Up) */}
                <line x1="120" y1="70" x2="120" y2="25" stroke="#10b981" strokeWidth="2.5" />
                <polygon points="120,20 116,28 124,28" fill="#10b981" />
                <text x="126" y="32" fill="#10b981" fontSize="9" fontWeight="bold">Normal (N)</text>

                {/* Weight Force (Down) */}
                <line x1="120" y1="120" x2="120" y2="148" stroke="#f43f5e" strokeWidth="2.5" />
                <polygon points="120,150 116,142 124,142" fill="#f43f5e" />
                <text x="126" y="145" fill="#f43f5e" fontSize="9" fontWeight="bold">Peso (P = m·g)</text>

                {/* Applied Force (Right) */}
                <line x1="145" y1="95" x2="195" y2="95" stroke="#3b82f6" strokeWidth="2.5" />
                <polygon points="200,95 192,91 192,99" fill="#3b82f6" />
                <text x="160" y="88" fill="#3b82f6" fontSize="9" fontWeight="bold">F = 20 N</text>

                {/* Friction (Left) */}
                <line x1="95" y1="95" x2="60" y2="95" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 2" />
                <polygon points="55,95 63,91 63,99" fill="#fbbf24" />
                <text x="45" y="88" fill="#fbbf24" fontSize="8">F. roz</text>
              </svg>
            </div>
          </div>
        )}

        {/* --- MODEL 9: CHEMISTRY LEWIS DOTS & BONDS --- */}
        {isChemistry && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Atom className="w-4 h-4" /> Estructura de Lewis & Regla del Octeto
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Los átomos transfieren o comparten electrones de valencia para alcanzar la estabilidad con 8 electrones en su último nivel.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
              {/* Ionic bond card */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xs font-extrabold text-blue-400 uppercase block">
                  Unión Iónica (Metal + No Metal):
                </span>
                <div className="flex items-center justify-center gap-3 py-2 font-mono">
                  <div className="p-2 border border-blue-500 rounded bg-blue-950/60 text-center">
                    <span className="text-sm font-bold text-blue-300">[ Na ]⁺</span>
                    <span className="text-3xs text-slate-400 block">Pierde 1 e⁻</span>
                  </div>
                  <span className="text-lg text-slate-400">+</span>
                  <div className="p-2 border border-emerald-500 rounded bg-emerald-950/60 text-center">
                    <span className="text-sm font-bold text-emerald-300">[ :Cl: ]⁻</span>
                    <span className="text-3xs text-slate-400 block">Completa 8 e⁻</span>
                  </div>
                </div>
              </div>

              {/* Covalent bond card */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <span className="text-2xs font-extrabold text-amber-400 uppercase block">
                  Unión Covalente (No Metales):
                </span>
                <div className="flex items-center justify-center gap-3 py-2 font-mono">
                  <div className="p-2 border border-amber-500/80 rounded bg-amber-950/60 text-center">
                    <span className="text-sm font-bold text-amber-300">H : O : H</span>
                    <span className="text-3xs text-slate-400 block">Comparten pares (H₂O)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- MODEL 10: GENERIC 4-STEP PEDAGOGICAL FLOW (FALLBACK FOR OTHER TOPICS) --- */}
        {!isEquation && !isFraction && !isFunction && !isPythagoras && !isSyntax && !isAccentuation && !isKinematics && !isForces && !isChemistry && (
          <div className="relative z-10 space-y-4 py-1">
            <div className="text-center space-y-1">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center justify-center gap-1">
                <Layers className="w-4 h-4" /> Esquema Pedagógico de Resolución en 4 Pasos
              </span>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                Estrategia didáctica estructurada para fijar el procedimiento en el cuaderno escolar.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center mx-auto">1</span>
                <span className="text-xs font-bold text-blue-300 block">Datos e Incógnita</span>
                <p className="text-3xs text-slate-300">Identificar qué tenemos y qué nos piden.</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center mx-auto">2</span>
                <span className="text-xs font-bold text-amber-300 block">Regla o Fórmula</span>
                <p className="text-3xs text-slate-300">Seleccionar el procedimiento exacto.</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center mx-auto">3</span>
                <span className="text-xs font-bold text-indigo-300 block">Desarrollo Paso a Paso</span>
                <p className="text-3xs text-slate-300">Operar sin saltear pasos intermedios.</p>
              </div>

              <div className="bg-slate-800/90 border border-slate-700 rounded-xl p-3 text-center space-y-1">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center mx-auto">4</span>
                <span className="text-xs font-bold text-emerald-300 block">Verificación Final</span>
                <p className="text-3xs text-slate-300">Comprobar coherencia y unidades.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. REGLA DE ORO Y ANALOGÍA COTIDIANA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {goldenRule && (
          <div className="bg-amber-50 border border-amber-200/90 rounded-xl p-3.5 space-y-1">
            <span className="text-2xs font-extrabold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              Regla de Oro Mnemotécnica:
            </span>
            <p className="text-xs text-amber-950 font-semibold leading-relaxed">
              {goldenRule}
            </p>
          </div>
        )}

        {everydayAnalogy && (
          <div className="bg-blue-50 border border-blue-200/90 rounded-xl p-3.5 space-y-1">
            <span className="text-2xs font-extrabold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
              Analogía de la Vida Cotidiana Argentina:
            </span>
            <p className="text-xs text-blue-950 italic leading-relaxed">
              "{everydayAnalogy}"
            </p>
          </div>
        )}
      </div>

      {/* 3. PRACTICAL EXAMPLE STEP-BY-STEP */}
      {practicalExample && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <span className="text-2xs font-extrabold text-slate-700 uppercase tracking-wider block">
            Ejemplo Modelo Resuelto Paso a Paso:
          </span>
          <p className="text-xs font-bold text-slate-900">
            {practicalExample.statement}
          </p>
          <div className="bg-white border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-800 whitespace-pre-line leading-relaxed shadow-2xs">
            {practicalExample.stepByStepSolution}
          </div>
        </div>
      )}
    </div>
  );
};
