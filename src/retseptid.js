
// retseptid lisatakse retseptipessa
const retseptipesa = document.getElementById("retseptipesa");
console.log(retseptipesa);

// siia käivad retseptifailide nimed
const retseptid = [
    "kanapasta",
    "naide"
]

// abi: https://stackoverflow.com/questions/196498/how-do-i-load-the-contents-of-a-text-file-into-a-javascript-variable
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

function kuva_retsept(nimi) {
    retsept_pessa(lae_retsept(nimi));
}

// testimine
retsept_pessa(lae_retsept("kanapasta"))