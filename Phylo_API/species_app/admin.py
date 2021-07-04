from django.contrib import admin
from .models import users, species, markers, sequences
# Register your models here.
admin.site.register(users)
admin.site.register(species)
admin.site.register(markers)
admin.site.register(sequences)