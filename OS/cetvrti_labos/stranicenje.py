#%%
from random import randint
from time import sleep

n, m = int(input()), int(input())

okvir = {i : ['0' * 8 for _ in range(64)] for i in range(m)}
tablica = { i : ['0' * 16 for _ in range(16)] for i in range(n)}
disk = {i : [bin(randint(0, 256))[2:].zfill(8) for _ in range(16)] for i in range(n)}
#%%
t = 0
for i in range(5):
    for proces in tablica.keys():
        print('--------------------------------------------------')
        print(f'proces: {proces}')
        x = randint(0, 1024) & 0x3FE
        print(f'\tt: {t}')

        fiz_adr = bin(x)[2:].zfill(10)[4:]
        ind_okvira = int(bin(x)[2:].zfill(10)[:4], 2)
        print(f'\tlog. adresa: {hex(x)}')
        if tablica.get(proces)[ind_okvira][10] == '0':
            print("\tPromašaj!")
            stranica = disk.get(proces)[ind_okvira]

            moguci_okviri = [i for i in range(m)]
            #print(moguci_okviri)
            min_r, min_pr, min_n, min_lru = 0, 0, 0, t
            for pr, tab in tablica.items():
                for i, redak in enumerate(tab):
                    #print(f'\tkoristeni okviri {int(redak[:10], 2)}') if redak[10] == '1' else moguci_okviri
                    moguci_okviri.remove(int(redak[:10], 2)) if redak[10] == '1' else moguci_okviri
                    if redak[10] == '1' and int(redak[11:], 2) <= t and int(redak[11:], 2) < min_lru:
                        min_r, min_pr, min_n, min_lru = redak, pr, i, int(redak[11:], 2)
                    redak = bin(int(redak, 2) & 0xFFE0)[2:].zfill(16) if t == 32 else redak 

            if moguci_okviri:
                br_okvira = bin(moguci_okviri.pop(0))[2:].zfill(10) 
            else:
                br_okvira = min_r[:10]
                tab_pr = tablica.get(min_pr)
                tab_pr[min_n] = '0' * 16
                tablica[min_pr] = tab_pr    

                odabrani_okvir = okvir.get(int(br_okvira, 2))
                stara_vr = disk.get(min_pr)
                stara_vr[min_n] = odabrani_okvir[int(fiz_adr, 2)]
                disk[min_pr] = stara_vr
                odabrani_okvir[int(fiz_adr, 2)] = stranica
                print(f'\t\t\tIzbacujem stranicu {hex(min_n)} iz procesa {pr}\n\t\t\tlru izbacene stranice: {hex(int(min_r[11:], 2))}')
            print(f'\t\t\tdodijeljen okvir {hex(int(br_okvira, 2))}')
        else:
            br_okvira = tablica.get(proces)[ind_okvira][:10]

        vrijednost = okvir.get(int(br_okvira, 2))[int(fiz_adr, 2)]
        tab = tablica.get(proces)
        fiz_adr = tab[int(bin(x)[:6], 2)][:10] + fiz_adr
        tab[int(bin(x)[:6], 2)] = br_okvira.zfill(9) + '1' + bin(t if t != 32 else 0)[2:].zfill(5)
        tablica[proces] = tab
        print(f'\tfiz. adresa: {hex(int(fiz_adr, 2))}')
        print(f'\tzapis tablice: {hex(int(tab[int(bin(x)[:6], 2)], 2))}')
        print(f'\tsadržaj adrese: {int(vrijednost,2)}')
        t = 0 if t == 32 else t + 1
        sleep(1)