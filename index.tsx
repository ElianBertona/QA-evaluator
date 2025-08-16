
import React, { useState, useMemo, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


// --- Sample Data (simulating a database fetch) ---
const QA_QUESTIONS = [
  // Módulo 1: Fundamentos de Pruebas (9 preguntas)
  {
    module: "Fundamentos de Pruebas",
    question: "En el contexto de los 7 principios de pruebas de ISTQB, ¿qué significa 'Las pruebas demuestran la presencia de defectos'?",
    options: ["Las pruebas pueden demostrar que no hay defectos.", "Una prueba exitosa es aquella que encuentra un defecto.", "Las pruebas pueden mostrar que los defectos están presentes, pero no pueden demostrar que no hay defectos.", "Las pruebas exhaustivas son posibles y recomendadas."],
    correctAnswer: "Las pruebas pueden mostrar que los defectos están presentes, pero no pueden demostrar que no hay defectos.",
    explanation: "Este principio fundamental establece que las pruebas solo pueden confirmar la existencia de defectos, pero nunca pueden garantizar su ausencia total, ya que probar todas las combinaciones posibles es inviable."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "El principio 'Las pruebas dependen del contexto' implica que:",
    options: ["Todas las aplicaciones deben probarse de la misma manera.", "La forma de probar una tienda en línea es diferente a probar una aplicación médica.", "Las pruebas deben realizarse en un entorno aislado.", "El contexto del defecto no es importante."],
    correctAnswer: "La forma de probar una tienda en línea es diferente a probar una aplicación médica.",
    explanation: "No existe una única estrategia de pruebas universal. Las técnicas, niveles de rigor y objetivos varían según el riesgo, la industria y la tecnología del software."
  },
   {
    module: "Fundamentos de Pruebas",
    question: "El principio 'Agrupación de defectos' (Defect clustering) sugiere que:",
    options: ["Los defectos se distribuyen uniformemente en todo el software.", "Un pequeño número de módulos suele contener la mayoría de los defectos.", "Todos los defectos deben ser corregidos en grupo.", "Los defectos deben ser reportados por grupos de testers."],
    correctAnswer: "Un pequeño número de módulos suele contener la mayoría de los defectos.",
    explanation: "Este principio, similar al de Pareto (80/20), indica que la mayoría de los defectos se concentran en unas pocas áreas críticas del sistema, lo que ayuda a enfocar los esfuerzos de prueba."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "La falacia de la 'ausencia de errores' significa que:",
    options: ["Si no se encuentran errores, el software es perfecto.", "Encontrar y corregir errores no ayudará si el sistema construido es inutilizable o no cumple las necesidades del usuario.", "Los errores nunca están realmente ausentes, solo ocultos.", "Es una falacia pensar que se pueden encontrar todos los errores."],
    correctAnswer: "Encontrar y corregir errores no ayudará si el sistema construido es inutilizable o no cumple las necesidades del usuario.",
    explanation: "La calidad no se limita a la ausencia de bugs. Un software sin errores pero que no satisface las expectativas del usuario es, en última instancia, un fracaso."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "¿Cuál de las siguientes afirmaciones sobre las pruebas estáticas es VERDADERA?",
    options: ["Requieren la ejecución del código.", "Solo pueden ser realizadas por herramientas automatizadas.", "Pueden encontrar defectos en una etapa temprana del ciclo de vida.", "Un ejemplo es la prueba de rendimiento."],
    correctAnswer: "Pueden encontrar defectos en una etapa temprana del ciclo de vida.",
    explanation: "Las pruebas estáticas (revisiones de código, análisis de requisitos) no ejecutan el software, permitiendo encontrar defectos de forma temprana y económica, antes de que se propaguen."
  },
    {
    module: "Fundamentos de Pruebas",
    question: "¿Cuál de los 7 principios de ISTQB se relaciona con el concepto de 'retorno de la inversión' en las pruebas?",
    options: ["Las pruebas exhaustivas son imposibles.", "Las pruebas tempranas ahorran tiempo y dinero.", "La paradoja del pesticida.", "Las pruebas dependen del contexto."],
    correctAnswer: "Las pruebas tempranas ahorran tiempo y dinero.",
    explanation: "Encontrar y corregir un defecto en etapas tempranas (requisitos, diseño) es exponencialmente más barato que encontrarlo y corregirlo en producción."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "La 'paradoja del pesticida' en pruebas de software sugiere que:",
    options: ["El software se vuelve inmune a los virus si se prueba lo suficiente.", "Si se repiten los mismos casos de prueba una y otra vez, dejarán de encontrar nuevos defectos.", "Usar demasiadas herramientas de prueba puede ser perjudicial.", "Los defectos deben eliminarse como si fueran plagas."],
    correctAnswer: "Si se repiten los mismos casos de prueba una y otra vez, dejarán de encontrar nuevos defectos.",
    explanation: "Al igual que los insectos se vuelven resistentes a un pesticida, los casos de prueba pierden su efectividad con el tiempo. Es necesario revisarlos y actualizarlos regularmente para descubrir nuevos tipos de errores."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "¿Qué es el Proceso de Pruebas Fundamental?",
    options: ["Un framework exclusivo para metodologías ágiles.", "Un conjunto de actividades que incluye Planificación, Análisis, Diseño, Implementación, Ejecución y Finalización.", "Una herramienta para automatizar el reporte de defectos.", "Un sinónimo de ciclo de vida de desarrollo de software."],
    correctAnswer: "Un conjunto de actividades que incluye Planificación, Análisis, Diseño, Implementación, Ejecución y Finalización.",
    explanation: "Este proceso define las etapas clave en cualquier actividad de prueba formal, desde la concepción estratégica hasta el cierre y aprendizaje del ciclo."
  },
  {
    module: "Fundamentos de Pruebas",
    question: "En la psicología de las pruebas, ¿por qué es importante mantener una mentalidad constructiva y no culpar a los desarrolladores?",
    options: ["Porque los desarrolladores nunca cometen errores.", "Para mantener una buena relación de trabajo y una comunicación efectiva, enfocándose en la calidad del producto.", "Porque el tester es el único responsable de la calidad.", "No es importante, el objetivo es encontrar culpables."],
    correctAnswer: "Para mantener una buena relación de trabajo y una comunicación efectiva, enfocándose en la calidad del producto.",
    explanation: "La calidad es una responsabilidad compartida. Una comunicación colaborativa y sin culpas entre testers y desarrolladores es esencial para un ciclo de desarrollo saludable y eficiente."
  },
  
  // Módulo 2: Pruebas en el Ciclo de Vida (9 preguntas)
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Cuál es el propósito principal de las pruebas de regresión?",
    options: ["Probar las nuevas características de una aplicación.", "Asegurar que los nuevos cambios de código no hayan afectado negativamente las características existentes.", "Probar el rendimiento de una aplicación bajo carga.", "Encontrar tantos errores como sea posible en un nuevo módulo."],
    correctAnswer: "Asegurar que los nuevos cambios de código no hayan afectado negativamente las características existentes.",
    explanation: "Las pruebas de regresión son una red de seguridad. Su objetivo es verificar que las modificaciones o correcciones no han introducido nuevos defectos en funcionalidades que antes operaban correctamente."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "En el Modelo V, las pruebas de aceptación están directamente relacionadas con:",
    options: ["El diseño de la arquitectura.", "La codificación de los componentes.", "La fase de análisis de requisitos.", "El diseño detallado."],
    correctAnswer: "La fase de análisis de requisitos.",
    explanation: "El Modelo V establece una correspondencia directa entre cada fase de desarrollo y su fase de prueba. Las pruebas de aceptación validan los requisitos del negocio definidos al inicio del proyecto."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Cuál de estos NO es un nivel de prueba?",
    options: ["Pruebas de Componente", "Pruebas de Integración", "Pruebas de Sistema", "Pruebas de Defectos"],
    correctAnswer: "Pruebas de Defectos",
    explanation: "'Pruebas de Defectos' no es un nivel de prueba estándar. Los niveles de prueba son fases que validan diferentes alcances: componente (unidad), integración, sistema y aceptación."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Qué tipo de prueba verifica el rendimiento del sistema bajo una carga de trabajo específica y esperada?",
    options: ["Pruebas de Estrés", "Pruebas de Carga", "Pruebas de Usabilidad", "Pruebas de Compatibilidad"],
    correctAnswer: "Pruebas de Carga",
    explanation: "Las pruebas de carga miden el comportamiento del sistema con un número esperado de usuarios, mientras que las pruebas de estrés buscan el punto de ruptura del sistema llevándolo más allá de sus límites normales."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Cuál es un objetivo principal de las Pruebas de Aceptación del Usuario (UAT)?",
    options: ["Encontrar defectos de código a bajo nivel.", "Verificar que el sistema cumple con los requisitos del negocio y las necesidades del usuario.", "Probar la integración entre diferentes módulos.", "Medir el rendimiento del sistema."],
    correctAnswer: "Verificar que el sistema cumple con los requisitos del negocio y las necesidades del usuario.",
    explanation: "UAT es la fase final de pruebas, donde los usuarios finales o clientes validan que el software resuelve su problema o necesidad en un entorno lo más parecido posible al de producción."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Cuál de las siguientes es una prueba NO funcional?",
    options: ["Probar que un usuario puede iniciar sesión con credenciales válidas.", "Probar que el sistema puede manejar 1000 usuarios concurrentes.", "Probar que un formulario de registro guarda la información correctamente.", "Probar que un cálculo matemático produce el resultado correcto."],
    correctAnswer: "Probar que el sistema puede manejar 1000 usuarios concurrentes.",
    explanation: "Las pruebas funcionales verifican 'qué' hace el sistema (iniciar sesión, guardar datos), mientras que las no funcionales verifican 'cómo' lo hace (rendimiento, seguridad, usabilidad)."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Qué es el 'Shift-Left Testing'?",
    options: ["Dejar todas las pruebas para el final del ciclo de desarrollo.", "Probar solo la interfaz de usuario.", "Comenzar las actividades de prueba lo antes posible en el ciclo de vida del desarrollo.", "Mover los defectos encontrados a la izquierda en un tablero Kanban."],
    correctAnswer: "Comenzar las actividades de prueba lo antes posible en el ciclo de vida del desarrollo.",
    explanation: "El 'Shift-Left' es una filosofía que promueve la participación de QA en etapas tempranas (requisitos, diseño) para prevenir defectos en lugar de solo detectarlos, ahorrando costos significativamente."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "Verificar que el software funciona correctamente en diferentes navegadores (Chrome, Firefox, Safari) es un ejemplo de:",
    options: ["Pruebas de Carga", "Pruebas de Usabilidad", "Pruebas de Compatibilidad", "Pruebas de Integración"],
    correctAnswer: "Pruebas de Compatibilidad",
    explanation: "Las pruebas de compatibilidad aseguran que el producto ofrece una experiencia consistente y funcional a través de diversas configuraciones de hardware, software, sistemas operativos y redes."
  },
  {
    module: "Pruebas en el Ciclo de Vida",
    question: "¿Qué son las pruebas de humo (Smoke Testing)?",
    options: ["Una prueba exhaustiva de toda la aplicación.", "Un conjunto de pruebas rápidas que verifican la funcionalidad básica y crítica de una nueva compilación para decidir si es estable para pruebas más profundas.", "Pruebas realizadas por los usuarios finales.", "Pruebas para encontrar fallos de seguridad."],
    correctAnswer: "Un conjunto de pruebas rápidas que verifican la funcionalidad básica y crítica de una nueva compilación para decidir si es estable para pruebas más profundas.",
    explanation: "Un 'smoke test' actúa como un filtro inicial. Si falla, la nueva versión (build) se rechaza inmediatamente, ahorrando tiempo al equipo de QA al no probar un sistema fundamentalmente roto."
  },

  // Módulo 3: Técnicas de Prueba (9 preguntas)
  {
    module: "Técnicas de Prueba",
    question: "¿Cuál de las siguientes es una técnica de prueba de 'caja blanca'?",
    options: ["Partición de equivalencia", "Análisis de valores límite", "Tabla de decisión", "Cobertura de sentencias"],
    correctAnswer: "Cobertura de sentencias",
    explanation: "Las técnicas de caja blanca se basan en el conocimiento de la estructura interna del código. La cobertura de sentencias mide cuántas líneas de código se ejecutan durante la prueba."
  },
  {
    module: "Técnicas de Prueba",
    question: "Si un campo de texto acepta números enteros del 1 al 100, ¿qué valores probarías usando 'Análisis de Valores Límite'?",
    options: ["1, 50, 100", "0, 1, 2, 99, 100, 101", "Solo números negativos", "Cualquier número al azar"],
    correctAnswer: "0, 1, 2, 99, 100, 101",
    explanation: "Esta técnica prueba los valores justo en los límites, así como inmediatamente por debajo y por encima de ellos, ya que es donde suelen ocurrir los errores (ej. 0 y 101 son inválidos, 1 y 100 son válidos)."
  },
    {
    module: "Técnicas de Prueba",
    question: "La técnica de 'Partición de Equivalencia' pertenece a qué categoría de pruebas?",
    options: ["Caja Blanca", "Caja Negra", "Basadas en la Experiencia", "Estáticas"],
    correctAnswer: "Caja Negra",
    explanation: "Las técnicas de caja negra se enfocan en probar la funcionalidad sin conocer el código interno. La partición de equivalencia divide las entradas en grupos de los que se asume que el sistema se comportará de manera similar."
  },
  {
    module: "Técnicas de Prueba",
    question: "¿Qué es el 'testing exploratorio'?",
    options: ["Ejecutar scripts de prueba automatizados.", "Seguir estrictamente casos de prueba predefinidos.", "Aprendizaje, diseño y ejecución de pruebas de forma simultánea.", "Revisar el código fuente en busca de errores."],
    correctAnswer: "Aprendizaje, diseño y ejecución de pruebas de forma simultánea.",
    explanation: "El testing exploratorio es una técnica dinámica y creativa donde la planificación, ejecución y aprendizaje ocurren al mismo tiempo. Es muy eficaz para encontrar defectos que los casos de prueba formales podrían pasar por alto."
  },
  {
    module: "Técnicas de Prueba",
    question: "La 'Cobertura de Decisión' es una métrica de prueba de:",
    options: ["Caja Negra", "Caja Blanca", "Usabilidad", "Rendimiento"],
    correctAnswer: "Caja Blanca",
    explanation: "La cobertura de decisión es una técnica de caja blanca más fuerte que la de sentencias. Mide si se han probado todos los resultados posibles de las decisiones en el código (ej. las ramas 'true' y 'false' de un 'if')."
  },
  {
    module: "Técnicas de Prueba",
    question: "La 'Técnica de Transición de Estados' es más adecuada para probar:",
    options: ["Sistemas con un gran volumen de datos.", "Sistemas que pueden estar en un número finito de estados y las transiciones entre ellos.", "Algoritmos matemáticos complejos.", "Interfaces de usuario estáticas."],
    correctAnswer: "Sistemas que pueden estar en un número finito de estados y las transiciones entre ellos.",
    explanation: "Es ideal para sistemas como una máquina expendedora, un semáforo o el flujo de estados de un pedido en un e-commerce, donde un evento provoca un cambio de un estado a otro."
  },
  {
    module: "Técnicas de Prueba",
    question: "Las pruebas de 'Caja Gris' combinan elementos de:",
    options: ["Pruebas de usabilidad y rendimiento.", "Pruebas estáticas y dinámicas.", "Pruebas de caja negra y caja blanca.", "Pruebas manuales y automatizadas."],
    correctAnswer: "Pruebas de caja negra y caja blanca.",
    explanation: "En las pruebas de caja gris, el tester tiene un conocimiento parcial del sistema interno, como acceder a la base de datos para verificar los resultados, pero no necesariamente ve el código fuente completo."
  },
   {
    module: "Técnicas de Prueba",
    question: "¿Qué es el 'Error Guessing' (Adivinación de errores)?",
    options: ["Una técnica formal de diseño de pruebas de caja negra.", "Una técnica basada en la experiencia donde el tester anticipa errores basándose en su conocimiento.", "Un método para adivinar las contraseñas de los usuarios.", "Un sinónimo de pruebas aleatorias."],
    correctAnswer: "Una técnica basada en la experiencia donde el tester anticipa errores basándose en su conocimiento.",
    explanation: "Esta técnica informal depende de la intuición y experiencia del QA para predecir dónde podrían haber cometido errores los desarrolladores, por ejemplo, probando la división por cero o la carga de archivos muy grandes."
  },
  {
    module: "Técnicas de Prueba",
    question: "Para un sistema de inicio de sesión con múltiples condiciones (usuario válido, contraseña correcta, cuenta no bloqueada), ¿qué técnica de caja negra sería la más eficiente para diseñar pruebas?",
    options: ["Análisis de valores límite", "Tablas de Decisión", "Transición de estados", "Partición de equivalencia"],
    correctAnswer: "Tablas de Decisión",
    explanation: "Las Tablas de Decisión son perfectas para modelar y probar reglas de negocio complejas con múltiples combinaciones de condiciones de entrada y sus correspondientes acciones o resultados."
  },

  // Módulo 4: Gestión de Pruebas (9 preguntas)
  {
    module: "Gestión de Pruebas",
    question: "¿Qué documento describe el alcance, enfoque, recursos y cronograma de las actividades de prueba?",
    options: ["Caso de Prueba", "Plan de Pruebas", "Informe de Defectos", "Estrategia de Pruebas"],
    correctAnswer: "Plan de Pruebas",
    explanation: "El Plan de Pruebas es el documento central para la gestión de un proyecto de pruebas. Responde a las preguntas: qué, cómo, cuándo y quién va a probar."
  },
  {
    module: "Gestión de Pruebas",
    question: "En metodologías ágiles como Scrum, ¿quién es el responsable de la calidad del producto?",
    options: ["Solo el equipo de QA", "Solo el Product Owner", "Todo el equipo (desarrolladores, QA, PO, etc.)", "Solo el Scrum Master"],
    correctAnswer: "Todo el equipo (desarrolladores, QA, PO, etc.)",
    explanation: "En Scrum, la calidad es una responsabilidad colectiva. Todo el equipo se compromete a entregar un incremento de producto funcional y de alta calidad al final de cada sprint."
  },
  {
    module: "Gestión de Pruebas",
    question: "Un defecto encontrado por el cliente final que no fue detectado por el equipo de pruebas se conoce como:",
    options: ["Defecto bloqueante", "Defecto latente", "Fuga de defectos (Defect leakage)", "Error de usabilidad"],
    correctAnswer: "Fuga de defectos (Defect leakage)",
    explanation: "La 'fuga de defectos' es una métrica clave que mide la efectividad del proceso de pruebas. Un alto número de fugas indica problemas en la estrategia o ejecución de las pruebas."
  },
  {
    module: "Gestión de Pruebas",
    question: "En el ciclo de vida de un defecto, ¿cuál es el estado inicial?",
    options: ["Abierto", "Nuevo", "Asignado", "En progreso"],
    correctAnswer: "Nuevo",
    explanation: "Cuando un tester encuentra y reporta un defecto por primera vez, este ingresa al sistema de seguimiento en estado 'Nuevo', a la espera de ser validado y asignado."
  },
  {
    module: "Gestión de Pruebas",
    question: "¿Qué es la 'deuda técnica' en el contexto de QA?",
    options: ["El costo de adquirir nuevas herramientas de testing.", "El resultado implícito de optar por una solución fácil ahora en lugar de usar un mejor enfoque que tomaría más tiempo.", "El tiempo que el equipo de QA le debe al equipo de desarrollo.", "Un presupuesto asignado para corregir errores."],
    correctAnswer: "El resultado implícito de optar por una solución fácil ahora en lugar de usar un mejor enfoque que tomaría más tiempo.",
    explanation: "La deuda técnica, como una deuda financiera, genera 'intereses' en forma de mayor dificultad para mantener el código y corregir errores en el futuro. Puede afectar tanto al desarrollo como a la automatización de pruebas."
  },
  {
    module: "Gestión de Pruebas",
    question: "En Scrum, una 'User Story' (Historia de Usuario) debe tener:",
    options: ["Un diagrama de flujo detallado.", "Criterios de Aceptación claros.", "El código fuente asociado.", "Un plan de pruebas formal."],
    correctAnswer: "Criterios de Aceptación claros.",
    explanation: "Los Criterios de Aceptación son las condiciones que la historia de usuario debe cumplir para ser considerada 'terminada'. Son la base para las pruebas y aseguran que todos entiendan el objetivo."
  },
  {
    module: "Gestión de Pruebas",
    question: "¿Qué es la 'Trazabilidad' en el contexto de las pruebas?",
    options: ["La capacidad de seguir un defecto hasta su corrección.", "La relación que vincula los requisitos, los casos de prueba, los resultados de las pruebas y los defectos.", "La habilidad de un tester para trazar un plan.", "El seguimiento del tiempo dedicado a las pruebas."],
    correctAnswer: "La relación que vincula los requisitos, los casos de prueba, los resultados de las pruebas y los defectos.",
    explanation: "La matriz de trazabilidad permite asegurar que todos los requisitos han sido cubiertos por casos de prueba y ayuda a evaluar el impacto de los cambios en los requisitos."
  },
  {
    module: "Gestión de Pruebas",
    question: "¿Qué define el 'Criterio de Salida' (Exit Criteria) en un plan de pruebas?",
    options: ["El momento en que comienzan las pruebas.", "Las condiciones que deben cumplirse para dar por finalizada una fase de pruebas.", "La lista de testers que abandonan el proyecto.", "Los criterios para contratar a un nuevo QA."],
    correctAnswer: "Las condiciones que deben cumplirse para dar por finalizada una fase de pruebas.",
    explanation: "Los criterios de salida son objetivos medibles, como 'el 95% de los casos de prueba críticos deben pasar' o 'no debe haber defectos bloqueantes abiertos'. Ayudan a tomar decisiones informadas sobre si el software está listo."
  },
  {
    module: "Gestión de Pruebas",
    question: "En un reporte de defecto, ¿cuál de los siguientes campos es el más crucial para la reproducibilidad?",
    options: ["La severidad asignada.", "El nombre del tester que lo encontró.", "Los pasos detallados para reproducir el error.", "La fecha y hora del hallazgo."],
    correctAnswer: "Los pasos detallados para reproducir el error.",
    explanation: "Si un desarrollador no puede reproducir un defecto, no puede corregirlo. Pasos claros, concisos y numerados son esenciales para un reporte de defecto efectivo."
  },

  // Módulo 5: Automatización y Herramientas (9 preguntas)
  {
    module: "Automatización y Herramientas",
    question: "¿Cuál de las siguientes herramientas se utiliza comúnmente para la automatización de pruebas de UI web?",
    options: ["Jira", "Postman", "Selenium", "Jenkins"],
    correctAnswer: "Selenium",
    explanation: "Selenium es un estándar de la industria para la automatización de navegadores web. Permite crear scripts que simulan la interacción de un usuario con la interfaz de una aplicación web."
  },
  {
    module: "Automatización y Herramientas",
    question: "Una herramienta como Postman o Insomnia se usa principalmente para:",
    options: ["Pruebas de UI web.", "Pruebas de bases de datos.", "Pruebas de API (servicios web).", "Gestión de proyectos."],
    correctAnswer: "Pruebas de API (servicios web).",
    explanation: "Estas herramientas permiten enviar peticiones (GET, POST, PUT, etc.) a los endpoints de una API y verificar que las respuestas (códigos de estado, datos) son las esperadas."
  },
  {
    module: "Automatización y Herramientas",
    question: "En la pirámide de automatización de pruebas, ¿qué tipo de pruebas debería tener la mayor cobertura?",
    options: ["Pruebas de UI (End-to-End)", "Pruebas Manuales", "Pruebas Unitarias", "Pruebas de Aceptación"],
    correctAnswer: "Pruebas Unitarias",
    explanation: "La pirámide de pruebas sugiere tener una base amplia de pruebas unitarias (rápidas y baratas), una capa intermedia de pruebas de API/integración, y una pequeña capa superior de pruebas de UI (lentas y frágiles)."
  },
  {
    module: "Automatización y Herramientas",
    question: "¿Cuál es un beneficio clave de la Integración Continua (CI) para QA?",
    options: ["Elimina la necesidad de pruebas manuales.", "Permite detectar errores de integración de forma temprana y frecuente.", "Garantiza que el software nunca tendrá defectos.", "Solo beneficia a los desarrolladores."],
    correctAnswer: "Permite detectar errores de integración de forma temprana y frecuente.",
    explanation: "CI/CD integra automáticamente el código de varios desarrolladores y ejecuta pruebas (unitarias, de integración) en cada cambio, lo que permite identificar problemas de compatibilidad casi al instante."
  },
    {
    module: "Automatización y Herramientas",
    question: "¿Qué es el 'Page Object Model' (POM)?",
    options: ["Un tipo de prueba de rendimiento.", "Un patrón de diseño en la automatización de pruebas que crea un repositorio de objetos para las páginas de la aplicación.", "Una herramienta para gestionar proyectos de automatización.", "Un lenguaje de scripting para Selenium."],
    correctAnswer: "Un patrón de diseño en la automatización de pruebas que crea un repositorio de objetos para las páginas de la aplicación.",
    explanation: "POM mejora la mantenibilidad del código de automatización al separar la lógica de las pruebas de la definición de los elementos de la UI. Si la UI cambia, solo se actualiza el 'Page Object' correspondiente, no todos los scripts de prueba."
  },
  {
    module: "Automatización y Herramientas",
    question: "En automatización, ¿qué es un 'locator' (localizador)?",
    options: ["Un tester asignado a una ubicación geográfica.", "Una forma de encontrar y interactuar con un elemento en una página web (ej. por ID, CSS Selector, XPath).", "Un tipo de defecto.", "Una variable global en un script."],
    correctAnswer: "Una forma de encontrar y interactuar con un elemento en una página web (ej. por ID, CSS Selector, XPath).",
    explanation: "Para que un script de automatización haga clic en un botón o escriba en un campo, primero debe 'localizarlo' en la estructura HTML de la página. La elección de un buen localizador (estable y único) es clave para evitar pruebas frágiles."
  },
  {
    module: "Automatización y Herramientas",
    question: "Un método de API que puede ser llamado múltiples veces con el mismo resultado se considera:",
    options: ["Volátil", "Idempotente", "Síncrono", "Asíncrono"],
    correctAnswer: "Idempotente",
    explanation: "La idempotencia es un concepto clave en las pruebas de API. Por ejemplo, una petición DELETE debería dar el mismo resultado (el recurso ya no existe) si se ejecuta una o diez veces. GET, PUT y DELETE suelen ser idempotentes, mientras que POST no lo es."
  },
  {
    module: "Automatización y Herramientas",
    question: "¿Qué es 'BDD' (Behavior-Driven Development)?",
    options: ["Una técnica de pruebas de bases de datos.", "Un proceso de desarrollo de software que fomenta la colaboración entre desarrolladores, QA y negocio usando un lenguaje natural como Gherkin (Given-When-Then).", "Una herramienta de automatización.", "Un sinónimo de desarrollo ágil."],
    correctAnswer: "Un proceso de desarrollo de software que fomenta la colaboración entre desarrolladores, QA y negocio usando un lenguaje natural como Gherkin (Given-When-Then).",
    explanation: "BDD utiliza ejemplos en lenguaje natural para describir el comportamiento esperado del sistema. Estos ejemplos pueden automatizarse (usando herramientas como Cucumber) para servir como pruebas de aceptación."
  },
  {
    module: "Automatización y Herramientas",
    question: "La principal ventaja de las pruebas de API sobre las pruebas de UI es que son:",
    options: ["Más fáciles de entender para los usuarios de negocio.", "Más visuales y atractivas.", "Generalmente más rápidas, estables y menos propensas a romperse por cambios cosméticos.", "Capaces de encontrar todos los tipos de defectos."],
    correctAnswer: "Generalmente más rápidas, estables y menos propensas a romperse por cambios cosméticos.",
    explanation: "Las pruebas de API interactúan directamente con la lógica de negocio, evitando la fragilidad y lentitud del navegador. Por eso la pirámide de pruebas recomienda tener una base de automatización más amplia a nivel de API que de UI."
  },
  
  // Módulo 6: Resolución de Escenarios (9 preguntas)
  {
    module: "Resolución de Escenarios",
    question: "Encuentras un defecto crítico a un día del lanzamiento. No hay tiempo para una corrección y un ciclo de regresión completo. ¿Cuál es tu acción más importante?",
    options: ["Cancelar el lanzamiento inmediatamente.", "Ignorar el defecto y esperar que los usuarios no lo encuentren.", "Comunicar claramente el riesgo (qué es, impacto, probabilidad) al Product Manager y al equipo para tomar una decisión informada.", "Intentar corregir el código tú mismo."],
    correctAnswer: "Comunicar claramente el riesgo (qué es, impacto, probabilidad) al Product Manager y al equipo para tomar una decisión informada.",
    explanation: "El rol del QA en esta situación no es tomar la decisión final, sino proporcionar toda la información necesaria para que el negocio pueda evaluar el riesgo. La comunicación clara y la evaluación de impacto son cruciales."
  },
  {
    module: "Resolución de Escenarios",
    question: "Te piden probar una nueva funcionalidad, pero la documentación de requisitos es vaga e incompleta. ¿Qué deberías hacer primero?",
    options: ["Empezar a probar al azar y esperar encontrar errores.", "Rechazar la tarea hasta que la documentación sea perfecta.", "Utilizar técnicas de testing exploratorio y colaborar activamente con el Product Owner y desarrolladores para aclarar dudas.", "Inventar los requisitos que crees que faltan."],
    correctAnswer: "Utilizar técnicas de testing exploratorio y colaborar activamente con el Product Owner y desarrolladores para aclarar dudas.",
    explanation: "La ambigüedad es común. Un QA proactivo no espera, sino que genera la información necesaria a través de la exploración del software y la comunicación directa con el equipo para definir los criterios de aceptación."
  },
  {
    module: "Resolución de Escenarios",
    question: "Un desarrollador te dice que un defecto que reportaste 'no es un bug, es una característica'. ¿Cómo procedes?",
    options: ["Cerrar el defecto inmediatamente y disculparte.", "Escalar el problema directamente a la alta gerencia.", "Revisar los requisitos o Criterios de Aceptación. Si no están claros, iniciar una conversación con el Product Owner para que defina el comportamiento esperado.", "Insistir en que es un bug sin más argumentos."],
    correctAnswer: "Revisar los requisitos o Criterios de Aceptación. Si no están claros, iniciar una conversación con el Product Owner para que defina el comportamiento esperado.",
    explanation: "La fuente de la verdad debe ser el requisito del negocio. Si el comportamiento actual contradice lo esperado por el Product Owner, es un defecto. Si no, podría ser una oportunidad para mejorar el requisito."
  },
  {
    module: "Resolución de Escenarios",
    question: "El equipo quiere mejorar la cobertura de pruebas de regresión automatizadas. ¿Qué tipo de casos de prueba son los mejores candidatos para automatizar primero?",
    options: ["Casos de prueba que se ejecutan una sola vez.", "Funcionalidades que son complejas y cambian constantemente.", "Los flujos críticos del negocio que son repetitivos, estables y cubren las funcionalidades más importantes (ej. login, compra).", "Pruebas de usabilidad y diseño visual."],
    correctAnswer: "Los flujos críticos del negocio que son repetitivos, estables y cubren las funcionalidades más importantes (ej. login, compra).",
    explanation: "La automatización debe tener un buen retorno de inversión. Se deben priorizar las pruebas que ahorran más tiempo y reducen más riesgo al ejecutarse de forma frecuente, como los 'happy paths' y funcionalidades clave del sistema."
  },
  {
    module: "Resolución de Escenarios",
    question: "Se implementa un nuevo formulario de registro. Aplicando técnicas de prueba, ¿cuál de las siguientes estrategias sería la más completa?",
    options: ["Solo probar el 'happy path' con datos válidos.", "Probar los límites de cada campo (ej. longitud de contraseña), particiones de equivalencia (emails válidos/inválidos) y la lógica de negocio con tablas de decisión (ej. edad mínima).", "Solo probar con todos los campos vacíos.", "Verificar que los colores de los botones sean correctos."],
    correctAnswer: "Probar los límites de cada campo (ej. longitud de contraseña), particiones de equivalencia (emails válidos/inválidos) y la lógica de negocio con tablas de decisión (ej. edad mínima).",
    explanation: "Una buena estrategia de pruebas combina múltiples técnicas de caja negra para cubrir no solo el flujo exitoso, sino también los casos de error, los valores límite y las reglas de negocio complejas de manera eficiente."
  },
  {
    module: "Resolución de Escenarios",
    question: "Constantemente aparecen defectos en producción en un módulo específico. ¿Qué acción estratégica propondrías al equipo?",
    options: ["Pedir que se reescriba todo el módulo desde cero.", "Culpar al desarrollador responsable de ese módulo.", "Proponer un análisis de causa raíz de los defectos y sugerir mejoras como aumentar la cobertura de pruebas unitarias y de integración en esa área.", "Contratar más testers manuales para revisar ese módulo."],
    correctAnswer: "Proponer un análisis de causa raíz de los defectos y sugerir mejoras como aumentar la cobertura de pruebas unitarias y de integración en esa área.",
    explanation: "Un QA estratégico no solo encuentra defectos, sino que ayuda a prevenir que ocurran en el futuro. Analizar patrones de fallos y proponer mejoras en el proceso (como aplicar el principio de 'agrupación de defectos') es clave."
  },
  {
    module: "Resolución de Escenarios",
    question: "Tienes que estimar el esfuerzo de prueba para una nueva historia de usuario. ¿En qué basarías tu estimación?",
    options: ["En un número al azar.", "Solo en la cantidad de líneas de código que se cambiarán.", "En la complejidad de la funcionalidad, los riesgos asociados, las dependencias con otros sistemas y los criterios de aceptación.", "En cuánto tiempo tardó el desarrollador en codificarla."],
    correctAnswer: "En la complejidad de la funcionalidad, los riesgos asociados, las dependencias con otros sistemas y los criterios de aceptación.",
    explanation: "Una buena estimación de pruebas es multifactorial. Considera la complejidad, el impacto potencial de un fallo (riesgo), cuántos otros sistemas podrían verse afectados y qué tan claros y extensos son los requisitos a validar."
  },
  {
    module: "Resolución de Escenarios",
    question: "Un test automatizado de UI falla de forma intermitente. A veces pasa, a veces no. ¿Cuál es la causa más probable?",
    options: ["El bug es real pero solo aparece a veces.", "Problemas de sincronización: el script intenta interactuar con un elemento antes de que esté completamente cargado en la página.", "La aplicación no tiene errores.", "La herramienta de automatización está corrupta."],
    correctAnswer: "Problemas de sincronización: el script intenta interactuar con un elemento antes de que esté completamente cargado en la página.",
    explanation: "La inestabilidad (flakiness) en las pruebas de UI es a menudo causada por problemas de 'timing' o esperas. El script es más rápido que la aplicación. Implementar esperas explícitas o dinámicas (explicit/fluent waits) es la solución común."
  },
  {
    module: "Resolución de Escenarios",
    question: "El Product Owner te pide que 'pruebes todo' antes de un lanzamiento importante. ¿Cómo respondes?",
    options: ["Aceptas y trabajas 24/7 para intentarlo.", "Le explicas que las pruebas exhaustivas son imposibles (uno de los 7 principios) y propones enfocar los esfuerzos en las áreas de mayor riesgo y en las funcionalidades más críticas.", "Dices que no es tu trabajo definir el alcance.", "Pides duplicar el tamaño del equipo de QA."],
    correctAnswer: "Le explicas que las pruebas exhaustivas son imposibles (uno de los 7 principios) y propones enfocar los esfuerzos en las áreas de mayor riesgo y en las funcionalidades más críticas.",
    explanation: "Parte del rol de un QA es educar al equipo sobre los principios de las pruebas. Una respuesta profesional se enfoca en la gestión de riesgos para maximizar el valor de las pruebas con los recursos y el tiempo disponibles."
  },

  // Módulo 7: Metodologías Ágiles y Scrum (9 preguntas)
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Cuál es el rol principal del Product Owner en un equipo Scrum?",
    options: ["Gestionar al equipo de desarrollo.", "Asegurar que el equipo siga las reglas de Scrum.", "Maximizar el valor del producto gestionando el Product Backlog.", "Escribir el código de las historias de usuario."],
    correctAnswer: "Maximizar el valor del producto gestionando el Product Backlog.",
    explanation: "El Product Owner es la voz del cliente. Su responsabilidad es definir y priorizar los elementos del Product Backlog para asegurar que el equipo de desarrollo construya el producto más valioso posible."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Cuál es el propósito de la 'Sprint Retrospective'?",
    options: ["Planificar el trabajo para el próximo Sprint.", "Demostrar el incremento del producto a los stakeholders.", "Inspeccionar el último Sprint y crear un plan de mejoras para el siguiente.", "Sincronizar el trabajo diario del equipo de desarrollo."],
    correctAnswer: "Inspeccionar el último Sprint y crear un plan de mejoras para el siguiente.",
    explanation: "La Retrospectiva es una reunión para el equipo Scrum donde se reflexiona sobre qué funcionó bien, qué no, y qué se puede mejorar en el proceso para el próximo Sprint. Es un pilar de la mejora continua."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "La 'Daily Scrum' (reunión diaria) es un evento para:",
    options: ["Reportar el estado del proyecto al Product Owner.", "El equipo de desarrollo, para planificar el trabajo de las próximas 24 horas.", "Los stakeholders, para que den su feedback.", "Asignar nuevas tareas al equipo."],
    correctAnswer: "El equipo de desarrollo, para planificar el trabajo de las próximas 24 horas.",
    explanation: "El propósito de la Daily es que el equipo de desarrollo se sincronice, inspeccione el progreso hacia el Sprint Goal y ajuste su plan para el día. No es una reunión de reporte de estado."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Qué es el 'Product Backlog'?",
    options: ["Una lista de todos los defectos encontrados en el producto.", "Un plan detallado y fijo para todo el proyecto.", "Una lista ordenada y emergente de todo lo que se conoce que es necesario en el producto.", "El conjunto de tareas técnicas para un Sprint."],
    correctAnswer: "Una lista ordenada y emergente de todo lo que se conoce que es necesario en el producto.",
    explanation: "Es la única fuente de requisitos para cualquier cambio a realizarse en el producto. Es dinámico y su contenido y priorización pueden cambiar con el tiempo a medida que se aprende más."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "El 'Definition of Done' (DoD) es:",
    options: ["Una lista de tareas que debe completar el Product Owner.", "Un entendimiento compartido por todo el equipo Scrum sobre qué significa que el trabajo está completo y listo para ser entregado.", "Una checklist que solo usa el QA.", "El momento en que se termina el Sprint."],
    correctAnswer: "Un entendimiento compartido por todo el equipo Scrum sobre qué significa que el trabajo está completo y listo para ser entregado.",
    explanation: "El DoD es un estándar de calidad. Asegura que todos en el equipo tengan la misma idea de lo que implica 'terminado', incluyendo codificación, pruebas, documentación, etc., para cada elemento del backlog."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Cuál de las siguientes afirmaciones es uno de los valores del Manifiesto Ágil?",
    options: ["Seguir un plan por encima de la respuesta al cambio.", "Procesos y herramientas por encima de individuos e interacciones.", "Colaboración con el cliente por encima de la negociación de contratos.", "Documentación exhaustiva por encima de software funcionando."],
    correctAnswer: "Colaboración con el cliente por encima de la negociación de contratos.",
    explanation: "El Manifiesto Ágil valora los elementos de la derecha, pero valora más los de la izquierda. Los cuatro valores son: Individuos e interacciones, Software funcionando, Colaboración con el cliente y Respuesta al cambio."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "En el contexto de un 'Agile Tester', ¿cuál de estas mentalidades es la más adecuada?",
    options: ["Actuar como un 'guardián de la calidad' al final del proceso.", "Prevenir defectos colaborando con el equipo desde el inicio, en lugar de solo encontrarlos al final.", "Escribir la mayor cantidad de casos de prueba posibles, sin importar su relevancia.", "Automatizar todas las pruebas, sin excepción."],
    correctAnswer: "Prevenir defectos colaborando con el equipo desde el inicio, en lugar de solo encontrarlos al final.",
    explanation: "Un Agile Tester adopta un enfoque de 'shift-left', participando activamente en la definición de requisitos y colaborando con los desarrolladores para construir la calidad en el producto desde el principio."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Cuál es el rol principal del Scrum Master?",
    options: ["Es el jefe del proyecto y asigna tareas.", "Se asegura de que el equipo siga los valores y prácticas de Scrum, eliminando impedimentos.", "Decide qué funcionalidades se construirán en el producto.", "Es el responsable de las pruebas de aceptación."],
    correctAnswer: "Se asegura de que el equipo siga los valores y prácticas de Scrum, eliminando impedimentos.",
    explanation: "El Scrum Master es un líder servicial. Su función es facilitar el proceso de Scrum, proteger al equipo de interrupciones externas y ayudar a eliminar cualquier obstáculo que impida su progreso."
  },
  {
    module: "Metodologías Ágiles y Scrum",
    question: "¿Qué artefacto de Scrum se crea durante la Sprint Planning?",
    options: ["El Product Backlog.", "El Sprint Backlog.", "El incremento del producto.", "La Definition of Done."],
    correctAnswer: "El Sprint Backlog.",
    explanation: "El Sprint Backlog es el conjunto de elementos del Product Backlog seleccionados para el Sprint, más un plan para entregar el incremento del producto y realizar el Sprint Goal. Es el plan de trabajo del equipo de desarrollo para el Sprint."
  }
];


