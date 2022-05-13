#include <stdio.h>
#include <stdlib.h>
#include <signal.h>
#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/shm.h>
#include <pthread.h>
#include <unistd.h>
#include <string.h>
const int MAX = 4;

pthread_mutex_t m;
pthread_cond_t uvjet[2];
int trenutno_u_restoranu[2] = {0, 0};
int cekaju[2] = {0, 0};
int ukupno_uslo[2] = {0, 0};
char linguz[] = "Linux";
char microsoft[] = "Microsoft";

void udi(int vrsta) {
    pthread_mutex_lock(&m);
    cekaju[vrsta]++;

    while (trenutno_u_restoranu[1 - vrsta] > 0 || (ukupno_uslo[vrsta] >= MAX && cekaju[1 - vrsta] > 0)) pthread_cond_wait(&uvjet[vrsta], &m);

    trenutno_u_restoranu[vrsta]++;
    cekaju[vrsta]--;
    ukupno_uslo[vrsta]++;

    if (ukupno_uslo[1 -vrsta] != 0) ukupno_uslo[1 - vrsta] = 0;
    pthread_mutex_unlock(&m);
}

void izadi(int vrsta) {
    pthread_mutex_lock(&m);

    trenutno_u_restoranu[vrsta]--;
    if (trenutno_u_restoranu[vrsta] == 0) {
        pthread_cond_broadcast(&uvjet[1 - vrsta]);
    }

    pthread_mutex_unlock(&m);
}

void *programer(void *arg) {
    int vrsta = *(int *)arg;
    char name[10] = "";

    if (vrsta == 1) strcat(name, linguz);
    else strcat(name, microsoft);

    for (int j = 0; j < 3; j++) {
        udi(vrsta);
        printf("%s programer vrste %d JE UŠAO u restoran i trenutno jede\n", name, vrsta);
        sleep(1);
        printf("%s programer vrste %d JE NA PUTU DA NAPUSTI restoran\n", name, vrsta);
        izadi(vrsta);
        printf("%s programer vrste %d JE IZAŠAO iz restorana\n", name, vrsta);
    }
}

int main(void) {

	pthread_mutex_init (&m, NULL);
	pthread_cond_init (&uvjet[0], NULL);
    pthread_cond_init (&uvjet[1], NULL);

    int n, m;

    printf("Broj Linux programera: ");
    scanf("%d", &n);
    printf("Broj Microsoft programera: ");
    scanf("%d", &m);

    pthread_t thr_id[n + m];

    for (int i = 0; i < n; i++) {
        int parametar = 0;
        if (pthread_create(&thr_id[i], NULL, programer, (void *)&parametar) != 0) {
            printf("Greska pri stvaranju dretve!\n");
            exit(1);
        }
    }

    for (int i = n; i < n + m; i++) {
        int parametar = 1;
        if (pthread_create(&thr_id[i], NULL, programer, (void *)&parametar) != 0) {
            printf("Greska pri stvaranju dretve!\n");
            exit(1);
        }
    }

    for (int i = 0; i < n + m; i++) {
        pthread_join(thr_id[i], NULL);
    }

    return EXIT_SUCCESS;
}