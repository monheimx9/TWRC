map_list = []
for i in ["A", "B", "C", "D", "E"]:
    for j in range(15):
        if j+1 < 10:
            map_list.append(f"{i}0{j+1} - Stadium")
        else:
            map_list.append(f"{i}{j+1} - Stadium")

print(map_list)