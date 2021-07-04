import json
from pprint import pprint
from channels.generic.websocket import WebsocketConsumer
from channels.exceptions import StopConsumer
import threading
import time
import re
import autobahn
from copy import copy

class DownloadConsumer(WebsocketConsumer):

    thread_reg = r"\d{10}"
    thread_pat = re.compile(thread_reg)

    base_message = {"status": "change", "message": "change"}

    def __init__(self):
        print("=====================")
        print("aaaaaaaaaaaaaaaaaaaaaaaa")
        print("=====================")
        super().__init__()

        self.time_message = copy(self.base_message)
        self.time_message['status'] = "warning"
        self.time_message['message'] = "The download of markers is taking so long. Check it manually later."

        self.success_message = copy(self.base_message)
        self.success_message['status'] = "success"
        self.success_message['message'] = "The download of markers was succesful."

        self.failed_message = copy(self.base_message)
        self.failed_message['status'] = "failed"
        self.failed_message['message'] = "Thes download of markers failed."

        self.error_message = copy(self.base_message)
        self.error_message['status'] = "error"
        self.error_message['message'] = "An error has occurred contact with the administrator."

        self.not_found = copy(self.base_message)
        self.not_found['status'] = "not found"
        self.not_found['message'] = "The specie does not have available markers."

        self.recently_downloaded = copy(self.base_message)
        self.recently_downloaded['status'] = "recently downloaded"
        self.recently_downloaded['message'] = "This specie has been recently updated."
    

    def connect(self):
        self.download_code = self.scope['url_route']['kwargs']['download_code']
        self.accept()
        self.check_threads()

    def disconnect(self, close_code):
        raise StopConsumer

    def check_threads(self):
        for thread in threading.enumerate():
            download_exists = self.thread_pat.finditer(thread.name)
            for download in download_exists:
                if download.group(0) and download.group(0) == self.download_code:
                    self.observeThread()

        try:
            text_data_json = json.loads('{"status": "error", "message": "This download does not exitst"}')
            message = text_data_json['message']
            self.send(text_data=json.dumps(text_data_json))
            self.close()
        except autobahn.exception.Disconnected:
            pass
        
    def observeThread(self):
        start_timestamp = int(time.time())
        max_timestamp = start_timestamp + 24 * 60 * 60
        finish_reg = r"(?!>{}:)(?:success|failed)+$".format(self.download_code)
        finish_pat = re.compile(finish_reg)
        finish_flag = True
        while finish_flag:
            for thread in threading.enumerate():
                finish_thread = finish_pat.finditer(thread.name)
                for finish in finish_thread:
                    if finish.group(0):
                        if finish.group(0) == "success":
                            self.send(text_data = json.dumps(self.success_message))
                        elif finish.group(0) == "failed":
                            self.send(text_data = json.dumps(self.failed_message))
                        elif finish.group(0) == "not_found":
                            self.send(text_data = json.dumps(self.not_found))
                        elif finish.group(0) == "recently_downloaded":
                            self.send(text_data = json.dumps(self.recently_downloaded))
                        finish_flag = False
            time.sleep(5)
            if start_timestamp > max_timestamp:
                finish_flag = False
                self.send(text_data = json.dumps(self.time_message))
        self.close()