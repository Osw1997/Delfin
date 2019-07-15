
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
// Dimensions
dims_available = ["dim_1", "dim_2", "dim_3"];
length_dimensions = dims_available.length;
// List of indicators
indicators = ["HV", "NHV", "GD", "IGD", "IGD+", "DELTAP", "EPSILON*", "EPSILON+", "MAXMIN",
              "R2", "ONGV", "C", "SP", "SPD", "S-ENERGY", "M1", "DELTAP+", "IGD-NS", "SIGMA",
              "TAU", "KAPPA", "OBJIGD"];
length_indicator = indicators.length;

function setup() {
    // MOEAS' HTML
    var html_moeas = '';
    for (var n = 0; n < length_moeas; n++) {
        html_moeas += "<input type=\"checkbox\" name=\"" + moeas[n] + "\" id=\"MOEA" + n + "\">" + moeas[n] + "<br>"
    }
    document.getElementById("list_moea").innerHTML = html_moeas;

    //DIMENSIONS' HTML
    var html_dims = '';
    for (var n = 0; n < length_dimensions; n++) {
        html_dims += "<input type=\"checkbox\" name=\"" + dims_available[n] + "\" id=\"DIM_" + (n + 1) + "\">" + (n + 1) + "Dimension(es) <br>"
    }
    document.getElementById("list_dimension").innerHTML = html_dims;

    // PROBLEMS' HTML
    array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
    array_problems_str = ["dtlz", "wfg", "dtlz_1", "wfg_1", "other", "vie", "uf"];
    number_problems = array_problems_str.length;
    for (n = 0; n < number_problems; n++) {
        fill_problem_table(array_problems[n], array_problems_str[n]);
    }

    // INDICATORS' HTML
    // Enable list of indicators
    var html_indicator = '';
    for (n = 0; n < length_indicator; n++) {
        html_indicator += "<input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "<br>"
    }
    document.getElementById("indicators_id").innerHTML = html_indicator;
}

function agregar() {
    flag_p = false;
    // Check at least one problem was selected
    for (n = 0; n < length_moeas; n++) {
        if (document.getElementById("MOEA" + n).checked && !flag_p)
            flag_p = true;
    }
    // Check at least one dimension was selected
    flag_d = false;
    for (n = 0; n < length_dimensions; n++) {
        if (document.getElementById("DIM_" + (n + 1)).checked && !flag_d)
            flag_d = true;
    }
    if(flag_p && flag_d){
        document.getElementById("edit_btn").style.visibility =  "visible";
        document.getElementById("next_btn").style.visibility =  "visible";
        document.getElementById("add_btn").style.visibility =  "hidden";
        // Disable checkbox list of problems
        var indx_checkbox;
        for (var n = 0; n < length_moeas; n++) {
            indx_checkbox = "MOEA" + n;
            document.getElementById(indx_checkbox).disabled = true;
        }
        // Disable checkbox list of dimensions
        for (var n = 0; n < length_dimensions; n++) {
            indx_checkbox = "DIM_" + (n + 1);
            document.getElementById(indx_checkbox).disabled = true;
        }
    } else {
        alert("Ningun MOEA/dimension seleccionado");
    }
    
}

function editar() {
    document.getElementById("edit_btn").style.visibility =  "hidden";
    document.getElementById("next_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "visible";
    // Enable checkbox list of problems
    var indx_checkbox;
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "MOEA" + n;
        document.getElementById(indx_checkbox).disabled = false;
    }
    // Enable checkbox list of dimensions
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "DIM_" + (n + 1);
        document.getElementById(indx_checkbox).disabled = false;
    }
}

// Function that fills the problem table in HTML
function fill_problem_table(vector_problem, type_problem) {
    length_p = vector_problem.length;
    var html_txt = '';
    for (var n = 0; n < length_p; n++) {
        html_txt += "<input type=\"checkbox\" name=\"" + vector_problem[n] + "\" id=\"" + type_problem.toUpperCase() + n + "\" disabled>" + vector_problem[n] + "<br>"
    }
    document.getElementById(type_problem + "_id").innerHTML = html_txt;
}

function continue_problem() {
    document.getElementById("edit_btn").style.visibility =  "hidden";
    document.getElementById("next_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "hidden";
    document.getElementById("back_btn").style.visibility =  "visible";
    document.getElementById("go_btn").style.visibility =  "visible";

    // Enable problems options
    for (n = 0; n < number_problems; n++) {
        length_p = array_problems[n].length;
        for (m = 0; m < length_p; m++) {
            indx_checkbox = array_problems_str[n].toUpperCase() + m;
           document.getElementById(indx_checkbox).disabled = false;
        }            
    }
}

function back_moea() {
    document.getElementById("back_btn").style.visibility =  "hidden";
    document.getElementById("go_btn").style.visibility =  "hidden";
    document.getElementById("add_btn").style.visibility =  "visible";
    // Disable problems options
    for (n = 0; n < number_problems; n++) {
        length_p = array_problems[n].length;
        for (m = 0; m < length_p; m++) {
            indx_checkbox = array_problems_str[n].toUpperCase() + m;
           document.getElementById(indx_checkbox).disabled = true;
        }            
    }
    // Enable MOEAs
    var indx_checkbox;
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "MOEA" + n;
        document.getElementById(indx_checkbox).disabled = false;
    }
    // Enable checkbox list of dimensions
    for (var n = 0; n < length_moeas; n++) {
        indx_checkbox = "DIM_" + (n + 1);
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


function load_indicators() {
    flag = false;

    array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
    array_problems_str = ["DTLZ", "WFG", "DTLZ_1", "WFG_1", "OTHER", "VIE", "UF"];
    number_problems = array_problems_str.length;
    // Check that at least one option is selected
    for (m = 0; m < number_problems; m++) {
        flag = flag || check_checkbox_problem(array_problems[m], array_problems_str[m]);
    }
    // If at least one option was selected, continue
    if (flag) {
        document.getElementById("go_btn").style.visibility =  "hidden";
        document.getElementById("back_btn").style.visibility =  "hidden";
        document.getElementById("finish_btn").style.visibility =  "visible";
        document.getElementById("back2prob_btn").style.visibility =  "visible";
        
        // Disable problems options
        for (n = 0; n < number_problems; n++) {
            length_p = array_problems[n].length;
            for (m = 0; m < length_p; m++) {
                indx_checkbox = array_problems_str[n] + m;
               document.getElementById(indx_checkbox).disabled = true;
            }            
        }
        // Enable checkbox list of indicators
        for (var n = 0; n < length_indicator; n++) {
            document.getElementById(indicators[n]).disabled = false;
        }
    } else {
        alert("Ningun problema seleccionado");
    }
}


function back_problem() {
    document.getElementById("finish_btn").style.visibility =  "hidden";
    document.getElementById("back2prob_btn").style.visibility =  "hidden";
    document.getElementById("go_btn").style.visibility =  "visible";
        document.getElementById("back_btn").style.visibility =  "visible";
    // Enable problems options
    for (n = 0; n < number_problems; n++) {
        length_p = array_problems[n].length;
        for (m = 0; m < length_p; m++) {
            indx_checkbox = array_problems_str[n] + m;
           document.getElementById(indx_checkbox).disabled = false;
        }            
    }
    // Disable checkbox list of indicators
    for (var n = 0; n < length_indicator; n++) {
        document.getElementById(indicators[n]).disabled = true;
    }
}