const MODULE_ORDER = [
  "Fundamentos de Pruebas",
  "Pruebas en el Ciclo de Vida",
  "Técnicas de Prueba",
  "Gestión de Pruebas",
  "Automatización y Herramientas",
  "Resolución de Escenarios",
  "Metodologías Ágiles y Scrum"
];

const STUDY_SUGGESTIONS: { [key: string]: { title: string; description: string; steps: string[] } } = {
  "Fundamentos de Pruebas": {
    title: "Reforzar los Pilares del Testing",
    description: "Estos conceptos son la base de todo el trabajo de QA. Dominarlos te permitirá tomar mejores decisiones y comunicarte de forma más efectiva.",
    steps: [
      "Memoriza y entiende los 7 Principios de ISTQB. Intenta dar un ejemplo práctico de cada uno.",
      "Dibuja un diagrama explicando la diferencia entre Pruebas Estáticas (revisiones) y Dinámicas (ejecución).",
      "Lee sobre el Proceso de Pruebas Fundamental y cómo se aplica en un proyecto real."
    ]
  },
  "Pruebas en el Ciclo de Vida": {
    title: "Entender el Cuándo y el Porqué de las Pruebas",
    description: "Saber qué tipo de prueba aplicar en cada momento del ciclo de vida es clave para la eficiencia y la detección temprana de errores.",
    steps: [
      "Compara el Modelo V y un ciclo de vida Ágil (Scrum). ¿Dónde encajan las pruebas en cada uno?",
      "Crea un mapa mental de los Niveles de Prueba (Componente, Integración, Sistema, Aceptación).",
      "Define con tus propias palabras la diferencia entre Pruebas Funcionales y No Funcionales (rendimiento, usabilidad, seguridad)."
    ]
  },
  "Técnicas de Prueba": {
    title: "Diseñar Pruebas Inteligentes, no solo Abundantes",
    description: "No se trata de probarlo todo, sino de probar lo correcto. Estas técnicas te ayudan a maximizar la detección de errores con el mínimo esfuerzo.",
    steps: [
      "Toma un formulario simple (ej. un login) y aplica Partición de Equivalencia y Análisis de Valores Límite.",
      "Explica la diferencia entre Caja Negra (sin ver el código) y Caja Blanca (viendo el código).",
      "Busca un ejemplo de una Tabla de Decisión y entiende cómo ayuda a simplificar reglas de negocio complejas."
    ]
  },
  "Gestión de Pruebas": {
    title: "Organizar, Planificar y Comunicar la Calidad",
    description: "Un buen QA no solo ejecuta pruebas, también las gestiona. Esto implica planificar, reportar y entender el proceso de desarrollo.",
    steps: [
      "Busca una plantilla de 'Plan de Pruebas' y familiarízate con sus secciones (alcance, riesgos, criterios de salida).",
      "Analiza el ciclo de vida de un defecto (Nuevo -> Asignado -> Corregido -> Verificado -> Cerrado).",
      "Investiga qué son los 'Criterios de Aceptación' en una Historia de Usuario y por qué son tan importantes para QA."
    ]
  },
  "Automatización y Herramientas": {
    title: "Potenciar el Testing con Tecnología",
    description: "La automatización es una habilidad clave en el mercado actual. Entender sus conceptos y herramientas te abrirá muchas puertas.",
    steps: [
      "Dibuja y explica la Pirámide de Automatización de Pruebas (Unitaria, API, UI).",
      "Investiga qué es Selenium y para qué se usa. Haz lo mismo con Postman.",
      "Lee sobre el patrón de diseño 'Page Object Model' (POM) y por qué es tan importante para mantener el código de automatización."
    ]
  },
  "Resolución de Escenarios": {
    title: "Aplicar el Conocimiento en el Mundo Real",
    description: "Esta área mide tu experiencia y tu capacidad para tomar decisiones. Se mejora enfrentando problemas reales y pensando críticamente.",
    steps: [
      "Piensa en el último bug complicado que encontraste. ¿Cómo lo comunicaste? ¿Cómo se podría haber prevenido?",
      "Practica el 'pensamiento basado en riesgos'. Para una nueva funcionalidad, haz una lista de '¿qué es lo peor que podría pasar?'.",
      "Cuando dudes sobre un requisito, escribe la pregunta que le harías al Product Owner. La comunicación clara es una habilidad clave."
    ]
  },
  "Metodologías Ágiles y Scrum": {
    title: "Dominar el Framework Ágil",
    description: "Comprender Scrum y la mentalidad ágil es fundamental, ya que es el entorno donde la mayoría de los equipos de QA operan hoy en día.",
    steps: [
        "Memoriza los 3 roles de Scrum (Product Owner, Scrum Master, Equipo de Desarrollo) y sus responsabilidades.",
        "Dibuja el ciclo de un Sprint, incluyendo los 4 eventos principales: Planning, Daily, Review y Retrospective.",
        "Lee el Manifiesto Ágil y reflexiona sobre cómo sus valores impactan el trabajo diario de un tester."
    ]
  }
};


