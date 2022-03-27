import sys

class Automat():

    def __init__(self):
        self.procitaj()
        self.start()

    def procitaj(self):
        self.nizovi = input().split("|")
        self.skupStanja = input().split(",")
        self.abcd = input().split(",")
        self.prihvatS = input().split(",")
        self.poc = str(input()).split(",")
        self.funkPr = dict()
    
        for prijelaz in sys.stdin.readlines():
            ulaz, izlaz = prijelaz.rstrip().split("->")
            self.funkPr[tuple(ulaz.split(","))] = list(izlaz.split(","))
    

    def start(self):
        for i, niz in enumerate(self.nizovi):
            self.rjesiNiz(niz.split(","))
            print()
        return
 
    def rjesiNiz(self, ulaz):
        trStanja = self.provjeri_e_okruzenje(self.poc)
        print(*trStanja, sep="," ,end="|")

        for i, slovo in enumerate(ulaz):
            trStanja = self.provjeri_e_okruzenje(self.nadiSljedecaStanja(trStanja, slovo))
            print(*trStanja, sep="," ,end="|" if i != len(ulaz) - 1 else "")
        return

    def provjeri_e_okruzenje(self, trStanja, svaStanja=[]):
        svaStanja = trStanja if len(svaStanja) == 0 else svaStanja
        trStanja.sort()
        for stanje in trStanja:
            if stanje == "#":
                continue
            if tuple([stanje, "$"]) in self.funkPr.keys():
                for moguceStanje in self.funkPr.get(tuple([stanje, "$"])):
                    if moguceStanje == "#":
                        continue
                    if moguceStanje not in svaStanja:
                        svaStanja.append(moguceStanje)
                        svaStanja = self.provjeri_e_okruzenje([moguceStanje], svaStanja)
        svaStanja.sort()
        return svaStanja

    def nadiSljedecaStanja(self, trStanja, slovo):
        sljStanja = list()

        for stanje in trStanja:
            if stanje == "#":
                continue
            if tuple([stanje, slovo]) in self.funkPr.keys():
                for moguceStanje in self.funkPr.get(tuple([stanje, slovo])):
                    if moguceStanje == "#":
                        continue
                    if moguceStanje not in sljStanja:
                        sljStanja.append(moguceStanje)

        return sljStanja if len(sljStanja) != 0 else ["#"]

if __name__ == "__main__":
    automat = Automat()