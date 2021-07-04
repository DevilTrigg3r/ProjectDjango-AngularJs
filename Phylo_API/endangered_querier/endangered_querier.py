from os import confstr
from bs4 import BeautifulSoup
import requests
import re

def get_endanger_status(specie_name):
    """ 
    Queries Wikipedia animal page and tries to extract the endanger status
        
    Attributes:
        specie_name (str): scientific name of the target spcecie

    Return (str): Returns the status if is found, otherwise false
    """
    reg_rubbish = r"sp."
    pat_rubbish = re.compile(reg_rubbish)
    specie_name = re.sub(pat_rubbish, "", specie_name)
    
    base_url = "https://en.wikipedia.org/wiki/{specie}"
    reg_possible_status = r"EX|EW|CR|EN|VU|NT|LC"
    reg_whitespaces = r"\s"
    pat_whitespaces = re.compile(reg_whitespaces)
    pat_status = re.compile(reg_possible_status)

    animal_url = base_url.format(specie = re.sub(pat_whitespaces, "_", specie_name.lower()))
    query = requests.get(animal_url)
    
    soup = BeautifulSoup(query.text)
    try:
        check_status = pat_status.finditer(str(soup.find("table", {"class": "infobox biota"}).findAll("img")))
        
        for status in check_status:
            if status.group(0) in ["EX", "EW", "CR", "EN", "VU", "NT", "LC"]:
                return {"status": status.group(0), "url":animal_url}
                break
    except AttributeError:
        return {"status": None, "url":animal_url}
        
    return {"status": None, "url": animal_url}