// --- Type Definitions ---
type Question = {
  module: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

type AppState = 'login' | 'register' | 'welcome' | 'quiz' | 'results' | 'dashboard';
type User = {
  name: string;
  role: 'user' | 'admin';
};

type EvaluationResult = {
  id: number;
  userName: string;
  score: number;
  total: number;
  level: string;
  date: string;
};

type QuizProgress = {
    index: number;
    answers: string[];
};

// --- UI Components ---

const LoginScreen = ({ onLogin, onNavigateToRegister }: { onLogin: (user: User) => void, onNavigateToRegister: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const name = email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Usuario';
        const role = email.toLowerCase() === 'admin@test.com' ? 'admin' : 'user';
        onLogin({ name, role });
    };

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Iniciar Sesión</h1>
            <p className="text-slate-600 mb-8">Ingresa a tu cuenta para continuar.</p>
            <form onSubmit={handleSubmit} className="text-left space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="user@test.com o admin@test.com"
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                    <input 
                        type="password" 
                        id="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
                >
                    Ingresar
                </button>
            </form>
            <p className="mt-6 text-sm">
                ¿No tienes una cuenta?{' '}
                <button onClick={onNavigateToRegister} className="font-medium text-teal-600 hover:text-teal-500">
                    Regístrate aquí
                </button>
            </p>
        </div>
    );
};

