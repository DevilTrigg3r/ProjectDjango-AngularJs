"""
Imports:
Entrez: to fetch info about predifined species of the API.
Serializers: Import the serializers of the species from the API to save the species.
"""
from species_app.serializers import species_serializer
from Bio import Entrez
from rest_framework.parsers import JSONParser
Entrez.email = "afonlopezalejandro@gmail.com"

"""
Function to autocomplete the database of the predifined species of the API.

    Attributes:
    ID_SPECIES = list to import the taxon id about the predifined species of the API.
    SPECIES_RESULT = list to save the search about the list with the taxon's ID.
    handle: save the information about the species by entrez.esummary.
    species_tidy = list to save the data by specie an create the dictionary with append and complete the specific fields of the API scientific_name, colloquial_name and taxon_id.
    species_serializer: get the validation with the serializers of the species with the new data species_tidy. If is valid save in to database to show in API.
"""
def autocomplete_species():
    ID_SPECIES = ["9606", "9031", "10090", "8479", "9913", "9615", "9359", "9597", "13146", "9685", "9823", "9986", "31031", "34861", "9646", "9641", "9598", "9796", "7955", "8517"]
    SPECIES_RESULTS = []
    for specie in ID_SPECIES:
        handle = Entrez.esummary(db="taxonomy", id=specie)
        SPECIES_RESULTS.append(Entrez.read(handle))
        handle.close()
    #count = -1
    species_tidy = []
    # Create a list dictionaries with the required fields to insert to the DB
    for specie in SPECIES_RESULTS:
        species_tidy.append({"scientific_name": specie[0]['ScientificName'],"colloquial_name": specie[0]['CommonName'],"taxon_id": specie[0]['Id']})
    # Serialize
    species_serialize = species_serializer(data = species_tidy, many=True)
    if species_serialize.is_valid():
        species_serialize.save()