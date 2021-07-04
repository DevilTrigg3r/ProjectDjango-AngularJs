from django.shortcuts import render

from django.http.response import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework import status
from rest_framework.response import Response
from species_app.models import species, users, trees, markers, download_occurrences_date, sequences, users_with_token, markers_with_names, blast, blast_species_gen, blast_authors, sequences_and_scientific_names
from species_app.serializers import species_serializer, users_serializer, trees_serializer, markers_serializer, download_ocurrences_date_serializer, sequences_serializer, users_with_token_serializer, markers_with_names_serializer, orthologs_serializer, blast_species_gen_serializer, blast_authors_serializer, blast_serializer, sequences_and_scientific_names_serializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db.models import Q
from endangered_querier.endangered_querier import *
from gbif_api_consumer.gbif_consumer import *
import requests
import re
import json
from Bio.Blast import NCBIWWW
from Bio import SeqIO
from Bio import Entrez
from Bio import SearchIO
from Bio.Blast import NCBIWWW
from Bio.Seq import Seq
import timeout_decorator
import re
from bs4 import BeautifulSoup
import threading
import base64
Entrez.email = 'martiriverogarcia@gmail.com'



""" 
    Function to generate token with the username and password and validate 

    Attributes:
        username: get the request about the username and comprove if the user exist. If not exist Response user not valid.
        password: get the request about the password and comprove if the password and user exist. If the password is not valid, show the message
    Return:
        token.key: return the token if the username and password is correct.
    
    @author Alejandro Afonso Lopez
    @version 1.0    
"""

@api_view(['POST'])
def login(request):
    username = request.POST.get('username')
    password = request.POST.get('password')
    try:
        user = User.objects.get(username=username)
    except User.DoesNotExist:
        return Response("User not valid")
    pwd_valid = make_password(password,salt=None, hasher='default')
    if not pwd_valid:
        return Response("password not valid")
    token, created = Token.objects.get_or_create(user=user)
    return Response(token.key)

"""
    Function to the species api list. Get all species and can post one specie with the correct paramethers.

    Attributes:
    Method GET:
        all_species: Get all objects of the model species. And if the species is not none, filter by specie_id.
        specie_id: comprove if the specie_id is not none and if is not none call all_species to filter.
        specie_serialize: get all species and validate if the data is valid.
    Method POST:
        specie_data: parser the data.
        specie_serializer: validate the data and if is valid save in the database.    
    Return:
        [GET]specie_serialize.data: return the objects.
        [POST]specie_serializer: return the object validate and inside to the database.
        Status 201: Created.
        Status 404: Bad request.
    @author Alejandro Afonso Lopez
    @version 1.0 
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def UploadSequenceFromFrontEnd(request, acc_number, gene, sequence):
    #CREATE A NEW SPECIE TO ADD SEQUENCE 
    specie_id = 1
    scientific_name = 'InsertByUser'
    colloquial_name ='InsertByUser'
    taxon_id = 'InsertByUser'
    SpecieAssociate = ({ "specie_id": specie_id, "scientific_name":scientific_name, "colloquial_name": colloquial_name, "taxon_id": taxon_id})
    specie_data = SpecieAssociate
    specie_serializer = species_serializer(data = specie_data)
    if specie_serializer.is_valid():
        specie_serializer.save()

    #SEQUENCE
    NewData = ({ "acc_number": acc_number, "specie":specie_id, "gene": gene, "sequence": sequence})
    #sequences_data = JSONParser().parse(request)
    sequences_data = NewData
    sequences_serialize = sequences_serializer(data=sequences_data)
    if sequences_serialize.is_valid():
        sequences_serialize.save()
        return JsonResponse(sequences_serialize.data, status=status.HTTP_201_CREATED) 
    return JsonResponse(sequences_serialize.errors, status=status.HTTP_400_BAD_REQUEST)

"""
    Function to the species api list. Get all species and can post one specie with the correct paramethers.

    Attributes:
    Method GET:
        all_species: Get all objects of the model species. And if the species is not none, filter by specie_id.
        specie_id: comprove if the specie_id is not none and if is not none call all_species to filter.
        specie_serialize: get all species and validate if the data is valid.
    Method POST:
        specie_data: parser the data.
        specie_serializer: validate the data and if is valid save in the database.    
    Return:
        [GET]specie_serialize.data: return the objects.
        [POST]specie_serializer: return the object validate and inside to the database.
        Status 201: Created.
        Status 404: Bad request.
    @author Alejandro Afonso Lopez
    @version 1.0 
