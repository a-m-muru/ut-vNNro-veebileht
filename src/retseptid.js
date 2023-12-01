
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
];

// ja siia sisse sildid
const sildid = {};
const sildid_ar = [];
const valitud_sildid = [];

// kasulik, tagastab true, kui kahes nimekirjas on võrdseid elemente
function on_sarnaseid_elemente(list1, list2) {
    for (let i = 0; i < list1.length; i++) {
        for (let j = 0; j < list2.length; j++) {
            if (list1[i] == list2[j]) return true
        }
    }
    return false;
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
    const siltide_konteiner = document.getElementById("sildid")
    try {
        // sildid tekstifailist
        const vastus = await fetch("src/sildid.txt");
        const andmed = await vastus.text();
        let loik = andmed.split("\n");
        loik.forEach(rida => {
            rida = rida.trim();
            let siserida = rida.split(",");
            // rea esimesel kohal retsepti nimi, edasi selle sildid
            sildid[siserida[0]] = siserida.slice(1, siserida.length)
            
            for (let i = 1; i < siserida.length; i++) {
                let silt = siserida[i];
                // sildid_ar on üldine siltide nimekiri
                if (!sildid_ar.includes(silt)) {
                    sildid_ar.push(silt);
                }
            }
        });
    }
    catch (viga) {
        console.error("viga siltide laadimisel: ", viga)
    }
    // sildid lehele
    for (let i = 1; i < sildid_ar.length; i++) {
        let silt = sildid_ar[i];
        siltide_konteiner.insertAdjacentHTML(
            "beforeend",
            `<div class="silt" onclick="klops_sildil(this)">${silt}</div>`
        );
    }
}

function klops_sildil(elem) {
    const silt = elem.innerText;
    // silte saab sisse ja välja lülitada
    elem.classList.toggle("vajutatud");
    const sees = elem.classList.contains("vajutatud");
    if (sees) {
        valitud_sildid.push(silt);
    } else {
        // siltide eemaldamine valitud siltide nimekirjast
        valitud_sildid.splice(valitud_sildid.indexOf(silt), 1);
    }
    lae_retseptide_nupud()
}

function kuva_retsept(nimi) {
    retsept_pessa(lae_retsept(nimi));
}

function lae_retseptide_nupud() {
    nk = document.getElementById("retseptinimekiri");
    nk.innerHTML = "";
    if (valitud_sildid.length < 1) return;
    retseptid.forEach(retsept => {
        let retsepti_id = retsept.replaceAll("_", " ");
        // kui retseptil pole silte siis tõsta kisa
        if (!sildid.hasOwnProperty(retsepti_id)) console.error("appi ", retsepti_id, sildid)
        // kui ükskõik milline retsepti silt on valitud siltide hulgas, siis kuva retsepti nupp
        if (on_sarnaseid_elemente(sildid[retsepti_id], valitud_sildid)) {
            nk.insertAdjacentHTML(
                "beforeend",
                `<li onclick="kuva_retsept('${retsept}')">${retsepti_id}</li>`
            );
        }
    });
}

lae_sildid();
console.log(sildid)

lae_retseptide_nupud();

// algne retsept
retsept_pessa(lae_retsept("kanapasta"))