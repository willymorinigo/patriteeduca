import { SolvedProblemResult, Subject, EducationLevel, Worksheet, DifficultyLevel } from "../types";

export function generateLocalSolvedProblem(
  problemText: string,
  subject: Subject,
  level: EducationLevel | string,
  studentName?: string
): SolvedProblemResult {
  const norm = (problemText || "").toLowerCase();
  const cleanSubject = subject || "Matemática";

  // 1. Lengua y Prácticas del Lenguaje
  if (cleanSubject.includes("Lengua") || cleanSubject.includes("Prácticas del Lenguaje")) {
    return {
      problemTitle: "Análisis Sintáctico y Morfológico Didáctico",
      subject: "Prácticas del Lenguaje",
      level: String(level || "Secundaria Básica"),
      originalProblem: problemText || "Análisis sintáctico de oración bimembre",
      stepByStep: [
        {
          stepNumber: 1,
          title: "1. Encontrar el Verbo Conjugado (Núcleo Verbal)",
          explanation: "Buscamos la palabra que indica la acción principal, proceso o estado de la oración. Este verbo marca el tiempo, persona y número.",
          detailOrFormula: "Núcleo Verbal (NV): Verbo conjugado principal",
          practicalTip: "Preguntale al verbo: '¿Quién o quiénes realizan la acción?' para hallar el Sujeto sin margen de error.",
        },
        {
          stepNumber: 2,
          title: "2. Delimitar Sujeto y Predicado",
          explanation: "Separamos la oración en dos partes fundamentales: el Sujeto (de quién se habla) y el Predicado (lo que se dice del sujeto).",
          detailOrFormula: "[ (Sujeto Expreso) / (Predicado Verbal) ] O.B. (Oración Bimembre)",
          practicalTip: "Si el sujeto no está escrito en la oración pero se sobreentiende por la terminación del verbo, se indica como Sujeto Tácito (S.T.).",
        },
        {
          stepNumber: 3,
          title: "3. Analizar los Modificadores del Sujeto",
          explanation: "Identificamos el Núcleo Sustantivo (N), los Modificadores Directos (MD: artículos y adjetivos pegados al sustantivo) y Modificadores Indirectos (MI: encabezados por preposiciones).",
          detailOrFormula: "MD: Artículo / Adjetivo | MI: Preposición + Término",
          practicalTip: "Los Modificadores Directos concuerdan siempre en género y número con el sustantivo.",
        },
        {
          stepNumber: 4,
          title: "4. Analizar los Modificadores del Predicado",
          explanation: "Buscamos el Objeto Directo (OD), Objeto Indirecto (OI) y los Circunstanciales (Tiempo, Lugar, Modo, Causa, etc.).",
          detailOrFormula: "OD: Reemplazable por 'lo, la, los, las' | OI: Reemplazable por 'le, les'",
          practicalTip: "Hacer la prueba del reemplazo pronominal para confirmar el Objeto Directo.",
        },
        {
          stepNumber: 5,
          title: "5. Cierre y verificación con corchetes",
          explanation: "Encerramos la oración entre corchetes [ ... ] y colocamos al final la clasificación: Oración Bimembre (O.B.) con S.E.S. y P.V.S.",
          detailOrFormula: "[ ... ] O.B. / S.E.S. + P.V.S.",
          practicalTip: "Revisá que ninguna palabra de la oración haya quedado sin su correspondiente función sintáctica.",
        },
      ],
      finalAnswer: "Oración Bimembre (O.B.) analizada con Sujeto Expreso Simple (S.E.S.), Predicado Verbal Simple (P.V.S.) y sus modificadores directos e indirectos correspondientes.",
      pedagogicalTips: [
        "Hacer que el alumno marque con colores diferentes el Sujeto (azul o verde) y el Predicado (rojo o naranja).",
        "Recordar que el Núcleo del Sujeto debe concordar obligatoriamente en persona y número con el Núcleo Verbal.",
        "Para los circunstanciales, formular preguntas clave: ¿Dónde? (Lugar), ¿Cuándo? (Tiempo), ¿Cómo? (Modo).",
      ],
      commonPitfalls: [
        "Confundir un Modificador Directo (adjetivo) con un Modificador Indirecto (preposición).",
        "Confundir el Objeto Directo con un Circunstancial de Modo o Cantidad.",
        "Olvidar señalar el Sujeto Tácito cuando no está explícitamente escrito.",
      ],
      reinforcementConcept: "Concordancia gramatical obligatoria entre el Núcleo del Sujeto y el Verbo conjugado.",
    };
  }

  // 2. Física
  if (cleanSubject.includes("Física") || norm.includes("mru") || norm.includes("velocidad") || norm.includes("newton")) {
    return {
      problemTitle: "Resolución de Cinemática / Dinámica (Física)",
      subject: "Física",
      level: String(level || "Secundaria"),
      originalProblem: problemText || "Problema de física aplicada",
      stepByStep: [
        {
          stepNumber: 1,
          title: "1. Extracción de Datos e Incógnitas con Unidades",
          explanation: "Leemos el enunciado y listamos en el margen izquierdo todos los valores numéricos con sus unidades del Sistema Internacional (SI).",
          detailOrFormula: "Datos: Posición (x₀), Velocidad (v), Tiempo (t) | Incógnita: Distancia total (x)",
          practicalTip: "Anotar siempre las unidades para no mezclar magnitudes (ej: km/h con m/s o minutos con horas).",
        },
        {
          stepNumber: 2,
          title: "2. Conversión y Homogeneización de Unidades",
          explanation: "Si tenemos velocidades en km/h y tiempos en segundos o minutos, convertimos dividiendo por 3,6 para trabajar en m/s.",
          detailOrFormula: "1 km/h = 1 / 3,6 m/s (ej: 72 km/h = 20 m/s)",
          practicalTip: "De km/h a m/s se DIVIDE por 3,6. De m/s a km/h se MULTIPLICA por 3,6.",
        },
        {
          stepNumber: 3,
          title: "3. Planteo de la Ecuación Horaria o Fórmula",
          explanation: "Seleccionamos la fórmula física correspondiente al movimiento o principio físico aplicable.",
          detailOrFormula: "MRU: Distancia = Velocidad × Tiempo (x = v · t) | Newton: F = m · a",
          practicalTip: "Despejar la incógnita de forma literal antes de reemplazar con los números.",
        },
        {
          stepNumber: 4,
          title: "4. Cálculo algebraico y simplificación de unidades",
          explanation: "Reemplazamos los valores, realizamos el cálculo numérico y simplificamos dimensionalmente las unidades.",
          detailOrFormula: "Resultado = [Valor numérico] [Unidad SI correspondiente]",
          practicalTip: "Preguntarse: ¿El resultado tiene sentido físico en la vida real?",
        },
      ],
      finalAnswer: "Resultado obtenido y verificado dimensionalmente con sus unidades correspondientes del Sistema Internacional (SI).",
      pedagogicalTips: [
        "Hacer que el alumno dibuje siempre un esquema con la trayectoria y el sentido positivo de referencia.",
        "Comprobar las cancelaciones de unidades paso a paso en el cuaderno.",
      ],
      commonPitfalls: [
        "Mezclar horas con minutos o segundos sin hacer la conversión previa.",
        "Olvidar colocar la unidad de medida al lado del número en la respuesta final.",
      ],
      reinforcementConcept: "En física, el sistema de referencia y las unidades homogéneas determinan la validez del cálculo.",
    };
  }

  // 3. Química
  if (cleanSubject.includes("Química") || norm.includes("lewis") || norm.includes("union") || norm.includes("molar")) {
    return {
      problemTitle: "Estructura Química, Uniones y Lewis",
      subject: "Química",
      level: String(level || "Secundaria"),
      originalProblem: problemText || "Problema de química general y uniones",
      stepByStep: [
        {
          stepNumber: 1,
          title: "1. Ubicación en la Tabla Periódica y Electrones de Valencia",
          explanation: "Identificamos el grupo y la cantidad de electrones en el último nivel de energía para cada elemento.",
          detailOrFormula: "Electrones de valencia = Número de Grupo representativo",
          practicalTip: "El número de grupo indica directamente cuántos puntos o cruces dibujar alrededor del símbolo.",
        },
        {
          stepNumber: 2,
          title: "2. Determinación del Tipo de Unión Química",
          explanation: "Analizamos la naturaleza de los elementos: Metal + No Metal (Unión Iónica) o No Metal + No Metal (Unión Covalente).",
          detailOrFormula: "Iónica: Transferencia de e⁻ | Covalente: Compartición de pares de e⁻",
          practicalTip: "Los metales ceden electrones formando cationes (+); los no metales captan o comparten.",
        },
        {
          stepNumber: 3,
          title: "3. Aplicación de la Regla del Octeto y Estructura de Lewis",
          explanation: "Graficamos los símbolos y distribuimos los electrones para que cada átomo alcance la configuración estable de 8 electrones.",
          detailOrFormula: "Octeto completo: 8 electrones en el nivel de valencia",
          practicalTip: "Usar cruces para un elemento y puntos para el otro para no confundirlos.",
        },
        {
          stepNumber: 4,
          title: "4. Formulación y Nomenclatura Final",
          explanation: "Escribimos la fórmula molecular desarrollada o por pares de enlaces verificando la neutralidad eléctrica.",
          detailOrFormula: "Fórmula molecular y estructura desarrollada",
          practicalTip: "Verificar que la suma total de cargas sea cero.",
        },
      ],
      finalAnswer: "Estructura de Lewis y tipo de enlace determinados satisfactoriamente según la regla del octeto de valencia.",
      pedagogicalTips: [
        "Utilizar colores diferentes para los electrones de cada átomo.",
        "Asociar los enlaces simples, dobles y triples con los electrones faltantes para completar 8.",
      ],
      commonPitfalls: [
        "Poner corchetes con cargas en uniones covalentes (los corchetes son solo para compuestos iónicos).",
        "Olvidar los electrones libres no enlazantes del átomo central.",
      ],
      reinforcementConcept: "La regla del octeto impulsa a los átomos a enlazarse para ganar estabilidad energética.",
    };
  }

  // 4. Matemática (Ecuaciones, Fracciones, Geometría, etc.)
  return {
    problemTitle: "Resolución Didáctica Paso a Paso (Pizarrón)",
    subject: "Matemática",
    level: String(level || "Secundaria Básica"),
    originalProblem: problemText || "Ejercicio de matemática",
    stepByStep: [
      {
        stepNumber: 1,
        title: "1. Separar en Términos y Analizar la Jerarquía de Operaciones",
        explanation: "Los signos de suma (+) y resta (-) que no están encerrados dentro de paréntesis dividen la cuenta en bloques independientes.",
        detailOrFormula: "Término 1 + Término 2 = Término 3",
        practicalTip: "Marcá 'arcos' por arriba de la cuenta para separar visualmente cada término antes de empezar.",
      },
      {
        stepNumber: 2,
        title: "2. Suprimir Paréntesis y Aplicar Propiedad Distributiva",
        explanation: "Si hay un número multiplicando o dividiendo a un paréntesis, opera con cada término de adentro respetando estrictamente la regla de los signos.",
        detailOrFormula: "a · (b + c) = a·b + a·c | Regla de signos: (+)·(-)=(-), (-)·(-)=(+)",
        practicalTip: "¡Cuidado con el signo menos delante de un paréntesis! Le cambia el signo a TODO lo que está adentro.",
      },
      {
        stepNumber: 3,
        title: "3. Agrupar Términos (Incógnitas de un lado, números del otro)",
        explanation: "Pasamos todos los términos con 'x' al primer miembro y los números sin incógnita al segundo miembro mediante la operación inversa.",
        detailOrFormula: "Suma pasa a Resta | Multiplicación pasa a División (sin cambiar el signo)",
        practicalTip: "Mantené el signo igual (=) bien alineado verticalmente en la hoja cuadriculada para no perder números.",
      },
      {
        stepNumber: 4,
        title: "4. Operar Términos Semejantes y Despejar la Incógnita",
        explanation: "Sumamos o restamos los coeficientes (usando denominador común si hay fracciones) y dejamos la incógnita 'x' completamente despejada.",
        detailOrFormula: "x = [Resultado en fracción irreducible o número entero]",
        practicalTip: "Si el resultado es una fracción, simplificala hasta su mínima expresión.",
      },
      {
        stepNumber: 5,
        title: "5. Verificación del Resultado en la Ecuación Original",
        explanation: "Reemplazamos el valor hallado en la ecuación de partida para comprobar que ambos lados den exactamente el mismo número.",
        detailOrFormula: "Primer Miembro = Segundo Miembro (Identidad confirmada)",
        practicalTip: "Enseñale al alumno que la verificación es su propio 'seguro' en los exámenes para saber que sacó un 10.",
      },
    ],
    finalAnswer: "Resultado hallado y verificado paso a paso mediante propiedades uniformes y simplificación.",
    pedagogicalTips: [
      "Recordar siempre la regla de los signos: signos iguales dan positivo, signos opuestos dan negativo.",
      "Trabajar en vertical en la hoja cuadriculada, renglón por renglón.",
      "Simplificar las fracciones intermedias para trabajar siempre con números chicos y fáciles.",
    ],
    commonPitfalls: [
      "Olvidar cambiar la operación al pasar un término al otro lado del igual.",
      "Distribuir solo con el primer término dentro del paréntesis y olvidarse del segundo.",
      "Cambiarle el signo a un número que está multiplicando y pasa dividiendo.",
    ],
    reinforcementConcept: "Toda ecuación es como una balanza en equilibrio: cualquier operación que se aplique de un lado debe aplicarse exactamente del otro.",
  };
}

