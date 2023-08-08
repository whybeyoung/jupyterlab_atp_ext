import os
import json

from jupyter_server.base.handlers import APIHandler
from jupyter_server.utils import url_path_join
import tornado
import requests
from tornado.web import StaticFileHandler
import os


class RouteHandler(APIHandler):
    # The following decorator should be present on all verb methods (head, get, post,
    # patch, put, delete, options) to ensure only authorized user can request the
    # Jupyter server
    @tornado.web.authenticated
    def get(self):
        self.finish(json.dumps({
            "data": "This is /jupyterlab-atp-extension/hello endpoint!"
        }))

    @tornado.web.authenticated
    def post(self):
        # get atp url
        ATP_URL = os.getenv("ATP_URL", "https://dev.iflyaicloud.com/api/v1/atp/task/run")
        # input_data is a dictionary with a key "name"
        ATP_TASK_ID = os.getenv("ATP_TASK_ID")
        if not ATP_TASK_ID:
            self.finish(
                json.dumps({
                    "code": -1,
                    "message": "you should specify ATP_TASK_ID"
                })
            )
            return
        input_data = self.get_json_body()
        cmd = input_data.get("command")
        if not input_data or not cmd:
            self.finish(
                json.dumps({
                    "code": -1,
                    "message": "you should choose one file"
                })
            )
            return
        resp = requests.post(ATP_URL, data={
            "command": cmd,
            "id": ATP_TASK_ID
        })
        # data = {"greetings": "Hello {}, enjoy JupyterLab!".format(input_data["name"])}

        self.finish(resp.json())


def setup_handlers(web_app):
    host_pattern = ".*$"

    base_url = web_app.settings["base_url"]
    # Prepend the base_url so that it works in a JupyterHub setting
    route_pattern = url_path_join(base_url, "jupyterlab-atp-extension", "hello")
    handlers = [(route_pattern, RouteHandler)]
    web_app.add_handlers(host_pattern, handlers)

    # Prepend the base_url so that it works in a JupyterHub setting
    doc_url = url_path_join(base_url, "jupyterlab-atp-extension", "public")
    doc_dir = os.getenv(
        "JLAB_SERVER_EXAMPLE_STATIC_DIR",
        os.path.join(os.path.dirname(__file__), "public"),
    )
    handlers = [("{}/(.*)".format(doc_url), StaticFileHandler, {"path": doc_dir})]
    web_app.add_handlers(host_pattern, handlers)
