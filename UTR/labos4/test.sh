#!/bin/bash
red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

for i in {1..20} # broj ispitnih primjera
do
    # generiraj ime direktorija s vodecom nulom
    dir=$(printf "%0*d\n" 2 $i)
    # pokreni program i provjeri izlaz
    res=`python3 Parser.py < ./lab4_primjeri/test$dir/test.in | diff ./lab4_primjeri/test$dir/test.out -`
    if [ "$res" != "" ]
    then
        # izlazi ne odgovaraju
        echo "Test $dir ${red}FAIL${reset}"
        echo $res
    else
        # OK!
        echo "Test $dir ${green}PASS${reset}"
    fi
done
