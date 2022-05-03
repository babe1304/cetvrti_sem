class Student {
    constructor(ime, prezime) {
        this.ime = ime;
        this.prezime = prezime;
        this.JMBAG = "0036" + parseInt(Math.random() * Math.pow(10,6));
    } 

    toString() {
        return this.ime + " " + this.prezime + ", " + this.JMBAG;
    }
}

let student = new Student("Jozo","Bozo");
console.log(student.toString());