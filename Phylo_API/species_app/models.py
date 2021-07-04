from django.db import models
from django.contrib.auth.models import User

class users(User):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    role = models.CharField(max_length=20)

class species(models.Model):
    specie_id = models.AutoField(primary_key=True)
    scientific_name = models.CharField(max_length=100)
    colloquial_name = models.CharField(max_length=20, null=True)
    taxon_id = models.CharField(max_length=25)
    user = models.ForeignKey(users, on_delete=models.CASCADE, null=True)
    
class trees(models.Model):
    tree_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(users, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=20)
    tree_route = models.CharField(max_length=100)
    image_route = models.CharField(max_length=100, null=True)

class markers(models.Model):
    marker_id = models.AutoField(primary_key=True)
    specie_id = models.ForeignKey(species, on_delete=models.CASCADE, db_column="specie_id")
    user_id = models.ForeignKey(users, on_delete=models.CASCADE, null=True, db_column="user_id")
    longitude = models.FloatField()
    latitude = models.FloatField()
    date = models.DateField()
    hour = models.TimeField()
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    identification_id = models.BigIntegerField(null=True)
    dataset_key = models.CharField(max_length=150, null=True)
    
class download_occurrences_date(models.Model):
    specie = models.ForeignKey(species, on_delete=models.CASCADE)
    download_id = models.CharField(max_length=23, unique=True)
    download_date = models.DateField(auto_now_add=True)


class sequences(models.Model):
    acc_number = models.CharField(max_length=20,primary_key=True)
    specie = models.ForeignKey(species, on_delete=models.CASCADE)
    gene = models.CharField(max_length=20)
    sequence = models.TextField(max_length=50000)

class ortholog(models.Model):
    entry_nr = models.IntegerField()
    sequence_length = models.IntegerField()
    taxon_id = models.IntegerField()
    species = models.CharField(max_length=250)
    chromosome = models.CharField(max_length=50)
    distance = models.FloatField(max_length=250)
    score = models.FloatField(max_length=50)
    class Meta:
        managed = False
        db_table = "ortholog"


class users_with_token(models.Model):
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=20)
    role = models.CharField(max_length=20)
    key = models.CharField(max_length=50)
    class Meta:
        managed = False
        db_table = "users_with_token"

class markers_with_names(models.Model):
    marker_id = models.IntegerField(primary_key=True)
    longitude = models.FloatField()
    latitude = models.FloatField()
    date = models.DateField()
    hour = models.TimeField()
    country = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    identification_id = models.BigIntegerField(null=True)
    dataset_key = models.CharField(max_length=150, null=True)
    specie_id = models.IntegerField()
    user_id = models.IntegerField()
    scientific_name = models.CharField(max_length=100)
    colloquial_name = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = "markers_with_names"

class blast(models.Model):
    acc_number = models.CharField(max_length=20,primary_key=True)
    scientific_name = models.CharField(max_length=100)
    gene = models.CharField(max_length=20, null = True)
    specie_authors = models.CharField(max_length=7000, default=False)
    user = models.ForeignKey(users, on_delete=models.CASCADE, null=True)


class blast_species_gen(models.Model):
    acc_number = models.CharField(max_length=20,primary_key=True)
    scientific_name = models.CharField(max_length=100)
    gene = models.CharField(max_length=20, null = True)
    user = models.ForeignKey(users, on_delete=models.CASCADE, null=True)
    class Meta:
        managed = False
        db_table = "get_blast_species_gen"

class blast_authors(models.Model):
    acc_number = models.CharField(max_length=20,primary_key=True)
    scientific_name = models.CharField(max_length=100)
    gene = models.CharField(max_length=20, null = True)
    specie_authors = models.CharField(max_length=10000, default=False)
    class Meta:
        managed = False
        db_table = "get_blast_authors"


class sequences_and_scientific_names(models.Model):
    taxon_id = models.CharField(max_length=25, primary_key=True)
    user = models.ForeignKey(users, on_delete=models.CASCADE, null=True)
    scientific_name = models.CharField(max_length=100)
    sequence = models.TextField(max_length=50000)
    
    class Meta:
        managed = False
        db_table = "sequences_and_scientific_names"