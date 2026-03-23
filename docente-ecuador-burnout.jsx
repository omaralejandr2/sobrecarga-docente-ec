import { useState } from "react";

const STEPS = ["perfil", "carga", "tareas", "intereses", "resultado"];

// Tareas específicas del contexto ecuatoriano MinEduc
const TASK_OPTIONS = [
  { id: "planificacion_micro", label: "Planificaciones micro-curriculares", icon: "📋", peso: 3, nota: "Formato MinEduc obligatorio" },
  { id: "calificacion", label: "Calificación y registro en SIME/eSigef", icon: "💻", peso: 3, nota: "Sistema a veces inestable" },
  { id: "poa", label: "POA / PEI / autoevaluación institucional", icon: "📊", peso: 2.5, nota: "Documentación institucional" },
  { id: "juntas", label: "Juntas de curso / Junta Académica", icon: "🏛️", peso: 2, nota: "" },
  { id: "dece", label: "Coordinación con DECE (casos estudiantiles)", icon: "🧠", peso: 2.5, nota: "Derivaciones y seguimiento" },
  { id: "representantes", label: "Atención a representantes legales", icon: "👨‍👩‍👧", peso: 2, nota: "" },
  { id: "guardias", label: "Guardias / inspección de recreos", icon: "👁️", peso: 1.5, nota: "Fuera del horario de clase" },
  { id: "tutoria_bgu", label: "Tutoría de curso (BGU)", icon: "🎓", peso: 2.5, nota: "Responsabilidad adicional no remunerada" },
  { id: "proyectos", label: "Proyectos escolares interdisciplinares", icon: "🔬", peso: 2, nota: "Feria de ciencias, etc." },
  { id: "capacitacion_me", label: "Cursos ME.CAPACITO / SíProfe", icon: "📚", peso: 1.5, nota: "Obligatorios para ascenso" },
  { id: "clases_apoyo", label: "Clases de recuperación pedagógica", icon: "🔁", peso: 2, nota: "Fuera del horario regular" },
  { id: "informes", label: "Informes de notas / actas de calificaciones", icon: "📝", peso: 2.5, nota: "Por parcial y quimestre" },
  { id: "adaptaciones", label: "Adaptaciones curriculares (NEE)", icon: "♿", peso: 3, nota: "Sin reducción de carga" },
  { id: "redes", label: "Reuniones de red de maestros / distrital", icon: "🤝", peso: 1.5, nota: "" },
];

// Intereses adaptados al contexto ecuatoriano
const INTEREST_OPTIONS = [
  { id: "musica", label: "Música (bandas, coro, pasillo)", icon: "🎵" },
  { id: "futbol", label: "Fútbol / deporte", icon: "⚽" },
  { id: "lectura", label: "Lectura / literatura ecuatoriana", icon: "📖" },
  { id: "cocina", label: "Cocina / gastronomía regional", icon: "🍲" },
  { id: "familia", label: "Familia / vida en comunidad", icon: "👨‍👩‍👧" },
  { id: "iglesia", label: "Fe / vida espiritual / voluntariado", icon: "🕊️" },
  { id: "campo", label: "Agricultura / campo / naturaleza", icon: "🌾" },
  { id: "artesania", label: "Artesanías / tejido / manualidades", icon: "🧶" },
  { id: "cine", label: "Cine / series / entretenimiento", icon: "🎬" },
  { id: "emprendimiento", label: "Emprendimiento / negocio propio", icon: "💼" },
  { id: "viajes", label: "Viajes / conocer Ecuador", icon: "🗺️" },
  { id: "tecnologia", label: "Tecnología / redes sociales", icon: "📱" },
];

function GaugeMeter({ value }) {
  const clamp = Math.min(100, Math.max(0, value));
  const angle = -140 + (clamp / 100) * 280;
  const getColor = (v) => v < 35 ? "#4ade80" : v < 60 ? "#facc15" : v < 80 ? "#fb923c" : "#ef4444";
  const color = getColor(clamp);
  const r = 70, cx = 90, cy = 90;
  const startAngle = -140 * (Math.PI / 180);
  const endAngle = 140 * (Math.PI / 180);
  const arcX1 = cx + r * Math.cos(startAngle);
  const arcY1 = cy + r * Math.sin(startAngle);
  const arcX2 = cx + r * Math.cos(endAngle);
  const arcY2 = cy + r * Math.sin(endAngle);
  const needleAngle = angle * (Math.PI / 180);
  const nx = cx + 60 * Math.cos(needleAngle);
  const ny = cy + 60 * Math.sin(needleAngle);
  return (
    <div style={{ textAlign: "center" }}>
      <svg width="180" height="110" viewBox="0 0 180 110">
        <path d={`M ${arcX1} ${arcY1} A ${r} ${r} 0 1 1 ${arcX2} ${arcY2}`} fill="none" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
        <path d={`M ${arcX1} ${arcY1} A ${r} ${r} 0 1 1 ${arcX2} ${arcY2}`} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
          strokeDasharray={`${(clamp / 100) * 307} 307`} style={{ transition: "stroke-dasharray 1.5s cubic-bezier(.4,0,.2,1), stroke 1s" }} />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="3" strokeLinecap="round" style={{ transition: "all 1.5s cubic-bezier(.4,0,.2,1)" }} />
        <circle cx={cx} cy={cy} r="6" fill={color} style={{ transition: "fill 1s" }} />
        <text x={cx} y={cy + 22} textAnchor="middle" fill={color} style={{ fontSize: "22px", fontWeight: "800", fontFamily: "'DM Mono', monospace", transition: "fill 1s" }}>{clamp}</text>
      </svg>
    </div>
  );
}

