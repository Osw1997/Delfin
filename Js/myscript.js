
// MOEAS
moeas = ["MOMBI2", "NSGA2&nbsp;&nbsp;&nbsp;", "SMS&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"];
length_moeas = moeas.length;
// List of problems
dtlz_p = ["DTLZ1", "DTLZ2", "DTLZ3", "DTLZ4", "DTLZ5", "DTLZ6", "DTLZ7"];
wfg_p = ["WFG1", "WFG2", "WFG3", "WFG4", "WFG5", "WFG6", "WFG7", "WFG8", "WFG9"];
dtlz_1_p = ["DTLZ<sup>-1</sup>1", "DTLZ<sup>-1</sup>2", "DTLZ<sup>-1</sup>3", "DTLZ<sup>-1</sup>4", "DTLZ<sup>-1</sup>5", "DTLZ<sup>-1</sup>6", "DTLZ<sup>-1</sup>7"];
wfg_1_p = ["WFG<sup>-1</sup>1", "WFG<sup>-1</sup>2", "WFG<sup>-1</sup>3", "WFG<sup>-1</sup>4", "WFG<sup>-1</sup>5", "WFG<sup>-1</sup>6", "WFG<sup>-1</sup>7", "WFG<sup>-1</sup>8", "WFG<sup>-1</sup>9"];
other_p = ["Lam&#233;", "Mirror"];
vie_p = ["VIE1", "VIE2", "VIE3"];
uf_p = ["UF1", "UF2", "UF3", "UF4", "UF5", "UF6", "UF7", "UF8", "UF9"];

function setup() {
    var html_moeas = '';
    for (var n = 0; n < length_moeas; n++) {
        html_moeas += "<input type=\"checkbox\" name=\"" + moeas[n] + "\" id=\"MOEA" + n + "\">" + moeas[n] + "<br>"
    }
    document.getElementById("list_moea").innerHTML = html_moeas;
}

function agregar() {
    flag = false;
    for (n = 0; n < length_moeas; n++) {
        if (document.getElementById("MOEA" + n).checked && !flag)
            flag = true;
    }
    if(flag){
        document.getElementById("edit_btn").style.visibility =  "visible";
        document.getElementById("next_btn").style.visibility =  "visible";
        document.getElementById("add_btn").style.visibility =  "hidden";
        // Disable checkbox list
        var indx_checkbox;
        for (var n = 0; n < length_moeas; n++) {
            indx_checkbox = "MOEA" + n;
            document.getElementById(indx_checkbox).disabled = true;
        }
    } else {
        alert("Ningun MOEA seleccionado");
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

// Function that fills the problem table in HTML
function fill_problem_table(vector_problem, type_problem) {
    length_p = vector_problem.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + vector_problem[n] + "\" id=\"" + type_problem.toUpperCase() + n + "\">" + vector_problem[n] + "<br>"
    }
    document.getElementById(type_problem + "_id").innerHTML = html_txt;
}

function continue_problem() {
    document.getElementById("edit_btn").style.visibility =  "hidden";
    document.getElementById("next_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "hidden";
    document.getElementById("back_btn").style.visibility =  "visible";
    document.getElementById("go_btn").style.visibility =  "visible";

    array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
    array_problems_str = ["dtlz", "wfg", "dtlz_1", "wfg_1", "other", "vie", "uf"];
    number_problems = array_problems_str.length;
    for (n = 0; n < number_problems; n++) {
        fill_problem_table(array_problems[n], array_problems_str[n]);
    }
}

function back_moea() {
    document.getElementById("back_btn").style.visibility =  "hidden";
    document.getElementById("go_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "visible";
    var indx_checkbox;
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "MOEA" + n;
        document.getElementById(indx_checkbox).disabled = false;
    }
}
function check_checkbox_problem(vector_problem, type_problem) {
    length_problem = vector_problem.length;
    flag = false;
    for (n = 0; n < length_problem; n++) {
        if (document.getElementById(type_problem + n).checked && !flag)
            flag = true;
    }
    return flag;    
}

function check() {
    flag = false;
    array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
    array_problems_str = ["DTLZ", "WFG", "DTLZ_1", "WFG_1", "OTHER", "VIE", "UF"];
    number_problems = array_problems_str.length;
    for (n = 0; n < number_problems; n++) {
        flag = flag || check_checkbox_problem(array_problems[n], array_problems_str[n]);
        //console.log(n);   
    }
    return flag;
}
function load_indicators() {
    flag = false;
    /*
    flag = flag || check_checkbox_problem(dtlz_p, "DTLZ");
    flag = flag || check_checkbox_problem(wfg_p, "WFG");
    flag = flag || check_checkbox_problem(dtlz_1_p, "DTLZ_1");
    flag = flag || check_checkbox_problem(wfg_1_p, "WFG_1");
    flag = flag || check_checkbox_problem(other_p, "OTHER");
    flag = flag || check_checkbox_problem(vie_p, "VIE");
    flag = flag || check_checkbox_problem(uf_p, "UF");
    */
    /*array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
    array_problems_str = ["DTLZ", "WFG", "DTLZ_1", "WFG_1", "OTHER", "VIE", "UF"];
    number_problems = array_problems_str.length;
    for (n = 0; n < number_problems; n++) {
        flag = flag || check_checkbox_problem(array_problems[n], array_problems_str[n]);
        console.log(n);
        
    }*/
    if (flag) {

    } else {
        alert("Ningun problema seleccionado");
    }
}