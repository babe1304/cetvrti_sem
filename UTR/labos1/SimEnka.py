import sys

class Automat():

    def __init__(self, nizovi, skupStanja, abcd, prihvatS, poc, funkPr):
        self.nizovi = nizovi
        self.skupStanja = skupStanja
        self.abcd = abcd
        self.prihvatS = prihvatS
        self.poc = poc
        self.funkPr = funkPr

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
    ulazniNizovi = input().split("|")
    skupStanja = input().split(",")
    abcd = input().split(",")
    prihvatS = input().split(",")
    poc = str(input()).split(",")
    funkPr = dict()
    
    for prijelaz in sys.stdin.readlines():
        ulaz, izlaz = prijelaz.rstrip().split("->")
        funkPr[tuple(ulaz.split(","))] = list(izlaz.split(","))
    
    automat = Automat(ulazniNizovi, skupStanja, abcd, prihvatS, poc, funkPr)
    automat.start()