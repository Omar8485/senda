# Senda · Copyright (C) 2026 Omar (github.com/Omar8485) y colaboradores
# SPDX-License-Identifier: AGPL-3.0-or-later
"""Revisa que el repositorio público no lleve archivos ni datos privados.

Uso (desde la raíz): python3 herramientas/revisar_publico.py
Termina con código 1 si encuentra algo. Lo corre la CI en cada push.

Qué busca, solo en archivos versionados (git ls-files):
- archivos que viven en el repositorio privado: CLAUDE.md, skills/, perfil/, datos/, notas/;
- rutas de usuario de Windows o macOS/Linux y enlaces a artifacts de claude.ai,
  que delatan el entorno de una persona o apuntan a sus datos.
"""
from __future__ import annotations

import re
import subprocess
import sys

PRIVADOS = ("CLAUDE.md", "skills/", "perfil/", "datos/", "notas/")

PATRONES = [
    (re.compile(r"[A-Za-z]:\\+Users\\+", re.I), "ruta de usuario de Windows"),
    (re.compile(r"/(?:Users|home)/[a-z0-9_.-]+/(?:Documents|Desktop|Downloads)", re.I), "ruta de usuario"),
    (re.compile(r"claude\.ai/(?:code/)?artifact/", re.I), "enlace a un artifact de claude.ai"),
]

# Rutas excluidas de la búsqueda de patrones, con su motivo.
EXCLUIDOS = {
    "herramientas/revisar_publico.py": "este archivo describe los patrones",
}


def versionados() -> list[str]:
    salida = subprocess.run(["git", "ls-files", "-z"], capture_output=True, check=True)
    return [p for p in salida.stdout.decode("utf-8").split("\0") if p]


def main() -> int:
    problemas: list[str] = []
    for ruta in versionados():
        if ruta in PRIVADOS or any(ruta.startswith(p) for p in PRIVADOS if p.endswith("/")):
            problemas.append(f"{ruta}: archivo privado (va en Omar8485/senda-omar)")
            continue
        if any(ruta.startswith(e) for e in EXCLUIDOS):
            continue
        try:
            texto = open(ruta, encoding="utf-8").read()
        except (UnicodeDecodeError, FileNotFoundError, IsADirectoryError):
            continue
        for n, linea in enumerate(texto.splitlines(), 1):
            for patron, motivo in PATRONES:
                if patron.search(linea):
                    problemas.append(f"{ruta}:{n}: {motivo}")
    if problemas:
        print("El repositorio público lleva archivos o datos privados:")
        for p in problemas:
            print(f"  - {p}")
        return 1
    print("Repositorio público: sin archivos ni datos privados.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
