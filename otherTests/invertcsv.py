with open("otherTests/test.csv", "r") as fich:
    rawdata = fich.readlines()
    data = []
    for elem in rawdata:
        data.append(elem[:-1])

datalignes = []
for wr in data:
    datalignes.append(wr.split(";"))

datalignes = datalignes[::-1]

current_map = datalignes[0][1]
index = 0
data_fin = []
for run in datalignes:
    if run[1] != current_map:
        current_map = run[1]
        index = 0
    index += 1
    run[7] = index
    data_fin.append(run)

with open('otherTests/test2.csv', 'w') as file:
    for replay in data_fin:
        print(';'.join(map(str, replay)), file=file)