from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from species_app.serializers import orthologs_serializer
import requests
from rest_framework.permissions import IsAuthenticated
from omadb import Client
import re
from django.http.response import JsonResponse
# Create your views here.


def get_api_request_url(c: Client, taxon_id:int):
    specie = c.entries[taxon_id]
    api_request_url = str(specie["orthologs"])
    return api_request_url

def regex(txt, pattern):
    pat = re.compile(pattern)
    matches = [(match.start(), match.end(), match.group(0)) for match in pat.finditer(txt)][0][2]
    return matches

def get_api_orthologs(api_request_url, api_server):
    api_request = api_server+api_request_url
    response = requests.get(api_request)
    orthologs_json = response.json()
    return orthologs_json


def filter_orthologs_dict(orthologs_dict):
    filtered_dict = []
    for ortholog in orthologs_dict:
        new_ortholog = {}
        for key, value in ortholog.items():
            if key == "entry_nr":
                new_ortholog[key] = value
            if key == "sequence_length":
                new_ortholog[key] = value
            if key == "species":
                for k, v in value.items():
                    if k == "taxon_id":
                        new_ortholog[k] = v
                    if k == "species":
                        new_ortholog[k] = v
            if key == "chromosome":
                new_ortholog[key] = value
            if key == "distance":
                new_ortholog[key] = value
            if key == "score":
                new_ortholog[key] = value
            filtered_dict.append(new_ortholog)
    return filtered_dict


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_specie_orthologs(request, taxon):
    try:
        cli = Client()
        api_request_url = get_api_request_url(cli, taxon)
        api_request_url_str = str(api_request_url)
        reg = r'\/[^>]+'
        match = regex(api_request_url_str, reg)
        api_server = 'https://omabrowser.org/api'
        orthologs_request_api = get_api_orthologs(match, api_server)
        orthologs_filtered = filter_orthologs_dict(orthologs_request_api)
        orthologs_unique = []
        for x in orthologs_filtered:
            if x not in orthologs_unique:
                orthologs_unique.append(x)
    except:
        orthologs_unique = []
    orthologs_unique_serialize = orthologs_serializer(data = orthologs_unique, many = True)
    orthologs_unique_serialize.is_valid()
    return JsonResponse(orthologs_unique_serialize.data, safe = False) 