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
      originalProblem: problemText || "Los alumnos aplicados de Patricia resolvieron la guía escolar con entusiasmo.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificar el verbo conjugado (Núcleo Verbal)",
          mathDevelopment: "Oración: [Los alumnos aplicados de Patricia resolvieron la guía escolar con entusiasmo.]\n==> Verbo conjugado: 'resolvieron' (Núcleo Verbal - NV)",
          appliedRule: "Regla del Núcleo Verbal y Concordancia en Persona y Número",
          explanation: "Buscamos la acción principal conjugada que concuerda en 3ra persona del plural con quienes realizan la acción.",
          practicalTip: "Preguntale al verbo: '¿Quiénes resolvieron?' para hallar el Sujeto con total seguridad.",
        },
        {
          stepNumber: 2,
          title: "Delimitar Sujeto y Predicado",
          mathDevelopment: "Sujeto: [Los alumnos aplicados de Patricia] (S.E.S.)\nPredicado: [resolvieron la guía escolar con entusiasmo] (P.V.S.)",
          appliedRule: "Estructura Bimembre (Sujeto Expreso Simple + Predicado Verbal Simple)",
          explanation: "Separamos la oración en dos miembros: de quién se habla (Sujeto) y lo que se predica sobre él (Predicado).",
          practicalTip: "Si el sujeto no está escrito pero se deduce del verbo, se indica como Sujeto Tácito (S.T.).",
        },
        {
          stepNumber: 3,
          title: "Analizar los Modificadores del Sujeto",
          mathDevelopment: "• 'Los' = Modificador Directo (MD, artículo)\n• 'alumnos' = Núcleo Sustantivo (N)\n• 'aplicados' = Modificador Directo (MD, adjetivo)\n• 'de Patricia' = Modificador Indirecto (MI, preposición 'de' + término)",
          appliedRule: "Modificadores del Sustantivo (MD directo / MI encabezado por preposición)",
          explanation: "Los artículos y adjetivos pegados al sustantivo son MD. Las construcciones con nexo subordinante ('de') son MI.",
          practicalTip: "Los Modificadores Directos concuerdan siempre en género y número con el sustantivo núcleo.",
        },
        {
          stepNumber: 4,
          title: "Analizar los Modificadores del Predicado",
          mathDevelopment: "• 'resolvieron' = NV\n• 'la guía escolar' = Objeto Directo (OD) ==> Prueba: 'la resolvieron'\n• 'con entusiasmo' = Circunstancial de Modo (C. Modo) ==> ¿Cómo resolvieron?",
          appliedRule: "Objetos del Verbo (Prueba de pronominalización y preguntas de circunstancial)",
          explanation: "El Objeto Directo recibe la acción y se reemplaza por 'la'. 'Con entusiasmo' responde a ¿cómo? y es C. de Modo.",
          practicalTip: "Hacer la prueba del pase a Voz Pasiva: 'La guía escolar fue resuelta por los alumnos'.",
        },
        {
          stepNumber: 5,
          title: "Cierre, corchetes y tipificación final",
          mathDevelopment: "[Los (MD) alumnos (N) aplicados (MD) de Patricia (MI)] S.E.S. [resolvieron (NV) la guía escolar (OD) con entusiasmo (C.Modo)] P.V.S.  ==> O.B.",
          appliedRule: "Sintaxis Bimembre Completa (O.B.)",
          explanation: "Encerramos la oración entre corchetes [ ... ] y verificamos que todos los sintagmas tengan su función asignada.",
          practicalTip: "Revisá que no quede ninguna palabra suelta sin analizar ni flecha sin conectar.",
        },
      ],
      finalAnswer: "Oración Bimembre (O.B.) con Sujeto Expreso Simple (S.E.S.), Predicado Verbal Simple (P.V.S.), Objeto Directo y Circunstancial de Modo.",
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
      originalProblem: problemText || "Un móvil viaja a velocidad constante de 72 km/h durante 25 segundos. Calcular la distancia recorrida en metros.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Extracción de Datos e Incógnitas con Unidades",
          mathDevelopment: "• Velocidad (v) = 72 km/h\n• Tiempo (t) = 25 s\n• Posición inicial (x₀) = 0 m\n• Incógnita: Distancia recorrida (x) = ? [en metros]",
          appliedRule: "Planteo de Magnitudes del Sistema Internacional (SI)",
          explanation: "Leemos el enunciado y listamos en el margen izquierdo todos los valores numéricos con sus unidades del Sistema Internacional.",
          practicalTip: "Anotar siempre las unidades para no mezclar magnitudes (ej: km/h con m/s o minutos con horas).",
        },
        {
          stepNumber: 2,
          title: "Conversión y Homogeneización de Unidades",
          mathDevelopment: "v = 72 km/h = (72 / 3,6) m/s = 20 m/s\n==> v = 20 m/s",
          appliedRule: "Factor de Conversión de Velocidad (1 km/h = 1000m / 3600s = 1/3,6 m/s)",
          explanation: "Como el tiempo está en segundos, convertimos la velocidad a metros por segundo (m/s) dividiendo por 3,6.",
          practicalTip: "De km/h a m/s se DIVIDE por 3,6. De m/s a km/h se MULTIPLICA por 3,6.",
        },
        {
          stepNumber: 3,
          title: "Planteo de la Ecuación Horaria de MRU",
          mathDevelopment: "Ecuación: x(t) = x₀ + v · t\nComo x₀ = 0 m ==> x = v · t",
          appliedRule: "Ecuación Horaria del Movimiento Rectilíneo Uniforme (MRU)",
          explanation: "Al tratarse de una velocidad constante sin aceleración, la distancia es el producto directo de la velocidad por el tiempo.",
          practicalTip: "Despejar la incógnita de forma literal antes de reemplazar con los números.",
        },
        {
          stepNumber: 4,
          title: "Cálculo algebraico y simplificación de unidades",
          mathDevelopment: "x = 20 (m/s) · 25 s\nx = (20 · 25) · (m · s / s)\nx = 500 m",
          appliedRule: "Análisis Dimensional y Cancelación de Unidades",
          explanation: "Multiplicamos 20 por 25 y simplificamos los segundos (s) obteniendo la distancia total en metros.",
          practicalTip: "Preguntarse: ¿El resultado tiene sentido físico en la vida real? 500 metros en 25 s a 72 km/h es físicamente consistente.",
        },
      ],
      finalAnswer: "Distancia recorrida = 500 metros (x = 500 m)",
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
      originalProblem: problemText || "Representar la estructura de Lewis y determinar el tipo de unión del Dióxido de Carbono (CO₂).",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Ubicación en la Tabla Periódica y Electrones de Valencia",
          mathDevelopment: "• Carbono (C): Grupo 14 (IV A) ==> 4 electrones de valencia (4 e⁻)\n• Oxígeno (O): Grupo 16 (VI A) ==> 6 electrones de valencia (6 e⁻)\n• Total e⁻ de valencia = 4 + 2·(6) = 16 e⁻",
          appliedRule: "Configuración Electrónica de Valencia según Grupo Representativo",
          explanation: "Identificamos el grupo y la cantidad de electrones en el último nivel de energía para cada átomo.",
          practicalTip: "El número de grupo indica directamente cuántos puntos o cruces dibujar alrededor del símbolo.",
        },
        {
          stepNumber: 2,
          title: "Determinación del Tipo de Unión Química",
          mathDevelopment: "Carbono (No Metal) + Oxígeno (No Metal)\nΔEN = 3,44 - 2,55 = 0,89 (< 1,7)\n==> Unión Covalente (se comparten pares de electrones)",
          appliedRule: "Criterio de Electronegatividad (No Metal + No Metal = Covalente)",
          explanation: "Al ser dos no metales, comparten pares de electrones para completar sus respectivos octetos.",
          practicalTip: "Los metales ceden electrones formando uniones iónicas; dos no metales forman uniones covalentes.",
        },
        {
          stepNumber: 3,
          title: "Aplicación de la Regla del Octeto y Estructura de Lewis",
          mathDevelopment: "Disposición: O = C = O\n• Cada enlace doble (=) comparte 2 pares de e⁻ (4 e⁻ enlazantes por cada O).\n• El C central completa 8 e⁻ (4 pares enlazantes).\n• Cada O completa 8 e⁻ (2 pares enlazantes + 2 pares libres).",
          appliedRule: "Regla del Octeto de Lewis (8 electrones de valencia)",
          explanation: "El carbono central comparte dos pares de electrones con cada átomo de oxígeno, formando dos enlaces dobles.",
          practicalTip: "Usar cruces para un elemento y puntos para el otro para no confundirlos.",
        },
        {
          stepNumber: 4,
          title: "Formulación y Geometría Molecular",
          mathDevelopment: "Fórmula desarrollada: O = C = O (Lineal, 180°)\nFórmula molecular: CO₂",
          appliedRule: "Geometría Molecular Lineal y Neutralidad Eléctrica",
          explanation: "Escribimos la fórmula desarrollada verificando la estabilidad energética y la neutralidad total.",
          practicalTip: "Verificar que la suma total de electrones dibujados sea exactamente 16 e⁻.",
        },
      ],
      finalAnswer: "Unión Covalente Doble No Polar. Estructura lineal O = C = O con todos los octetos completos.",
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

  // 4. Matemática (Ecuaciones, Fracciones, etc.)
  return {
    problemTitle: "Resolución Didáctica Paso a Paso (Pizarrón)",
    subject: "Matemática",
    level: String(level || "Secundaria Básica"),
    originalProblem: problemText || "Resolver y verificar la siguiente ecuación: 2(x - 3) + 4 = 3x - 5",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Separar en Términos y Analizar la Jerarquía de Operaciones",
        mathDevelopment: "Ecuación original:\n[2·(x - 3)] + [4] = [3x] - [5]\n(2 términos en el 1° miembro y 2 términos en el 2° miembro)",
        appliedRule: "Jerarquía de Operaciones y Separación en Términos",
        explanation: "Los signos de suma (+) y resta (-) que no están encerrados dentro de paréntesis dividen la cuenta en bloques independientes.",
        practicalTip: "Marcá 'arcos' por arriba de la cuenta para separar visualmente cada término antes de empezar.",
      },
      {
        stepNumber: 2,
        title: "Suprimir Paréntesis y Aplicar Propiedad Distributiva",
        mathDevelopment: "2·(x) - 2·(3) + 4 = 3x - 5\n2x - 6 + 4 = 3x - 5\n2x - 2 = 3x - 5",
        appliedRule: "Propiedad Distributiva del Producto respecto a la Resta: a·(b - c) = a·b - a·c",
        explanation: "El 2 multiplica tanto a la incógnita 'x' como al '3'. Luego reducimos los términos numéricos: -6 + 4 = -2.",
        practicalTip: "¡Cuidado con el signo menos delante de un paréntesis! (+2) · (-3) = -6.",
      },
      {
        stepNumber: 3,
        title: "Agrupar Términos (Incógnitas de un lado, números del otro)",
        mathDevelopment: "2x - 2 = 3x - 5\n2x - 3x = -5 + 2\n-1x = -3",
        appliedRule: "Propiedad Uniforme (Pasaje de Términos con Operación Inversa)",
        explanation: "Pasamos todos los términos con 'x' al primer miembro y los números sin incógnita al segundo miembro mediante la operación inversa.",
        practicalTip: "Mantené el signo igual (=) bien alineado verticalmente en la hoja cuadriculada para no perder números.",
      },
      {
        stepNumber: 4,
        title: "Operar Términos Semejantes y Despejar la Incógnita",
        mathDevelopment: "-1x = -3\nx = -3 / (-1)\nx = 3",
        appliedRule: "Regla de los Signos en la División: (-) ÷ (-) = (+)",
        explanation: "El -1 que multiplica a la 'x' pasa dividiendo conservando su signo negativo. Menos dividido menos da más.",
        practicalTip: "El número que multiplica pasa dividiendo CON su mismo signo, no cambia de signo.",
      },
      {
        stepNumber: 5,
        title: "Verificación del Resultado en la Ecuación Original",
        mathDevelopment: "Reemplazamos x = 3 en el enunciado original:\n1° Miembro: 2·(3 - 3) + 4 = 2·(0) + 4 = 0 + 4 = 4\n2° Miembro: 3·(3) - 5 = 9 - 5 = 4\n==> 4 = 4  (Identidad comprobada ✓)",
        appliedRule: "Método de Verificación por Sustitución Numérica",
        explanation: "Reemplazamos el valor hallado en la ecuación de partida para comprobar que ambos lados den exactamente 4.",
        practicalTip: "Enseñale al alumno que la verificación es su propio 'seguro' en los exámenes para saber que sacó un 10.",
      },
    ],
    finalAnswer: "x = 3 (Verificado: 4 = 4)",
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
