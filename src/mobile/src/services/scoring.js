/**
 * Sistema de puntuación y penalización de maestría escalable (Opción B) para FamiGest.
 * 
 * Reglas pedagógicas y matemáticas:
 * - El usuario inicia la lección con un potencial de maestría del 100%.
 * - Cada ejercicio evaluable (opción múltiple, cámara, etc.) tiene un peso base proporcional:
 *     pesoEjercicio = 100 / totalEvaluable
 * - Penalizaciones:
 *     - Errores en opción múltiple: descuentan de forma proporcional al valor del ejercicio.
 *     - Primer salto de cámara (postergado para reintento): penalización leve por reintento (~30% del valor del ejercicio).
 *     - Segundo salto de cámara (renuncia en ronda de reintentos): se califica como ejercicio FALLIDO (pérdida del 100% del valor de ese ejercicio).
 * - Piso de motivación: mínimo 10% para no desanimar al usuario principiante.
 */

export function calculateMasteryScore({
  totalEvaluable = 2,
  errorsCount = 0,
  skipsCount = 0,
  failedExercisesCount = 0,
}) {
  if (totalEvaluable <= 0) return 100;

  // Peso equitativo de cada ejercicio respecto al 100% total
  const exerciseWeight = 100 / totalEvaluable;

  // Penalización por cada error en opción múltiple (~30% del valor del ejercicio)
  const penaltyPerError = Math.max(5, Math.round((exerciseWeight / 3) * 0.9));

  // Penalización leve por primer salto (reintento al final)
  const penaltyPerSkip = Math.max(5, Math.round(exerciseWeight * 0.3));

  // Deducción total de puntos para ejercicios fallidos (segundo salto)
  const failedDeduction = failedExercisesCount * exerciseWeight;

  // Deducciones menores de errores y saltos
  const minorDeductions = (errorsCount * penaltyPerError) + (skipsCount * penaltyPerSkip);

  const totalDeductions = failedDeduction + minorDeductions;
  const finalScore = Math.max(10, Math.min(100, Math.round(100 - totalDeductions)));

  return finalScore;
}
