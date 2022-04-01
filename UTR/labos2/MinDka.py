import sys

class Automat():

    def __init__(self):
        self.procitaj()
        self.start()

    def procitaj(self):
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

    def nadi_istovjetne(self):
        return

    def nadi_nedohvatljive(self):
        return

    def eliminiraj(self):
        return

if __name__ == "__main__":
    automat = Automat()