"""
Script para levantar el servidor de la API de FamiGest localmente.
Uso:
    python src/api/run_api.py
"""
import uvicorn
import os
import sys
from pathlib import Path

# Asegurar que 'src' esté en sys.path
BASE_SRC = Path(__file__).resolve().parent.parent
if str(BASE_SRC) not in sys.path:
    sys.path.insert(0, str(BASE_SRC))

if __name__ == "__main__":
    print("🚀 Iniciando FamiGest API en http://0.0.0.0:8000 ...")
    print("📖 Documentación Swagger interactiva en http://localhost:8000/docs")
    uvicorn.run("api.main:app", host="0.0.0.0", port=8000, reload=True)