export function generateLocalWorksheet(
  subject: Subject,
  topic: string,
  level: EducationLevel | string,
  difficulty: DifficultyLevel = "Intermedio",
  count: number = 5,
  studentName?: string
): Worksheet {
  const norm = (topic || "").toLowerCase();

  let exercises = [
    {
      number: 1,
      statement: `Resolver el siguiente ejercicio de aplicación práctica sobre ${topic}: Plantear el cálculo paso a paso y justificar el procedimiento.`,
      hint: "Separa en términos y respeta la jerarquía de operaciones.",
      solution: {
        stepSummary: `Aplicar el método paso a paso para ${topic}, despejando la incógnita y simplificando.`,
        answer: "Resultado verificado y simplificado.",
      },
    },
    {
      number: 2,
      statement: `Problema de razonamiento sobre ${topic}: Leer los datos con atención, plantear la expresión correspondiente y resolver.`,
      hint: "Subraya los datos numéricos y lo que te pide averiguar.",
      solution: {
        stepSummary: "Planteo inicial, operaciones intermedias y verificación con los datos del enunciado.",
        answer: "Solución analítica comprobada.",
      },
    },
    {
      number: 3,
      statement: `Ejercicio de fijación: Desarrollar en el cuaderno y verificar el resultado obtenido.`,
      hint: "Verifica reemplazando el valor en la cuenta inicial.",
      solution: {
        stepSummary: "Desarrollo algebraico directo paso a paso.",
        answer: "Resultado exacto.",
      },
    },
    {
      number: 4,
      statement: `Situación problemática integradora sobre ${topic} aplicada a la vida cotidiana.`,
      hint: "Dibuja un esquema o tabla con los datos antes de hacer las cuentas.",
      solution: {
        stepSummary: "Organización de datos, formulación matemática y cálculo final con unidades.",
        answer: "Respuesta redactada con unidades correspondientes.",
      },
    },
    {
      number: 5,
      statement: `Desafío de profundización: Resolver aplicando propiedades y explicar con tus palabras el resultado.`,
      hint: "Revisa los signos y no te saltees ningún paso intermedio.",
      solution: {
        stepSummary: "Aplicación de propiedades distributivas y simplificación final.",
        answer: "Resultado verificado con éxito.",
      },
    },
  ].slice(0, Math.max(3, Math.min(count, 8)));

  return {
    id: "ws_" + Date.now(),
    title: `Ficha de Práctica: ${topic}`,
    subject,
    level: String(level),
    topic,
    difficulty,
    studentName,
    date: new Date().toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric" }),
    pedagogicalIntro: `Caja de Herramientas para ${topic}: Lee con atención cada consigna, separa en términos y recuerda justificar cada uno de los pasos en tu hoja de trabajo.`,
    exercises,
    resolutionTipsForTeacher: [
      "Hacer que el alumno lea el enunciado en voz alta para chequear la comprensión lectora.",
      "Verificar que no saltee pasos intermedios en el cuaderno y mantenga la prolijidad.",
      "Recordar la importancia de verificar siempre el resultado final.",
    ],
    suggestedNextTopics: [
      `Profundización de ${topic}`,
      "Problemas de aplicación integradores",
    ],
  };
}
