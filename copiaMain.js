const rowMarkup = `
    <tr id="row-@" class="row-data">
        <td id="oggetto-@" class="table-column"></td>
        <td id="prezzo-@" class="table-column"></td>
        <td class="table-column"><button id="@" onclick="eliminaRiga(this)" class="interfaccia-item bottone giallo">&times;</button></td>
    </tr>
`;

//*********************************************************
// don't try this at home
Number.prototype.arrotonda = function (digits, base) {
    let multiplier = Math.pow(base = 10, digits);
    return Math.round(this * multiplier) / multiplier
}
//*********************************************************


let latestId = 0;
let totPrezzi = 0;
let descrizione = document.getElementById('descrizioneInput');
let importo = document.getElementById('importoInput');
let totale = document.getElementById('totale-spese');
let lista = document.getElementById('lista-body');
let postaBtn = document.getElementById('posta-btn');
let resettaBtn = document.getElementById('resetta-btn');


//some helper functions
function createRow() {
    let nuovaRow = rowMarkup;
    nuovaRow = nuovaRow.replace(/@/g, latestId);
    lista.innerHTML = lista.innerHTML + nuovaRow;
}

function fillRow(){
    document.getElementById(`oggetto-${latestId}`).textContent = descrizione.value;
    document.getElementById(`prezzo-${latestId}`).textContent = importo.value;
}

function updateTotal(newTotal){
    totale.textContent = `${newTotal.toFixedNumber(2)}`;
}

//****************************************************************************************************

//the actual functions

//add expense to list
function postaSpesa() {
    totPrezzi = parseFloat(totPrezzi).arrotonda(2) + parseFloat(importo.value).arrotonda(2);

    createRow();
    fillRow();
   
    updateTotal(totPrezzi);

    latestId++;
    descrizione.value = '';
    importo.value = '';
    EnableDisable();

}

//delete expense from list
function eliminaRiga(questo) {
    let indice = questo.id;                                      //       
    let myPrezzo = document.getElementById(`prezzo-${indice}`);  // variabili utitli   
    let myRow = document.getElementById(`row-${indice}`);        //   
    let myBody = myRow.parentNode;                               //
    let newTotale = parseFloat(totPrezzi) - parseFloat(myPrezzo.innerText);

    totale.textContent = newTotale.arrotonda(2);    //aggiorno nodo che mostra il totale
    totPrezzi = newTotale.arrotonda(2);          //aggiorno il totale

    myBody.removeChild(myRow);      //elimino child
}


//delete all expenses from list
function resettaSpesa() {
    lista.innerHTML = '';
    totPrezzi = 0;
    totale.textContent = totPrezzi;
}

//****************************************************************************************************

//enable post button when input field is not empty
function EnableDisable() {
    if (descrizione.value.trim() != "" && importo.value != '') {
        postaBtn.disabled = false;
    } else if (descrizione.value.trim() == "" || importo.value == '') {
        postaBtn.disabled = true;
    }
}

// EVENT LISTENERS

function checkIfNum(stringa) {
    if (/[^0-9.]+/g.test(stringa)) {
        stringa = stringa.replace(/[^0-9.]+/g, '');
        alert('caratteri consentiti: numeri e il punto (.)');
    }
    return stringa;
}

descrizione.addEventListener('keyup', () => {
    EnableDisable();
});
importo.addEventListener('input', () => {
    EnableDisable();

    importo.value=checkIfNum(importo.value);
});
