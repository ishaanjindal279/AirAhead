import json
from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_predict_endpoint():
    resp = client.get("/predict?zoneId=zone_test&horizon_hours=6")
    assert resp.status_code == 200
    data = resp.json()
    assert "zoneId" in data
    assert "predictions" in data
    assert isinstance(data["predictions"], list)


def test_hotspots_endpoint():
    resp = client.get("/hotspots?horizon_hours=24&minAQI=100")
    assert resp.status_code == 200
    data = resp.json()
    assert "hotspots" in data


def test_traffic_endpoint():
    resp = client.get("/traffic?origin_lat=12.9&origin_lng=77.6&dest_lat=12.95&dest_lng=77.63")
    assert resp.status_code == 200
    data = resp.json()
    assert "route" in data


def test_alerts_endpoint():
    resp = client.get("/alerts?zoneId=zone_test&persona=elderly")
    assert resp.status_code == 200
    data = resp.json()
    assert "alerts" in data


def test_purifier_control_endpoint():
    payload = {
        "deviceId": "purifier_xyz",
        "zoneId": "zone_test",
        "command": "SET_LEVEL",
        "level": 4
    }
    resp = client.post("/purifier-control", json=payload)
    assert resp.status_code == 200
    data = resp.json()
    assert data.get("deviceId") == "purifier_xyz"