"""

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def species_api_list(request):

    if request.method == 'GET':
        all_species = species.objects.all() 
        specie_id = request.GET.get('specie_id', None)
        if specie_id is not None:
            all_species = all_species.filter(specie_id__icontains=specie_id)
        specie_serialize = species_serializer(all_species, many=True)
        return Response(specie_serialize.data)

    elif request.method == 'POST':
        specie_data = JSONParser().parse(request)
        specie_serializer = species_serializer(data=specie_data)
        if specie_serializer.is_valid():
            specie_serializer.save()
            return JsonResponse(specie_serializer.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(specie_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def species_api_details(request, pk):
    try:
        species_id = species.objects.get(pk=pk) 
    except species.DoesNotExist:
        return JsonResponse({'message': 'The specie does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        species_serialize = species_serializer(species_id) 
        return Response(species_serialize.data) 
    elif request.method == 'PUT': 
        species_data = JSONParser().parse(request) 
        specie = species.objects.get(specie_id=species_data['specie_id']) 
        species_serialize = species_serializer(specie, data=species_data) 
        if species_serialize.is_valid(): 
            species_serialize.save() 
            return JsonResponse(species_serialize.data) 
        return JsonResponse(species_serialize.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        species.objects.get(pk=pk).delete() 
        return JsonResponse({'message': 'Species was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def species_by_default(request):
    default_species = species.objects.filter(user = None)
    species_serialize = species_serializer(data = default_species, many = True)
    species_serialize.is_valid()
    return JsonResponse(species_serialize.data, safe = False)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
@permission_classes([IsAuthenticated]) 
def user_api_list(request):
    if request.method == 'GET':
        all_users = users.objects.all()
        user_id = request.GET.get('user_id', None)
        if user_id is not None:
            all_users = all_users.filter(user_id__icontains=user_id)
        user_serialize = users_serializer(all_users, many=True)
        return Response(user_serialize.data)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['POST'])
def user_api_register(request):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        users_serialize = users_serializer(data=user_data)
        if users_serialize.is_valid():
            users_serialize.save()
            return JsonResponse(users_serialize.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(users_serialize.errors, status=status.HTTP_400_BAD_REQUEST)


""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_api_details(request, pk):
    try:
        user_id = users.objects.get(pk=pk) 
    except users.DoesNotExist:
        return JsonResponse({'message': 'The user does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        user_serialize = users_serializer(user_id) 
        return Response(user_serialize.data) 
    elif request.method == 'PUT': 
        user_data = JSONParser().parse(request)
        user = users.objects.get(user_id=user_data['user_id'])
        user_serialize = users_serializer(user, data=user_data) 
        if user_serialize.is_valid(): 
            user_serialize.save() 
            return JsonResponse(user_serialize.data) 
        return JsonResponse(user_serialize.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        users.objects.get(pk=pk).delete()
        return JsonResponse({'message': 'User was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def markers_api_list(request):
    if request.method == 'GET':
        all_markers = markers.objects.all()
        marker_id = request.GET.get('marker_id', None)
        if marker_id is not None:
            all_markers = all_markers.filter(marker_id__icontains=marker_id)
        marker_serialize = markers_serializer(all_markers, many=True)
        return JsonResponse(marker_serialize.data, safe=False)
    elif request.method == 'POST':
        marker_data = JSONParser().parse(request)
        marker_serialize = markers_serializer(data=marker_data)
        if marker_serialize.is_valid():
            marker_serialize.save()
            return JsonResponse(marker_serialize.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(marker_serialize.errors, status=status.HTTP_400_BAD_REQUEST)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def marker_api_details(request, pk):
    try:
        marker_id = markers.objects.get(pk=pk) 
    except markers.DoesNotExist:
        return JsonResponse({'message': 'The marker does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        marker_serialize = markers_serializer(marker_id) 
        return Response(marker_serialize.data) 
    elif request.method == 'PUT': 
        marker_data = JSONParser().parse(request)
        marker = markers.objects.get(marker_id=marker_data['marker_id'])
        marker_serialize = markers_serializer(marker, data=marker_data) 
        if marker_serialize.is_valid(): 
            marker_serialize.save() 
            return JsonResponse(marker_serialize.data) 
        return JsonResponse(marker_serialize.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        markers.objects.get(pk=pk).delete() 
        return JsonResponse({'message': 'Species was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_sequences_and_scrintific_names(request, user_id):
    print(user_id)
    if request.method == "GET":
        if(user_id == 0):
            sequences_and_scientific_names_objs = sequences_and_scientific_names.objects.all().filter(Q(user_id = None))
        else:
            sequences_and_scientific_names_objs = sequences_and_scientific_names.objects.all().filter(Q(user_id = user_id))
        sequences_and_scientific_names_serialize = sequences_and_scientific_names_serializer(data = sequences_and_scientific_names_objs, many = True)
        sequences_and_scientific_names_serialize.is_valid()
        return JsonResponse(sequences_and_scientific_names_serialize.data, safe = False)


"""
    Function to obtain picture about the specie selected to the view MAP.

    Attributes:
    Method GET:
        specie: name of the specie to get the picture.
        req: request to google images and add the specie in the URL.
        soup: get the content with the beautifulSoup.
        picture: find all by 'img' and src. Specify get 1 picture.
        picture_with_image: picture of the specie with src filtered.
        imag_req: obtain the image in encode base 64 to convert to string and filter with first 2 position and last 3 positions to get correct encode.
    Return:
        Return HttpResponse(imag_req): To send the encode via API.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def image_to_plot(request, specie_name):
    specie = specie_name
    req = requests.get("https://www.google.com/search?q="+specie+"&tbm=isch&hl=es&sa=X&ved=2ahUKEwj0mOH6xtPwAhUJdxoKHTFcAgsQBXoECAEQOw&biw=1275&bih=942")
    soup = BeautifulSoup(req.content, "html.parser")
    picture = soup.find_all('img', src_="")[1]
    picture_with_image = picture['src']
    imag_req = base64.encodebytes(requests.get(picture_with_image).content)
    str(imag_req)[2:-3]
    return HttpResponse(imag_req)


