#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

/* funkcije za obradu signala, navedene ispod main-a */
void obradi_dogadjaj(int sig);
void obradi_sigterm(int sig);
void obradi_sigint(int sig);
int zabavna_funkcija(int b);

int zavrsi = 1;
int broj;
FILE *obrada, *status;

int main() {

 struct sigaction sig;

 /* 1. maskiranje signala SIGUSR1 */
 sig.sa_handler = obradi_dogadjaj; 
 sigemptyset(&sig.sa_mask);
 sigaddset(&sig.sa_mask, SIGTERM); 
 sig.sa_flags = 0; 
 sigaction(SIGUSR1, &sig, NULL); 

 /* 2. maskiranje signala SIGTERM */
 sig.sa_handler = obradi_sigterm;
 sigemptyset(&sig.sa_mask);
 sigaction(SIGTERM, &sig, NULL);

 /* 3. maskiranje signala SIGINT */
 sig.sa_handler = obradi_sigint;
 sigaction(SIGINT, &sig, NULL);
 printf("Program s PID=%ld krenuo s radom\n", (long) getpid());

 /* moj dio koda */
 obrada = fopen("./obrada.txt", "r+");
 status = fopen("./status.txt", "r+");
 fscanf(status, "%d\n", &broj);
 
 if (broj == 0) 
    while (fscanf(obrada, "%d\n", &broj) != EOF);
 
 fprintf(status,"0\n");

 /* beskonačna petlja, rip */
 while(zavrsi) {
    int x = zabavna_funkcija(++broj);
    fprintf(obrada, "%d\n", x);    
    for (int i = 0; i < 5; i++) sleep(1);
 }

 printf("Program s PID=%ld zavrsio s radom\n", (long) getpid());
 fclose(obrada);
 fclose(status);
 return 0;
}

void obradi_dogadjaj(int sig) {
 printf("Broj: %d", broj);
}

void obradi_sigterm(int sig) {
 printf("SIGTERMinator will be back\n");
 fprintf(status, "%d\n",  broj);
 zavrsi = 0;
}

void obradi_sigint(int sig) {
 printf("YOU SHALL NOT WORK ANYMORE!\n");
 fclose(obrada);
 fclose(status);
 exit(1);
}

int zabavna_funkcija(int b) {
   return b * b;
}