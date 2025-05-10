import pandas as pd
from datetime import datetime, timedelta
import os

def date_moyenne(date1, date2):
    # Convertir les chaînes en objets datetime
    date1 = pd.to_datetime(date1, format='%d/%m/%Y')
    date2 = pd.to_datetime(date2, format='%d/%m/%Y')

    # Calculer la date au milieu
    middle_date = date1 + (date2 - date1) / 2

    # Convertir la date au milieu en chaîne de caractères
    middle_date_str = middle_date.strftime('%d/%m/%Y')

    return middle_date_str

def date_tier_moyen(date1, date2):
    # Convertir les chaînes en objets datetime
    date1 = pd.to_datetime(date1, format='%d/%m/%Y')
    date2 = pd.to_datetime(date2, format='%d/%m/%Y')

    # Calculer les intervalles de tiers
    interval = (date2 - date1) / 3

    # Calculer les dates équidistantes
    date1_third = date1 + interval
    date2_third = date1 + 2 * interval

    # Convertir les dates en chaînes de caractères
    date1_third_str = date1_third.strftime('%d/%m/%Y')
    date2_third_str = date2_third.strftime('%d/%m/%Y')

    return date1_third_str, date2_third_str

chemin_fichier_python = os.path.realpath(__file__)
repertoire_fichier = os.path.dirname(chemin_fichier_python)
os.chdir(repertoire_fichier)

donnees_maps = pd.read_csv("./data/maplist.txt", header=0, sep=";")

estimated_times = donnees_maps.copy()
estimated_times["check"] = 0
nb = 0
for i in range(0,len(donnees_maps)):

    if "?" not in donnees_maps.date[i]:
        estimated_times.loc[i, "check"] = 1

    elif donnees_maps.date[i][2:] == "/03/2013":
        estimated_times.loc[i, "check"] = 1

    elif "?" not in donnees_maps.date[i][2:]:
        if donnees_maps.date[i][2:] == donnees_maps.date[i+1][2:]:
            estimated_times.loc[i, "date"] = donnees_maps.date[i+1]
        else:
            estimated_times.loc[i, "date"] = "28" + donnees_maps.date[i][2:]
        estimated_times.loc[i, "check"] = 1

    elif donnees_maps.player[i] == "???":
        if i != 0:
            estimated_times.loc[i, "date"] = donnees_maps.date[i-1]
            estimated_times.loc[i, "check"] = 1

    if estimated_times.check[i] == 0:
        if "?" in donnees_maps.date[i]:
            if i != 0:
                if donnees_maps.player[i] == donnees_maps.player[i-1]:
                    if donnees_maps.map[i] == donnees_maps.map[i-1]:
                        if donnees_maps.date[i-1] != "??/??/????":
                            estimated_times.loc[i, "date"] = donnees_maps.date[i-1]
                            estimated_times.loc[i, "check"] = 1                         
    
    if estimated_times.check[i] == 0:
        if "?" in donnees_maps.date[i]:
            if i != 0 or i != len(donnees_maps):
                if "?" not in donnees_maps.date[i-1]:
                    if int(donnees_maps.date[i-1][6:]) < 2017:
                        estimated_times.loc[i, "date"] = "09/05/2017"
                        estimated_times.loc[i, "check"] = 1
                        if "?" not in donnees_maps.date[i+1]:
                            if int(donnees_maps.date[i+1][6:]) < 2017:
                                estimated_times.loc[i, "date"] = donnees_maps.date[i]
                                estimated_times.loc[i, "check"] = 0

    if estimated_times.check[i] == 0:
        if "?" in donnees_maps.date[i]:
            if i != 0 or i != len(donnees_maps):
                current_map = donnees_maps.map[i]
                donnees_temp = donnees_maps.query(f"map == '{current_map}'")
                surplus_index = donnees_temp.index[0]
                if donnees_maps.time[i] == donnees_temp.time[surplus_index]:
                    estimated_times.loc[i, "date"] = "20/06/2013"
                    estimated_times.loc[i, "check"] = 1
    
    if estimated_times.check[i] == 0:
        if "?" in donnees_maps.date[i]:
            if i != 0 or i < len(donnees_maps)-1: 
                if "?" not in estimated_times.date[i-1] and "?" not in estimated_times.date[i+1]:
                    estimated_times.loc[i, "date"] = date_moyenne(estimated_times.date[i-1], estimated_times.date[i+1])
                    estimated_times.loc[i, "check"] = 1
                elif "?" not in estimated_times.date[i-1] and estimated_times.date[i+1] == "??/??/????" and "?" not in estimated_times.date[i+2]:
                    tier1, tier2 = date_tier_moyen(estimated_times.date[i-1], estimated_times.date[i+2])
                    estimated_times.loc[i, "date"] = tier1
                    estimated_times.loc[i+1, "date"] = tier2
                    estimated_times.loc[i, "check"] = 1
                    estimated_times.loc[i+1, "check"] = 1