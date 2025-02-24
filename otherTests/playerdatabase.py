import pprint as pp
import json

with open("otherTests/AllUploads - New.txt", "r") as fich:
    rawdata = fich.readlines()
    data = []
    for elem in rawdata:
        data.append(elem[:-1])

datalignes = []
for wr in data:
    datalignes.append(wr.split(";"))

id_list = []
json_data = []
id = 0
for line in datalignes:
    if line[-1] not in id_list:
        player_data = {}
        player_data["Id"] = id
        player_data["Display_Name"] = line[0]
        player_data["Country"] = None
        player_data["TMO_Id"] = None
        player_data["TMS_Id"] = None
        player_data["TMN_Id"] = None
        player_data["TMUF_Id"] = None
        player_data["TMNF_Id"] = line[-1]
        player_data["TM2_Id"] = None
        player_data["TMT_Id"] = None
        player_data["TM20_Id"] = None

        json_data.append(player_data)
        id += 1
        id_list.append(line[-1])
    

with open('otherTests/PlayerDB.json', 'w') as file:
    json.dump(json_data, file, indent=4)