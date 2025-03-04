import os, glob, re
import time as sex

class ReplayFile:
    def __init__(self, path, name, player, map, time, date) -> None:
        self.path = path
        self.name = name
        self.player = player
        self.map = map
        self.time = time
        self.date = date
    
    def ToString(self):
        print(f"{self.path}, {self.name}, {self.player}, {self.map}, {self.time}, {self.date}")

def formatNumber(number):
    if number < 10:
        return "0" + str(number)
    return str(number)

def formatTime(time):
    seconds = time // 1000 % 60
    minutes = time // 1000 // 60 % 60
    hours = time // 1000 // 60 // 60

    date = ""

    if hours > 0:
        date += formatNumber(hours) + ":"
    date += formatNumber(minutes) + ':' + formatNumber(seconds) + '.' + formatThousandthsNumber(time % 1000)
    return date

def formatThousandthsNumber(number):
    if number < 10: return "00" + str(number)
    if number < 100: return "0" + str(number)

    return str(number)
    
def GetMapData(path):
    line = "".join(open(path, encoding='latin-1').readlines()[0:5])
    try:
        player = line.split("@nadeolabs")[0].split("Nadeo")[1]
    except:
        player = line.split("@nadeolabs")[0].split("papychampy")[-1]
    plist = ["Mebe12", "riolu", "asier", "tween", "Samerlifofwer", "Spam", "racehans", "RedExtra", "Marius89", "NeYo", "Zypher", "Thoringer", "Paco"
             , "NicoSan", "Affi", "Kek", "Lars", "Laurens", "xFaNaTikiLL3urZ", "Fanakuri", "katakuriii", "XB1", "Cloud", "Quentin", "Yogosun", "GravelGuy"
             , "Cookie", "MattJimJett", "NSGR", "ender", "voyager"]
    for thing in plist:
        if thing.lower() in player.lower():
            player = thing
    print(path)
    if line == "":
        time = 9999999
        name = "999"
        res = -1
        return time, name, player, res
    time = line.split("times best=\"")[1].split("\"")[0]
    name = re.search("\d+", line.split("name=\"")[1].split("\"")[0])
    res = line.split("respawns=\"")[1].split("\"")[0]
    if player in ["xFaNaTikiLL3urZ", "Fanakuri", "katakuriii"]: player = "Fanakuri"
    return time, str(int(name.group(0))), player, res

if __name__ == '__main__':
    data = {}
    history = {}

    for file in glob.glob(".\\data\\allreplays\\**\\*.gbx", recursive= True):
        name = file.split("\\")[-1]
        time, map, player, res= GetMapData(file)
        if res != "-1":
            try:
                data[map].append(ReplayFile(file, name, player, map, time, os.path.getmtime(file)))
            except KeyError:
                data[map] = [ReplayFile(file, name, player, map, time, os.path.getmtime(file))]

    for k, v in data.items():
        data[k] = sorted(v, key = lambda t : t.date, reverse=False)
        wr_list = [data[k][0]]
        current_time_wr = data[k][0].time
        for thing in data[k]:
            if thing.time < current_time_wr:
                wr_list.append(thing)
                current_time_wr = thing.time
        history[k] = wr_list
    
    output = []

    for k, v in {k : v for k, v in sorted(history.items(), key = lambda t : int(t[0]), reverse = False)}.items():
        output.append("\n\n"+k)
        for thing in history[k]:
            output.append(f"{thing.player} | {formatTime(int(thing.time))} | {sex.strftime('%d/%m/%Y', sex.gmtime(thing.date))}")
    
    with open("./data/output.txt", "w", encoding='latin-1') as history:
        for line in output:
            history.write(line + '\n')