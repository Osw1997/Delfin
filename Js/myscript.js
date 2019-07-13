
function setup() {
    // MOEAS
    moeas = ["MOEA0", "MOEA1", "MOEA2", "MOEA3", "MOEA4"];
    length_moeas = moeas.length;
    var html_moeas = '';
    for (var n = 0; n < length_moeas; n++) {
        html_moeas += "<input type=\"checkbox\" name=\"" + moeas[n] + "\" id=\"MOEA" + n + "\">" + moeas[n] + "<br>"
    }
    document.getElementById("list_moea").innerHTML = html_moeas;
}

function agregar() {
    document.getElementById("edit_btn").style.visibility =  "visible";
    document.getElementById("next_btn").style.visibility =  "visible";
    document.getElementById("add_btn").style.visibility =  "hidden";
    // Disable checkbox list
    var indx_checkbox;
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "MOEA" + n;
        document.getElementById(indx_checkbox).disabled = true;
    }
}

function editar() {
    document.getElementById("edit_btn").style.visibility =  "hidden";
    document.getElementById("next_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "visible";
    // Enable checkbox list
    var indx_checkbox;
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "MOEA" + n;
        document.getElementById(indx_checkbox).disabled = false;
    }
}

function continue_problem() {
    document.getElementById("edit_btn").style.visibility =  "hidden";
    document.getElementById("next_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "hidden";
    // List of problems
    dtlz_p = ["DTLZ1", "DTLZ2", "DTLZ3", "DTLZ4", "DTLZ5", "DTLZ6", "DTLZ7"];
    wfg_p = ["WFG1", "WFG2", "WFG3", "WFG4", "WFG5", "WFG6", "WFG7", "WFG8", "WFG9"];
    dtlz_1_p = ["DTLZ<sup>-1</sup>1", "DTLZ<sup>-1</sup>2", "DTLZ<sup>-1</sup>3", "DTLZ<sup>-1</sup>4", "DTLZ<sup>-1</sup>5", "DTLZ<sup>-1</sup>6", "DTLZ<sup>-1</sup>7"];
    wfg_1_p = ["WFG<sup>-1</sup>1", "WFG<sup>-1</sup>2", "WFG<sup>-1</sup>3", "WFG<sup>-1</sup>4", "WFG<sup>-1</sup>5", "WFG<sup>-1</sup>6", "WFG<sup>-1</sup>7", "WFG<sup>-1</sup>8", "WFG<sup>-1</sup>9"];
    other_p = ["Lamé", "Mirror"];
    vie_p = ["VIE1", "VIE2", "VIE3"];
    uf_p = ["UF1", "UF2", "UF3", "UF4", "UF5", "UF6", "UF7", "UF8", "UF9"];

    length_p = dtlz_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + dtlz_p[n] + "\" id=\"DLTZ" + n + "\">" + dtlz_p[n] + "<br>"
    }
    document.getElementById("dtlz_id").innerHTML = html_txt;

    length_p = wfg_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + wfg_p[n] + "\" id=\"WFG" + n + "\">" + wfg_p[n] + "<br>"
    }
    document.getElementById("wfg_id").innerHTML = html_txt;

    length_p = dtlz_1_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + dtlz_1_p[n] + "\" id=\"DLTZ_1" + n + "\">" + dtlz_1_p[n] + "<br>"
    }
    document.getElementById("dtlz_1_id").innerHTML = html_txt;

    length_p = wfg_1_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + wfg_1_p[n] + "\" id=\"WFG_1" + n + "\">" + wfg_1_p[n] + "<br>"
    }
    document.getElementById("wfg_1_id").innerHTML = html_txt;

    length_p = other_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + other_p[n] + "\" id=\"OTHER" + n + "\">" + other_p[n] + "<br>"
    }
    document.getElementById("other_id").innerHTML = html_txt;

    length_p = vie_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + vie_p[n] + "\" id=\"VIE" + n + "\">" + vie_p[n] + "<br>"
    }
    document.getElementById("vie_id").innerHTML = html_txt;

    length_p = uf_p.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + uf_p[n] + "\" id=\"UF" + n + "\">" + uf_p[n] + "<br>"
    }
    document.getElementById("uf_id").innerHTML = html_txt;
}