const RegisterScreen = ({ onRegister, onNavigateToLogin }: { onRegister: (user: User) => void, onNavigateToLogin: () => void }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onRegister({ name, role: 'user' });
    };

    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Crear Cuenta</h1>
            <p className="text-slate-600 mb-8">Completa tus datos para registrarte.</p>
            <form onSubmit={handleSubmit} className="text-left space-y-4">
                 <div>
                    <label htmlFor="name" className="block text-sm font-medium text-slate-700">Nombre</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">Email</label>
                    <input 
                        type="email" 
                        id="reg-email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <div>
                    <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                    <input 
                        type="password" 
                        id="reg-password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
                >
                    Registrarse
                </button>
            </form>
            <p className="mt-6 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <button onClick={onNavigateToLogin} className="font-medium text-teal-600 hover:text-teal-500">
                    Inicia sesión
                </button>
            </p>
        </div>
    );
};


const WelcomeScreen = ({ user, onStartNew, onContinue, hasSavedProgress, onLogout, onNavigateToDashboard }: { 
    user: User, 
    onStartNew: () => void, 
    onContinue: () => void,
    hasSavedProgress: boolean,
    onLogout: () => void, 
    onNavigateToDashboard: () => void 
}) => (
  <div className="text-center">
    <div className="absolute top-4 right-4">
        <button onClick={onLogout} className="text-sm font-medium text-teal-600 hover:text-teal-500">Cerrar Sesión</button>
    </div>
    <h1 className="text-4xl font-bold text-slate-900 mb-2">¡Bienvenido, {user.name}!</h1>
    <p className="text-slate-600 mb-8">{hasSavedProgress ? "Tienes una evaluación en progreso." : "Pon a prueba tus habilidades e identifica áreas de crecimiento."}</p>
    <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
        {hasSavedProgress ? (
            <>
                <button
                    onClick={onContinue}
                    className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
                >
                    Continuar Evaluación
                </button>
                <button
                    onClick={onStartNew}
                    className="bg-gray-200 text-gray-800 font-bold py-3 px-8 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all"
                >
                    Comenzar de Nuevo
                </button>
            </>
        ) : (
             <button
              onClick={onStartNew}
              className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all transform hover:scale-105"
            >
              Comenzar Evaluación
            </button>
        )}

        {user.role === 'admin' && (
            <button
                onClick={onNavigateToDashboard}
                className="bg-slate-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all transform hover:scale-105"
            >
              Ver Dashboard
            </button>
        )}
    </div>
  </div>
);

