from django.http.response import HttpResponse
from django.shortcuts import render
from Bio import SeqIO
from Bio import AlignIO
from Bio import Phylo
from Bio import Entrez
from io import StringIO
from Bio.Phylo.TreeConstruction import DistanceCalculator
from Bio.Align.Applications import MuscleCommandline
from Bio.Phylo.TreeConstruction import DistanceTreeConstructor
from species_app.models import sequences
from species_app.serializers import sequences_serializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.http import JsonResponse
import requests
import json

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def CreateGenbankByAccNumber(request):
    Entrez.email = "jimenerojorge@example.com"  # Always tell NCBI who you are 
    acc_number_list = ['CR541913','AWGT02000214']#,'AY410048','NW_007281581','NM_173917','MKHE01000001','DP001094','CM008008','KM522873','AF114701','NM_001144841','DP001067']
    Genbank_Results = []
    count = -1	
    jajason = {}
    for acc_number in acc_number_list: 
            count+=1
            with Entrez.efetch(db      ="nucleotide",
                               id      = acc_number,
                               rettype ="gb",
                               retmode ="text") as efetch_response:
                               result  = SeqIO.read(efetch_response, "genbank")
                               Genbank_Results.append(result)

    Genbank_Results[0].id
    Genbank_Results[0].description
    A = str(Genbank_Results[0].seq)
    Genbank_Results[1].id
    Genbank_Results[1].description
    B = str(Genbank_Results[1].seq)
    Gb1 = [{'Id': Genbank_Results[0].id ,'Description': Genbank_Results[0].description,'Seq':A}]
    Gb2 = [{'Id': Genbank_Results[1].id ,'Description': Genbank_Results[1].description,'Seq':B}]
    jajason = Gb1 + Gb2

    return JsonResponse( jajason, safe=False)
 

#Function to get All sequences from database 
def GetSequenceFasta():
        all_sequences = sequences.objects.all()   
        sequences_serialize = sequences_serializer(all_sequences, many=True)
        #TO DO
        print(sequences_serialize)
        return JsonResponse(sequences_serialize.data, safe=False)


def InputDataTest ():

    #import the sequences we will use.
    #example: https://www.ncbi.nlm.nih.gov/nuccore/FJ039971.1?report=genbank
    t1 = SeqIO.read("PhyloTree_App/Testing_project/sequences1.fasta", "fasta")
    t2 = SeqIO.read("PhyloTree_App/Testing_project/sequences2.fasta", "fasta")
    t3 = SeqIO.read("PhyloTree_App/Testing_project/sequences3.fasta", "fasta")
    t4 = SeqIO.read("PhyloTree_App/Testing_project/sequences4.fasta", "fasta")
    t5 = SeqIO.read("PhyloTree_App/Testing_project/sequences5.fasta", "fasta")
    t6 = SeqIO.read("PhyloTree_App/Testing_project/sequences6.fasta", "fasta")
    
    # Combine all of the individual sequences into a new file 
    SeqIO.write([t1,t2,t3,t4,t5,t6], "PhyloTree_App/Testing_project/turtles.fasta", "fasta")
      
def MakeMultiAligment():

    # Load the turtles sequences into MUSCLE
    muscle_cline = MuscleCommandline(input="PhyloTree_App/Testing_project/turtles.fasta")
    stdout, stderr = muscle_cline()
    align = AlignIO.read(StringIO(stdout), "fasta")
    print(align)
    AlignIO.write(align, "PhyloTree_App/Testing_project/turtles.aln", "clustal")


def TreeConstructor():

    # Open the alignment file as a MultipleSeqAlignment object 
    with open("PhyloTree_App/Testing_project/turtles.aln","r") as aln:
        alignment = AlignIO.read(aln,"clustal")
    print(type(alignment))
    list(alignment)
    # Open and initiate the Distance Calculator using the Identity model  
    calculator = DistanceCalculator('identity')
    # Write the Distance Matrix 
    distance_matrix = calculator.get_distance(alignment)
    print(distance_matrix)
    #Open and initiate the Tree Constructor 
    constructor = DistanceTreeConstructor(calculator)
    # Build the tree 
    turtle_tree = constructor.build_tree(alignment)
    turtle_tree.rooted = True
    print(turtle_tree)
    # Save the tree to a new file 
    Phylo.write(turtle_tree, "PhyloTree_App/Testing_project/turtle_tree.nwk", "newick")
    