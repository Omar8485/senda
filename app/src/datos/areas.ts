// Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
// SPDX-License-Identifier: AGPL-3.0-or-later

// Áreas de vida (Valued Living Questionnaire, más "transversal"), con nombre y ayuda.

import type { Area } from './esquemas'

export const INFO_AREAS: Record<Area, { nombre: string; ayuda: string }> = {
  'familia-origen': { nombre: 'Familia de origen (padres, hermanos)', ayuda: 'Tu relación con tus padres, hermanos y la familia con la que creciste. No incluye a tu pareja ni a tus hijos, que tienen área propia.' },
  pareja: { nombre: 'Pareja', ayuda: 'Tu relación de pareja: matrimonio, convivencia o relación íntima.' },
  crianza: { nombre: 'Crianza de mis hijos', ayuda: 'Cómo educas y acompañas a tus hijos o a los niños a tu cargo.' },
  amistades: { nombre: 'Amistades', ayuda: 'Tus amigos y tu vida social.' },
  trabajo: { nombre: 'Trabajo', ayuda: 'Tu empleo, tu carrera o tu actividad profesional.' },
  educacion: { nombre: 'Educación y formación', ayuda: 'Lo que estudias o aprendes: cursos, idiomas, certificaciones, lectura formativa.' },
  recreacion: { nombre: 'Recreación y ocio', ayuda: 'Descanso, juego, pasatiempos y diversión.' },
  espiritualidad: { nombre: 'Espiritualidad', ayuda: 'Lo que da sentido profundo a tu vida, sea religioso o no.' },
  ciudadania: { nombre: 'Ciudadanía y comunidad', ayuda: 'Tu aporte a tu comunidad, a la sociedad o al medio ambiente.' },
  'cuidado-fisico': { nombre: 'Cuidado físico (salud, sueño, ejercicio)', ayuda: 'Tu salud, sueño, alimentación y ejercicio.' },
  transversal: { nombre: 'En todas las áreas', ayuda: 'Valores que aplicas en cualquier área de tu vida, no solo en una. Ejemplo: cumplir a tiempo lo que prometes vale igual en el trabajo, con tu pareja o con tus amigos.' },
}

export const nombreArea = (a?: Area) => (a ? INFO_AREAS[a].nombre : 'Sin área')
