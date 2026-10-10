#!/usr/bin/env python3
# Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Validador del Modelo de Habilidades.

Revisa las fichas de modelo/catalogo/ y perfil/ contra las reglas 01-04:
esquema, identificadores, referencias cruzadas, topes de evidencia,
límite de trabajo en curso y vigencia.

Uso (desde la raíz del proyecto):
    pip install pyyaml
    python herramientas/validar.py

Sale con código 1 si hay errores. Las advertencias no bloquean.
"""
from __future__ import annotations

import datetime as dt
import sys
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover
    sys.exit("Falta PyYAML. Instálalo con: pip install pyyaml")

RAIZ = Path(__file__).resolve().parent.parent

AREAS_VIDA = {
    "familia-origen", "pareja", "crianza", "amistades", "trabajo",
    "educacion", "recreacion", "espiritualidad", "ciudadania", "cuidado-fisico",
}

TIPOS = {
    # tipo: (prefijo, carpeta relativa, campos obligatorios)
    "habilidad": ("hab-", "modelo/catalogo/habilidades",
                  ["nombre", "subtipo", "definicion", "funciones", "importancia", "estado", "version"]),
    "competencia": ("comp-", "modelo/catalogo/competencias",
                    ["nombre", "resultado", "contexto", "componentes", "estado", "version"]),
    "conocimiento": ("con-", "modelo/catalogo/conocimientos",
                     ["nombre", "definicion", "estado", "version"]),
    "campo": ("campo-", "modelo/catalogo/campos",
              ["nombre", "descripcion", "estado", "version"]),
    "valor": ("val-", "perfil/orientacion/valores",
              ["enunciado", "area_vida", "importancia", "consistencia", "fecha_evaluacion", "testigo_secreto"]),
    "principio": ("prin-", "perfil/orientacion/principios", ["enunciado"]),
    "direccion": ("dir-", "perfil/orientacion/direcciones", ["enunciado", "area_vida", "valores"]),
    "objetivo": ("obj-", "perfil/orientacion/objetivos",
                 ["enunciado", "area_vida", "valores", "criterio_cumplimiento", "fecha_limite", "estado", "exige"]),
    "inventario": ("inv-", "perfil/inventario",
                   ["ref", "nivel_actual", "confianza", "ultima_revision", "decision", "evidencias"]),
}

ENUMS = {
    ("habilidad", "subtipo"): {"cognitiva", "interpersonal", "motora", "metahabilidad"},
    ("*", "estado_ficha"): {"borrador", "revisada", "validada"},
    ("objetivo", "estado"): {"activo", "pausado", "logrado", "abandonado"},
    ("inventario", "confianza"): {"baja", "media", "alta"},
    ("inventario", "decision"): {"desarrollar", "mantener", "suficiente", "delegar", "descartar", "pendiente"},
    ("valor", "testigo_secreto"): {"si", "no", "dudoso"},
    ("evidencia", "tipo"): {"producto", "resultado", "retroalimentacion", "evaluacion", "autoobservacion", "formacion"},
}

MAX_DESARROLLAR = 3
MAX_DESARROLLAR_ALTO = 1   # subidas desde nivel >= 3
MESES_VIGENCIA = 12


class Informe:
    def __init__(self) -> None:
        self.errores: list[str] = []
        self.avisos: list[str] = []

    def error(self, ruta: Path | str, msg: str) -> None:
        self.errores.append(f"ERROR   {_rel(ruta)}: {msg}")

    def aviso(self, ruta: Path | str, msg: str) -> None:
        self.avisos.append(f"AVISO   {_rel(ruta)}: {msg}")


def _rel(ruta: Path | str) -> str:
    try:
        return str(Path(ruta).relative_to(RAIZ))
    except ValueError:
        return str(ruta)


def leer_frontmatter(ruta: Path) -> dict | None:
    texto = ruta.read_text(encoding="utf-8")
    if not texto.startswith("---"):
        return None
    partes = texto.split("---", 2)
    if len(partes) < 3:
        return None
    datos = yaml.safe_load(partes[1])
    return datos if isinstance(datos, dict) else None


def como_fecha(valor) -> dt.date | None:
    if isinstance(valor, dt.date):
        return valor
    try:
        return dt.date.fromisoformat(str(valor))
    except ValueError:
        return None


def cargar_funciones(inf: Informe) -> set[str]:
    ruta = RAIZ / "modelo" / "familias.md"
    if not ruta.exists():
        inf.aviso(ruta, "no existe; no se validan las funciones de las habilidades")
        return set()
    datos = leer_frontmatter(ruta) or {}
    return {f["id"] for f in datos.get("funciones", []) if isinstance(f, dict) and "id" in f}


def cargar_fichas(inf: Informe) -> dict[str, tuple[Path, dict]]:
    fichas: dict[str, tuple[Path, dict]] = {}
    for base in ("modelo/catalogo", "perfil"):
        for ruta in sorted((RAIZ / base).rglob("*.md")):
            if ruta.name.lower() in ("readme.md", "estado.md"):
                continue
            if "estrategia" in ruta.relative_to(RAIZ).parts:
                continue  # los planes son documentos en prosa, no fichas
            datos = leer_frontmatter(ruta)
            if datos is None:
                inf.error(ruta, "sin encabezado YAML válido")
                continue
            ident = datos.get("id")
            if not ident:
                inf.error(ruta, "falta 'id'")
                continue
            if ident != ruta.stem:
                inf.error(ruta, f"el id '{ident}' no coincide con el nombre del archivo")
            if ident in fichas:
                inf.error(ruta, f"id duplicado (también en {_rel(fichas[ident][0])})")
            fichas[ident] = (ruta, datos)
    return fichas


def validar_esquema(fichas, funciones, inf: Informe) -> None:
    for ident, (ruta, d) in fichas.items():
        tipo = d.get("tipo")
        if tipo not in TIPOS:
            inf.error(ruta, f"tipo desconocido '{tipo}'")
            continue
        prefijo, carpeta, obligatorios = TIPOS[tipo]
        if not ident.startswith(prefijo):
            inf.error(ruta, f"un '{tipo}' debe empezar por '{prefijo}'")
        if not _rel(ruta).replace("\\", "/").startswith(carpeta + "/"):
            inf.error(ruta, f"un '{tipo}' debe estar en {carpeta}/")
        for campo in obligatorios:
            if campo not in d or d[campo] is None or d[campo] == "":
                inf.error(ruta, f"falta el campo obligatorio '{campo}'")
        if "estado" in d and tipo in {"habilidad", "competencia", "conocimiento", "campo"}:
            if d["estado"] not in ENUMS[("*", "estado_ficha")]:
                inf.error(ruta, f"estado '{d['estado']}' inválido")

        if tipo == "habilidad":
            if d.get("subtipo") not in ENUMS[("habilidad", "subtipo")]:
                inf.error(ruta, f"subtipo '{d.get('subtipo')}' inválido")
            imp = d.get("importancia") or {}
            for eje in ("autonomia", "multiplicador"):
                v = imp.get(eje)
                if not isinstance(v, int) or not 0 <= v <= 3:
                    inf.error(ruta, f"importancia.{eje} debe ser un entero de 0 a 3")
            for f in d.get("funciones") or []:
                if funciones and f not in funciones:
                    inf.error(ruta, f"función desconocida '{f}' (ver modelo/familias.md)")
            if not d.get("funciones"):
                inf.aviso(ruta, "sin funciones asignadas")

        if tipo in {"valor", "direccion", "objetivo"} and d.get("area_vida") not in AREAS_VIDA:
            inf.error(ruta, f"area_vida '{d.get('area_vida')}' inválida")

        if tipo == "valor":
            for campo in ("importancia", "consistencia"):
                v = d.get(campo)
                if not isinstance(v, int) or not 1 <= v <= 10:
                    inf.error(ruta, f"{campo} debe ser un entero de 1 a 10")
            if d.get("testigo_secreto") not in ENUMS[("valor", "testigo_secreto")]:
                inf.error(ruta, "testigo_secreto debe ser si | no | dudoso")
            if d.get("testigo_secreto") == "no":
                inf.aviso(ruta, "no pasa la prueba del testigo secreto: ¿es un valor propio o un mandato ajeno?")

        if tipo == "objetivo":
            if d.get("estado") not in ENUMS[("objetivo", "estado")]:
                inf.error(ruta, f"estado '{d.get('estado')}' inválido")
            if d.get("estado") == "activo" and not como_fecha(d.get("fecha_limite")):
                inf.error(ruta, "un objetivo activo necesita fecha_limite válida")
            if not d.get("valores"):
                inf.aviso(ruta, "no declara a qué valor sirve")


def validar_referencias(fichas, inf: Informe) -> None:
    def existe(ruta, ref, contexto):
        if ref and ref not in fichas:
            inf.error(ruta, f"{contexto}: referencia inexistente '{ref}'")

    for ident, (ruta, d) in fichas.items():
        tipo = d.get("tipo")
        if tipo == "habilidad":
            existe(ruta, d.get("campo"), "campo")
            for r in d.get("requiere") or []:
                existe(ruta, r, "requiere")
        elif tipo == "conocimiento":
            existe(ruta, d.get("campo"), "campo")
        elif tipo == "competencia":
            comp = d.get("componentes") or {}
            for clave, escala in (("habilidades", 5), ("conocimientos", 3)):
                for item in comp.get(clave) or []:
                    existe(ruta, item.get("ref"), f"componentes.{clave}")
                    n = item.get("nivel")
                    if not isinstance(n, int) or not 0 <= n <= escala:
                        inf.error(ruta, f"nivel de {item.get('ref')} debe ser 0-{escala}")
            if len(comp.get("habilidades") or []) < 2:
                inf.aviso(ruta, "una competencia suele integrar al menos 2 habilidades (regla 01 §2.3)")
        elif tipo in {"direccion", "objetivo"}:
            for r in d.get("valores") or []:
                existe(ruta, r, "valores")
            if tipo == "objetivo":
                existe(ruta, d.get("direccion"), "direccion")
                for item in d.get("exige") or []:
                    existe(ruta, item.get("ref"), "exige")
        elif tipo == "inventario":
            existe(ruta, d.get("ref"), "ref")
            esperado = f"inv-{d.get('ref')}"
            if ident != esperado:
                inf.aviso(ruta, f"por convención el id debería ser '{esperado}'")


def validar_inventario(fichas, inf: Informe, hoy: dt.date) -> None:
    desarrollar = []
    for ident, (ruta, d) in fichas.items():
        if d.get("tipo") != "inventario":
            continue
        ref = str(d.get("ref") or "")
        escala = 3 if ref.startswith("con-") else 5
        nivel = d.get("nivel_actual")
        if not isinstance(nivel, int) or not 0 <= nivel <= escala:
            inf.error(ruta, f"nivel_actual debe ser 0-{escala} para '{ref}'")
            continue
        if d.get("confianza") not in ENUMS[("inventario", "confianza")]:
            inf.error(ruta, "confianza debe ser baja | media | alta")
        if d.get("decision") not in ENUMS[("inventario", "decision")]:
            inf.error(ruta, f"decision '{d.get('decision')}' inválida")

        evidencias = d.get("evidencias") or []
        for i, ev in enumerate(evidencias, 1):
            if ev.get("tipo") not in ENUMS[("evidencia", "tipo")]:
                inf.error(ruta, f"evidencia {i}: tipo '{ev.get('tipo')}' inválido")
            if not como_fecha(ev.get("fecha")):
                inf.error(ruta, f"evidencia {i}: fecha inválida")
            if not ev.get("descripcion"):
                inf.error(ruta, f"evidencia {i}: falta descripción")
        # La formación (cursos, lecturas, horas) no cuenta como evidencia de ejecución.
        ejecucion = [ev for ev in evidencias if ev.get("tipo") != "formacion"]
        externas = sum(1 for ev in ejecucion if ev.get("externa") is True)
        contextos = {str(ev.get("contexto", "")).strip().lower() for ev in ejecucion if ev.get("contexto")}

        # Topes de evidencia (regla 02 §3). Para conocimientos, el nivel 3 exige 1 evidencia.
        if escala == 5:
            if nivel >= 1 and not evidencias:
                inf.error(ruta, "cualquier nivel ≥ 1 necesita al menos una evidencia concreta")
            if nivel == 3 and not (len(contextos) >= 2 or externas >= 1):
                inf.error(ruta, "nivel 3 exige ≥2 contextos distintos o ≥1 evidencia externa")
            if nivel == 4 and not (externas >= 1 and len(contextos) >= 2):
                inf.error(ruta, "nivel 4 exige ≥1 evidencia externa y ≥2 contextos distintos")
            if nivel == 5 and externas < 2:
                inf.error(ruta, "nivel 5 exige reconocimiento externo sostenido (≥2 evidencias externas)")
            if evidencias and not ejecucion and nivel > 2:
                inf.error(ruta, "cursos, lecturas u horas solos no justifican más de nivel 2")
        elif nivel == 3 and not evidencias:
            inf.error(ruta, "conocimiento nivel 3 exige una evidencia verificable")

        if d.get("confianza") == "alta" and externas == 0:
            inf.error(ruta, "confianza 'alta' exige al menos una evidencia externa")

        ultima = como_fecha(d.get("ultima_practica"))
        if ultima and (hoy - ultima).days > MESES_VIGENCIA * 30.4:
            inf.aviso(ruta, f"nivel EN RIESGO: sin práctica desde {ultima} (> {MESES_VIGENCIA} meses)")

        if d.get("decision") == "desarrollar":
            desarrollar.append((ident, nivel, escala))

    if len(desarrollar) > MAX_DESARROLLAR:
        inf.error("perfil/inventario", f"{len(desarrollar)} elementos en 'desarrollar' (máximo {MAX_DESARROLLAR}): "
                  + ", ".join(i for i, _, _ in desarrollar))
    altas = [i for i, n, e in desarrollar if e == 5 and n >= 3]
    if len(altas) > MAX_DESARROLLAR_ALTO:
        inf.error("perfil/inventario", f"más de {MAX_DESARROLLAR_ALTO} subida desde nivel ≥3 en curso: {', '.join(altas)}")


def main() -> int:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    inf = Informe()
    funciones = cargar_funciones(inf)
    fichas = cargar_fichas(inf)
    validar_esquema(fichas, funciones, inf)
    validar_referencias(fichas, inf)
    validar_inventario(fichas, inf, dt.date.today())

    conteo: dict[str, int] = {}
    for _, d in fichas.values():
        conteo[d.get("tipo", "?")] = conteo.get(d.get("tipo", "?"), 0) + 1
    resumen = ", ".join(f"{t}: {n}" for t, n in sorted(conteo.items())) or "ninguna"
    print(f"Fichas leídas — {resumen}")
    for linea in inf.errores + inf.avisos:
        print(linea)
    print(f"\n{len(inf.errores)} error(es), {len(inf.avisos)} aviso(s).")
    return 1 if inf.errores else 0


if __name__ == "__main__":
    sys.exit(main())
