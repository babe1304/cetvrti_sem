#include <iostream>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>
#include <math.h>

/* funkcije za obradu signala, navedene ispod main-a */
void obradi_dogadjaj(int sig);
void obradi_sigterm(int sig);
void obradi_sigint(int sig);
int zabavna_funkcija(int b);

int zavrsi = 1;
int broj;
FILE *obrada, *status;

int main()
{
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

   /* moj dio koda - čitanje*/
   obrada = fopen("./obrada.txt", "r");
   status = fopen("./status.txt", "r");
   fscanf(status, "%d\n", &broj);
   fclose(status);
   
   if (broj == 0) 
      while (fscanf(obrada, "%d\n", &broj) != EOF)
         broj = sqrt(broj);
   fclose(obrada);

   /* ponovno otvaranje datoteka - pisanje*/
   obrada = fopen("./obrada.txt", "r+");
   status = fopen("./status.txt", "w");
   fprintf(status,"0\n");
   fclose(status);

   /* prolaz kroz pbrada.txt do kraja dokumenta 
    * da se ne prepiše preko već postojećih podataka
    */
   int tmp;
   while (fscanf(obrada, "%d\n", &tmp) != EOF)
      ;

   /* beskonačna petlja, rip */
   while(zavrsi) {
      int x = zabavna_funkcija(++broj);
      fprintf(obrada, "%d\n", x);    
      for (int i = 0; i < 5; i++) sleep(1);
   }

   printf("Program s PID=%ld zavrsio s radom\n", (long) getpid());
   fclose(obrada);
   return 0;
}

void obradi_dogadjaj(int sig)
{
   printf("Broj: %d\n", broj);
}

void obradi_sigterm(int sig) 
{
   printf("SIGTERM aktiviran!\n");
   status = fopen("./status.txt", "w");
   fprintf(status, "%d\n",  broj);
   zavrsi = 0;
}

void obradi_sigint(int sig) 
{
   printf("SIGINT aktiviran!\n");
   fclose(obrada);
   exit(1);
}

int zabavna_funkcija(int b) 
{
   return b * b;
}