function Pill({ children, active, onClick, color = "#6366f1" }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: "999px", border: `1.5px solid ${active ? color : "#334155"}`,
      background: active ? `${color}22` : "transparent", color: active ? color : "#64748b",
      cursor: "pointer", fontSize: "12px", fontFamily: "'DM Mono', monospace",
      transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px",
      fontWeight: active ? "700" : "400", lineHeight: 1.3,
    }}>{children}</button>
  );
}

function Slider({ label, value, min, max, step = 1, onChange, unit = "", hint }) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
        <label style={{ color: "#cbd5e1", fontSize: "14px", fontFamily: "Fraunces, Georgia, serif" }}>{label}</label>
        <span style={{ color: "#6366f1", fontFamily: "'DM Mono', monospace", fontWeight: "700", fontSize: "15px" }}>{value}{unit}</span>
      </div>
      <div style={{ position: "relative", height: "6px", background: "#1e293b", borderRadius: "3px" }}>
        <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: "linear-gradient(90deg,#6366f1,#a78bfa)", borderRadius: "3px", transition: "width 0.2s" }} />
        <input type="range" min={min} max={max} step={step} value={value} onChange={e => onChange(Number(e.target.value))}
          style={{ position: "absolute", top: "-7px", left: 0, width: "100%", height: "20px", opacity: 0, cursor: "pointer", zIndex: 2 }} />
        <div style={{ position: "absolute", top: "-5px", left: `${pct}%`, transform: "translateX(-50%)", width: "16px", height: "16px", borderRadius: "50%", background: "#6366f1", border: "2px solid #a78bfa", boxShadow: "0 0 10px #6366f166", transition: "left 0.2s", pointerEvents: "none" }} />
      </div>
      {hint && <div style={{ color: "#475569", fontSize: "11px", marginTop: "6px", fontFamily: "'DM Mono', monospace" }}>{hint}</div>}
    </div>
  );
}

function StepDot({ step, current, label }) {
  const done = STEPS.indexOf(current) > STEPS.indexOf(step);
  const active = current === step;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
      <div style={{ width: "10px", height: "10px", borderRadius: "50%", transition: "all 0.3s", background: active ? "#6366f1" : done ? "#4ade80" : "#1e293b", border: `2px solid ${active ? "#a78bfa" : done ? "#4ade80" : "#334155"}`, boxShadow: active ? "0 0 12px #6366f1" : "none" }} />
      <span style={{ fontSize: "9px", color: active ? "#a78bfa" : done ? "#4ade80" : "#334155", fontFamily: "'DM Mono', monospace", textTransform: "uppercase", letterSpacing: "1px" }}>{label}</span>
    </div>
  );
}

