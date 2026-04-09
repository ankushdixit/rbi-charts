import tempfile
import os
import threading
from http.server import HTTPServer, SimpleHTTPRequestHandler

import pytest


@pytest.fixture
def tmp_dir():
    with tempfile.TemporaryDirectory() as d:
        yield d


class MockRBIHandler(SimpleHTTPRequestHandler):
    """Serves canned HTML responses for testing."""

    responses = {}

    def do_GET(self):
        if self.path in self.responses:
            body = self.responses[self.path].encode()
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        pass  # suppress logs during tests


@pytest.fixture
def mock_server():
    """Start a local HTTP server with canned responses."""
    server = HTTPServer(("127.0.0.1", 0), MockRBIHandler)
    port = server.server_address[1]
    thread = threading.Thread(target=server.serve_forever)
    thread.daemon = True
    thread.start()
    yield f"http://127.0.0.1:{port}"
    server.shutdown()
