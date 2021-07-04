from rest_framework import serializers
from species_app.models import species, users, trees, markers, download_occurrences_date, sequences, ortholog, users_with_token, markers_with_names, blast, blast_species_gen, blast_authors, sequences_and_scientific_names

class species_serializer(serializers.ModelSerializer):
    class Meta:
        model = species
        fields = '__all__'

class users_serializer(serializers.ModelSerializer):
    class Meta:
        model = users 
        fields = ['user_id', 'password', 'username','email', 'name', 'surname', 'role']

class trees_serializer(serializers.ModelSerializer):
    class Meta:
        model = trees 
        fields = '__all__'

class markers_serializer(serializers.ModelSerializer):
    class Meta:
        model = markers 
        fields = '__all__'

class download_ocurrences_date_serializer(serializers.ModelSerializer):
    class Meta:
        model = download_occurrences_date
        fields = '__all__'

class sequences_serializer(serializers.ModelSerializer):
    class Meta:
        model = sequences 
        fields = ('acc_number', 'specie', 'gene', 'sequence')


class orthologs_serializer(serializers.ModelSerializer):
    class Meta:
        model = ortholog
        fields = '__all__'


class users_with_token_serializer(serializers.ModelSerializer):
    class Meta:
        model = users_with_token
        fields = ('user_id', 'name', 'surname', 'role', 'key')

class markers_with_names_serializer(serializers.ModelSerializer):
    class Meta:
        model = markers_with_names
        fields = ('marker_id', 'longitude', 'latitude', 'date', 'hour', 'country', 'state',  'identification_id', 'dataset_key', 'specie_id', 'user_id', 'scientific_name', 'colloquial_name')
        
class blast_species_gen_serializer(serializers.ModelSerializer):
    class Meta:
        model = blast_species_gen
        fields = '__all__'


class blast_authors_serializer(serializers.ModelSerializer):
    class Meta:
        model = blast_authors
        fields = '__all__'

class blast_serializer(serializers.ModelSerializer):
    class Meta:
        model = blast
        fields = '__all__'


class sequences_and_scientific_names_serializer(serializers.ModelSerializer):
    class Meta:
        model = sequences_and_scientific_names
        fields = '__all__'