export default function DocenteEcuadorApp() {
  const [step, setStep] = useState("perfil");
  const [perfil, setPerfil] = useState({
    nombre: "", anos: 5, regimen: "sierra", tipoInst: "fiscal",
    zona: "urbana", cargo: "docente", asignatura: "", escalafon: "categoria_e"
  });
  const [carga, setCarga] = useState({ periodos: 30, horasPrep: 8, horasAdmin: 6, paralelos: 3, estudiantes: 105 });
  const [tareas, setTareas] = useState([]);
  const [intereses, setIntereses] = useState([]);
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [animIn, setAnimIn] = useState(true);

  const navigate = (to) => {
    setAnimIn(false);
    setTimeout(() => { setStep(to); setAnimIn(true); }, 180);
  };

  const toggleTarea = (id) => setTareas(t => t.includes(id) ? t.filter(x => x !== id) : [...t, id]);
  const toggleInteres = (id) => setIntereses(i => i.includes(id) ? i.filter(x => x !== id) : [...i, id]);

  // Cálculo adaptado al sistema ecuatoriano
  // Ley Orgánica de Educación Intercultural: máx 30 períodos + 10h extraclase = 40h/sem
  const horasClase = Math.round(carga.periodos * 0.75); // períodos de 45 min → horas
  const horasTotal = horasClase + carga.horasPrep + carga.horasAdmin;

  const calcularStressBase = () => {
    const periodosFactor = Math.min((carga.periodos / 25) * 100, 100); // 25 = máximo legal vigente
    const prepFactor = Math.min((carga.horasPrep / 15) * 100, 100);
    const adminFactor = Math.min((carga.horasAdmin / 12) * 100, 100);
    const paralelosFactor = Math.min((carga.paralelos / 6) * 100, 100);
    const estudiantesFactor = Math.min((carga.estudiantes / 210) * 100, 100);
    const tareasPeso = tareas.reduce((acc, id) => acc + (TASK_OPTIONS.find(t => t.id === id)?.peso || 0), 0);
    const tareasFactor = Math.min((tareasPeso / 30) * 100, 100);
    const anosFactor = perfil.anos < 2 ? 75 : perfil.anos > 15 ? 35 : 55;
    const zonaBonus = perfil.zona === "rural" ? 10 : 0;
    const cargoBonus = perfil.cargo === "directivo_docente" ? 15 : perfil.cargo === "tutor" ? 8 : 0;
    const raw = periodosFactor * 0.25 + prepFactor * 0.10 + adminFactor * 0.15 + paralelosFactor * 0.15 + estudiantesFactor * 0.10 + tareasFactor * 0.20 + anosFactor * 0.05 + zonaBonus + cargoBonus;
    return Math.min(100, Math.round(raw));
  };

  const analizar = async () => {
    setLoading(true);
    navigate("resultado");
    const stressBase = calcularStressBase();
    const tareasLabels = tareas.map(id => TASK_OPTIONS.find(t => t.id === id)?.label).filter(Boolean);
    const interesesLabels = intereses.map(id => INTEREST_OPTIONS.find(i => i.id === id)?.label).filter(Boolean);

    const prompt = `Eres un psicólogo organizacional especializado en bienestar del magisterio ecuatoriano. Conoces bien el sistema educativo del Ecuador: la LOEI (Ley Orgánica de Educación Intercultural), el distributivo de trabajo, los regímenes Sierra y Costa, el SIME, los estándares de calidad educativa del MinEduc, el proceso de ascenso en el escalafón docente, el BGU (Bachillerato General Unificado), el DECE, los distritos zonales, y la realidad cotidiana del docente fiscal ecuatoriano. Entiendes sus limitaciones salariales, la burocracia del Ministerio de Educación, la carga de planificaciones en formato ministerial y los problemas del sistema.

Analiza este perfil REAL y responde SOLO con un JSON válido, sin markdown, sin explicaciones extra.

PERFIL DOCENTE ECUATORIANO:
- Nombre: ${perfil.nombre || "Docente"}
- Años de servicio: ${perfil.anos}
- Régimen: ${perfil.regimen}
- Tipo de institución: ${perfil.tipoInst}
- Zona: ${perfil.zona}
- Cargo: ${perfil.cargo}
- Asignatura/área: ${perfil.asignatura || "no especificada"}
- Escalafón: ${perfil.escalafon}
- Períodos de clase/semana: ${carga.periodos} (máximo legal vigente: 25 períodos de 45 min)
- Horas de preparación/semana: ${carga.horasPrep}h
- Horas administrativas/semana: ${carga.horasAdmin}h
- Total estimado horas/semana: ${horasTotal}h
- Paralelos / grupos: ${carga.paralelos}
- Total estudiantes: ${carga.estudiantes}
- Responsabilidades adicionales: ${tareasLabels.join(", ") || "ninguna especificada"}
- Intereses personales: ${interesesLabels.join(", ") || "ninguno especificado"}
- Score de estrés base calculado: ${stressBase}/100

Genera el JSON con estas claves exactas:
{
  "nivelStress": ${stressBase},
  "etiquetaStress": "bajo|moderado|alto|crítico",
  "burnoutRiesgo": "bajo|medio|alto|muy alto",
  "alertas": ["alerta específica y real del contexto ecuatoriano 1", "alerta 2", "alerta 3"],
  "factoresClave": ["factor 1 más crítico", "factor 2", "factor 3"],
  "contextoEcuador": "Una oración que reconoce una realidad específica del sistema educativo ecuatoriano que afecta a este docente (puede mencionar MinEduc, LOEI, escalafón, SIME, régimen, zona, etc.)",
  "recomendaciones": [
    {
      "titulo": "Título corto",
      "descripcion": "Recomendación de 2-3 oraciones ultra-específica para el contexto ecuatoriano. Si tiene intereses personales, conéctalos directamente. Da pasos concretos, menciona herramientas o recursos reales disponibles en Ecuador si aplica.",
      "impacto": "alto|medio|bajo",
      "tiempo": "inmediato|esta semana|este mes",
      "icono": "emoji"
    }
  ],
  "derechoLaboral": "Un derecho o norma concreta de la LOEI o normativa MinEduc que este docente debería conocer y que aplica a su situación.",
  "mensajePersonal": "Mensaje empático de 2 oraciones dirigido a ${perfil.nombre || "este docente"}, que reconoce la realidad específica del magisterio ecuatoriano sin ser condescendiente ni genérico.",
  "fortaleza": "Una fortaleza concreta observada en su perfil, contextualizada al sistema ecuatoriano."
}

INSTRUCCIONES CLAVE:
- Las alertas deben ser específicas del contexto ecuatoriano (ej: riesgo de no cumplir indicadores de evaluación, carga de documentación ministerial, etc.)
- Las recomendaciones deben ser 4-5, accionables, y NUNCA genéricas. Considera la realidad económica del docente ecuatoriano.
- Si tiene intereses: cada recomendación debe conectar el bienestar con sus intereses reales (ej: si le gusta el fútbol, recomienda unirse a la liga barrial del colegio como válvula de escape; si le gusta cocinar, sugiere el ritual del almuerzo en casa como separador entre trabajo y descanso).
- El campo derechoLaboral es importante: cita normas reales (artículos de la LOEI, Acuerdos Ministeriales) que protejan al docente.
- Tono: cercano, sin tecnicismos innecesarios, como un colega que entiende la realidad.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultado(parsed);
    } catch (e) {
      setResultado({
        nivelStress: stressBase,
        etiquetaStress: stressBase < 35 ? "bajo" : stressBase < 60 ? "moderado" : stressBase < 80 ? "alto" : "crítico",
        burnoutRiesgo: stressBase < 40 ? "bajo" : stressBase < 65 ? "medio" : stressBase < 85 ? "alto" : "muy alto",
        alertas: ["Carga de períodos cercana o sobre el límite legal vigente (25 períodos de 45 min)", "Alta carga burocrática sin reducción de períodos de clase", "Ratio de estudiantes por docente elevado para el contexto ecuatoriano"],
        factoresClave: ["Períodos de clase semanales", "Tareas administrativas MinEduc", "Número de paralelos"],
        contextoEcuador: "El sistema educativo ecuatoriano exige al docente fiscal una carga burocrática creciente sin reducción proporcional de horas frente al aula.",
        recomendaciones: [
          { titulo: "Bloques de planificación fijos", descripcion: "Reserva dos tardes fijas (ej: martes y jueves) exclusivamente para planificaciones y registros en el SIME. Comunícalo a tu familia para proteger ese tiempo.", impacto: "alto", tiempo: "esta semana", icono: "🛡️" },
          { titulo: "Red de apoyo con colegas", descripcion: "Coordina con docentes del mismo año para compartir planificaciones micro-curriculares. Es legal y ahorra 2-3 horas semanales.", impacto: "alto", tiempo: "este mes", icono: "🤝" },
          { titulo: "Ritual de desconexión", descripcion: "Establece las 18h00 como hora de cierre. Apaga notificaciones del grupo de WhatsApp del colegio. Tu tiempo libre es protegido por la LOEI.", impacto: "alto", tiempo: "inmediato", icono: "🔕" },
        ],
        derechoLaboral: "Según la normativa vigente del MinEduc, el docente tiene derecho a un máximo de 25 períodos de 45 minutos por semana frente al aula. Las horas adicionales deben ser justificadas y reconocidas institucionalmente.",
        mensajePersonal: `${perfil.nombre || "Profe"}, lo que haces cada día en el aula importa más de lo que el sistema a veces reconoce. Cuidarte no es egoísmo — es condición para seguir enseñando bien.`,
        fortaleza: "Tu experiencia en el sistema te da herramientas para navegar la burocracia que un docente nuevo todavía no maneja."
      });
    }
    setLoading(false);
  };

  const riskColor = (n) => ({ "bajo": "#4ade80", "medio": "#facc15", "alto": "#fb923c", "muy alto": "#ef4444" }[n] || "#94a3b8");
  const impactColor = (i) => ({ "alto": "#ef4444", "medio": "#facc15", "bajo": "#4ade80" }[i] || "#94a3b8");
  const tiempoColor = (t) => ({ "inmediato": "#f43f5e", "esta semana": "#f97316", "este mes": "#6366f1" }[t] || "#94a3b8");

  const card = { background: "#0f172a", border: "1px solid #1e293b", borderRadius: "16px", padding: "24px", marginBottom: "14px" };
  const inputStyle = { width: "100%", background: "#0a0f1e", border: "1.5px solid #1e293b", borderRadius: "10px", padding: "11px 14px", color: "#e2e8f0", fontFamily: "'DM Mono', monospace", fontSize: "13px", outline: "none", boxSizing: "border-box" };
  const label12 = { color: "#94a3b8", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", display: "block", marginBottom: "8px" };
  const btnPrimary = { background: "linear-gradient(135deg, #6366f1, #a78bfa)", border: "none", borderRadius: "12px", padding: "13px 28px", color: "white", fontFamily: "'DM Mono', monospace", fontWeight: "700", fontSize: "13px", cursor: "pointer", letterSpacing: "1px", boxShadow: "0 4px 20px #6366f133" };
  const btnSecondary = { background: "transparent", border: "1.5px solid #334155", borderRadius: "12px", padding: "11px 20px", color: "#94a3b8", fontFamily: "'DM Mono', monospace", fontSize: "12px", cursor: "pointer" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;600;700;900&family=DM+Mono:wght@400;500;700&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #020817; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f172a; } ::-webkit-scrollbar-thumb { background: #334155; border-radius: 2px; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse-ring { 0%,100% { box-shadow: 0 0 0 0 #ef444444; } 50% { box-shadow: 0 0 0 10px transparent; } }
        @keyframes spin { to { transform: rotate(360deg); } }
        select option { background: #0f172a; }
      `}</style>
      <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 15% 0%, #1e1b4b1a 0%, transparent 55%), radial-gradient(ellipse at 85% 100%, #0c4a221a 0%, transparent 55%), #020817", padding: "24px 16px" }}>
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#0f172a", border: "1px solid #1e293b", borderRadius: "999px", padding: "5px 16px", marginBottom: "18px" }}>
              <span style={{ fontSize: "14px" }}>🇪🇨</span>
              <span style={{ color: "#6366f1", fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Bienestar Docente · Ecuador</span>
            </div>
            <h1 style={{ fontFamily: "Fraunces, Georgia, serif", fontSize: "clamp(26px,5vw,40px)", color: "#f1f5f9", fontWeight: "900", lineHeight: 1.15, marginBottom: "10px" }}>
              Detector de Sobrecarga<br /><span style={{ color: "#a78bfa" }}>del Magisterio Ecuatoriano</span>
            </h1>
            <p style={{ color: "#64748b", fontSize: "13px", maxWidth: "420px", margin: "0 auto", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>
              Basado en la LOEI · Sistema MinEduc · BGU · Fiscales y fiscomisionales
            </p>
          </div>

          {/* Progress */}
          {step !== "resultado" && (
            <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "28px" }}>
              {[["perfil","Perfil"],["carga","Carga"],["tareas","Tareas"],["intereses","Yo"],].map(([s,l]) => (
                <StepDot key={s} step={s} current={step} label={l} />
              ))}
            </div>
          )}

          <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(10px)", transition: "all 0.2s", animation: animIn ? "fadeUp 0.3s ease" : "none" }}>

            {/* ── PASO 1: PERFIL ── */}
            {step === "perfil" && (
              <div>
                <div style={card}>
                  <h2 style={{ fontFamily: "Fraunces, serif", color: "#e2e8f0", fontSize: "19px", marginBottom: "20px" }}>Tu perfil en el sistema</h2>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={label12}>Nombre (opcional)</label>
                    <input style={inputStyle} placeholder="Ej: Profe Carlos Andrade" value={perfil.nombre} onChange={e => setPerfil(p => ({ ...p, nombre: e.target.value }))} />
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={label12}>Asignatura / Área</label>
                    <input style={inputStyle} placeholder="Ej: Matemáticas, Lengua, Ciencias Naturales..." value={perfil.asignatura} onChange={e => setPerfil(p => ({ ...p, asignatura: e.target.value }))} />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                    <div>
                      <label style={label12}>Régimen</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {[["sierra","🏔️ Sierra"],["costa","🌊 Costa"],["amazonia","🌿 Amazonía"],["galapagos","🐢 Galápagos"]].map(([v,l]) => (
                          <Pill key={v} active={perfil.regimen === v} onClick={() => setPerfil(p => ({ ...p, regimen: v }))} color="#6366f1">{l}</Pill>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={label12}>Tipo de institución</label>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {[["fiscal","🏫 Fiscal"],["fiscomisional","⛪ Fiscomisional"],["municipal","🏛️ Municipal"],["particular","🏢 Particular subvencionado"]].map(([v,l]) => (
                          <Pill key={v} active={perfil.tipoInst === v} onClick={() => setPerfil(p => ({ ...p, tipoInst: v }))} color="#6366f1">{l}</Pill>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={label12}>Zona de trabajo</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[["urbana","🌆 Urbana"],["urbana_marginal","🏘️ Urbano-marginal"],["rural","🌾 Rural"],["fronteriza","🗺️ Zona fronteriza"]].map(([v,l]) => (
                        <Pill key={v} active={perfil.zona === v} onClick={() => setPerfil(p => ({ ...p, zona: v }))} color={v === "rural" || v === "fronteriza" ? "#ef4444" : "#6366f1"}>{l}</Pill>
                      ))}
                    </div>
                    {(perfil.zona === "rural" || perfil.zona === "fronteriza") && (
                      <div style={{ marginTop: "8px", background: "#2d1515", border: "1px solid #7f1d1d", borderRadius: "8px", padding: "8px 12px", fontSize: "11px", color: "#fca5a5", fontFamily: "'DM Mono', monospace" }}>
                        ⚠️ Las zonas rurales y fronterizas tienen factores de estrés adicionales que el sistema rara vez reconoce.
                      </div>
                    )}
                  </div>

                  <div style={{ marginBottom: "16px" }}>
                    <label style={label12}>Cargo actual</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[["docente","👨‍🏫 Docente"],["tutor","🎓 Docente-Tutor de curso"],["directivo_docente","📋 Directivo con carga horaria"],["coordinador","🔧 Coordinador de área"]].map(([v,l]) => (
                        <Pill key={v} active={perfil.cargo === v} onClick={() => setPerfil(p => ({ ...p, cargo: v }))} color="#a78bfa">{l}</Pill>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: "4px" }}>
                    <label style={label12}>Categoría en el escalafón</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {[["categoria_j","J (ingreso)"],["categoria_i","I"],["categoria_h","H"],["categoria_g","G"],["categoria_f","F"],["categoria_e","E"],["categoria_d","D"],["categoria_c","C"],["categoria_b","B"],["categoria_a","A (máximo)"]].map(([v,l]) => (
                        <Pill key={v} active={perfil.escalafon === v} onClick={() => setPerfil(p => ({ ...p, escalafon: v }))} color="#10b981">{l}</Pill>
                      ))}
                    </div>
                    <div style={{ marginTop: "6px", fontSize: "10px", color: "#334155", fontFamily: "'DM Mono', monospace" }}>Categoría J = inicio de carrera · Categoría A = tope máximo</div>
                  </div>

                  <div style={{ marginTop: "20px" }}>
                    <Slider label="Años de servicio en el magisterio" value={perfil.anos} min={0} max={40} onChange={v => setPerfil(p => ({ ...p, anos: v }))} unit=" años"
                      hint={perfil.anos < 2 ? "⚡ Primer año — adaptación al sistema muy exigente" : perfil.anos >= 30 ? "🏆 Docente con gran trayectoria" : perfil.anos > 20 ? "📌 Posiblemente próximo a jubilación — planifícala" : ""} />
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <button style={btnPrimary} onClick={() => navigate("carga")}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── PASO 2: CARGA ── */}
            {step === "carga" && (
              <div>
                <div style={card}>
                  <h2 style={{ fontFamily: "Fraunces, serif", color: "#e2e8f0", fontSize: "19px", marginBottom: "6px" }}>Distributivo de trabajo</h2>
                  <p style={{ color: "#475569", fontSize: "11px", marginBottom: "22px", fontFamily: "'DM Mono', monospace" }}>Semana típica · Régimen {perfil.regimen === "sierra" ? "Sierra (ago–jun)" : "Costa (may–feb)"}</p>

                  <Slider label="Períodos de clase por semana" value={carga.periodos} min={5} max={40} onChange={v => setCarga(c => ({ ...c, periodos: v }))} unit=" períodos"
                    hint={carga.periodos > 25 ? "🚨 Supera el límite legal vigente: máximo 25 períodos de 45 min" : carga.periodos === 25 ? "⚠️ En el límite máximo legal — sin margen de error" : `✓ ${25 - carga.periodos} períodos bajo el límite legal`} />

                  <div style={{ background: "#0a0f1e", borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ color: "#475569", fontSize: "10px", fontFamily: "'DM Mono', monospace" }}>Horas efectivas frente al aula</div>
                      <div style={{ color: "#a78bfa", fontWeight: "700", fontSize: "18px", fontFamily: "'DM Mono', monospace" }}>{horasClase}h / semana</div>
                    </div>
                    <div style={{ fontSize: "10px", color: "#334155", fontFamily: "'DM Mono', monospace", textAlign: "right" }}>
                      {carga.periodos} períodos<br />× 45 min
                    </div>
                  </div>

                  <Slider label="Horas de preparación y planificación" value={carga.horasPrep} min={0} max={25} onChange={v => setCarga(c => ({ ...c, horasPrep: v }))} unit="h"
                    hint="Incluye planificaciones micro-curriculares en formato MinEduc" />

                  <Slider label="Horas de trabajo administrativo y burocrático" value={carga.horasAdmin} min={0} max={20} onChange={v => setCarga(c => ({ ...c, horasAdmin: v }))} unit="h"
                    hint={carga.horasAdmin > 8 ? "⚠️ Alta carga burocrática. ¿Tienes apoyo administrativo en la institución?" : "Incluye SIME, actas, informes, comunicaciones"} />

                  <div style={{ background: "#0a0f1e", borderRadius: "10px", padding: "14px 16px", marginBottom: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ color: "#64748b", fontSize: "12px", fontFamily: "'DM Mono', monospace" }}>Total horas estimadas / semana</span>
                      <span style={{ color: horasTotal > 35 ? "#ef4444" : horasTotal > 30 ? "#fb923c" : "#4ade80", fontWeight: "700", fontSize: "17px", fontFamily: "'DM Mono', monospace" }}>
                        {horasTotal}h
                      </span>
                    </div>
                    <div style={{ fontSize: "10px", color: "#334155", fontFamily: "'DM Mono', monospace" }}>
                      {horasTotal > 35 ? "🚨 Supera ampliamente la jornada laboral docente reconocida" : horasTotal > 30 ? "⚠️ Carga elevada — incluye horas no remuneradas" : "✓ Dentro del rango esperado"}
                    </div>
                  </div>

                  <Slider label="Número de paralelos / grupos" value={carga.paralelos} min={1} max={10} onChange={v => setCarga(c => ({ ...c, paralelos: v }))} unit=" paralelos"
                    hint={carga.paralelos > 5 ? "⚠️ Muchos grupos dificulta el seguimiento individualizado" : ""} />

                  <Slider label="Total de estudiantes a cargo" value={carga.estudiantes} min={10} max={400} step={5} onChange={v => setCarga(c => ({ ...c, estudiantes: v }))} unit=" est."
                    hint={`≈ ${Math.round(carga.estudiantes / carga.paralelos)} estudiantes por paralelo · ${carga.estudiantes > 200 ? "Muy alta carga de seguimiento" : ""}`} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button style={btnSecondary} onClick={() => navigate("perfil")}>← Atrás</button>
                  <button style={btnPrimary} onClick={() => navigate("tareas")}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── PASO 3: TAREAS ── */}
            {step === "tareas" && (
              <div>
                <div style={card}>
                  <h2 style={{ fontFamily: "Fraunces, serif", color: "#e2e8f0", fontSize: "19px", marginBottom: "6px" }}>Responsabilidades adicionales</h2>
                  <p style={{ color: "#475569", fontSize: "11px", marginBottom: "18px", fontFamily: "'DM Mono', monospace" }}>Selecciona todo lo que haces además de dar clases</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {TASK_OPTIONS.map(t => (
                      <div key={t.id} style={{ position: "relative" }}>
                        <Pill active={tareas.includes(t.id)} onClick={() => toggleTarea(t.id)} color={t.peso >= 3 ? "#ef4444" : t.peso >= 2 ? "#f97316" : "#6366f1"}>
                          {t.icon} {t.label}
                          {t.peso >= 3 && <span style={{ fontSize: "8px", letterSpacing: "1px", opacity: 0.8 }}>●</span>}
                        </Pill>
                        {t.nota && tareas.includes(t.id) && (
                          <div style={{ position: "absolute", bottom: "-22px", left: 0, whiteSpace: "nowrap", fontSize: "9px", color: "#475569", fontFamily: "'DM Mono', monospace" }}>{t.nota}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: "28px", display: "flex", gap: "16px" }}>
                    <div style={{ background: "#ef444411", border: "1px solid #ef444433", borderRadius: "8px", padding: "8px 12px", fontSize: "10px", color: "#fca5a5", fontFamily: "'DM Mono', monospace" }}>● = Alto impacto en estrés</div>
                    {tareas.length > 0 && (
                      <div style={{ background: "#6366f111", border: "1px solid #6366f133", borderRadius: "8px", padding: "8px 12px", fontSize: "10px", color: "#a78bfa", fontFamily: "'DM Mono', monospace" }}>
                        {tareas.length} seleccionadas · Peso: {tareas.reduce((a, id) => a + (TASK_OPTIONS.find(t => t.id === id)?.peso || 0), 0).toFixed(1)}
                      </div>
                    )}
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button style={btnSecondary} onClick={() => navigate("carga")}>← Atrás</button>
                  <button style={btnPrimary} onClick={() => navigate("intereses")}>Continuar →</button>
                </div>
              </div>
            )}

            {/* ── PASO 4: INTERESES ── */}
            {step === "intereses" && (
              <div>
                <div style={card}>
                  <h2 style={{ fontFamily: "Fraunces, serif", color: "#e2e8f0", fontSize: "19px", marginBottom: "6px" }}>¿Qué disfrutas fuera del trabajo?</h2>
                  <p style={{ color: "#475569", fontSize: "11px", marginBottom: "18px", fontFamily: "'DM Mono', monospace" }}>La IA usará esto para recomendaciones reales — no genéricas</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {INTEREST_OPTIONS.map(i => (
                      <Pill key={i.id} active={intereses.includes(i.id)} onClick={() => toggleInteres(i.id)} color="#10b981">
                        {i.icon} {i.label}
                      </Pill>
                    ))}
                  </div>
                  {intereses.length === 0 && (
                    <p style={{ marginTop: "14px", color: "#334155", fontSize: "11px", fontFamily: "'DM Mono', monospace", fontStyle: "italic" }}>Puedes continuar sin seleccionar, pero las recomendaciones serán más genéricas.</p>
                  )}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <button style={btnSecondary} onClick={() => navigate("tareas")}>← Atrás</button>
                  <button style={{ ...btnPrimary, background: "linear-gradient(135deg, #10b981, #6366f1)" }} onClick={analizar}>
                    🔍 Analizar mi situación
                  </button>
                </div>
              </div>
            )}

            {/* ── RESULTADO ── */}
            {step === "resultado" && (
              <div>
                {loading ? (
                  <div style={{ textAlign: "center", padding: "80px 20px" }}>
                    <div style={{ width: "44px", height: "44px", borderRadius: "50%", border: "3px solid #1e293b", borderTop: "3px solid #6366f1", animation: "spin 0.8s linear infinite", margin: "0 auto 20px" }} />
                    <p style={{ color: "#6366f1", fontSize: "13px", letterSpacing: "2px", fontFamily: "'DM Mono', monospace" }}>ANALIZANDO TU PERFIL DOCENTE...</p>
                    <p style={{ color: "#334155", fontSize: "11px", marginTop: "8px", fontFamily: "'DM Mono', monospace" }}>Procesando contexto del magisterio ecuatoriano</p>
                  </div>
                ) : resultado && (
                  <div>
                    {/* Gauge + nivel */}
                    <div style={{ ...card, textAlign: "center", background: "linear-gradient(135deg, #0f172a, #0a0f1e)" }}>
                      <GaugeMeter value={resultado.nivelStress} />
                      <div style={{ marginTop: "8px" }}>
                        <span style={{ fontFamily: "Fraunces, serif", fontSize: "26px", color: "#f1f5f9", fontWeight: "900" }}>
                          Sobrecarga {resultado.etiquetaStress?.toUpperCase()}
                        </span>
                      </div>
                      <div style={{ marginTop: "10px", display: "inline-flex", alignItems: "center", gap: "8px", background: `${riskColor(resultado.burnoutRiesgo)}11`, border: `1px solid ${riskColor(resultado.burnoutRiesgo)}44`, borderRadius: "999px", padding: "6px 16px" }}>
                        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: riskColor(resultado.burnoutRiesgo), animation: resultado.burnoutRiesgo === "muy alto" ? "pulse-ring 1.5s infinite" : "none" }} />
                        <span style={{ color: riskColor(resultado.burnoutRiesgo), fontSize: "11px", letterSpacing: "1px", fontFamily: "'DM Mono', monospace" }}>
                          Riesgo burnout: {resultado.burnoutRiesgo?.toUpperCase()}
                        </span>
                      </div>
                      {resultado.contextoEcuador && (
                        <div style={{ marginTop: "14px", background: "#1e1b4b33", border: "1px solid #312e8133", borderRadius: "10px", padding: "10px 14px" }}>
                          <span style={{ color: "#818cf8", fontSize: "11px", fontFamily: "'DM Mono', monospace", lineHeight: 1.6 }}>🇪🇨 {resultado.contextoEcuador}</span>
                        </div>
                      )}
                      {resultado.mensajePersonal && (
                        <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7, marginTop: "14px", fontFamily: "Fraunces, serif", fontStyle: "italic", maxWidth: "460px", margin: "14px auto 0" }}>
                          "{resultado.mensajePersonal}"
                        </p>
                      )}
                    </div>

                    {/* Alertas */}
                    {resultado.alertas?.length > 0 && (
                      <div style={card}>
                        <h3 style={{ fontFamily: "Fraunces, serif", color: "#fca5a5", fontSize: "15px", marginBottom: "14px" }}>🚨 Alertas de riesgo</h3>
                        {resultado.alertas.map((a, i) => (
                          <div key={i} style={{ display: "flex", gap: "10px", padding: "10px 0", borderBottom: i < resultado.alertas.length - 1 ? "1px solid #1e293b" : "none" }}>
                            <span style={{ color: "#ef4444", flexShrink: 0 }}>⚠️</span>
                            <span style={{ color: "#fca5a5", fontSize: "13px", lineHeight: 1.6, fontFamily: "'DM Mono', monospace" }}>{a}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Derecho laboral */}
                    {resultado.derechoLaboral && (
                      <div style={{ ...card, background: "linear-gradient(135deg, #0c1a2e, #0f172a)", border: "1px solid #1e3a5f" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span style={{ fontSize: "20px", flexShrink: 0 }}>⚖️</span>
                          <div>
                            <div style={{ color: "#60a5fa", fontSize: "10px", letterSpacing: "2px", marginBottom: "6px", fontFamily: "'DM Mono', monospace" }}>CONOCE TU DERECHO · LOEI / MinEduc</div>
                            <p style={{ color: "#93c5fd", fontSize: "13px", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>{resultado.derechoLaboral}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Factores clave */}
                    {resultado.factoresClave?.length > 0 && (
                      <div style={card}>
                        <h3 style={{ fontFamily: "Fraunces, serif", color: "#e2e8f0", fontSize: "15px", marginBottom: "14px" }}>📊 Qué más te está afectando</h3>
                        {resultado.factoresClave.map((f, i) => (
                          <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "10px" }}>
                            <div style={{ flexShrink: 0, width: "22px", height: "22px", borderRadius: "50%", background: "#1e293b", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", color: "#6366f1", fontFamily: "'DM Mono', monospace", fontWeight: "700" }}>{i+1}</div>
                            <div style={{ flex: 1, height: "5px", background: "#0a0f1e", borderRadius: "3px" }}>
                              <div style={{ height: "100%", width: `${100 - i * 22}%`, background: "linear-gradient(90deg, #6366f1, #a78bfa)", borderRadius: "3px" }} />
                            </div>
                            <span style={{ color: "#94a3b8", fontSize: "12px", flexShrink: 0, fontFamily: "'DM Mono', monospace", maxWidth: "160px" }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Recomendaciones */}
                    {resultado.recomendaciones?.length > 0 && (
                      <div style={card}>
                        <h3 style={{ fontFamily: "Fraunces, serif", color: "#e2e8f0", fontSize: "15px", marginBottom: "16px" }}>💡 Recomendaciones personalizadas</h3>
                        {resultado.recomendaciones.map((rec, i) => (
                          <div key={i} style={{ background: "#0a0f1e", borderRadius: "12px", padding: "16px", marginBottom: "10px", border: "1px solid #1e293b" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                              <div style={{ display: "flex", gap: "9px", alignItems: "center" }}>
                                <span style={{ fontSize: "18px" }}>{rec.icono || "✨"}</span>
                                <span style={{ fontFamily: "Fraunces, serif", color: "#f1f5f9", fontSize: "14px", fontWeight: "600" }}>{rec.titulo}</span>
                              </div>
                              <div style={{ display: "flex", gap: "5px", flexShrink: 0, marginLeft: "8px" }}>
                                <span style={{ fontSize: "9px", color: impactColor(rec.impacto), background: `${impactColor(rec.impacto)}11`, padding: "2px 7px", borderRadius: "999px", letterSpacing: "1px", fontFamily: "'DM Mono', monospace" }}>{rec.impacto?.toUpperCase()}</span>
                                <span style={{ fontSize: "9px", color: tiempoColor(rec.tiempo), background: `${tiempoColor(rec.tiempo)}11`, padding: "2px 7px", borderRadius: "999px", letterSpacing: "1px", fontFamily: "'DM Mono', monospace" }}>{rec.tiempo}</span>
                              </div>
                            </div>
                            <p style={{ color: "#94a3b8", fontSize: "12px", lineHeight: 1.7, paddingLeft: "27px", fontFamily: "'DM Mono', monospace" }}>{rec.descripcion}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Fortaleza */}
                    {resultado.fortaleza && (
                      <div style={{ ...card, background: "linear-gradient(135deg, #052e16, #0f172a)", border: "1px solid #14532d" }}>
                        <div style={{ display: "flex", gap: "12px" }}>
                          <span style={{ fontSize: "22px" }}>💪</span>
                          <div>
                            <div style={{ color: "#4ade80", fontSize: "10px", letterSpacing: "2px", marginBottom: "6px", fontFamily: "'DM Mono', monospace" }}>TU FORTALEZA</div>
                            <p style={{ color: "#86efac", fontSize: "13px", lineHeight: 1.7, fontFamily: "'DM Mono', monospace" }}>{resultado.fortaleza}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div style={{ textAlign: "center", marginTop: "8px" }}>
                      <button style={btnSecondary} onClick={() => { setResultado(null); navigate("perfil"); }}>↩ Nuevo análisis</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: "36px", color: "#1e293b", fontSize: "10px", fontFamily: "'DM Mono', monospace", lineHeight: 1.8 }}>
            Análisis orientativo · No reemplaza orientación profesional de salud mental<br />
            Basado en LOEI, Acuerdos Ministeriales y estándares MinEduc Ecuador
          </div>
        </div>
      </div>
    </>
  );
}
