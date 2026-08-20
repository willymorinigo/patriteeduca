import { SolvedProblemResult, Subject, EducationLevel, Worksheet, DifficultyLevel } from "../types";

export function generateLocalSolvedProblem(
  problemText: string,
  subject: Subject,
  level: EducationLevel | string,
  studentName?: string
): SolvedProblemResult {
  const norm = (problemText || "").toLowerCase();
  const cleanSubject = subject || "Matemática";

  // ==========================================
  // 1. MATEMÁTICA: REGLA DE TRES SIMPLE / PROPORCIONALIDAD DIRECTA E INVERSA
  // ==========================================
  if (
    norm.includes("regla de tres") ||
    norm.includes("proporcionalidad") ||
    norm.includes("alfajor") ||
    norm.includes("paquete") ||
    norm.includes("harina") ||
    (norm.includes("con ") && norm.includes("se elaboran")) ||
    (norm.includes("con ") && norm.includes("se hacen")) ||
    (norm.includes("si ") && norm.includes("cuánto") && (norm.includes("cuesta") || norm.includes("litros") || norm.includes("kilos") || norm.includes("días")))
  ) {
    // Check if it's the famous alfajores problem from the bank:
    // "En una fábrica de Mar del Plata, con 3 paquetes de harina se elaboran 72 alfajores artesanales..."
    const isAlfajores = norm.includes("alfajor") || norm.includes("mar del plata") || norm.includes("72");
    
    if (isAlfajores) {
      return {
        problemTitle: "Regla de Tres Simple Directa (Proporcionalidad)",
        subject: "Matemática",
        level: String(level || "Primaria (4° a 6° año)"),
        originalProblem: problemText || "En una fábrica de Mar del Plata, con 3 paquetes de harina se elaboran 72 alfajores artesanales. ¿Cuántos alfajores se podrán hacer con 8 paquetes iguales? ¿Cuántos paquetes se necesitan para 240 alfajores?",
        stepByStep: [
          {
            stepNumber: 1,
            title: "Identificar magnitudes y clasificar el tipo de proporcionalidad",
            mathDevelopment: "Magnitudes involucradas:\n• Magnitud A: Cantidad de paquetes de harina\n• Magnitud B: Cantidad de alfajores artesanales elaborados\n\nAnálisis cualitativo: A mayor cantidad de paquetes de harina (+), se elaborará mayor cantidad de alfajores (+).\n==> Se trata de PROPORCIONALIDAD DIRECTA.",
            appliedRule: "Definición de Proporcionalidad Directa (ambas magnitudes aumentan o disminuyen en la misma proporción)",
            explanation: "Cuando dos magnitudes crecen juntas al multiplicarse por el mismo factor, la relación es directa. Esto indica que se resuelve por Regla de Tres Simple Directa o por reducción a la unidad.",
            practicalTip: "Preguntale siempre al alumno: '¿Si compro el doble de paquetes, me salen más o menos alfajores?'. Si la respuesta es 'más', es Directa.",
          },
          {
            stepNumber: 2,
            title: "Calcular la constante de proporcionalidad directa (k) por unidad",
            mathDevelopment: "k = (Cantidad de alfajores) / (Cantidad de paquetes)\nk = 72 alfajores / 3 paquetes\nk = 24 alfajores por cada paquete de harina",
            appliedRule: "Constante de Proporcionalidad Directa: k = y / x",
            explanation: "Dividimos la cantidad total de alfajores por la cantidad de paquetes conocidos para averiguar cuántos alfajores rinde exactamente 1 solo paquete (valor unitario).",
            practicalTip: "Averiguar 'cuánto vale 1' (reducción a la unidad) es la forma más fácil y comprensible para que los chicos no se confundan.",
          },
          {
            stepNumber: 3,
            title: "Pregunta 1: Calcular la producción de alfajores con 8 paquetes",
            mathDevelopment: "Planteo de Regla de Tres Simple Directa:\n  3 paquetes ---------> 72 alfajores\n  8 paquetes ---------> X alfajores\n\nCálculo cruzado:\nX = (8 paquetes · 72 alfajores) / 3 paquetes\nX = 576 / 3\nX = 192 alfajores\n\n(Comprobación directa con k: 8 · 24 = 192 alfajores)",
            appliedRule: "Regla de Tres Simple Directa: X = (b · c) / a",
            explanation: "Multiplicamos los valores cruzados (8 por 72) y dividimos por el paquete restante (3). El resultado son 192 alfajores.",
            practicalTip: "En la regla de tres directa: 'se multiplica cruzado y se divide por el que queda solo enfrente'.",
          },
          {
            stepNumber: 4,
            title: "Pregunta 2: Calcular cuántos paquetes se necesitan para 240 alfajores",
            mathDevelopment: "Planteo de Regla de Tres Inversa de la incógnita:\n  72 alfajores ---------> 3 paquetes\n  240 alfajores -------> Y paquetes\n\nCálculo:\nY = (240 alfajores · 3 paquetes) / 72 alfajores\nY = 720 / 72\nY = 10 paquetes\n\n(Comprobación directa con k: 240 / 24 = 10 paquetes)",
            appliedRule: "Cálculo de antecedente proporcional: Y = Total / k",
            explanation: "Ahora conocemos la cantidad deseada de alfajores (240) y dividimos por el rendimiento de 1 paquete (24 alfajores), obteniendo 10 paquetes.",
            practicalTip: "Alinear siempre las mismas unidades en la misma columna: alfajores debajo de alfajores y paquetes debajo de paquetes.",
          },
          {
            stepNumber: 5,
            title: "Tabla de valores completa y redacción final de respuestas",
            mathDevelopment: "Tabla de Proporcionalidad Directa (k = 24):\n┌─────────────────────┬────┬────┬─────┬─────┐\n│ Paquetes de harina  │ 1  │ 3  │ 8   │ 10  │\n├─────────────────────┼────┼────┼─────┼─────┤\n│ Cantidad alfajores  │ 24 │ 72 │ 192 │ 240 │\n└─────────────────────┴────┴────┴─────┴─────┘",
            appliedRule: "Representación Tabular y Verificación de Constancia de Cociente",
            explanation: "Verificamos que todos los pares cumplan y/x = 24 (24/1 = 72/3 = 192/8 = 240/10 = 24). Las respuestas responden con claridad ambas consignas.",
            practicalTip: "Hacer una tablita ordenada en la hoja permite detectar a simple vista si algún número quedó fuera de proporción.",
          },
        ],
        finalAnswer: "1) Con 8 paquetes se elaboran 192 alfajores artesanales. 2) Para elaborar 240 alfajores se necesitan 10 paquetes de harina.",
        pedagogicalTips: [
          "Explicar siempre el concepto de 'reducción a la unidad': averiguar primero cuánto rinde 1 paquete para que el alumno entienda el porqué de la cuenta.",
          "Ordenar los datos en dos columnas con sus nombres (Paquetes | Alfajores) para evitar mezclar magnitudes.",
          "Verificar la coherencia lógica: si con 3 paquetes se hacen 72, con 8 paquetes tiene que dar bastante más que 72 (192 es coherente).",
        ],
        commonPitfalls: [
          "Multiplicar derecho en vez de cruzado al aplicar la regla de tres simple directa.",
          "Mezclar las magnitudes en el planteo (poner alfajores debajo de paquetes).",
          "Olvidar responder con la oración completa y colocar solo el número sin la unidad ('192 alfajores', '10 paquetes').",
        ],
        reinforcementConcept: "En la proporcionalidad directa, el cociente entre ambas magnitudes permanece siempre constante (k = y / x).",
      };
    }

    // Generic rule of three parser
    const numbers = (problemText.match(/\d+(?:[.,]\d+)?/g) || []).map((n) => parseFloat(n.replace(",", ".")));
    const a = numbers[0] || 4;
    const b = numbers[1] || 100;
    const c = numbers[2] || 10;
    const resDirect = ((c * b) / a);
    const resFormatted = Number.isInteger(resDirect) ? resDirect.toString() : resDirect.toFixed(2);
    const kVal = (b / a);
    const kFormatted = Number.isInteger(kVal) ? kVal.toString() : kVal.toFixed(2);

    return {
      problemTitle: "Regla de Tres Simple y Proporcionalidad",
      subject: "Matemática",
      level: String(level || "Primaria / Secundaria"),
      originalProblem: problemText,
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificación de Magnitudes y Tipo de Relación",
          mathDevelopment: `Planteo de datos extraídos:\n• Magnitud 1 = ${a} unidades  ====>  Magnitud 2 = ${b} unidades\n• Para ${c} unidades de Magnitud 1  ====>  Incógnita (X) = ?\n\nRelación: Proporcionalidad Directa`,
          appliedRule: "Planteo de Regla de Tres Simple Directa",
          explanation: "Organizamos los datos en dos columnas alineando magnitudes semejantes en la misma vertical.",
          practicalTip: "Anotar siempre las unidades para no confundir qué valor corresponde a cada columna.",
        },
        {
          stepNumber: 2,
          title: "Cálculo del Valor Unitario (Constante de Proporcionalidad k)",
          mathDevelopment: `k = ${b} / ${a} = ${kFormatted} por unidad`,
          appliedRule: "Constante de Proporcionalidad: k = Y / X",
          explanation: "Dividimos el total por la cantidad inicial para saber el valor equivalente a 1 unidad.",
          practicalTip: "Conocer el valor de 1 unidad simplifica cualquier cálculo posterior.",
        },
        {
          stepNumber: 3,
          title: "Despeje y Resolución de la Incógnita (X)",
          mathDevelopment: `X = (${c} · ${b}) / ${a}\nX = ${c * b} / ${a}\nX = ${resFormatted}`,
          appliedRule: "Multiplicación Cruzada en Regla de Tres Directa: X = (c · b) / a",
          explanation: "Multiplicamos los términos cruzados y dividimos por el término opuesto a la incógnita.",
          practicalTip: "Comprobar que el resultado aumente o disminuya en concordancia con el cambio de la primera magnitud.",
        },
      ],
      finalAnswer: `Resultado = ${resFormatted} (Constante k = ${kFormatted})`,
      pedagogicalTips: [
        "Verificar que las columnas tengan siempre la misma unidad de medida.",
        "Comprobar el resultado multiplicando la constante unitaria k por la nueva cantidad.",
      ],
      commonPitfalls: [
        "Invertir la fracción o dividir por el número incorrecto.",
        "Confundir proporcionalidad directa con inversa.",
      ],
      reinforcementConcept: "En toda regla de tres directa, la multiplicación cruzada de los extremos y medios es idéntica.",
    };
  }

  // ==========================================
  // 2. MATEMÁTICA: FRACCIONES Y COMPRAS EN LA VERDULERÍA / NÚMEROS RACIONALES
  // ==========================================
  if (
    norm.includes("verduler") ||
    norm.includes("manzana") ||
    norm.includes("papa") ||
    norm.includes("vuelto") ||
    (norm.includes("kilo") && norm.includes("compró"))
  ) {
    return {
      problemTitle: "Problema de Compras, Fracciones y Números Decimales",
      subject: "Matemática",
      level: String(level || "Primaria (4° a 6° año)"),
      originalProblem: problemText || "Juan fue a la verdulería del barrio y compró 1 kilo y 3/4 de manzanas a $1.200 el kilo, y 2 kilos y medio de papas a $800 el kilo. Si pagó con un billete de $5.000, ¿cuánto dinero le dieron de vuelto?",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Expresar las cantidades de kilogramos en forma decimal y fraccionaria",
          mathDevelopment: "• Manzanas: 1 kilo y 3/4 kg = 1 + 3/4 = 1 + 0,75 = 1,75 kg (o 7/4 kg)\n• Papas: 2 kilos y medio = 2 + 1/2 = 2 + 0,50 = 2,50 kg (o 5/2 kg)",
          appliedRule: "Conversión de Números Mixtos a Decimales y Fracciones Impropias",
          explanation: "Convertimos las fracciones usuales (3/4 = 0,75 y 1/2 = 0,5) para facilitar las operaciones multiplicativas con los precios por kilogramo.",
          practicalTip: "Recordar a los chicos equivalencias visuales cotidianas: 1/4 = 0,25 | 1/2 = 0,50 | 3/4 = 0,75.",
        },
        {
          stepNumber: 2,
          title: "Calcular el costo total de las manzanas",
          mathDevelopment: "Precio unitario: $1.200 por kg\nCantidad: 1,75 kg\n\nCálculo:\nGasto manzanas = 1,75 kg · $1.200\nGasto manzanas = 1 kg · $1.200 + 0,75 kg · $1.200\nGasto manzanas = $1.200 + $900 = $2.100\n(Por fracción: 7/4 · 1200 = 7 · 300 = $2.100)",
          appliedRule: "Multiplicación de Número Decimal por Entero / Fracción de una Cantidad",
          explanation: "Multiplicamos los 1,75 kg por el valor de cada kilo ($1.200) para obtener el importe exacto de las manzanas.",
          practicalTip: "Hacer el desglose mental: 1 kilo son $1200, medio kilo son $600 y un cuarto son $300 -> 1200 + 600 + 300 = $2100.",
        },
        {
          stepNumber: 3,
          title: "Calcular el costo total de las papas",
          mathDevelopment: "Precio unitario: $800 por kg\nCantidad: 2,50 kg\n\nCálculo:\nGasto papas = 2,50 kg · $800\nGasto papas = 2 kg · $800 + 0,50 kg · $800\nGasto papas = $1.600 + $400 = $2.000\n(Por fracción: 5/2 · 800 = 5 · 400 = $2.000)",
          appliedRule: "Multiplicación Proporcional Directa",
          explanation: "Multiplicamos los 2,5 kg por los $800 que vale el kilo de papas, dando un total de $2.000.",
          practicalTip: "Multiplicar por 2,5 es lo mismo que duplicar y sumarle la mitad del número.",
        },
        {
          stepNumber: 4,
          title: "Calcular el gasto total acumulado en la verdulería",
          mathDevelopment: "Gasto Total = Gasto Manzanas + Gasto Papas\nGasto Total = $2.100 + $2.000\nGasto Total = $4.100",
          appliedRule: "Suma de Importes Parciales",
          explanation: "Sumamos lo que costaron las manzanas más lo que costaron las papas para saber el total que Juan debe pagar en la caja.",
          practicalTip: "Alinear las unidades de mil y centenas para sumar prolijamente.",
        },
        {
          stepNumber: 5,
          title: "Calcular el vuelto restando del billete de pago ($5.000)",
          mathDevelopment: "Dinero entregado: $5.000\nGasto a descontar: $4.100\n\nVuelto = $5.000 - $4.100\nVuelto = $900",
          appliedRule: "Operación de Resta / Diferencia Económica",
          explanation: "Restamos el gasto total ($4.100) del valor del billete entregado ($5.000). A Juan le devuelven $900.",
          practicalTip: "Verificar la resta haciendo la suma inversa: $4.100 + $900 = $5.000 ✓.",
        },
      ],
      finalAnswer: "Gasto Total en la verdulería = $4.100 | Vuelto que recibe Juan = $900",
      pedagogicalTips: [
        "Enseñar el cálculo mental del almacén: 1 kg ($1200) + 3/4 kg ($900) = $2100.",
        "Hacer que el alumno anote con claridad qué corresponde a cada verdura.",
        "Recordar que el vuelto es siempre la diferencia entre lo que se entrega y lo que se gasta.",
      ],
      commonPitfalls: [
        "Confundir 3/4 con 0,34 en lugar de 0,75.",
        "Calcular el gasto de una sola verdura y olvidarse de sumar la otra antes de calcular el vuelto.",
        "No colocar el signo pesos ($) en las respuestas monetarias.",
      ],
      reinforcementConcept: "Una fracción de una cantidad se calcula multiplicando el número por el numerador y dividiendo por el denominador.",
    };
  }

  // ==========================================
  // 3. MATEMÁTICA: GEOMETRÍA - PERÍMETRO Y SUPERFICIE DEL PATIO
  // ==========================================
  if (
    norm.includes("patio") ||
    norm.includes("perímetro") ||
    norm.includes("superficie") ||
    (norm.includes("rectangular") && norm.includes("ancho") && norm.includes("largo"))
  ) {
    return {
      problemTitle: "Cálculo de Perímetro y Superficie (Geometría)",
      subject: "Matemática",
      level: String(level || "Primaria (4° a 6° año)"),
      originalProblem: problemText || "El patio de la escuela tiene forma rectangular, mide 18,5 metros de largo y 12 metros de ancho. Quieren cercarlo con una cinta de peligro y pintar todo el piso. Calcular el perímetro total y la superficie en metros cuadrados.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificar la figura geométrica y extraer dimensiones",
          mathDevelopment: "Figura: Rectángulo\n• Largo (base b) = 18,5 m\n• Ancho (altura h) = 12 m",
          appliedRule: "Propiedades del Rectángulo (lados opuestos iguales de a pares)",
          explanation: "Un rectángulo tiene 4 lados: 2 lados de largo igual a 18,5 m y 2 lados de ancho igual a 12 m.",
          practicalTip: "Hacer siempre un dibujo del rectángulo en la hoja con las medidas anotadas en cada lado.",
        },
        {
          stepNumber: 2,
          title: "Cálculo del Perímetro total (longitud de la cinta de peligro)",
          mathDevelopment: "Fórmula: P = 2 · largo + 2 · ancho\nP = 2 · (18,5 m) + 2 · (12 m)\nP = 37 m + 24 m\nP = 61 metros",
          appliedRule: "Perímetro de una figura plana (suma de todos sus lados exteriores)",
          explanation: "El perímetro es el contorno. Sumamos los cuatro lados: 18,5 + 12 + 18,5 + 12 = 61 metros lineales.",
          practicalTip: "El perímetro se expresa siempre en unidades lineales simples (metros 'm').",
        },
        {
          stepNumber: 3,
          title: "Cálculo de la Superficie / Área (piso a pintar)",
          mathDevelopment: "Fórmula: Superficie = largo · ancho (base · altura)\nÁrea = 18,5 m · 12 m\nÁrea = 222 m² (metros cuadrados)",
          appliedRule: "Área del Rectángulo: A = b · h",
          explanation: "El área mide todo el espacio interior del patio multiplicando largo por ancho. Resulta en 222 m².",
          practicalTip: "La superficie se expresa obligatoriamente en unidades cuadradas (m²).",
        },
      ],
      finalAnswer: "Perímetro para la cinta = 61 metros | Superficie a pintar = 222 m²",
      pedagogicalTips: [
        "Insistir en la diferencia conceptual: Perímetro = cinta/borde (metros) vs. Superficie = baldosa/pintura (metros cuadrados).",
      ],
      commonPitfalls: [
        "Confundir las fórmulas y multiplicar los cuatro lados en el perímetro.",
        "Olvidar colocar el exponente cuadrado (²) en la unidad de superficie.",
      ],
      reinforcementConcept: "El perímetro es la suma de las longitudes de los lados; el área es la medida de la región interior.",
    };
  }

  // ==========================================
  // 4. MATEMÁTICA: TEOREMA DE PITÁGORAS (POSTE Y SOMBRA)
  // ==========================================
  if (
    norm.includes("pitágoras") ||
    norm.includes("poste") ||
    norm.includes("sombra") ||
    norm.includes("hipotenusa") ||
    norm.includes("cateto")
  ) {
    return {
      problemTitle: "Teorema de Pitágoras y Triángulos Rectángulos",
      subject: "Matemática",
      level: String(level || "Secundaria Básica (1° a 3° año)"),
      originalProblem: problemText || "Un poste de luz de 6 metros de altura proyecta sobre la vereda una sombra de 4,5 metros. ¿Cuál es la distancia en línea recta desde la punta más alta del poste hasta el extremo de la sombra en el piso?",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Modelar el triángulo rectángulo e identificar catetos e hipotenusa",
          mathDevelopment: "Triángulo rectángulo formado:\n• Cateto vertical (altura del poste a) = 6 m\n• Cateto horizontal (longitud de la sombra b) = 4,5 m\n• Hipotenusa (distancia en línea recta H) = ?",
          appliedRule: "Identificación de Elementos del Triángulo Rectángulo (Ángulo recto de 90° entre poste y piso)",
          explanation: "El poste vertical forma un ángulo recto (90°) con el suelo horizontal. Los dos lados perpendiculares son los catetos y la distancia buscada es la hipotenusa.",
          practicalTip: "La hipotenusa es siempre el lado opuesto al ángulo de 90° y es el lado más largo de los tres.",
        },
        {
          stepNumber: 2,
          title: "Plantear el Teorema de Pitágoras",
          mathDevelopment: "Teorema: H² = a² + b²\n(Hipotenusa)² = (Cateto 1)² + (Cateto 2)²",
          appliedRule: "Teorema de Pitágoras: En todo triángulo rectángulo, el cuadrado de la hipotenusa es igual a la suma de los cuadrados de los catetos.",
          explanation: "Escribimos la fórmula fundamental antes de sustituir con los valores numéricos.",
          practicalTip: "Anotar la fórmula con letras ayuda a no saltear el paso de elevar al cuadrado.",
        },
        {
          stepNumber: 3,
          title: "Sustituir datos y calcular los cuadrados de los catetos",
          mathDevelopment: "H² = (6 m)² + (4,5 m)²\nH² = 36 m² + 20,25 m²\nH² = 56,25 m²",
          appliedRule: "Potenciación de Números Enteros y Decimales",
          explanation: "Calculamos 6² = 36 y 4,5² = 20,25. Luego sumamos ambos resultados parciales obteniendo 56,25.",
          practicalTip: "¡Ojo con 4,5²! Es 4,5 · 4,5 = 20,25 (no es 4,5 · 2 = 9).",
        },
        {
          stepNumber: 4,
          title: "Aplicar la raíz cuadrada para despejar la distancia H",
          mathDevelopment: "H = √(56,25 m²)\nH = 7,5 metros",
          appliedRule: "Operación Inversa de la Potencia (Radicación)",
          explanation: "Pasamos el exponente cuadrado como raíz cuadrada. La raíz cuadrada de 56,25 es exactamente 7,5 metros.",
          practicalTip: "Comprobar que 7,5 m es mayor que 6 m y que 4,5 m (la hipotenusa siempre debe ser el lado más largo).",
        },
      ],
      finalAnswer: "Distancia en línea recta desde la punta del poste al extremo de la sombra = 7,5 metros",
      pedagogicalTips: [
        "Hacerle dibujar el triángulo con la escuadra y marcar el ángulo recto con un cuadradito.",
        "Verificar que la hipotenusa siempre sea más larga que cualquiera de los dos catetos.",
      ],
      commonPitfalls: [
        "Sumar 6 + 4,5 = 10,5 sin elevar al cuadrado.",
        "Olvidar sacar la raíz cuadrada final y dejar H² = 56,25 como respuesta.",
      ],
      reinforcementConcept: "En el Teorema de Pitágoras, primero se elevan al cuadrado los catetos, luego se suman y finalmente se extrae la raíz cuadrada.",
    };
  }

  // ==========================================
  // 5. MATEMÁTICA: OPERACIONES COMBINADAS CON ENTEROS (Z)
  // ==========================================
  if (
    norm.includes("enteros") ||
    norm.includes("√49") ||
    norm.includes("combinadas") ||
    (norm.includes("-3") && norm.includes("-4") && norm.includes("jerarquía"))
  ) {
    return {
      problemTitle: "Operaciones Combinadas en Números Enteros (Z)",
      subject: "Matemática",
      level: String(level || "Secundaria Básica (1° a 3° año)"),
      originalProblem: problemText || "Separar en términos y resolver respetando la jerarquía de operaciones: -3 · (-4 + 7) + √49 - (-18) : (-3)² + (-2)³",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Separar en términos principales",
          mathDevelopment: "Expresión:\n[-3 · (-4 + 7)] + [√49] - [(-18) : (-3)²] + [(-2)³]\n(Son 4 términos delimitados por los signos + y - principales)",
          appliedRule: "Jerarquía de Operaciones (Separación en Términos)",
          explanation: "Separamos en 4 términos independientes que se resolverán en paralelo respetando la prioridad.",
          practicalTip: "Los signos + y - dentro de paréntesis NO separan términos.",
        },
        {
          stepNumber: 2,
          title: "Resolver paréntesis, potencias y raíces en cada término",
          mathDevelopment: "• Término 1: (-4 + 7) = +3  ==>  -3 · (+3)\n• Término 2: √49 = 7\n• Término 3: (-3)² = +9  ==>  -(-18 : 9)\n• Término 4: (-2)³ = -8",
          appliedRule: "Regla de Signos en Potenciación (Base negativa, exponente par = positivo; impar = negativo)",
          explanation: "Resolvemos primero las operaciones interiores de los paréntesis, las raíces exactas y las potencias.",
          practicalTip: "(-3)² = +9 (exponente par da positivo), pero (-2)³ = -8 (exponente impar conserva el signo negativo).",
        },
        {
          stepNumber: 3,
          title: "Resolver multiplicaciones y divisiones de cada término",
          mathDevelopment: "• Término 1: -3 · (+3) = -9\n• Término 2: +7\n• Término 3: - (-18 : 9) = - (-2) = +2\n• Término 4: + (-8) = -8",
          appliedRule: "Regla de los Signos en Multiplicación y División: (-) · (+) = (-)  y  (-) : (+) = (-)",
          explanation: "Efectuamos el producto y cociente de cada bloque numérico aplicando la regla de los signos.",
          practicalTip: "Un signo menos delante de un paréntesis le cambia el signo a todo lo de adentro: -(-2) = +2.",
        },
        {
          stepNumber: 4,
          title: "Suma algebraica final reuniendo positivos y negativos",
          mathDevelopment: "Suma algebraica: -9 + 7 + 2 - 8\nPositivos: (+7 + 2) = +9\nNegativos: (-9 - 8) = -17\nResultado final: +9 - 17 = -8",
          appliedRule: "Suma Algebraica de Números Enteros: (Suma de positivos) - (Suma de módulos negativos)",
          explanation: "Agrupamos los números positivos por un lado (+9) y los negativos por el otro (-17). Al restarlos obtenemos -8.",
          practicalTip: "Pensalo con dinero: tenés $9 a favor y debés $17, quedás debiendo $8 (-8).",
        },
      ],
      finalAnswer: "Resultado = -8",
      pedagogicalTips: [
        "Marcar los arcos de los términos con lápiz arriba de la cuenta.",
        "Resolver cada término renglón por renglón hacia abajo en el cuaderno.",
      ],
      commonPitfalls: [
        "Hacer -3 · (-4) y luego sumarle 7 sin resolver el paréntesis primero.",
        "Creer que (-2)³ da +8 por ser negativo.",
      ],
      reinforcementConcept: "En operaciones combinadas el orden es: 1° Paréntesis, 2° Potencias y Raíces, 3° Multiplicaciones y Divisiones, 4° Sumas y Restas.",
    };
  }

  // ==========================================
  // 6. MATEMÁTICA: PORCENTAJES Y RECARGOS / DESCUENTOS EN CUOTAS
  // ==========================================
  if (
    norm.includes("porcentaje") ||
    norm.includes("campera") ||
    norm.includes("cuota") ||
    norm.includes("recargo") ||
    norm.includes("descuento")
  ) {
    return {
      problemTitle: "Porcentajes, Descuentos Comerciales y Recargos en Cuotas",
      subject: "Matemática",
      level: String(level || "Secundaria Básica (1° a 3° año)"),
      originalProblem: problemText || "Una campera cuesta $45.000 de contado. Si se abona en 3 cuotas fijas con tarjeta de crédito, tiene un recargo del 18%. En cambio, si se paga en efectivo en el local, hacen un descuento del 15%. ¿Cuánto se paga en cada modalidad y cuál es el valor de cada cuota?",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Opción Tarjeta: Calcular el recargo del 18% y el precio financiado",
          mathDevelopment: "Precio base: $45.000\nRecargo = 18% de $45.000 = ($45.000 · 18) / 100 = $8.100\n\nPrecio con Tarjeta = $45.000 + $8.100 = $53.100\n(O cálculo directo: $45.000 · 1,18 = $53.100)",
          appliedRule: "Cálculo de Porcentaje con Recargo: Total = Base · (1 + i)",
          explanation: "Calculamos el 18% de $45.000 multiplicando por 0,18 ($8.100) y se lo sumamos al precio base para obtener el valor total financiado ($53.100).",
          practicalTip: "Multiplicar por 1,18 aplica el precio original (1) más el recargo (0,18) en un solo paso.",
        },
        {
          stepNumber: 2,
          title: "Calcular el valor de cada una de las 3 cuotas fijas",
          mathDevelopment: "Valor de cada cuota = Precio con Tarjeta / 3\nValor cuota = $53.100 / 3\nValor cuota = $17.700 por mes",
          appliedRule: "División Uniforme de Importe Financiado",
          explanation: "Dividimos el total con recargo ($53.100) en 3 partes iguales. Cada cuota mensual será de $17.700.",
          practicalTip: "Verificar multiplicando: $17.700 · 3 = $53.100 ✓.",
        },
        {
          stepNumber: 3,
          title: "Opción Efectivo: Calcular el descuento del 15% y el precio final",
          mathDevelopment: "Precio base: $45.000\nDescuento = 15% de $45.000 = ($45.000 · 15) / 100 = $6.750\n\nPrecio Efectivo = $45.000 - $6.750 = $38.250\n(O cálculo directo: $45.000 · 0,85 = $38.250)",
          appliedRule: "Cálculo de Porcentaje con Descuento: Total = Base · (1 - d)",
          explanation: "Calculamos el 15% de $45.000 ($6.750) y se lo restamos al valor base. El pago al contado en efectivo queda en $38.250.",
          practicalTip: "Si te descuentan el 15%, pagás el 85% del valor (45.000 · 0,85 = 38.250).",
        },
      ],
      finalAnswer: "1) Con tarjeta en 3 cuotas: Total $53.100 (3 cuotas fijas de $17.700 c/u). 2) En efectivo con 15% de descuento: Total $38.250 (Ahorro de $6.750).",
      pedagogicalTips: [
        "Enseñar los dos caminos: calcular el monto del porcentaje y luego sumar/restar, o usar el coeficiente multiplicador (1,18 / 0,85).",
      ],
      commonPitfalls: [
        "Dividir por 3 antes de sumar el recargo del 18%.",
        "Sumar el porcentaje en lugar de restarlo en el caso del descuento en efectivo.",
      ],
      reinforcementConcept: "Un recargo incrementa el valor base (Base + %); un descuento lo disminuye (Base - %).",
    };
  }

  // ==========================================
  // 7. MATEMÁTICA: FUNCIÓN LINEAL (PENDIENTE, ORDENADA, RAÍZ)
  // ==========================================
  if (
    norm.includes("función lineal") ||
    norm.includes("recta") ||
    norm.includes("pendiente") ||
    norm.includes("ordenada al origen") ||
    norm.includes("y = -2x + 4")
  ) {
    return {
      problemTitle: "Función Lineal, Recta, Pendiente y Raíz",
      subject: "Matemática",
      level: String(level || "Secundaria Básica (1° a 3° año)"),
      originalProblem: problemText || "Dada la función lineal y = -2x + 4: a) Indicar pendiente y ordenada al origen. b) Hallar la raíz o cero de la función. c) Indicar si es creciente o decreciente y graficar por corrimiento.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificar la Pendiente (m) y la Ordenada al Origen (b)",
          mathDevelopment: "Forma explícita: y = m·x + b\nFunción dada: y = -2x + 4\n==> Pendiente (m) = -2 (o -2/1)\n==> Ordenada al origen (b) = 4 (Punto de corte con eje Y: (0, 4))",
          appliedRule: "Ecuación Explícita de la Recta",
          explanation: "El número que multiplica a la 'x' es la pendiente (inclinación) y el término independiente es la ordenada al origen (corte con el eje Y).",
          practicalTip: "La ordenada al origen es el valor donde x = 0. Se marca directamente sobre el eje vertical Y.",
        },
        {
          stepNumber: 2,
          title: "Hallar la Raíz o Cero de la Función (corte con el eje X)",
          mathDevelopment: "Condición de raíz: y = 0\n0 = -2x + 4\n2x = 4\nx = 4 / 2\nx = 2 (Punto de corte con eje X: (2, 0))",
          appliedRule: "Cálculo de Ceros o Raíces de una Función",
          explanation: "Igualamos la fórmula a cero y despejamos la variable x para averiguar en qué valor la recta cruza el eje horizontal.",
          practicalTip: "La raíz siempre tiene coordenada y = 0.",
        },
        {
          stepNumber: 3,
          title: "Determinar el crecimiento o decrecimiento de la recta",
          mathDevelopment: "Como m = -2 < 0 (pendiente negativa):\n==> La función lineal es DECRECIENTE en todo su dominio (ℝ).",
          appliedRule: "Criterio de Monotonía según el Signo de la Pendiente",
          explanation: "Si la pendiente es positiva la recta sube de izquierda a derecha; al ser negativa (-2), desciende a medida que x aumenta.",
          practicalTip: "Leemos siempre el gráfico de izquierda a derecha como si leyéramos un libro.",
        },
        {
          stepNumber: 4,
          title: "Método de graficación por corrimiento de la pendiente",
          mathDevelopment: "1. Marcamos la ordenada al origen en (0, 4) sobre el eje Y.\n2. Como la pendiente es -2/1, desde (0, 4) corremos 1 unidad a la derecha (denominador) y bajamos 2 unidades (numerador negativo), llegando al punto (1, 2).\n3. Trazamos la recta que une (0, 4), (1, 2) y la raíz (2, 0).",
          appliedRule: "Construcción Geométrica por Pendiente (Δy / Δx)",
          explanation: "Graficamos sin tabla de valores utilizando el corrimiento del vector director de la pendiente.",
          practicalTip: "El denominador siempre corre a la derecha; el numerador sube si es positivo o baja si es negativo.",
        },
      ],
      finalAnswer: "a) Pendiente m = -2, Ordenada b = 4 | b) Raíz en x = 2 | c) Función Decreciente",
      pedagogicalTips: [
        "Hacer que el alumno use regla y hoja cuadriculada para que la escala 1:1 sea exacta.",
        "Verificar que la recta pase exactamente por la raíz calculada (2, 0).",
      ],
      commonPitfalls: [
        "Confundir la pendiente con la variable x (decir que la pendiente es '-2x' en vez de '-2').",
        "Correr hacia la izquierda en el denominador de la pendiente.",
      ],
      reinforcementConcept: "La pendiente m indica la inclinación y el ritmo de cambio; la ordenada b indica la altura de inicio en el eje Y.",
    };
  }

  // ==========================================
  // 8. MATEMÁTICA: ECUACIÓN CUADRÁTICA Y BHASKARA
  // ==========================================
  if (
    norm.includes("cuadrática") ||
    norm.includes("bhaskara") ||
    norm.includes("vértice") ||
    norm.includes("2x² - 8x - 24") ||
    (norm.includes("x²") && norm.includes("raíces"))
  ) {
    return {
      problemTitle: "Ecuación Cuadrática, Fórmula de Bhaskara y Vértice",
      subject: "Matemática",
      level: String(level || "Secundaria Superior (4° a 6° año)"),
      originalProblem: problemText || "Hallar las raíces reales de la ecuación cuadrática 2x² - 8x - 24 = 0 mediante la fórmula resolvente de Bhaskara. Indicar las coordenadas del vértice (Xv, Yv) y el eje de simetría.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificar los coeficientes cuadrático, lineal e independiente",
          mathDevelopment: "Forma general: a·x² + b·x + c = 0\nEcuación dada: 2x² - 8x - 24 = 0\n• Coeficiente principal (a) = 2\n• Coeficiente lineal (b) = -8\n• Término independiente (c) = -24",
          appliedRule: "Forma Canónica General de la Ecuación Cuadrática",
          explanation: "Identificamos con sus respectivos signos los tres coeficientes necesarios para aplicar la fórmula resolvente.",
          practicalTip: "Anotar siempre los signos con cuidado: b es -8 y c es -24.",
        },
        {
          stepNumber: 2,
          title: "Calcular el Discriminante (Δ)",
          mathDevelopment: "Discriminante: Δ = b² - 4·a·c\nΔ = (-8)² - 4 · (2) · (-24)\nΔ = 64 - (-192)\nΔ = 64 + 192\nΔ = 256  (Como Δ > 0, existen 2 raíces reales y distintas)",
          appliedRule: "Análisis del Discriminante de la Ecuación Cuadrática",
          explanation: "El discriminante es el radicando de la fórmula. Al ser 256 (positivo), sabemos que la parábola corta al eje X en dos puntos y √256 = 16.",
          practicalTip: "Menos por más por menos da más: -4 · 2 · (-24) = +192.",
        },
        {
          stepNumber: 3,
          title: "Aplicar la fórmula resolvente de Bhaskara para hallar x₁ y x₂",
          mathDevelopment: "Fórmula: x = [-b ± √Δ] / (2·a)\nx = [-(-8) ± √256] / (2 · 2)\nx = [8 ± 16] / 4\n\n• Raíz 1 (x₁): (8 + 16) / 4 = 24 / 4 = 6\n• Raíz 2 (x₂): (8 - 16) / 4 = -8 / 4 = -2",
          appliedRule: "Fórmula Resolvente de Bhaskara para Polinomios de 2° Grado",
          explanation: "Desdoblamos el signo ± para obtener las dos raíces reales: x₁ = 6 y x₂ = -2.",
          practicalTip: "Verificación rápida por Cardano-Vieta: x₁ · x₂ = 6 · (-2) = -12 = c/a (-24/2) ✓.",
        },
        {
          stepNumber: 4,
          title: "Calcular las coordenadas del Vértice (Xv, Yv) y Eje de Simetría",
          mathDevelopment: "• Xv = -b / (2·a) = -(-8) / (2 · 2) = 8 / 4 = 2\n• Yv = f(Xv) = 2·(2)² - 8·(2) - 24 = 2·(4) - 16 - 24 = 8 - 40 = -32\n\n==> Vértice: V = (2, -32)\n==> Eje de simetría: x = 2",
          appliedRule: "Coordenadas del Vértice de la Parábola y Eje de Simetría",
          explanation: "El vértice es el punto mínimo de la parábola (ya que a = 2 > 0 y abre hacia arriba) y se ubica exactamente en el punto medio entre ambas raíces: (6 + (-2))/2 = 2.",
          practicalTip: "Xv siempre coincide con el promedio exacto de las dos raíces.",
        },
      ],
      finalAnswer: "Raíces: x₁ = 6, x₂ = -2 | Vértice: V = (2, -32) | Eje de simetría: x = 2",
      pedagogicalTips: [
        "Enseñar que el discriminante Δ anticipa todo: si da negativo no tiene raíces reales, si da cero tiene 1 sola, si da positivo tiene 2.",
        "Comprobar el vértice sustituyendo x = 2 en la ecuación original.",
      ],
      commonPitfalls: [
        "Olvidar que -(-8) se convierte en +8 al principio de la fórmula.",
        "Dividir solo al 16 por 4 y no a todo el numerador (8 ± 16).",
      ],
      reinforcementConcept: "Las raíces son los cortes con el eje X; el vértice es el punto extremo (máximo o mínimo) de la parábola.",
    };
  }

  // ==========================================
  // 9. MATEMÁTICA: TRIGONOMETRÍA (TORRE Y SOMBRA)
  // ==========================================
  if (
    norm.includes("trigonometr") ||
    norm.includes("torre") ||
    norm.includes("38°") ||
    norm.includes("ángulo de elevación") ||
    norm.includes("seno") ||
    norm.includes("tangente")
  ) {
    return {
      problemTitle: "Trigonometría en Triángulos Rectángulos (SOH-CAH-TOA)",
      subject: "Matemática",
      level: String(level || "Secundaria Superior (4° a 6° año)"),
      originalProblem: problemText || "Desde un punto en el suelo a 35 metros de la base de una torre de telefonía, un observador divisa la cúspide con un ángulo de elevación de 38°. Calcular la altura de la torre considerando que el instrumento de medición está a 1,60 m del suelo.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificar datos geométricos y razón trigonométrica adecuada",
          mathDevelopment: "Datos del triángulo rectángulo:\n• Ángulo de elevación (α) = 38°\n• Cateto adyacente (distancia a la base d) = 35 m\n• Cateto opuesto (altura parcial h₁) = ?\n• Altura del instrumento (h₀) = 1,60 m\n\nRazón adecuada: Tangente (tg α = Opuesto / Adyacente)",
          appliedRule: "Definición de Tangente Trigonométrica (SOH-CAH-TOA)",
          explanation: "Como conocemos el cateto adyacente (35 m) y queremos calcular el cateto opuesto (h₁), la razón trigonométrica que los vincula es la Tangente.",
          practicalTip: "Mnemotecnia SOH-CAH-TOA: Tangente = Opuesto / Adyacente.",
        },
        {
          stepNumber: 2,
          title: "Plantear la ecuación y despejar la altura parcial h₁",
          mathDevelopment: "tg(38°) = h₁ / 35 m\nh₁ = 35 m · tg(38°)\nComo tg(38°) ≈ 0,7813\nh₁ = 35 · 0,7813 ≈ 27,35 metros",
          appliedRule: "Despeje Algebraico con Razones Trigonométricas",
          explanation: "Multiplicamos la distancia (35 m) por el valor de la tangente de 38° (0,7813) obteniendo la altura parcial desde el instrumento.",
          practicalTip: "Verificar que la calculadora esté en modo DEG (grados sexagesimales) y no en RAD o GRAD.",
        },
        {
          stepNumber: 3,
          title: "Sumar la altura del instrumento para obtener la altura total",
          mathDevelopment: "Altura Total = h₁ + h₀\nAltura Total = 27,35 m + 1,60 m\nAltura Total = 28,95 metros",
          appliedRule: "Suma Geométrica de Cotas de Elevación",
          explanation: "Sumamos la altura del trípode/instrumento (1,60 m) a la altura triangular calculada, dando una altura real de 28,95 metros.",
          practicalTip: "Leer siempre todo el enunciado: no olvidar sumar la altura del observador o instrumento si está especificada.",
        },
      ],
      finalAnswer: "Altura total de la torre = 28,95 metros",
      pedagogicalTips: [
        "Hacer el dibujo esquemático con el observador, la visual y el ángulo de 38°.",
      ],
      commonPitfalls: [
        "Usar Seno o Coseno en vez de Tangente cuando no se conoce la hipotenusa.",
        "Tener la calculadora en radianes en lugar de grados sexagesimales.",
      ],
      reinforcementConcept: "La tangente vincula directamente los dos catetos del triángulo rectángulo sin necesidad de calcular la hipotenusa.",
    };
  }

  // ==========================================
  // 10. MATEMÁTICA: FACTOREO DE POLINOMIOS
  // ==========================================
  if (
    norm.includes("factorizar") ||
    norm.includes("factoreo") ||
    norm.includes("polinomios") ||
    norm.includes("3x⁴ - 12x²") ||
    norm.includes("diferencia de cuadrados")
  ) {
    return {
      problemTitle: "Casos de Factoreo de Polinomios",
      subject: "Matemática",
      level: String(level || "Secundaria Superior (4° a 6° año)"),
      originalProblem: problemText || "Factorizar al máximo los siguientes polinomios indicando el caso utilizado: a) P(x) = 3x⁴ - 12x² b) Q(x) = x² - 49 c) R(x) = 2x³ + 6x² + 2x + 6",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Ítem a: Factorizar P(x) = 3x⁴ - 12x² (Factor común y Dif. de Cuadrados)",
          mathDevelopment: "1. 1° Caso (Factor Común 3x²):\nP(x) = 3x² · (x² - 4)\n\n2. 3° Caso (Diferencia de Cuadrados en x² - 4):\nx² - 4 = (x - 2) · (x + 2)\n\n==> Expresión totalmente factorizada: P(x) = 3x² · (x - 2) · (x + 2)",
          appliedRule: "Factor Común Monomio y Diferencia de Cuadrados: a² - b² = (a - b)(a + b)",
          explanation: "Extraemos primero el divisor común máximo numérico y literal (3x²), y luego descomponemos el binomio restante por diferencia de cuadrados.",
          practicalTip: "Siempre revisar si el paréntesis que queda adentro se puede seguir factorizando.",
        },
        {
          stepNumber: 2,
          title: "Ítem b: Factorizar Q(x) = x² - 49 (Diferencia de Cuadrados)",
          mathDevelopment: "Identificamos las bases:\n• √x² = x\n• √49 = 7\n==> Q(x) = (x - 7) · (x + 7)",
          appliedRule: "Diferencia de Cuadrados: a² - b² = (a - b)·(a + b)",
          explanation: "Es una resta de dos términos con raíces cuadradas exactas. Se escribe como el producto de binomios conjugados.",
          practicalTip: "Uno va con signo menos (-) y el otro con signo más (+).",
        },
        {
          stepNumber: 3,
          title: "Ítem c: Factorizar R(x) = 2x³ + 6x² + 2x + 6 (Factor común por Grupos)",
          mathDevelopment: "Agrupamos en dos pares de términos:\nR(x) = [2x³ + 6x²] + [2x + 6]\nExtraemos factor común en cada grupo:\nR(x) = 2x² · (x + 3) + 2 · (x + 3)\nExtraemos el paréntesis común (x + 3):\nR(x) = (x + 3) · (2x² + 2) = 2 · (x + 3) · (x² + 1)",
          appliedRule: "Factor Común por Grupos",
          explanation: "Agrupamos de a dos términos, sacamos factor común parcial y comprobamos que ambos grupos tengan idéntico paréntesis (x + 3).",
          practicalTip: "El paréntesis que queda en ambos grupos debe ser exactamente idéntico.",
        },
      ],
      finalAnswer: "a) P(x) = 3x²(x - 2)(x + 2) | b) Q(x) = (x - 7)(x + 7) | c) R(x) = 2(x + 3)(x² + 1)",
      pedagogicalTips: [
        "Enseñar el orden de búsqueda: 1° Intentar siempre Factor Común, 2° Si tiene 2 términos ver Diferencia de Cuadrados, 3° Si tiene 4 términos ver Por Grupos.",
      ],
      commonPitfalls: [
        "Quedarse en 3x²(x² - 4) y no terminar de factorizar el (x² - 4).",
      ],
      reinforcementConcept: "Factorizar es transformar una suma o resta de términos en un producto equivalente de factores primos.",
    };
  }

  // ==========================================
  // 11. PRÁCTICAS DEL LENGUAJE: SINTAXIS Y ACENTUACIÓN
  // ==========================================
  if (
    cleanSubject.includes("Lengua") ||
    cleanSubject.includes("Prácticas del Lenguaje") ||
    norm.includes("sintáctic") ||
    norm.includes("sujeto") ||
    norm.includes("acentuación") ||
    norm.includes("agudas")
  ) {
    if (norm.includes("acentuación") || norm.includes("aguda") || norm.includes("grave") || norm.includes("esdrújula")) {
      return {
        problemTitle: "Reglas de Acentuación y Clasificación de Palabras",
        subject: "Prácticas del Lenguaje",
        level: String(level || "Primaria (4° a 6° año)"),
        originalProblem: problemText || "Clasificar las siguientes palabras según su acentuación (aguda, grave o esdrújula) y justificar por qué llevan o no tilde gráfica: canción, árbol, cuaderno, pájaro, examen, exámenes, corazón.",
        stepByStep: [
          {
            stepNumber: 1,
            title: "Separar en sílabas e identificar la sílaba tónica (fuerte)",
            mathDevelopment: "• can-CIÓN: sílaba tónica 'CIÓN' (última)\n• ÁR-bol: sílaba tónica 'ÁR' (penúltima)\n• cua-DER-no: sílaba tónica 'DER' (penúltima)\n• PÁ-ja-ro: sílaba tónica 'PÁ' (antepenúltima)\n• ex-A-men: sílaba tónica 'A' (penúltima)\n• ex-Á-me-nes: sílaba tónica 'Á' (antepenúltima)\n• co-ra-ZÓN: sílaba tónica 'ZÓN' (última)",
            appliedRule: "Identificación de Sílaba Tónica y Separación Silábica",
            explanation: "Pronunciamos cada palabra para ubicar la sílaba que recibe el golpe de voz principal.",
            practicalTip: "Hacer palmadas o exagerar la pronunciación para ubicar la sílaba tónica sin dudar.",
          },
          {
            stepNumber: 2,
            title: "Clasificar y justificar según las reglas de tildación",
            mathDevelopment: "1. Canción / Corazón: AGUDAS con tilde porque terminan en 'N'.\n2. Árbol: GRAVE con tilde porque termina en 'L' (consonante distinta de N o S).\n3. Cuaderno / Examen: GRAVES sin tilde porque terminan en vocal / 'N'.\n4. Pájaro / Exámenes: ESDRÚJULAS con tilde porque todas las esdrújulas llevan tilde siempre.",
            appliedRule: "Reglas Generales de Acentuación (RAE / PBA)",
            explanation: "Aplicamos la regla: Agudas (N, S o vocal), Graves (no N, no S, no vocal) y Esdrújulas (siempre).",
            practicalTip: "Regla mnemotécnica SEGA: Sobreesdrújulas, Esdrújulas, Graves, Agudas.",
          },
        ],
        finalAnswer: "Canción (Aguda c/tilde), Árbol (Grave c/tilde), Cuaderno (Grave s/tilde), Pájaro (Esdrújula c/tilde), Examen (Grave s/tilde), Exámenes (Esdrújula c/tilde), Corazón (Aguda c/tilde).",
        pedagogicalTips: [
          "Explicar el caso típico de 'examen' (grave sin tilde) vs. 'exámenes' (esdrújula con tilde obligatoria).",
        ],
        commonPitfalls: [
          "Ponerle tilde a 'examen' por creer que sigue la regla de 'canción'.",
        ],
        reinforcementConcept: "La posición de la sílaba tónica determina si la palabra es aguda, grave o esdrújula.",
      };
    }

    return {
      problemTitle: "Análisis Sintáctico y Morfológico Didáctico",
      subject: "Prácticas del Lenguaje",
      level: String(level || "Secundaria Básica"),
      originalProblem: problemText || "Ayer por la tarde, los entusiastas alumnos de la profesora Patricia resolvieron los difíciles ejercicios de matemática con gran alegría.",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Identificar el verbo conjugado (Núcleo Verbal)",
          mathDevelopment: "Oración: [Ayer por la tarde, los entusiastas alumnos de Patricia resolvieron la guía escolar con entusiasmo.]\n==> Verbo conjugado: 'resolvieron' (Núcleo Verbal - NV)",
          appliedRule: "Regla del Núcleo Verbal y Concordancia en Persona y Número",
          explanation: "Buscamos la acción principal conjugada que concuerda en 3ra persona del plural con los alumnos.",
          practicalTip: "Preguntale al verbo: '¿Quiénes resolvieron?' para hallar el Sujeto con total seguridad.",
        },
        {
          stepNumber: 2,
          title: "Delimitar Sujeto y Predicado",
          mathDevelopment: "Sujeto: [los entusiastas alumnos de Patricia] (S.E.S.)\nPredicado: [Ayer por la tarde, ... resolvieron la guía escolar con entusiasmo] (P.V.S.)",
          appliedRule: "Estructura Bimembre (Sujeto Expreso Simple + Predicado Verbal Simple)",
          explanation: "Separamos la oración en dos miembros principales: quién realiza la acción (Sujeto) y lo que se predica (Predicado).",
          practicalTip: "El predicado puede estar dividido si hay un circunstancial al inicio.",
        },
        {
          stepNumber: 3,
          title: "Analizar los Modificadores del Sujeto",
          mathDevelopment: "• 'los' = Modificador Directo (MD, artículo)\n• 'entusiastas' = Modificador Directo (MD, adjetivo)\n• 'alumnos' = Núcleo Sustantivo (N)\n• 'de Patricia' = Modificador Indirecto (MI, preposición 'de' + término)",
          appliedRule: "Modificadores del Sustantivo (MD directo / MI encabezado por preposición)",
          explanation: "Los artículos y adjetivos pegados al sustantivo son MD. Las construcciones con preposición son MI.",
          practicalTip: "Los MD concuerdan siempre en género y número con el sustantivo núcleo.",
        },
        {
          stepNumber: 4,
          title: "Analizar los Modificadores del Predicado",
          mathDevelopment: "• 'Ayer por la tarde' = Circunstancial de Tiempo (CCTiempo)\n• 'resolvieron' = NV\n• 'la guía escolar' = Objeto Directo (OD) ==> Prueba: 'la resolvieron'\n• 'con entusiasmo' = Circunstancial de Modo (CCModo)",
          appliedRule: "Objetos del Verbo (Prueba de pronominalización y preguntas de circunstancial)",
          explanation: "El Objeto Directo se reemplaza por 'la'. 'Ayer por la tarde' responde a ¿cuándo? y 'con entusiasmo' a ¿cómo?.",
          practicalTip: "Hacer la prueba de la voz pasiva: 'La guía escolar fue resuelta por los alumnos'.",
        },
      ],
      finalAnswer: "Oración Bimembre (O.B.) con Sujeto Expreso Simple (S.E.S.), Predicado Verbal Simple (P.V.S.), OD, CCTiempo y CCModo.",
      pedagogicalTips: [
        "Hacer que el alumno marque con colores diferentes el Sujeto y el Predicado.",
        "Recordar que el Núcleo del Sujeto debe concordar con el Núcleo Verbal.",
      ],
      commonPitfalls: [
        "Confundir un Modificador Directo con un Modificador Indirecto.",
      ],
      reinforcementConcept: "Concordancia gramatical obligatoria entre el Núcleo del Sujeto y el Verbo conjugado.",
    };
  }

  // ==========================================
  // 12. FÍSICA: MRU Y DINÁMICA
  // ==========================================
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
          mathDevelopment: "• Velocidad (v) = 72 km/h\n• Tiempo (t) = 25 s\n• Incógnita: Distancia (x) = ? [en metros]",
          appliedRule: "Planteo de Magnitudes del Sistema Internacional (SI)",
          explanation: "Listamos todos los valores con sus unidades para verificar compatibilidad.",
          practicalTip: "Anotar siempre las unidades para no mezclar magnitudes.",
        },
        {
          stepNumber: 2,
          title: "Conversión de Unidades (km/h a m/s)",
          mathDevelopment: "v = 72 km/h = (72 / 3,6) m/s = 20 m/s",
          appliedRule: "Factor de Conversión de Velocidad (1 km/h = 1/3,6 m/s)",
          explanation: "Convertimos la velocidad a metros por segundo dividiendo por 3,6.",
          practicalTip: "De km/h a m/s se DIVIDE por 3,6. De m/s a km/h se MULTIPLICA por 3,6.",
        },
        {
          stepNumber: 3,
          title: "Planteo de la Ecuación de MRU y Cálculo Final",
          mathDevelopment: "Fórmula: x = v · t\nx = 20 m/s · 25 s\nx = 500 metros",
          appliedRule: "Ecuación del Movimiento Rectilíneo Uniforme (MRU)",
          explanation: "Multiplicamos la velocidad constante por el tiempo transcurrido obteniendo 500 metros.",
          practicalTip: "Los segundos (s) se cancelan dejando la respuesta en metros.",
        },
      ],
      finalAnswer: "Distancia recorrida = 500 metros (x = 500 m)",
      pedagogicalTips: [
        "Hacer que el alumno verifique siempre la cancelación de unidades en la hoja.",
      ],
      commonPitfalls: [
        "Multiplicar directamente 72 × 25 sin convertir km/h a m/s.",
      ],
      reinforcementConcept: "En MRU la velocidad es constante (aceleración a = 0) y x = v · t.",
    };
  }

  // ==========================================
  // 13. QUÍMICA: LEWIS Y UNIONES
  // ==========================================
  if (cleanSubject.includes("Química") || norm.includes("lewis") || norm.includes("union") || norm.includes("molar")) {
    return {
      problemTitle: "Estructura Química, Uniones y Lewis",
      subject: "Química",
      level: String(level || "Secundaria"),
      originalProblem: problemText || "Representar la estructura de Lewis y determinar el tipo de unión del Dióxido de Carbono (CO₂).",
      stepByStep: [
        {
          stepNumber: 1,
          title: "Ubicación en Tabla Periódica y Electrones de Valencia",
          mathDevelopment: "• Carbono (C): Grupo 14 ==> 4 e⁻ de valencia\n• Oxígeno (O): Grupo 16 ==> 6 e⁻ de valencia\n• Total e⁻ = 4 + 2·(6) = 16 e⁻",
          appliedRule: "Electrones de Valencia según Grupo Representativo",
          explanation: "Identificamos los electrones del último nivel para cada átomo.",
          practicalTip: "El grupo indica cuántos puntos dibujar alrededor del símbolo.",
        },
        {
          stepNumber: 2,
          title: "Determinación de Unión y Estructura de Lewis",
          mathDevelopment: "No metal (C) + No metal (O) ==> Unión Covalente\nDisposición: O = C = O (2 enlaces covalentes dobles)\nTodos los átomos completan 8 electrones (Regla del Octeto).",
          appliedRule: "Regla del Octeto y Enlaces Covalentes Dobles",
          explanation: "El carbono comparte dos pares de electrones con cada oxígeno completando los octetos.",
          practicalTip: "Usar colores distintos para los electrones de cada elemento.",
        },
      ],
      finalAnswer: "Unión Covalente Doble No Polar: O = C = O con todos los octetos completos.",
      pedagogicalTips: [
        "Recordar que los no metales comparten electrones en lugar de transferirlos.",
      ],
      commonPitfalls: [
        "Poner cargas con corchetes en uniones covalentes.",
      ],
      reinforcementConcept: "Los átomos comparten electrones para alcanzar la configuración estable del gas noble.",
    };
  }

  // ==========================================
  // 14. DEFAULT ECUACIONES DE PRIMER GRADO
  // ==========================================
  return {
    problemTitle: "Ecuación de 1° Grado y Verificación",
    subject: "Matemática",
    level: String(level || "Secundaria Básica"),
    originalProblem: problemText || "Resolver y verificar la siguiente ecuación: 2(x - 3) + 4 = 3x - 5",
    stepByStep: [
      {
        stepNumber: 1,
        title: "Separar en Términos y Analizar la Jerarquía de Operaciones",
        mathDevelopment: "Ecuación original:\n[2·(x - 3)] + [4] = [3x] - [5]\n(2 términos en el 1° miembro y 2 términos en el 2° miembro)",
        appliedRule: "Jerarquía de Operaciones y Separación en Términos",
        explanation: "Los signos + y - fuera de paréntesis delimitan los términos independientes a operar.",
        practicalTip: "Marcá arcos por arriba de la cuenta para separar visualmente cada término.",
      },
      {
        stepNumber: 2,
        title: "Suprimir Paréntesis y Aplicar Propiedad Distributiva",
        mathDevelopment: "2·(x) - 2·(3) + 4 = 3x - 5\n2x - 6 + 4 = 3x - 5\n2x - 2 = 3x - 5",
        appliedRule: "Propiedad Distributiva del Producto: a·(b - c) = a·b - a·c",
        explanation: "El 2 multiplica a la 'x' y al '3'. Luego reducimos: -6 + 4 = -2.",
        practicalTip: "(+2) · (-3) = -6 (regla de los signos).",
      },
      {
        stepNumber: 3,
        title: "Agrupar Términos con 'x' y Números Independientes",
        mathDevelopment: "2x - 3x = -5 + 2\n-1x = -3",
        appliedRule: "Propiedad Uniforme (Pasaje de Términos)",
        explanation: "Pasamos las incógnitas al 1° miembro y los números al 2° miembro con su operación contraria.",
        practicalTip: "Mantené el signo igual alineado verticalmente.",
      },
      {
        stepNumber: 4,
        title: "Despejar la Incógnita 'x'",
        mathDevelopment: "x = -3 / (-1)\nx = 3",
        appliedRule: "Regla de Signos en la División: (-) ÷ (-) = (+)",
        explanation: "El -1 pasa dividiendo conservando su signo negativo. Menos dividido menos da más.",
        practicalTip: "El número que multiplica pasa dividiendo CON su mismo signo.",
      },
      {
        stepNumber: 5,
        title: "Verificación del Resultado",
        mathDevelopment: "Reemplazamos x = 3:\n1° Miembro: 2·(3 - 3) + 4 = 2·0 + 4 = 4\n2° Miembro: 3·(3) - 5 = 9 - 5 = 4\n==> 4 = 4 ✓",
        appliedRule: "Método de Verificación por Sustitución Numérica",
        explanation: "Comprobamos que ambos miembros den exactamente 4 al reemplazar x = 3.",
        practicalTip: "La verificación asegura que la solución es 100% correcta.",
      },
    ],
    finalAnswer: "x = 3 (Verificado: 4 = 4)",
    pedagogicalTips: [
      "Recordar siempre la regla de los signos.",
      "Hacer siempre la verificación sustituyendo en el enunciado original.",
    ],
    commonPitfalls: [
      "Olvidar multiplicar el 2 por el segundo término dentro del paréntesis.",
      "Cambiarle el signo al número que pasa dividiendo.",
    ],
    reinforcementConcept: "Toda ecuación es como una balanza en equilibrio.",
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
