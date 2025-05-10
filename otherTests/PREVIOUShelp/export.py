import pandas as pd
from datetime import datetime, timedelta
import os

def generate_dates(start_date):
    # Obtenir la date actuelle
    today = datetime.today()
    
    # Créer une liste pour stocker les dates
    dates = []

    # Convertir la date de début en datetime
    current_date = datetime.strptime(start_date, "%d/%m/%Y")

    # Boucler jusqu'à la date actuelle
    while current_date <= today:
        # Ajouter le 01 et le 15 du mois à la liste si la date est valide
        if current_date.day == 1 or current_date.day == 10 or current_date.day == 20:
            dates.append(current_date.strftime("%d/%m/%Y"))
        
        # Passer au lendemain
        current_date += timedelta(days=1)

    dates.append(today.strftime('%d/%m/%Y'))
    return dates

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

# chemin_fichier_python = os.path.realpath(__file__)
# repertoire_fichier = os.path.dirname(chemin_fichier_python)
# os.chdir(repertoire_fichier)

donnees_maps = pd.read_csv("otherTests/PREVIOUShelp/data/maplist.txt", header=0, sep=";", dtype={'track': str})

estimated_times = donnees_maps.copy()
estimated_times["check"] = 0
for i in range(0,len(donnees_maps)):

    if "?" not in donnees_maps.date[i]:
        estimated_times.loc[i, "check"] = 1

    elif donnees_maps.date[i][2:] == "/03/2016":
        estimated_times.loc[i, "check"] = 1

    elif "?" not in donnees_maps.date[i][2:]:
        if donnees_maps.date[i][2:] == donnees_maps.date[i+1][2:]:
            estimated_times.loc[i, "date"] = donnees_maps.date[i+1]
        else:
            estimated_times.loc[i, "date"] = "28" + donnees_maps.date[i][2:]
        estimated_times.loc[i, "check"] = 1

    elif donnees_maps.player[i] == "???":
        try:
            estimated_times.loc[i, "date"] = donnees_maps.date[i-1]
            estimated_times.loc[i, "check"] = 1
        except: pass

    if estimated_times.check[i] == 0:
        if "?" in donnees_maps.date[i]:
            if i != 0:
                if donnees_maps.player[i] == donnees_maps.player[i-1]:
                    if donnees_maps.track[i] == donnees_maps.track[i-1]:
                        if donnees_maps.date[i-1] != "??/??/????":
                            estimated_times.loc[i, "date"] = donnees_maps.date[i-1]
                            estimated_times.loc[i, "check"] = 1  
    
    # if estimated_times.check[i] == 0:
    #     if "?" in donnees_maps.date[i]:
    #         if i != 0 or i != len(donnees_maps):
    #             if "?" not in donnees_maps.date[i-1]:
    #                 if int(donnees_maps.date[i-1][6:]) < 2017:
    #                     estimated_times.loc[i, "date"] = "09/05/2017"
    #                     estimated_times.loc[i, "check"] = 1
    #                     if "?" not in donnees_maps.date[i+1]:
    #                         if int(donnees_maps.date[i+1][6:]) < 2017:
    #                             estimated_times.loc[i, "date"] = donnees_maps.date[i]
    #                             estimated_times.loc[i, "check"] = 0

    if estimated_times.check[i] == 0:
        if "?" in donnees_maps.date[i]:
            if i != 0 or i != len(donnees_maps):
                current_map = donnees_maps.track[i]
                donnees_temp = donnees_maps.query(f"track == '{current_map}'")
                surplus_index = donnees_temp.index[0]
                if donnees_maps.time[i] == donnees_temp.time[surplus_index]:
                    estimated_times.loc[i, "date"] = "20/03/2016"
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

# list of every 2 weeks

# Définir la date de début
start_date = '20/03/2016'
dates_list = generate_dates(start_date)
#dates_list = ['01/01/2014','01/01/2015','01/01/2016','01/01/2017','01/01/2018','01/01/2019','01/01/2020','01/01/2021','01/01/2022','01/01/2023','01/01/2024','01/01/2025']
map_list = donnees_maps["track"].unique().tolist()

#print(estimated_times.date.tolist())
donnees = estimated_times

# Liste joueurs
player_list = donnees.player.unique().tolist()

player_history = {}
#player_history["date"] = dates_list
for joueur in player_list:
    list_day = []
    for i in range(0, len(dates_list)):
        list_day.append(0)
    player_history[joueur] = list_day

for track in map_list:
    today = datetime.now()
    today = today.strftime("%d/%m/%Y") # Formater la date au format "DD/MM/YYYY"
    donnees_temp = donnees.query(f"track == '{track}'")
    surplus_index = donnees_temp.index[0]

    for indx in range(0, len(donnees_temp["date"].tolist())):
        elem = donnees_temp['date'][indx + surplus_index]
        if indx == len(donnees_temp["date"].tolist())-1:
            next_wr = today
        else:
            next_wr = donnees_temp['date'][indx + surplus_index+1]

        player = donnees_temp['player'][indx + surplus_index]
        
        if elem[3:] != "03/2013":
            dateWR = datetime.strptime(elem, "%d/%m/%Y")
            print(track)
            dateNextWR = datetime.strptime(next_wr, "%d/%m/%Y")
            for i in range(0,len(dates_list)):
                date2 = datetime.strptime(dates_list[i], "%d/%m/%Y")

                # Comparer les dates
                if dateWR < date2:
                    player_history[player][i] += 1
                    if dateNextWR < date2 and next_wr != today:
                        player_history[player][i] -= 1

#for elem in player_history.items(): print(elem[1], elem[0])

# Créer le DataFrame à partir du dictionnaire
tableau_fin = pd.DataFrame.from_dict(player_history, orient='index', columns=dates_list)

# Réinitialiser l'index pour avoir les noms comme une colonne
tableau_fin.reset_index(inplace=True)
tableau_fin.rename(columns={'index': 'Player'}, inplace=True)

tableau_fin.to_csv('otherTests/PREVIOUShelp/dataframe_exporte.csv', sep=';', index=False)