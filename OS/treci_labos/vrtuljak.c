#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <pthread.h>
#include <unistd.h>
#include <semaphore.h>

sem_t *sem1;
sem_t *sem2;
sem_t *sem3;
sem_t *sem4;
int id;

void prekid(int sig)
{
    (void) shmdt((char *) sem1);
    (void) shmdt((char *) sem2);
    (void) shmdt((char *) sem3);
    (void) shmdt((char *) sem4);
    exit(0);
}   

void posjetitelj(int n, int i) 
{
    while (1) {
        sem_wait(sem1); //čeka se semafor za vrtuljak
        printf("° Posjetitelj %d je ušao\n", i);
        sem_post(sem2); //postavlja se semafor da je posjetitelj ušao
        sem_wait(sem3); //čeka se semafor da je vožnja gotova
        printf("° Posjetitelj %d izlazi\n", i);
        sem_post(sem4); //postavlja se semafor da je posjetitelj izašao
    }
}

void vrtuljak(int n) 
{
    while (1) {
        printf("~Vlak se priprema za polazak\n");
        for (int i = 0; i < n; i++) sem_post(sem1); //postavljaju se semafori za mjesta u vrtuljku
        for (int i = 0; i < n; i++) sem_wait(sem2); //čekaju se semafori potvrde da su zauzeta sva mjesta
        printf("->Vožnja je krenula\n");
        for (int i = 0; i < 3; i++) {
            printf("  Vrijeme vožnje %d\n", i + 1);
            sleep(1);
        }
        for (int i = 0; i < n; i++) sem_post(sem3); //postavljaju se semafori da je moguće izaći sa svakog mjesta
        for (int i = 0; i < n; i++) sem_wait(sem4); //čekaju se semafori s potvrdom da su sva mjesta prazna
        printf("~Svi su izašli\n");
        for (int i = 0; i < 3; i++) {
            printf("  Vrijeme pripreme vrtuljka %d\n", i + 1);
            sleep(1);
        }
    }
}

int main(void)
{   
    int n, m;
    printf("Upiši broj putnika pa nakon toga broj slobodnih mjesta: "); scanf("%d %d", &n, &m);
    
    sigset(SIGINT, prekid);

    id = shmget (IPC_PRIVATE, sizeof(sem_t), 0600);
	sem1 = (sem_t *) shmat (id, NULL, 0);
	shmctl (id, IPC_RMID, NULL);
    sem_init (sem1, 1, 0);

    id = shmget (IPC_PRIVATE, sizeof(sem_t), 0600);
	sem2 = (sem_t *) shmat (id, NULL, 0);
	shmctl (id, IPC_RMID, NULL);
    sem_init (sem2, 1, 0);

    id = shmget (IPC_PRIVATE, sizeof(sem_t), 0600);
	sem3 = (sem_t *) shmat (id, NULL, 0);
	shmctl (id, IPC_RMID, NULL);
    sem_init (sem3, 1, 0);

    id = shmget (IPC_PRIVATE, sizeof(sem_t), 0600);
	sem4 = (sem_t *) shmat (id, NULL, 0);
	shmctl (id, IPC_RMID, NULL);
    sem_init (sem4, 1, 0);

    for (int i = 0; i < n; i++) {
        if (fork() == 0) {
            posjetitelj(n, i + 1);
            exit(0);
        }
    }

    vrtuljak(m);

    for (int i = 0; i < n; i++) wait(NULL);
    prekid(0);

    return EXIT_SUCCESS;
}