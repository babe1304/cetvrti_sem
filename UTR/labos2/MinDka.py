import sys

class Automat():

    def __init__(self):
        self.procitaj()
        self.start()

    def procitaj(self):
        self.skupStanja = input().split(",")
        self.abcd = input().split(",")
        self.prihvatS = input().split(",")
        self.prihvatS = list() if self.prihvatS[0] == '' else self.prihvatS #Provjera u slučaju praznog skupa prihvatljivih
        self.poc = str(input()).split(",")
        self.funkPr = dict()
    
        for prijelaz in sys.stdin.readlines():
            ulaz, izlaz = prijelaz.rstrip().split("->")
            self.funkPr[tuple(ulaz.split(","))] = list(izlaz.split(","))

    def start(self):
        self.skupStanja = sorted(list(self.nadi_dohvatljive()))
        self.eliminiraj()
        istovjetnaS = self.nadi_istovjetne()
        self.obradi(istovjetnaS)
        print(*self.skupStanja, sep=",")
        print(*self.abcd, sep=",")
        print(*self.prihvatS, sep=",")
        print(*self.poc, sep=",")
        for key, value in self.funkPr.items():
            print(*key, sep=",", end=f"->{value}\n")

    def obradi(self, istovjetnaS):
        if len(istovjetnaS) == 0: return 
        grupirana_istovjetna = []
        grupirana_istovjetna.append(set(istovjetnaS.pop()))

        while len(istovjetnaS) != 0:
            lista = list(istovjetnaS.pop())
            slj_grupiranja_stanja = grupirana_istovjetna
            for grupa in grupirana_istovjetna:
                if lista[0] in grupa or lista[1] in grupa:
                    grupa.update(lista)
                else:
                    slj_grupiranja_stanja.append(set(lista))
            grupirana_istovjetna = slj_grupiranja_stanja
        grupirana_istovjetna = list(dict.fromkeys([tuple(sorted(stanja)) for stanja in grupirana_istovjetna]))
        for grupa in grupirana_istovjetna:
            zam_stanje = grupa[0]
            for stanje in grupa[1:]:
                if stanje in self.skupStanja:
                    self.skupStanja.remove(stanje)
                if stanje in self.prihvatS:
                    self.prihvatS.remove(stanje)
                for slovo in self.abcd:
                    if tuple([stanje, slovo]) in self.funkPr.keys():
                        self.funkPr.pop(tuple([stanje, slovo]))
                for key, value in self.funkPr.items():
                    if stanje in key[0]:
                        self.funkPr.pop(key)
                    if stanje == value:
                        self.funkPr[key] = zam_stanje
                for i, prihv_stanje in enumerate(self.poc):
                    if stanje == prihv_stanje:
                        self.poc[i] = zam_stanje
        return 

    def eliminiraj(self):
        nova_prihvatS = [novo_stanje for novo_stanje in self.prihvatS if novo_stanje in self.skupStanja]
        self.prihvatS = nova_prihvatS
        novi_prijelazi = {prijelaz : sljznak for prijelaz in self.funkPr.keys() if prijelaz[0] in self.skupStanja for sljznak in self.funkPr.get(prijelaz)}
        self.funkPr = novi_prijelazi

    def nadi_istovjetne(self):
        neprihvatS = list(set(self.skupStanja).difference(self.prihvatS))
        oznacenaS = {tuple(sorted([stanje1, stanje2])) for stanje1 in self.prihvatS for stanje2 in neprihvatS}
        svi_parovi = {tuple(sorted([stanje1, stanje2])) for stanje1 in self.prihvatS for stanje2 in self.prihvatS if stanje1 != stanje2}.union({tuple(sorted([stanje3, stanje4])) for stanje3 in neprihvatS for stanje4 in neprihvatS if stanje3 != stanje4})
        dict_ovisnosti = dict()
        for par in svi_parovi:
            slj_stanja = {tuple(sorted([self.funkPr.get(tuple([par[0], slovo])), self.funkPr.get(tuple([par[1], slovo]))])) for slovo in self.abcd}
            dict_ovisnosti[par] = dict_ovisnosti.get(par) if par in dict_ovisnosti.keys() else list()

            for slj_par in slj_stanja:
                if slj_par in oznacenaS:
                    oznacenaS.update([par])
                    stanja_za_pogledati = {stanja for stanja in dict_ovisnosti.get(par) if stanja not in oznacenaS}                    
                    while stanja_za_pogledati:
                        oznacenaS.update(stanja_za_pogledati)
                        stanja_za_pogledati = {stanja for pogledano_stanje in stanja_za_pogledati for stanja in dict_ovisnosti.get(pogledano_stanje) if pogledano_stanje in dict_ovisnosti.keys() and stanja not in oznacenaS}
                elif slj_par[0] != slj_par[1]:
                    if not dict_ovisnosti.get(slj_par):
                        dict_ovisnosti[slj_par] = [par]
                    else:
                        dict_ovisnosti[slj_par].append(par)
        return svi_parovi.difference(oznacenaS)

    def nadi_dohvatljive(self):
        prijasnjaDohvatljivaS = {*list(self.poc)}
        dohvatljivaS = {moguceStanje for stanje in self.poc for slovo in self.abcd if tuple([stanje, slovo]) in self.funkPr.keys() for moguceStanje in self.funkPr.get(tuple([stanje, slovo]))}
        dohvatljivaS.update(self.poc)

        while prijasnjaDohvatljivaS != dohvatljivaS:
            prijasnjaDohvatljivaS.update(dohvatljivaS)
            dohvatljivaS.update({moguceStanje for stanje in dohvatljivaS for slovo in self.abcd if tuple([stanje, slovo]) in self.funkPr.keys() for moguceStanje in self.funkPr.get(tuple([stanje, slovo]))})
        return dohvatljivaS

if __name__ == "__main__":
    automat = Automat()