const QuizScreen = ({ 
    question, 
    questionIndex, 
    totalQuestions, 
    onNext, 
    onSaveAndExit 
} : {
    question: Question,
    questionIndex: number,
    totalQuestions: number,
    onNext: (selectedAnswer: string) => void,
    onSaveAndExit: () => void
}) => {
  const [currentSelection, setCurrentSelection] = useState<string | null>(null);

  const handleNextClick = () => {
    if (currentSelection === null) return;
    onNext(currentSelection);
    setCurrentSelection(null); // Reset selection for next question
  };
  
  const isLastQuestion = questionIndex === totalQuestions - 1;

  useEffect(() => {
      // Reset selection when question changes
      setCurrentSelection(null);
  }, [question]);

  return (
    <div className="w-full">
       <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-slate-500 font-medium">Pregunta {questionIndex + 1} de {totalQuestions}</p>
            <div>
                <button onClick={onSaveAndExit} className="text-sm font-medium text-teal-600 hover:text-teal-500 mr-4">Guardar y Salir</button>
                <span className="text-xs font-semibold bg-teal-100 text-teal-800 px-2 py-1 rounded-full">{question.module}</span>
            </div>
        </div>
        <h2 className="text-2xl font-semibold mt-1">{question.question}</h2>
      </div>
      <div className="space-y-3 mb-8">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => setCurrentSelection(option)}
            aria-pressed={currentSelection === option}
            className={`w-full text-left p-4 border rounded-lg transition-all ${
              currentSelection === option
                ? 'bg-teal-100 border-teal-500 ring-2 ring-teal-300 text-teal-800'
                : 'bg-white border-slate-300 hover:bg-slate-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={handleNextClick}
        disabled={currentSelection === null}
        className="w-full bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed"
      >
        {isLastQuestion ? 'Finalizar Evaluación' : 'Siguiente Pregunta'}
      </button>
    </div>
  );
};

const ResultsScreen = ({ userAnswers, onRestart, onFinishEvaluation }: { userAnswers: string[]; onRestart: () => void, onFinishEvaluation: (score: number, total: number, level: string) => void }) => {
  const [showReview, setShowReview] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const resultsContentRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    let score = 0;
    const moduleResults: { [key: string]: { correct: number, total: number } } = {};

    QA_QUESTIONS.forEach((q, index) => {
      if (!moduleResults[q.module]) {
        moduleResults[q.module] = { correct: 0, total: 0 };
      }
      moduleResults[q.module].total++;

      if (userAnswers[index] === q.correctAnswer) {
        score++;
        moduleResults[q.module].correct++;
      }
    });
    
    const percentage = Math.round((score / QA_QUESTIONS.length) * 100);
    
    let level = 'Trainee';
    let levelColor = 'bg-red-500';
    if (percentage > 75) {
        level = 'Senior';
        levelColor = 'bg-green-600';
    } else if (percentage > 50) {
        level = 'Semi-Senior (Ssr)';
        levelColor = 'bg-blue-500';
    } else if (percentage > 25) {
        level = 'Junior (Jr)';
        levelColor = 'bg-yellow-500';
    }

    const sortedModuleResults = MODULE_ORDER.map(moduleName => {
        const result = moduleResults[moduleName];
        const modulePercentage = result ? Math.round((result.correct / result.total) * 100) : 0;
        return { name: moduleName, ...result, percentage: modulePercentage };
    });
    
    const improvementAreas = [...sortedModuleResults].sort((a,b) => a.percentage - b.percentage);
    const areasToImprove = (level === 'Trainee' || level === 'Junior (Jr)') ? improvementAreas.slice(0, 2) : improvementAreas.slice(0, 1);

    return { score, percentage, level, levelColor, moduleResults: sortedModuleResults, areasToImprove };
  }, [userAnswers]);

  // Effect to call onFinishEvaluation once when component mounts
  React.useEffect(() => {
    onFinishEvaluation(results.score, QA_QUESTIONS.length, results.level);
  }, []);

  const handleDownloadPdf = () => {
      if (!resultsContentRef.current) return;
      setIsGeneratingPdf(true);

      html2canvas(resultsContentRef.current, { scale: 2 }).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF({
              orientation: 'portrait',
              unit: 'px',
              format: [canvas.width, canvas.height]
          });
          pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
          pdf.save(`Resultados-Evaluacion-QA.pdf`);
          setIsGeneratingPdf(false);
      }).catch(err => {
          console.error("Error al generar PDF:", err);
          setIsGeneratingPdf(false);
      });
  };

  return (
    <div className="w-full text-center">
      <div ref={resultsContentRef} className="bg-white p-4">
        <h2 className="text-3xl font-bold mb-3">Evaluación Completada</h2>
        <div className="mb-6">
          <span className="text-sm font-medium text-slate-600">Nivel Alcanzado</span>
          <p className={`inline-block text-white text-lg font-bold px-4 py-1 rounded-full ml-2 ${results.levelColor}`}>{results.level}</p>
        </div>
        
        <div className="bg-teal-50 p-6 rounded-xl mb-8">
          <p className="text-lg font-medium text-slate-700">Tu Puntuación General</p>
          <p className="text-6xl font-bold text-teal-600 my-2">{results.score} <span className="text-3xl font-medium text-slate-500">/ {QA_QUESTIONS.length}</span></p>
          <p className="text-xl font-semibold text-slate-600">{results.percentage}%</p>
        </div>

        <div className="text-left space-y-6 mb-8">
            <h3 className="text-xl font-bold text-center">Desglose por Módulo</h3>
            {results.moduleResults.map((mod, index) => (
               <div key={index} className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-slate-800">{mod.name}</p>
                      <p className="text-sm font-medium text-slate-600">{mod.correct} / {mod.total}</p>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                      <div className="bg-teal-600 h-2.5 rounded-full" style={{width: `${mod.percentage}%`}}></div>
                  </div>
               </div>
            ))}
        </div>
        
        {results.areasToImprove.length > 0 && (
          <div className="text-left bg-amber-50 border-l-4 border-amber-400 p-4 rounded-lg mb-8">
              <h3 className="text-xl font-bold text-amber-900 mb-2">Plan de Mejora Sugerido</h3>
              {results.areasToImprove.map((area, index) => {
                  const suggestion = STUDY_SUGGESTIONS[area.name];
                  return (
                      <div key={index} className={index > 0 ? "mt-4" : ""}>
                          <h4 className="font-bold text-slate-800 text-lg">{suggestion.title}</h4>
                          <p className="text-slate-700 text-sm mt-1 mb-2">{suggestion.description}</p>
                          <ul className="list-disc list-inside text-sm space-y-1 text-slate-600">
                              {suggestion.steps.map((step, i) => <li key={i}>{step}</li>)}
                          </ul>
                      </div>
                  )
              })}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
        <button
          onClick={onRestart}
          className="bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-300 transition-all"
        >
          Intentar de Nuevo
        </button>
         <button
          onClick={handleDownloadPdf}
          disabled={isGeneratingPdf}
          className="bg-gray-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all disabled:bg-gray-400"
        >
          {isGeneratingPdf ? 'Generando PDF...' : 'Descargar Resultados en PDF'}
        </button>
        <button
          onClick={() => setShowReview(!showReview)}
          className="bg-slate-200 text-slate-800 font-bold py-3 px-8 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-4 focus:ring-slate-300 transition-all"
        >
          {showReview ? 'Ocultar Revisión' : 'Revisar Mis Respuestas'}
        </button>
      </div>

      {showReview && (
        <div className="text-left mt-8 space-y-6">
            <h3 className="text-2xl font-bold text-center">Revisión Detallada</h3>
            {QA_QUESTIONS.map((q, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;
                return (
                    <div key={index} className={`p-4 rounded-lg border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}>
                        <p className="font-bold text-slate-800">{index + 1}. {q.question}</p>
                        <p className={`mt-2 font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                            Tu respuesta: {isCorrect ? '✔️' : '✘'} {userAnswer}
                        </p>
                        {!isCorrect && (
                            <p className="mt-1 font-medium text-green-700">
                                Respuesta correcta: {q.correctAnswer}
                            </p>
                        )}
                         <div className="mt-3 bg-slate-100 p-3 rounded-md text-sm">
                            <p className="font-semibold text-slate-700">Explicación:</p>
                            <p className="text-slate-600">{q.explanation}</p>
                        </div>
                    </div>
                )
            })}
        </div>
      )}
    </div>
  );
};

const AdminDashboard = ({ onBack, evaluations, adminEmail, onEmailChange }: { onBack: () => void; evaluations: EvaluationResult[]; adminEmail: string; onEmailChange: (email: string) => void; }) => {
  const [emailInput, setEmailInput] = useState(adminEmail);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleEmailSave = (e: React.FormEvent) => {
      e.preventDefault();
      onEmailChange(emailInput);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
  };
  
  const stats = useMemo(() => {
      const totalAssessments = evaluations.length;
      if(totalAssessments === 0) return { totalAssessments: 0, averageScore: 0, scoreDistribution: [] };

      const totalScore = evaluations.reduce((sum, e) => sum + (e.score / e.total * 100), 0);
      const averageScore = totalScore / totalAssessments;
      
      const distribution = { 'Trainee': 0, 'Junior (Jr)': 0, 'Semi-Senior (Ssr)': 0, 'Senior': 0 };
      evaluations.forEach(e => {
        if (distribution.hasOwnProperty(e.level)) {
            distribution[e.level as keyof typeof distribution]++;
        }
      });

      return {
          totalAssessments,
          averageScore: parseFloat(averageScore.toFixed(1)),
          scoreDistribution: [
              { range: 'Trainee', count: distribution.Trainee },
              { range: 'Junior (Jr)', count: distribution['Junior (Jr)'] },
              { range: 'Ssr', count: distribution['Semi-Senior (Ssr)'] },
              { range: 'Senior', count: distribution.Senior },
          ]
      }
  }, [evaluations]);

  const maxCount = Math.max(...stats.scoreDistribution.map(d => d.count), 1);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Dashboard de Administrador</h2>
        <button onClick={onBack} className="text-sm font-medium text-teal-600 hover:text-teal-500">
            &larr; Volver
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-50 p-6 rounded-xl text-center">
            <p className="text-lg font-medium text-slate-700">Evaluaciones Completadas</p>
            <p className="text-5xl font-bold text-slate-900 mt-2">{stats.totalAssessments}</p>
        </div>
        <div className="bg-slate-50 p-6 rounded-xl text-center">
            <p className="text-lg font-medium text-slate-700">Promedio General</p>
            <p className="text-5xl font-bold text-slate-900 mt-2">{stats.averageScore}%</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-slate-50 p-6 rounded-xl">
          <h3 className="text-xl font-bold mb-4">Distribución de Niveles</h3>
          <div className="flex items-end space-x-4 h-48">
              {stats.scoreDistribution.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                      <p className="text-sm font-bold text-slate-700">{data.count}</p>
                      <div 
                          className="w-full bg-teal-400 rounded-t-md mt-1"
                          style={{ height: `${(data.count / maxCount) * 100}%` }}
                          title={`Cantidad: ${data.count}`}
                      ></div>
                      <p className="text-xs mt-2 text-slate-600 font-medium">{data.range}</p>
                  </div>
              ))}
          </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-xl">
            <h3 className="text-xl font-bold mb-4">Configuración</h3>
            <form onSubmit={handleEmailSave}>
                <label htmlFor="admin-email" className="block text-sm font-medium text-slate-700 mb-1">Email para Notificaciones</label>
                <input 
                    type="email"
                    id="admin-email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin.email@ejemplo.com"
                    className="block w-full px-3 py-2 bg-white border border-slate-300 rounded-md shadow-sm"
                />
                <button type="submit" className="mt-3 w-full bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800">
                    Guardar Email
                </button>
                {showConfirmation && <p className="text-sm text-green-600 mt-2">¡Email guardado con éxito!</p>}
            </form>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Evaluaciones Recientes</h3>
        <div className="bg-slate-50 p-4 rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-700 uppercase">
                    <tr>
                        <th scope="col" className="px-6 py-3">Nombre</th>
                        <th scope="col" className="px-6 py-3">Puntaje</th>
                        <th scope="col" className="px-6 py-3">Nivel</th>
                        <th scope="col" className="px-6 py-3">Fecha</th>
                    </tr>
                </thead>
                <tbody>
                    {evaluations.length > 0 ? (
                        [...evaluations].reverse().map(e => (
                             <tr key={e.id} className="bg-white border-b last:border-b-0">
                                <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{e.userName}</td>
                                <td className="px-6 py-4">{e.score} / {e.total}</td>
                                <td className="px-6 py-4">{e.level}</td>
                                <td className="px-6 py-4">{e.date}</td>
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-500">Aún no hay evaluaciones completadas.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---

const App = () => {
  const [appState, setAppState] = useState<AppState>('login');
  const [user, setUser] = useState<User | null>(null);
  const [allEvaluations, setAllEvaluations] = useState<EvaluationResult[]>([
    {id: 1, userName: "Ana Gomez", score: 52, total: 63, level: "Senior", date: new Date(Date.now() - 86400000).toLocaleDateString()},
    {id: 2, userName: "Luis Castro", score: 37, total: 63, level: "Semi-Senior (Ssr)", date: new Date(Date.now() - 172800000).toLocaleDateString()},
    {id: 3, userName: "Carla Diaz", score: 21, total: 63, level: "Junior (Jr)", date: new Date(Date.now() - 259200000).toLocaleDateString()},
  ]);
  const [adminEmail, setAdminEmail] = useState('');

  // State for quiz progress
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [savedProgress, setSavedProgress] = useState<QuizProgress | null>(null);

  const clearProgress = (currentUser: User | null) => {
      const userToClear = currentUser || user;
      if (userToClear) {
        localStorage.removeItem(`qa-quiz-progress-${userToClear.name}`);
      }
      setSavedProgress(null);
      setCurrentQuestionIndex(0);
      setQuizAnswers([]);
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    const progressJSON = localStorage.getItem(`qa-quiz-progress-${loggedInUser.name}`);
    if (progressJSON) {
      setSavedProgress(JSON.parse(progressJSON));
    } else {
      setSavedProgress(null);
    }
    setAppState('welcome');
  };

  const handleRegister = (registeredUser: User) => {
    setUser(registeredUser);
    setSavedProgress(null); // No progress for new users
    setAppState('welcome');
  };

  const handleLogout = () => {
    clearProgress(user);
    setUser(null);
    setAppState('login');
  };

  const handleStartNew = () => {
    clearProgress(user);
    setAppState('quiz');
  };

  const handleContinue = () => {
    if (savedProgress) {
        setCurrentQuestionIndex(savedProgress.index);
        setQuizAnswers(savedProgress.answers);
    }
    setAppState('quiz');
  };

  const handleSaveAndExit = () => {
    if (user) {
        const progress: QuizProgress = { index: currentQuestionIndex, answers: quizAnswers };
        localStorage.setItem(`qa-quiz-progress-${user.name}`, JSON.stringify(progress));
        setSavedProgress(progress);
    }
    setAppState('welcome');
  };
  
  const handleNextQuestion = (selectedAnswer: string) => {
    const newAnswers = [...quizAnswers, selectedAnswer];
    setQuizAnswers(newAnswers);

    if (user) {
        const progress: QuizProgress = { index: currentQuestionIndex + 1, answers: newAnswers };
        localStorage.setItem(`qa-quiz-progress-${user.name}`, JSON.stringify(progress));
    }
    
    if (currentQuestionIndex < QA_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Finished quiz
      clearProgress(user);
      setAppState('results');
    }
  };


  const handleFinishEvaluation = (score: number, total: number, level: string) => {
    if (!user) return;
    
    const mostRecentResult = allEvaluations[allEvaluations.length - 1];
    if(mostRecentResult && mostRecentResult.userName === user.name && mostRecentResult.score === score && mostRecentResult.date === new Date().toLocaleDateString()) {
      return;
    }
    
    const newEvaluation: EvaluationResult = {
        id: Date.now(),
        userName: user.name,
        score,
        total,
        level,
        date: new Date().toLocaleDateString()
    };
    setAllEvaluations(prev => [...prev, newEvaluation]);

    if (adminEmail) {
        console.log(`%c--- SIMULACIÓN DE ENVÍO DE CORREO ---`, 'color: #0d9488; font-weight: bold;');
        console.log(`Para: ${adminEmail}`);
        console.log(`Asunto: Nueva Evaluación Completada - ${user.name}`);
        console.log(`Contenido:`);
        console.log(`  - Usuario: ${user.name}`);
        console.log(`  - Puntaje: ${score}/${total}`);
        console.log(`  - Nivel: ${level}`);
        console.log(`------------------------------------`);
    }
  };


  const handleRestart = () => {
    clearProgress(user);
    setAppState('welcome');
  };

  const renderContent = () => {
    switch (appState) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setAppState('register')} />;
      case 'register':
        return <RegisterScreen onRegister={handleRegister} onNavigateToLogin={() => setAppState('login')} />;
      case 'welcome':
        return user ? <WelcomeScreen 
                        user={user} 
                        hasSavedProgress={!!savedProgress}
                        onContinue={handleContinue}
                        onStartNew={handleStartNew} 
                        onLogout={handleLogout} 
                        onNavigateToDashboard={() => setAppState('dashboard')} /> : null;
      case 'quiz':
        return <QuizScreen 
                  question={QA_QUESTIONS[currentQuestionIndex]}
                  questionIndex={currentQuestionIndex}
                  totalQuestions={QA_QUESTIONS.length}
                  onNext={handleNextQuestion}
                  onSaveAndExit={handleSaveAndExit}
                />;
      case 'results':
        return <ResultsScreen userAnswers={quizAnswers} onRestart={handleRestart} onFinishEvaluation={handleFinishEvaluation} />;
      case 'dashboard':
        return <AdminDashboard onBack={handleRestart} evaluations={allEvaluations} adminEmail={adminEmail} onEmailChange={setAdminEmail} />;
      default:
        return <LoginScreen onLogin={handleLogin} onNavigateToRegister={() => setAppState('register')} />;
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 transition-all relative">
        {renderContent()}
      </div>
    </main>
  );
};

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(<App />);