"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def articles_of_ncbi(request):
    req = requests.get("https://ncbiinsights.ncbi.nlm.nih.gov/")
    soup = BeautifulSoup(req.content, 'html.parser')
    resources_ncbi = soup.find_all('h1', class_="entry-title")
    ncbi_insights = []
    for result in resources_ncbi:
        txt = str(result)
        reg = r"https:\/\/ncbiinsights\.ncbi\.nlm\.nih\.gov\/(\d+\/){3}[a-zA-Z0-9-]+\/"
        pat = re.compile(reg)
        matches = [(match.start(), match.end(), match.group(0)) for match in pat.finditer(txt)]
        ncbi_insights.append(matches)
    ncbi_resources = []    
    for ncbi_insight in ncbi_insights:
        try:
            ncbi_resources.append(ncbi_insight[0][2])
             
        except:
            pass
    ncbi_resource = json.dumps(ncbi_resources)    
    return HttpResponse(ncbi_resource)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
def get_markers_with_names(request, specie_id, user_id):
    markers_with_names_objs = markers_with_names.objects.filter(Q(specie_id = specie_id) & (Q(user_id = user_id) | Q(user_id = None)))
    markers_with_names_serialize = markers_with_names_serializer(data = markers_with_names_objs, many = True)
    markers_with_names_serialize.is_valid()
    return JsonResponse(markers_with_names_serialize.data, safe = False)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def trees_api_list(request):
    if request.method == 'GET':
        all_trees = trees.objects.all()
        tree_id = request.GET.get('tree_id', None)
        if tree_id is not None:
            all_trees = all_trees.filter(tree_id__icontains=tree_id)
        trees_serialize = trees_serializer(all_trees, many=True)
        return JsonResponse(trees_serialize.data, safe=False)

    elif request.method == 'POST':
        tree_data = JSONParser().parse(request)
        trees_serialize = trees_serializer(data=tree_data)
        if trees_serialize.is_valid():
            trees_serialize.save()
            return JsonResponse(trees_serialize.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(trees_serialize.errors, status=status.HTTP_400_BAD_REQUEST)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def tree_api_details(request, pk):
    try:
        tree_id = trees.objects.get(pk=pk) 
    except trees.DoesNotExist:
        return JsonResponse({'message': 'The tree does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        trees_serialize = trees_serializer(tree_id) 
        return Response(trees_serialize.data) 
    elif request.method == 'PUT': 
        tree_data = JSONParser().parse(request)
        tree_id = trees.objects.get(tree_id=tree_data['tree_id']) 
        trees_serialize = trees_serializer(trees, data=tree_data) 
        if trees_serialize.is_valid(): 
            trees_serialize.save() 
            return JsonResponse(trees_serialize.data) 
        return JsonResponse(trees_serialize.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        trees.objects.get(pk=pk).delete() 
        return JsonResponse({'message': 'Species was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)       

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def sequences_api_list(request):
    if request.method == 'GET':
        all_seq = sequences.objects.all() 
        acc_number = request.GET.get('acc_number', None)
        if acc_number is not None:
            all_seq = all_seq.filter(acc_number__icontains=acc_number)
        sequences_serialize = sequences_serializer(all_seq, many=True)
        return JsonResponse(sequences_serialize.data, safe=False)
    elif request.method == 'POST':
        sequences_data = JSONParser().parse(request)
        sequences_serialize = sequences_serializer(data=sequences_data)
        if sequences_serialize.is_valid():
            sequences_serialize.save()
            return JsonResponse(sequences_serialize.data, status=status.HTTP_201_CREATED) 
        return JsonResponse(sequences_serialize.errors, status=status.HTTP_400_BAD_REQUEST)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def sequence_api_details(request, pk):
    try:
        sequence_id = sequences.objects.get(pk=pk) 
    except sequences.DoesNotExist:
        return JsonResponse({'message': 'The sequence does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        sequence_serialize = sequences_serializer(sequence_id) 
        return Response(sequence_serialize.data) 
    elif request.method == 'PUT': 
        sequence_data = JSONParser().parse(request) 
        sequence_serialize = sequences_serializer(sequences, data=sequence_data) 
        if sequence_serialize.is_valid(): 
            sequence_serialize.save() 
            return JsonResponse(sequence_serialize.data) 
        return JsonResponse(sequence_serialize.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE': 
        sequences.objects.get(pk=pk).delete() 
        return JsonResponse({'message': 'Species was deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)


""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def occurrences_post_add(request):
    if request.method == 'GET':
        all_seq = download_occurrences_date.objects.all() 
        id_number = request.GET.get('id', None)
        if id_number is not None:
            all_seq = all_seq.filter(id_number__icontains=id_number)
        download_serializer = download_ocurrences_date_serializer(all_seq, many=True)
        return Response(download_serializer.data)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def occurrences_get_details(request, specie_id):
    try:
        download_fk = download_occurrences_date.objects.all().filter(specie_id = specie_id)
    except download_occurrences_date.DoesNotExist:
        return JsonResponse({'message': 'The occurrences does not exist'}, status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET': 
        download_serialize = download_ocurrences_date_serializer(download_fk, many=True) 
        return Response(download_serialize.data)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
def get_users_with_key(request, key):
    if request.method == 'GET':
        users_with_token_objs = users_with_token.objects.all().filter(Q(key=key))
        users_with_token_serialize = users_with_token_serializer(data = users_with_token_objs, many = True)
        users_with_token_serialize.is_valid()
        data = json.dumps(users_with_token_serialize.data)
        return JsonResponse(data, safe = False)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
def get_blast_species_gen(request, user_id):
    if request.method == "GET":
        blast_species_gen_objs = blast_species_gen.objects.filter(user_id=None)
        blast_species_gen_serialize = blast_species_gen_serializer(data = blast_species_gen_objs, many = True)
        blast_species_gen_serialize.is_valid()
        return JsonResponse(blast_species_gen_serialize.data, safe = False)

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

def get_authors_regex(authors):
    names = []
    try:
        reg = r"\w+[\.,\s]\s?\w+\.?\s?(and)?\s?\w*-?\w*,?\w*\.?\w*"
        pat = re.compile(reg)
        matches = [(match.start(), match.end(), match.group(0)) for match in pat.finditer(authors)]
        names = [match[2] for match in matches]
    except:
        names = []
    return names

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

def get_unique_authors(li):
    out =  []
    for list_o in li:
        for authors in list_o:
            if authors not in out:
                out.append(authors)
    return out

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

def create_void_author_dict(auth_unique) -> dict:
    author_dict = dict()
    for authunique in auth_unique:
        author_dict[authunique] = []
    return author_dict

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

def get_all_authors(scientific_name, gene):
    blast_authors_obj = blast_authors.objects.filter(Q(scientific_name=scientific_name) & Q(gene=gene))
    blast_authors_serialize = blast_authors_serializer(data = blast_authors_obj, many = True)
    blast_authors_serialize.is_valid()
    results = blast_authors_serialize.data
    autores = ""
    for result in results:
        autores+=result["specie_authors"]

    list_output = []
    for result in results:
        authors_list = []
        authors_reg = get_authors_regex(result["specie_authors"])
        authors_list = authors_reg
        list_output.append(authors_list)
    return list_output

""" 
    Sets the correct column names, drops the occurrences that already exists

    Attributes:
        data (pd.DataFrame): dataframe to tidy
        specie_id (int): identification code of the target specie in our DB
        user_id (int): identification code of the target user in our DB
        curr_records_ids (int): identifications of the occurrences of the specie already stored in the DB

    Return:
        data (dict): nested dictionaries with each row being one dictionary

"""

@api_view(['GET'])
def get_blast_authors(request, scientific_name, gene):
    if request.method == "GET":
        list_output = get_all_authors(scientific_name, gene)
        
        unique_authors = get_unique_authors(list_output)

        data_raw = create_void_author_dict(unique_authors)

        for author in unique_authors:
            for list_out in list_output:
                if author in list_out:
                    for auth in list_out:
                        data_raw[author].append(auth)

        for author in unique_authors:
            new_list = []
            for authorr in data_raw[author]:
                if authorr not in new_list:
                    if authorr != author:
                        new_list.append(authorr)
            data_raw[author] = new_list
        graph_data = {"nodes": [], "links": []}

        #set nodes:
        for author in unique_authors:
            new_node = {"id": author, "value": len(data_raw[author])}
            graph_data["nodes"].append(new_node)

        #set links
        for author in unique_authors:
            for auth in data_raw[author]:
                new_link = {"source": author, "target": auth}
                graph_data["links"].append(new_link)
        return JsonResponse(graph_data, safe = False)


@api_view(['GET'])
def get_markers_with_names(request, specie_id, user_id):
    markers_with_names_objs = markers_with_names.objects.filter(Q(specie_id = specie_id) & (Q(user_id = user_id) | Q(user_id = None)))
    markers_with_names_serialize = markers_with_names_serializer(data = markers_with_names_objs, many = True)
    markers_with_names_serialize.is_valid()
    return JsonResponse(markers_with_names_serialize.data, safe = False)


"""
blast functions
"""




BLAST_DATABASES = ["nt", "refseq_select_rna","nr", "swissprot"]




#@timeout_decorator.timeout(600) # 10 mins timeout
def do_blast(program: str, db: str, sequence):
    print("enter function")
    try:
        blast_result = NCBIWWW.qblast(program, db, sequence)
        return blast_result
    except Exception:
        print("Timed out")
        return False


def check_blast(blast_res):
    try:
        with open("ncbi_result.xml", "w") as result_file:
            result_file.write(blast_res.read())
        result = SearchIO.read("ncbi_result.xml", "blast-xml")
        return result, True
    except:
        return "", False


def regex(txt: str, pattern):
    pat = re.compile(pattern)
    matches = [(match.start(), match.end(), match.group(0)) for match in pat.finditer(txt)][0][2]
    return matches

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_specie_acc(fasta_seq: str, all_acc: bool): # input fasta file)
    try:
        fasta_seq_nuc = Seq(str(fasta_seq))
        fasta_seq_prot = Seq(str(fasta_seq_nuc)).translate()
        for db in BLAST_DATABASES:
            if db=="nt" or db=="refseq_select_rna":
                ncbi_result = do_blast("blastn", db, fasta_seq_nuc)
            else:
                ncbi_result = do_blast("blastp", db, fasta_seq_prot)
            ckeck_blase_result, is_valid = check_blast(ncbi_result)
            if(is_valid):
                if(all_acc):
                    acc_list = []
                    for hit in ckeck_blase_result:
                        hit_id = hit.id
                        hit_acc = hit_id.split('|')[3]
                        acc_list.append(hit_acc)
                    return acc_list
                else:
                    first_hit_id = ckeck_blase_result[0].id
                    first_hit_acc = first_hit_id.split('|')[3]
                    return first_hit_acc
    except:
        return False

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_genbank_by_acc(acc_number):
    
    with Entrez.efetch(db="nucleotide",
                        id=acc_number,
                        rettype="gb",
                        retmode="text",
                        ) as efetch_response:
        result = SeqIO.read(efetch_response, "genbank")
        return result

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_specie_name(gb):
    for feature in gb.features:
        if feature.type == "source":
            db_xref = gb.features[0].qualifiers['db_xref']
            reg = r"taxon:\d+"
            matches = regex(str(db_xref), reg)
            if isinstance(matches, list):
                taxon = matches[0][6:]
            else: 
                taxon = matches[6:]
            handle = Entrez.esummary(db="taxonomy", id=taxon)
            taxonomy_result = Entrez.read(handle)
            handle.close()
            if taxonomy_result[0]['ScientificName']:
                return taxonomy_result[0]['ScientificName']

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_specie_gene(gb):
    for feature in gb.features:
        if feature.type == 'gene':
            return feature.qualifiers['gene']

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_authors(gb):
    authors = ""
    for annotation in gb.annotations['references']:
        authors+=annotation.authors
    return authors

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_specie_name_to_db(gb, user_id):
    specie_tidy = []
    for feature in gb.features:
        if feature.type == "source":
            taxon = gb.features[0].qualifiers['db_xref'][0][6:]
            handle = Entrez.esummary(db="taxonomy", id=taxon)
            taxonomy_result = Entrez.read(handle)
            handle.close()
            if taxonomy_result[0]['ScientificName'] and taxonomy_result[0]['CommonName']:
                specie_tidy.append({"scientific_name": taxonomy_result[0]['ScientificName'],"colloquial_name": taxonomy_result[0]['CommonName'],"taxon_id": taxon, "user": user_id})
    species_serialize = species_serializer(data = specie_tidy, many=True)
    if species_serialize.is_valid():
        species_serialize.save()

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_specie_name_to_db_with_regex(gb, user_id):
    specie_tidy = []
    for feature in gb.features:
        if feature.type == "source":
            db_xref = gb.features[0].qualifiers['db_xref']
            reg = r"taxon:\d+"
            matches = regex(str(db_xref), reg)
            if isinstance(matches, list):
                taxon = matches[0][6:]
            else: 
                taxon = matches[6:]
            handle = Entrez.esummary(db="taxonomy", id=taxon)
            taxonomy_result = Entrez.read(handle)
            handle.close()
            specie_tidy.append({"scientific_name": taxonomy_result[0]['ScientificName'],"colloquial_name": taxonomy_result[0]['CommonName'],"taxon_id": taxon, "user": user_id})
    species_serialize = species_serializer(data = specie_tidy, many=True)
    if species_serialize.is_valid():
        species_serialize.save()
    return taxonomy_result[0]['ScientificName']

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def conductive_thread(acc):
    target_genbank = get_genbank_by_acc(acc)
    specie_gene = get_specie_gene(target_genbank)[0]
    default_species_gene = get_other_species_gene(specie_gene, list_species)
    default_species_genbanks = get_species_genbanks(default_species_gene)
    default_species_sequences = get_species_sequences(default_species_genbanks, specie_gene)
    get_species_with_id(default_species_sequences)
    
"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def blast(request, download_id):
    if request.method == 'POST':
        body_data = JSONParser().parse(request)
        seq = body_data["sequence"]
        user_id = body_data["user_id"]
        acc_list = get_specie_acc(seq, True)
        specie_gb_to_db = get_genbank_by_acc(acc_list[0])
        sci_NAME = get_specie_name_to_db_with_regex(specie_gb_to_db, user_id)

        sci_Id_query =species.objects.all().filter(scientific_name=sci_NAME)
        target_specie_serialize= species_serializer(data = sci_Id_query, many = True)
        target_specie_serialize.is_valid()
        sci_Id = target_specie_serialize.data[0]['specie_id']

        occurrence_thread = threading.Thread(target=gbif_consumer_master, args=(sci_NAME, sci_Id, user_id, ))
        occurrence_thread.name = download_id
        occurrence_thread.start()

        conductive_thread(acc_list[0])
        species_list = []
        if acc_list != False:
            for acc in acc_list:
                specie = {}
                specie_gb = get_genbank_by_acc(acc)
                specie_name = get_specie_name(specie_gb)
                specie_gene = get_specie_gene(specie_gb)
                if specie_gene != None:
                    print(specie_gene)
                    print(type(specie_gene))
                    specie_gene = specie_gene[0]
                specie_authors = get_authors(specie_gb)
                specie = {"acc_number": acc, "scientific_name": specie_name, "gene": specie_gene, "specie_authors": specie_authors, "user_id": user_id}
                species_list.append(specie)
        blast_serialize = blast_serializer(data = species_list, many = True)
        if blast_serialize.is_valid():
            blast_serialize.save()
        data = json.dumps(blast_serialize.data)
        return JsonResponse(data, safe = False)
    return JsonResponse([], safe = False)


base_search_term = "{gene}[All Fields] AND \"{specie}\"[Organism] AND animals[filter] NOT chromosome[All Fields] NOT genome[All Fields]"
list_species = ['Homo sapiens', 'Gallus gallus', 'Mus musculus', 'Chrysemys picta', 'Bos taurus', 'Canis lupus', 'Dasypodidae', 'Pan paniscus', 'Melopsittacus undulatus', 'Felis catus', 'Sus scrofa', 'Oryctolagus cuniculus', 'Tetraodontidae', 'Sciurus niger', 'Ailuropoda melanoleuca', 'Ursus sp.','Pan troglodytes', 'Equus caballus', 'Danio rerio', 'Iguana iguana']

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_other_species_gene(gene_name, animals):
    results = []
    for animal in animals:
        search_term = base_search_term.format(gene = gene_name, specie = animal)
        with Entrez.esearch(db="nucleotide",
                            term= search_term,
                            retmax=30
                           ) as search_http_response:
            result = Entrez.read(search_http_response)
            results.append((animal, result))
    return results

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_species_genbanks(species_accs):
    results = []
    for specie in species_accs:
        try:
            id_acc = specie[1]['IdList'][0]
            with Entrez.efetch(db="nucleotide",
                               id=id_acc,
                               rettype="gb",
                               retmode="text",
                              ) as efetch_response:
                result = SeqIO.read(efetch_response, "genbank")
                results.append((specie[0], result))
        except IndexError:
            pass
    return results

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_species_sequences(species_genbanks, gene):
    results = []
    for specie in species_genbanks:
        results.append((specie[0], specie[1].name, gene, str(specie[1].seq)))
    return results

"""
Function to add the specie_id and comprove if the species have the gene of the specie selected by the client.
@Alejandro Afonso Lopez
@version 1.0
"""
"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

def get_species_with_id(results):
    list_id = []
    for result in results:
        if result[0] == "Homo sapiens":
            id = 1
        if result[0] == "Gallus gallus":
            id = 2
        if result[0] == "Mus musculus":
            id = 3
        if result[0] == "Chrysemys picta":
            id = 4
        if result[0] == "Bos taurus":
            id = 5
        if result[0] == "Canis lupus":
            id = 6
        if result[0] == "Dasypodidae":
            id = 7
        if result[0] == "Pan paniscus":
            id = 8
        if result[0] == "Melopsittacus undulatus":
            id = 9
        if result[0] == "Felis catus":
            id = 10
        if result[0] == "Sus scrofa":
            id = 11
        if result[0] == "Oryctolagus cuniculus":
            id = 12
        if result[0] == "Tetraodontidae":
            id = 13 
        if result[0] == "Sciurus niger":
            id = 14
        if result[0] == "Ailuropoda melanoleuca":
            id = 15
        if result[0] == "Ursus sp.":
            id = 16
        if result[0] == "Pan troglodytes":
            id = 17
        if result[0] == "Equus caballus":
            id = 18
        if result[0] == "Danio rerio":
            id = 19
        if result[0] == "Iguana iguana":
            id = 20
        new_specie = {"acc_number": result[1] , "specie": id, "gene": result[2] ,"sequence": result[3]}
        list_id.append(new_specie)
    
    sequences_serialize = sequences_serializer(data = list_id, many=True)
    if sequences_serialize.is_valid():
        sequences_serialize.save()

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

@api_view(['GET'])
def species_by_default(request):
    default_species = species.objects.filter(user = None)
    species_serialize = species_serializer(data = default_species, many = True)
    species_serialize.is_valid()
    return JsonResponse(species_serialize.data, safe = False)

"""
    Function to obtain the URLS about the resources of the NCBI.

    Attributes:
    Method GET:
        req: request to get resources of NCBI.
        soup: get the content with the beautifulSoup.
        resources_ncbi: soup all by tag 'h1' and class entry title to get the links about the resources.
        ncbi_insights: List to add the data filtered with regex and comprove the matches.
        ncbi_resources: List to add the ncbi_insight by the position 0 to inside in the tupla and get the position 2 -> Href.
        ncbi_resource: json.dumps to format to correct format to return HttpResponse
    Return:
        Return HttpResponse(ncbi_resource): To send the urls via API to plot in Angular.

    @author Alejandro Afonso Lopez
    @version 1.0   
"""

@api_view(['GET'])
def invasive(request, specie_name):
    return JsonResponse(get_endanger_status(specie_name), safe = False)