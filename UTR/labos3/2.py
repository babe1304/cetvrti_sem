import sys

class Automat():

    def __init__(self):
        self.procitaj()
        self.start()

    def procitaj(self):
        self.nizovi = input().split("|")
        self.skupStanja = input().split(",")
        self.abcd = input().split(",")
        self.znakoviStoga = input().split(",")
        self.prihvatS = input().split(",")
        self.pocStanje = str(input())
        self.pocStog = str(input())
        self.funkPr = dict()
    
        for prijelaz in sys.stdin.readlines():
            ulaz, izlaz = prijelaz.strip().split("->")
            self.funkPr[tuple(ulaz.split(","))] = list(izlaz.split(","))

    def start(self):
        for niz in self.nizovi:
            self.rjesiNiz(niz.split(","))
        return
 
    def provjeri_epsilon(self, stanje, znakStoga, stog):
        while tuple([stanje, "$", znakStoga]) in self.funkPr.keys() and stanje not in self.prihvatS:
                stanje, znakStoga = self.funkPr[tuple([stanje, "$", znakStoga])]
                stog.extend(znakStoga[::-1] if znakStoga != "$" else [])
                print(stanje, "".join(stog[::-1]), sep="#", end="|") if stog else print(stanje, "$", sep="#", end="|")
                znakStoga = stog.pop() if stog else znakStoga
        return stanje, znakStoga, stog

    def rjesiNiz(self, niz):
        stog = [self.pocStog]
        stanje = self.pocStanje
        print(stanje, "".join(stog), sep="#", end="|")

        for slovo in niz:
            znakStoga = stog.pop() if stog else "$"
            stanje, znakStoga, stog = self.provjeri_epsilon(stanje, znakStoga, stog)
            if tuple([stanje, slovo, znakStoga]) in self.funkPr.keys() or (tuple([stanje, "$", znakStoga]) in self.funkPr.keys() and not stog):
                stanje, znakStoga = self.funkPr[tuple([stanje, slovo, znakStoga])] if not (tuple([stanje, "$", znakStoga]) in self.funkPr.keys() and not stog) else self.funkPr[tuple([stanje, "$", znakStoga])]
                stog.extend(znakStoga[::-1] if znakStoga != "$" else [])
            else:
                print("fail|0")
                return
            print(stanje, "".join(stog[::-1]), sep="#", end="|") if stog else print(stanje, "$", sep="#", end="|")
        stanje, znakStoga, stog = self.provjeri_epsilon(stanje, stog.pop(), stog) if stanje not in self.prihvatS and stog else [stanje, znakStoga, stog]
        print(f"{1 if stanje in self.prihvatS else 0}")
        return
            
if __name__ == "__main__":
    automat = Automat()