import { Subject, EducationLevel } from "../types";

export interface SampleProblemItem {
  id: string;
  label: string;
  topic: string;
  subject: Subject;
  level: EducationLevel;
  difficulty: "Básico" | "Intermedio" | "Avanzado";
  text: string;
}

export const SAMPLE_PROBLEMS_BANK: SampleProblemItem[] = [
  // MATEMÁTICA - PRIMARIA
  {
    id: "mat_pri_1",
    label: "Fracciones y compras en la verdulería",
    topic: "Fracciones y Decimales",
    subject: "Matemática",
    level: "Primaria (4° a 6° año)",
    difficulty: "Básico",
    text: "Juan fue a la verdulería del barrio y compró 1 kilo y 3/4 de manzanas a $1.200 el kilo, y 2 kilos y medio de papas a $800 el kilo. Si pagó con un billete de $5.000, ¿cuánto dinero le dieron de vuelto?",
  },
  {
    id: "mat_pri_2",
    label: "Problema de proporcionalidad directa (Alfajores)",
    topic: "Regla de Tres Simple",
    subject: "Matemática",
    level: "Primaria (4° a 6° año)",
    difficulty: "Básico",
    text: "En una fábrica de Mar del Plata, con 3 paquetes de harina se elaboran 72 alfajores artesanales. ¿Cuántos alfajores se podrán hacer con 8 paquetes iguales? ¿Cuántos paquetes se necesitan para 240 alfajores?",
  },
  {
    id: "mat_pri_3",
    label: "Cálculo de perímetro y área del patio escolar",
    topic: "Geometría y Medición",
    subject: "Matemática",
    level: "Primaria (4° a 6° año)",
    difficulty: "Intermedio",
    text: "El patio de la escuela tiene forma rectangular, mide 18,5 metros de largo y 12 metros de ancho. Quieren cercarlo con una cinta de peligro y pintar todo el piso. Calcular el perímetro total y la superficie en metros cuadrados.",
  },

  // MATEMÁTICA - SECUNDARIA BÁSICA
  {
    id: "mat_secb_1",
    label: "Ecuación lineal con fracciones y distributiva",
    topic: "Ecuaciones de 1° Grado",
    subject: "Matemática",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Resolver y verificar la siguiente ecuación aplicando propiedad distributiva y simplificación: 2/3 (x - 1) + 1/2 = 3/4 x - 2",
  },
  {
    id: "mat_secb_2",
    label: "Teorema de Pitágoras y sombras en la plaza",
    topic: "Pitágoras y Triángulos Rectángulos",
    subject: "Matemática",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Un poste de luz de 6 metros de altura proyecta sobre la vereda una sombra de 4,5 metros. ¿Cuál es la distancia en línea recta desde la punta más alta del poste hasta el extremo de la sombra en el piso? (Hacer esquema y calcular con Pitágoras).",
  },
  {
    id: "mat_secb_3",
    label: "Operaciones combinadas con números enteros (Z)",
    topic: "Números Enteros y Paréntesis",
    subject: "Matemática",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Básico",
    text: "Separar en términos y resolver respetando la jerarquía de operaciones: -3 · (-4 + 7) + √49 - (-18) : (-3)² + (-2)³",
  },
  {
    id: "mat_secb_4",
    label: "Función lineal: recta, pendiente y ordenada",
    topic: "Funciones Lineales",
    subject: "Matemática",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Dada la función lineal y = -2x + 4: a) Indicar pendiente y ordenada al origen. b) Hallar la raíz o cero de la función. c) Indicar si es creciente o decreciente y graficar por corrimiento.",
  },
  {
    id: "mat_secb_5",
    label: "Porcentajes y recargos comerciales en cuotas",
    topic: "Porcentajes y Descuentos",
    subject: "Matemática",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Básico",
    text: "Una campera cuesta $45.000 de contado. Si se abona en 3 cuotas fijas con tarjeta de crédito, tiene un recargo del 18%. En cambio, si se paga en efectivo en el local, hacen un descuento del 15%. ¿Cuánto se paga en cada modalidad y cuál es el valor de cada cuota?",
  },

  // MATEMÁTICA - SECUNDARIA SUPERIOR
  {
    id: "mat_secsup_1",
    label: "Ecuación cuadrática y fórmula de Bhaskara",
    topic: "Función Cuadrática",
    subject: "Matemática",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Avanzado",
    text: "Hallar las raíces reales de la ecuación cuadrática 2x² - 8x - 24 = 0 mediante la fórmula resolvente de Bhaskara. Indicar las coordenadas del vértice (Xv, Yv) y el eje de simetría.",
  },
  {
    id: "mat_secsup_2",
    label: "Trigonometría: razones trigonométricas y ángulos",
    topic: "SOH-CAH-TOA",
    subject: "Matemática",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Desde un punto en el suelo a 35 metros de la base de una torre de telefonía, un observador divisa la cúspide con un ángulo de elevación de 38°. Calcular la altura de la torre considerando que el instrumento de medición está a 1,60 m del suelo.",
  },
  {
    id: "mat_secsup_3",
    label: "Casos de factoreo: Factor común y diferencia de cuadrados",
    topic: "Polinomios y Factoreo",
    subject: "Matemática",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Factorizar al máximo los siguientes polinomios indicando el caso utilizado: a) P(x) = 3x⁴ - 12x² b) Q(x) = x² - 49 c) R(x) = 2x³ + 6x² + 2x + 6",
  },

  // PRÁCTICAS DEL LENGUAJE - PRIMARIA & SECUNDARIA
  {
    id: "leng_1",
    label: "Análisis sintáctico completo de Oración Bimembre",
    topic: "Sintaxis: Sujeto y Predicado",
    subject: "Prácticas del Lenguaje",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Analizar sintácticamente la siguiente oración entre corchetes, marcando Sujeto, Predicado, Núcleos y Modificadores: 'Ayer por la tarde, los entusiastas alumnos de la profesora Patricia resolvieron los difíciles ejercicios de matemática con gran alegría.'",
  },
  {
    id: "leng_2",
    label: "Distinguiendo Sujeto Tácito y Objeto Directo",
    topic: "Sujeto Tácito y Pronominalización",
    subject: "Prácticas del Lenguaje",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Analizar sintácticamente: 'Compraron unos hermosos libros de cuentos para la biblioteca de la escuela.' Indicar el Sujeto Tácito (persona y número) y verificar el Objeto Directo mediante el reemplazo pronominal por 'los'.",
  },
  {
    id: "leng_3",
    label: "Acentuación: Agudas, Graves, Esdrújulas y Tilde Diacrítica",
    topic: "Reglas de Ortografía y Acentuación",
    subject: "Prácticas del Lenguaje",
    level: "Primaria (4° a 6° año)",
    difficulty: "Básico",
    text: "Clasificar las siguientes palabras según su acentuación (aguda, grave o esdrújula) y justificar por qué llevan o no tilde gráfica: canción, árbol, cuaderno, pájaro, examen, exámenes, corazón.",
  },
  {
    id: "leng_4",
    label: "Diptongo, Hiato y separación en sílabas",
    topic: "Fonología y Sílabas",
    subject: "Prácticas del Lenguaje",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Básico",
    text: "Separar en sílabas las siguientes palabras, señalar si hay diptongo o hiato y explicar la regla vocálica: bahía, paisaje, héroe, teatro, ciudad, frío, cuento.",
  },
  {
    id: "leng_5",
    label: "Clasificación morfológica de palabras en un fragmento",
    topic: "Clases de Palabras",
    subject: "Prácticas del Lenguaje",
    level: "Primaria (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Extraer del siguiente texto: 2 sustantivos comunes, 1 sustantivo propio, 2 adjetivos calificativos, 2 verbos conjugados y 1 preposición: 'En La Plata, Manuel preparó una riquísima merienda con galletitas caseras para sus queridos compañeros.'",
  },

  // FÍSICA
  {
    id: "fis_1",
    label: "MRU: Encuentro de micros en la ruta 2",
    topic: "Cinemática MRU",
    subject: "Física",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Un micro de larga distancia sale de Mar del Plata hacia La Plata a una velocidad constante de 90 km/h. Si la distancia total es de 360 km y salió a las 08:30 hs: a) ¿A qué hora exacta llegará a destino? b) ¿A cuántos metros por segundo (m/s) equivale su velocidad?",
  },
  {
    id: "fis_2",
    label: "MRUV: Frenado de un automóvil ante el semáforo",
    topic: "Cinemática MRUV y Aceleración",
    subject: "Física",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Un auto viaja por la avenida a 72 km/h (20 m/s). Al ver el semáforo en rojo, el conductor frena con una desaceleración constante de 4 m/s² hasta detenerse por completo. Calcular: a) El tiempo que tarda en frenar. b) La distancia recorrida durante la frenada.",
  },
  {
    id: "fis_3",
    label: "2° Ley de Newton: Fuerza, masa y aceleración",
    topic: "Dinámica y Leyes de Newton",
    subject: "Física",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Básico",
    text: "Una fuerza horizontal de 150 N empuja un carrito de 25 kg apoyado sobre una superficie horizontal lisa (sin rozamiento). Calcular: a) La aceleración que adquiere el carrito. b) La velocidad que alcanzará luego de 4 segundos partiendo del reposo.",
  },
  {
    id: "fis_4",
    label: "Energía cinética y energía potencial gravitatoria",
    topic: "Trabajo y Energía",
    subject: "Física",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Una pelota de 500 gramos (0,5 kg) se deja caer desde la terraza de un edificio de 20 metros de altura (g = 9,8 m/s²). Calcular: a) Su energía potencial inicial. b) Su energía cinética justo antes de tocar el suelo. c) La velocidad con la que impacta.",
  },
  {
    id: "fis_5",
    label: "Presión hidrostática y principio de Pascal",
    topic: "Fluidos e Hidrostática",
    subject: "Física",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Avanzado",
    text: "En una prensa hidráulica, el émbolo menor tiene una sección de 10 cm² y el émbolo mayor una sección de 250 cm². Si se aplica una fuerza de 80 N en el émbolo menor, ¿qué fuerza máxima es capaz de levantar en el émbolo mayor? Explicar el principio físico aplicado.",
  },

  // QUÍMICA
  {
    id: "quim_1",
    label: "Estructura de Lewis y uniones Iónica vs Covalente",
    topic: "Uniones Químicas y Lewis",
    subject: "Química",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Intermedio",
    text: "Explicar el tipo de unión química y graficar la estructura de Lewis para: a) El Dióxido de Carbono (CO2) b) El Cloruro de Magnesio (MgCl2). Indicar en cada caso si hay transferencia o compartición de electrones y justificar con la regla del octeto.",
  },
  {
    id: "quim_2",
    label: "Balanceo de ecuaciones químicas por tanteo",
    topic: "Reacciones y Conservación de Masa",
    subject: "Química",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Balancear por el método de tanteo las siguientes ecuaciones químicas respetando la Ley de Conservación de la Masa de Lavoisier: a) Fe + O2 -> Fe2O3 b) C3H8 + O2 -> CO2 + H2O c) Al + HCl -> AlCl3 + H2",
  },
  {
    id: "quim_3",
    label: "Cálculo de Masa Molar y número de Moles (Masa a Moles)",
    topic: "Estequiometría y Moles",
    subject: "Química",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Calcular la masa molar del Ácido Sulfúrico (H2SO4) utilizando las masas atómicas de la Tabla Periódica (H=1 g/mol, S=32 g/mol, O=16 g/mol). ¿Cuántos moles y cuántos gramos de H2SO4 hay presentes en una muestra de 245 gramos?",
  },
  {
    id: "quim_4",
    label: "Soluciones: Concentración en % m/m y % m/v",
    topic: "Soluciones y Concentraciones",
    subject: "Química",
    level: "Secundaria Superior (4° a 6° año)",
    difficulty: "Intermedio",
    text: "Se prepara una solución disolviendo 25 gramos de sal de mesa (NaCl) en 225 gramos de agua destilada. Calcular: a) La masa total de la solución. b) La concentración expresada en porcentaje masa en masa (% m/m). c) Si el volumen final es de 240 mL, ¿cuál es el % m/v?",
  },
  {
    id: "quim_5",
    label: "Tabla Periódica: Electronegatividad y Radio Atómico",
    topic: "Propiedades Periódicas",
    subject: "Química",
    level: "Secundaria Básica (1° a 3° año)",
    difficulty: "Básico",
    text: "Para los elementos Sodio (Z=11), Cloro (Z=17) y Oxígeno (Z=8): a) Indicar período y grupo en la Tabla Periódica. b) Determinar la cantidad de protones, neutrones y electrones. c) Ordenarlos de menor a mayor electronegatividad.",
  },
];

