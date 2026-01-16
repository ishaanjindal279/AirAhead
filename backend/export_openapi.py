import json
from pathlib import Path

from main import app


def write_openapi(path: Path = None):
    path = path or (Path(__file__).parent / "openapi.json")
    spec = app.openapi()
    # Convert any non-serializable objects to strings if necessary via default
    path.write_text(json.dumps(spec, indent=2, default=str))


if __name__ == "__main__":
    write_openapi()
    print("Wrote OpenAPI spec to backend/openapi.json")
