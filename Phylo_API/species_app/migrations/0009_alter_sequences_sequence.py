# Generated by Django 3.2 on 2021-05-24 20:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('species_app', '0008_alter_species_colloquial_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sequences',
            name='sequence',
            field=models.TextField(max_length=50000),
        ),
    ]