/**
 * Pomoćna klasa koja enkapsulira parametre koje šalje korisnik. Instanca ove klase mora se proslijediti
 * kao lokalni parametar u .ejs datoteku pod ključem 'helper':
 * https://expressjs.com/en/4x/api.html#res
 *
 * ```
 * res.render('example', {
 *         ...
 *         helper: new Helper(parameters)
 *     });
 * });
 * ```
 *
 * Vaš zadatak je implementirati metode koje nisu implementirane unutar ove klase.
 * Nakon što se metode implementiraju, .ejs datoteka će se ispravno prikazati.
 * @type {Helper}
 */
module.exports = class Helper {

    constructor(params) {
        this.params = params;
    }

    /**
     * Metoda vraća niz koji je korisnik proslijedio za input
     * 'When would you like to have your package delivered (dd.mm.yyyy.)?'
     * ili prazan string.
     * @returns {string|*}
     */
    deliveryDate() {
        // ZADATAK
        if (this.params["deliveryDate"] === undefined) return '';
        return this.params["deliveryDate"];
    }


    /**
     * Metoda vraća niz koji je korisnik proslijedio za input
     * 'What is your address?'
     * ili prazan string.
     * @returns {string|*}
     */
    address() {
        // ZADATAK
        if (this.params["deliveryAdress"] === undefined) return '';
        return this.params["deliveryAdress"];
    }


    /**
     * Metoda vraća polje mogućih vrijednosti za input
     * 'If you are not at home at the given date, where would you like your package delivered?'
     * @returns {string[]}
     */
    deliveryAlternativeValues() {
        // ZADATAK
        return ['At our nearest affiliate', 'At the nearest post office'];
    }

    /**
     * Za proslijeđeni parametar 'val', ova metoda vraća string 'checked' ako se 'val'
     * podudara s opcijom koju je korisnik odabrao za input
     * 'If you are not at home at the given date, where would you like your package delivered?'
     * ,a inače vraća undefined.
     *
     * @param val input
     * @returns {string} 'checked' ili undefined
     */
    isDeliveryAlternativeSelected(val) {
        // ZADATAK

        if (val !== this.params["deliveryAlternative"]) return undefined;  
        return 'checked';
    }


    /**
     * Metoda zamjenjuje znak razmaka ' ' u nizu sa '-' i pretvara string u mala slova
     * @param val input
     * @returns {string}
     */
    stringToHTMLId(val) {
        // NE TREBA implementirati
        return String(val).split(' ').join('-').toLowerCase();
    }

}
