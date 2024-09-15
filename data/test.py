with open("data/WRDb.csv", "r") as file:
    data = file.readlines()
    data = data[::-1]
    rank = 1
    last_map = ""
    final = ""
    for elem in data:
        ligne = elem.split(";")
        if last_map != ligne[1]:
            rank = 1
            ligne.append(str(rank))
        else:
            rank += 1
            ligne.append(str(rank))
        ligne[6] = ligne[6][0:3]
        last_map = ligne[1]
        final+=ligne[0]+";"+ligne[1]+";"+ligne[2]+";"+ligne[3]+";"+ligne[4]+";"+ligne[5]+";"+ligne[6]+";"+ligne[7]+"$"
    print(final)