// Helper to get random sample problems with rotation
export function getRandomSampleProblems(
  selectedSubject?: Subject | "Todos",
  count: number = 5,
  excludeIds: string[] = []
): SampleProblemItem[] {
  let pool = SAMPLE_PROBLEMS_BANK;
  if (selectedSubject && selectedSubject !== "Todos") {
    pool = pool.filter((p) => p.subject === selectedSubject);
  }
  if (pool.length === 0) {
    pool = SAMPLE_PROBLEMS_BANK;
  }

  // Filter out recently shown if possible
  const available = pool.filter((p) => !excludeIds.includes(p.id));
  const source = available.length >= count ? available : pool;

  // Shuffle array using Fisher-Yates
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Search problems bank by keyword/topic across all fields
export function searchSampleProblems(
  query: string,
  selectedSubject?: Subject | "Todos"
): SampleProblemItem[] {
  const cleanQ = query.toLowerCase().trim();
  if (!cleanQ) return [];

  let pool = SAMPLE_PROBLEMS_BANK;
  if (selectedSubject && selectedSubject !== "Todos") {
    pool = pool.filter((p) => p.subject === selectedSubject);
  }

  return pool.filter((p) => {
    const textMatch = p.text.toLowerCase().includes(cleanQ);
    const labelMatch = p.label.toLowerCase().includes(cleanQ);
    const topicMatch = p.topic.toLowerCase().includes(cleanQ);
    const subjectMatch = p.subject.toLowerCase().includes(cleanQ);
    const difficultyMatch = p.difficulty.toLowerCase().includes(cleanQ);
    return textMatch || labelMatch || topicMatch || subjectMatch || difficultyMatch;
  });
}

// Generate an authentic curricular exercise for any typed topic
export function generateLocalTopicExercise(
  topicQuery: string,
  currentSubject: Subject = "Matemática",
  currentLevel: EducationLevel = "Secundaria Básica (1° a 3° año)"
): SampleProblemItem {
  const q = topicQuery.toLowerCase().trim();

  // Detect subject if not explicitly matching
  let inferredSubject: Subject = currentSubject;
  let inferredLevel: EducationLevel = currentLevel;
  let difficulty: "Básico" | "Intermedio" | "Avanzado" = "Intermedio";

  if (q.includes("quim") || q.includes("mol") || q.includes("estequio") || q.includes("tabla periodica") || q.includes("oxido") || q.includes("lewis") || q.includes("atomo")) {
    inferredSubject = "Química";
  } else if (q.includes("fisic") || q.includes("mru") || q.includes("mruv") || q.includes("newton") || q.includes("fuerza") || q.includes("calor") || q.includes("cinematica") || q.includes("caida libre")) {
    inferredSubject = "Física";
  } else if (q.includes("lengua") || q.includes("sintax") || q.includes("sujeto") || q.includes("predicado") || q.includes("oracion") || q.includes("acento") || q.includes("texto") || q.includes("verbo") || q.includes("tilde")) {
    inferredSubject = "Prácticas del Lenguaje";
  } else if (q.includes("mat") || q.includes("ecuacion") || q.includes("fraccion") || q.includes("pitagoras") || q.includes("bhaskara") || q.includes("derivada") || q.includes("trigono") || q.includes("proporc") || q.includes("regla de tres")) {
    inferredSubject = "Matemática";
  }

  // Pre-crafted authentic exercises for popular curriculum topics
  if (q.includes("tales") || q.includes("thales")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Teorema de Tales: Segmentos proporcionales",
      topic: "Teorema de Tales y Proporcionalidad",
      subject: "Matemática",
      level: "Secundaria Básica (1° a 3° año)",
      difficulty: "Intermedio",
      text: "Tres rectas paralelas a, b y c son cortadas por dos rectas transversales r y s. Sobre la recta r se determinan los segmentos AB = 6 cm y BC = 9 cm. Sobre la recta s, el segmento A'B' mide 4 cm. Aplicar el Teorema de Tales para calcular la longitud del segmento B'C' y graficar el esquema.",
    };
  }

  if (q.includes("ruffini") || q.includes("gauss") || q.includes("polinomio")) {
    return {
      id: `gen_${Date.now()}`,
      label: "División de Polinomios por Regla de Ruffini",
      topic: "Polinomios y Regla de Ruffini",
      subject: "Matemática",
      level: "Secundaria Superior (4° a 6° año)",
      difficulty: "Intermedio",
      text: "Dado el polinomio P(x) = 2x³ - 5x² + 4x - 6 y el divisor Q(x) = x - 2: a) Realizar la división utilizando la Regla de Ruffini. b) Indicar el polinomio cociente C(x) y el resto R. c) Verificar el resto aplicando el Teorema del Resto P(2).",
    };
  }

  if (q.includes("mruv") || q.includes("acelerac")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Movimiento Rectilíneo Uniformemente Variado (MRUV)",
      topic: "Cinemática y MRUV",
      subject: "Física",
      level: "Secundaria Superior (4° a 6° año)",
      difficulty: "Intermedio",
      text: "Un automóvil que viaja en línea recta por la autopista a una velocidad inicial de 72 km/h (20 m/s) frena de manera constante con una aceleración de -2,5 m/s² hasta detenerse por completo. Calcular: a) El tiempo total que tarda en frenar. b) La distancia recorrida durante el frenado.",
    };
  }

  if (q.includes("caida libre") || q.includes("tiro vertical")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Caída Libre y Tiro Vertical",
      topic: "Cinemática y Gravedad",
      subject: "Física",
      level: "Secundaria Superior (4° a 6° año)",
      difficulty: "Intermedio",
      text: "Se deja caer una pelota desde la terraza de un edificio de 45 metros de altura. Despreciando el rozamiento con el aire y tomando la aceleración de la gravedad g = 9,8 m/s²: a) ¿Cuánto tiempo tarda en llegar al suelo? b) ¿Con qué velocidad (en m/s y en km/h) impacta contra el piso?",
    };
  }

  if (q.includes("logaritm")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Ecuaciones Logarítmicas y Propiedades",
      topic: "Logaritmos",
      subject: "Matemática",
      level: "Secundaria Superior (4° a 6° año)",
      difficulty: "Avanzado",
      text: "Resolver la siguiente ecuación logarítmica aplicando la propiedad del logaritmo de un producto y la definición: log₂(x + 2) + log₂(x - 2) = 5. Indicar el dominio de validez y verificar la solución obtenida.",
    };
  }

  if (q.includes("oracion compuesta") || q.includes("coordinada") || q.includes("subordinada")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Análisis de Oración Compuesta por Coordinación",
      topic: "Sintaxis: Oraciones Compuestas",
      subject: "Prácticas del Lenguaje",
      level: "Secundaria Superior (4° a 6° año)",
      difficulty: "Avanzado",
      text: "Analizar sintácticamente y clasificar la siguiente oración compuesta: [Los alumnos repasaron todas las fórmulas en el aula], pero [el profesor propuso un desafío integrador muy creativo]. Marcar proposiciones, nexo coordinante adversativo y estructuras internas.",
    };
  }

  if (q.includes("ley de ohm") || q.includes("circuito") || q.includes("resistencia")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Ley de Ohm y Circuitos Eléctricos en Serie",
      topic: "Electricidad y Ley de Ohm",
      subject: "Física",
      level: "Secundaria Básica (1° a 3° año)",
      difficulty: "Intermedio",
      text: "Un circuito eléctrico simple está conectado a una fuente de tensión de 220 V y contiene dos resistencias en serie: R1 = 40 Ω y R2 = 70 Ω. Calcular: a) La resistencia equivalente total del circuito (Req). b) La intensidad de corriente eléctrica total (I) que circula por el circuito. c) La caída de tensión en cada resistencia.",
    };
  }

  if (q.includes("oxido") || q.includes("nomenclatura")) {
    return {
      id: `gen_${Date.now()}`,
      label: "Nomenclatura y Formación de Óxidos Básicos y Ácidos",
      topic: "Compuestos Inorgánicos",
      subject: "Química",
      level: "Secundaria Básica (1° a 3° año)",
      difficulty: "Intermedio",
      text: "Escribir la ecuación química balanceada de formación y nombrar por nomenclatura tradicional y IUPAC/moderna para: a) La combinación de Hierro con valencia III con Oxígeno molecular (Fe + O₂). b) La combinación de Azufre con valencia IV con Oxígeno (S + O₂).",
    };
  }

  if (q.includes("proporc") || q.includes("regla de tres") || q.includes("porcentaje")) {
    return {
      id: `gen_${Date.now()}`,
      label: `Problema de aplicación sobre ${topicQuery}`,
      topic: topicQuery,
      subject: "Matemática",
      level: inferredLevel,
      difficulty: "Básico",
      text: `Un taller de confección textil en Avellaneda produce 85 prendas de abrigo con 15 metros de tela de algodón. a) ¿Cuántas prendas idénticas se podrán confeccionar con 45 metros de tela? b) Si se desea producir 340 prendas para un pedido escolar, ¿cuántos metros de tela se deberán comprar? Plantear la Regla de Tres Simple y verificar.`,
    };
  }

  // Generic customized curricular exercise
  const capitalizedTopic = topicQuery.charAt(0).toUpperCase() + topicQuery.slice(1);
  return {
    id: `gen_${Date.now()}`,
    label: `Ejercicio de práctica: ${capitalizedTopic}`,
    topic: capitalizedTopic,
    subject: inferredSubject,
    level: inferredLevel,
    difficulty,
    text: `Plantear, resolver y justificar paso a paso el siguiente ejercicio sobre ${capitalizedTopic} correspondiente a ${inferredSubject} (${inferredLevel}): Desarrollar los cálculos con precisión, detallar las propiedades y fórmulas aplicadas en cada renglón y verificar el resultado final.`,
  };
}

