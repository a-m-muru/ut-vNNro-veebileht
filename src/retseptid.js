
// skripti autor A M Muru

// retseptid lisatakse retseptipessa
const retseptipesa = document.getElementById("retseptipesa");
console.log(retseptipesa);

// siia käivad retseptifailide nimed
const retseptid = [
    "ahjuköögiviljad",
    "burgeri_takod",
    "chili_con_carne",
    "kanapasta",
    "köögiviljapirukas",
    "laetud_friikad",
    "maapähklivõi_nuudlid",
    "tatar_peekoniga",
    "tuunikala_kauss",
    "tuunikala_pasta"
]

// ja siia sisse sildid
const sildid = {

}

// abi: https://stackoverflow.com/questions/196498/how-do-i-load-the-contents-of-a-text-file-into-a-javascript-variable
// Edward Z Yang ja Pharaoah Jardin
async function lae_retsept(nimi) {
    try {
        // retseptid laetakse /md/-kaustast
        const vastus = await fetch("md/" + nimi + ".md");
        const andmed = await vastus.text();
        return andmed;
    }
    catch (viga) {
        console.error(viga);
    }
    console.error("mingi jama");
    return null;
}

function retsept_pessa(retsept) {
    retsept.then((andmed) => {
        // md konverteerimine html-iks kasutades Showdown-teeki
        let converter = new showdown.Converter();
        let html = converter.makeHtml(andmed);
        retseptipesa.innerHTML = html;
    })
}

async function lae_sildid() {
    try {
        const vastus = await fetch("src/sildid.txt");
        const andmed = await vastus.text();
        let loik = andmed.split("\n");
        loik.forEach(rida => {
            let siserida = rida.split(",");
            sildid[siserida[0]] = siserida.slice(1, siserida.length)
        });
    }
    catch (viga) {
        console.error("viga siltide laadimisel: ", viga)
    }
}

function kuva_retsept(nimi) {
    retsept_pessa(lae_retsept(nimi));
}

function lae_retseptide_nupud() {
    nk = document.getElementById("retseptinimekiri");
    retseptid.forEach(retsept => {
        nk.insertAdjacentHTML(
            "beforeend",
            `<li onclick="kuva_retsept('${retsept}')">${retsept.replaceAll("_", " ")}</li>`
        )
    });
}

lae_sildid();
console.log(sildid)

lae_retseptide_nupud();

// testimine
retsept_pessa(lae_retsept("kanapasta"))