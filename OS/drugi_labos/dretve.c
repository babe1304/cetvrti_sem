#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <pthread.h>
#include <unistd.h>

int id; 
int *ZajednickaVarijabla;
int GlobalnaVarijabla = 0;
int brPonavljanja;

void *Rad(void) 
{
    printf("Pokrenuta RADNA DRETVA\n");

    for (int i = 0; i < brPonavljanja; i++) {
        while (*ZajednickaVarijabla == 0) sleep(1);
        GlobalnaVarijabla = (*ZajednickaVarijabla) + 1;
        printf("RADNA DRETVA: pročitan broj %d i povećan na %d\n", *ZajednickaVarijabla, GlobalnaVarijabla );
        while (GlobalnaVarijabla != 0) sleep(1);
        *ZajednickaVarijabla = 0;
    }

    printf("Završila RADNA DRETVA\n");
}

void *Izlaz(void)
{   
    FILE *izlaz;
    izlaz = fopen("./izalz.txt", "w");
    printf("Pokrenuta IZLAZNA DRETVA\n\n");

    for (int i = 0; i < brPonavljanja; i++) {
        while (GlobalnaVarijabla == 0) sleep(1);
        printf("IZLAZNI PROCES: broj upisan u datoteku %d\n\n", GlobalnaVarijabla);
        fprintf(izlaz, "%d\n", GlobalnaVarijabla);
        GlobalnaVarijabla = 0;
    }

    printf("Završila IZLAZNA DRETVA\n");
}

void Ulaz(void)
{
    time_t t;
    printf("Pokrenut ULAZNI PROCES\n");
    srand((unsigned) time(&t));
    sleep(2);

    for (int i = 0; i < brPonavljanja; i++) {
        *ZajednickaVarijabla = rand() % 100 + 1;
        printf("ULAZNA DRETVA: broj %d\n", *ZajednickaVarijabla);

        for (int j = 0; j < 5; j++) {
            if (*ZajednickaVarijabla == 0) break; 
            sleep(1);
        }
    } 
    
    printf("Završio ULAZNI PROCES\n");
}

void Novi_Proces(void) 
{
    pthread_t thr_id[2];

    if (pthread_create(&thr_id[0], NULL, Rad, NULL) != 0) {
      printf("Greska pri stvaranju dretve!\n");
      exit(1);
   }
   if (pthread_create(&thr_id[1], NULL, Izlaz, NULL) != 0) {
      printf("Greska pri stvaranju dretve!\n");
      exit(1);
   }

   pthread_join(thr_id[0], NULL);
   pthread_join(thr_id[1], NULL);
}

void prekid(int sig)
{
    (void) shmdt((char *) ZajednickaVarijabla);
    (void) shmctl(id, IPC_RMID, NULL);
    exit(0);
}

int main(void)
{
    scanf("%d", &brPonavljanja);

    id = shmget(IPC_PRIVATE, sizeof(int), 0600);
    if (id == -1)
       exit(1);  
 
    ZajednickaVarijabla = (int *) shmat(id, NULL, 0);
    *ZajednickaVarijabla = 0;
    sigset(SIGINT, prekid);
 
    if (fork() == 0) {
        Novi_Proces();
        exit(0);
    }
    if (fork() == 0) {
        Ulaz();
        exit(0);
    }
    
    wait(NULL);
    wait(NULL);
    prekid(0);
 
    return 0;
}