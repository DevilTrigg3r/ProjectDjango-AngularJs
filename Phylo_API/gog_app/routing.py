from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/downloadService/(?P<download_code>\w+)$', consumers.DownloadConsumer.as_asgi()),
]