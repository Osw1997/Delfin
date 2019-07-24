
// MOEAS
moeas= ["MOMBI2", "NSGA2", "SMS"];
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
indicators = ["HV", "NHV", "GD", "IGD", "IGD+", "DELTAP", "EPS*", "EPS+", "ONVGR", "C", "MAXMIN",
              "R2", "ONGV", "SP", "SPD", "S-ENERGY", "M1", "DELTAP+", "IGD-NS", "SIGMA",
              "TAU", "KAPPA", "OBJIGD"];
length_indicator = indicators.length;


var html_moeas = '';
function setup() {
    // MOEAS' HTML
    
    html_moeas = "";
    for (var n = 0; n < length_moeas; n++) {
        html_moeas += "<input type=\"checkbox\" name=\"" + moeas[n] + "\" id=\"MOEA" + n + "\">" + moeas[n] + "&nbsp;&nbsp;&nbsp;&nbsp;#runs: <input type=\"number\" id=\"" + moeas[n] + "_id_nruns\" value=\"10\" min=\"0\" max=\"30\">" + "<br><br><br>"
    }
    document.getElementById("list_moea").innerHTML = html_moeas;

    //DIMENSIONS' HTML
    var html_dims = '';
    for (var n = 0; n < length_dimensions; n++) {
        html_dims += "<input type=\"checkbox\" name=\"" + dims_available[n] + "\" id=\"DIM_" + (n + 1) + "\">" + (n + 1) + "Dimension(es) <br><br><br>"
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
    /*
    // Create list of indicators
    var html_indicator = '';
    for (n = 0; n < length_indicator; n++) {
        //html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th></tr>"
        switch (indicators[n]) {
            case "HV":
            case "NHV":
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th>Reference_point <input type=\"text\" id=\"" + indicators[n] + "ref_point_id\" disabled><br> Algorithm <input type=\"text\" id=\"" + indicators[n] + "algor_id\" disabled>  </th></tr>";
                break;
            case "GD":
            case "IGD":
            case "DELTAP":
            case "DELTAP+":
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th> p_norm <input type=\"number\" id=\""+ indicators[n] +"pnorm_id\" disabled><br> Reference_file <input type=\"text\" id=\"" + indicators[n] + "refile_id\" disabled>  </th></tr>";
                break;
            case "IGD+":
            case "M1":
            case "IGD-NS":
            case "OBJIGD":
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th> Reference_file <input type=\"text\" id=\"" + indicators[n] + "refile_id\" disabled>  </th></tr>";
                break;
            case "EPS+":
            case "EPS*":
            case "ONVGR":
            case "C":
            case "SIGMA":
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th> Prefix_file_B <input type=\"text\" id=\"" + indicators[n] + "prefixB_id\" disabled>  </th></tr>";
                break;
            case "R2":
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th> Weight_filename <input type=\"text\" id=\"" + indicators[n] + "w_filename_id\" disabled> <br> UTILITY_FUNCTION <input type=\"text\" id=\"" + indicators[n] + "util_func_id\" disabled>  </th></tr>";
                break;
            case "SPD":
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th> theta <input type=\"number\" id=\""+ indicators[n] +"theta_id\" disabled></th></tr>";
                break;
            default:
                html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th><th>-</th></tr>"
                break;
        }
    }
    html_indicator += "<tr><th colspan=\"2\"><button onclick=\"ejecuta()\" id=\"finish_btn\" style=\"visibility: hidden\">Finalizar</button>";
    html_indicator += "<button onclick=\"back_problem()\" id=\"back2prob_btn\" style=\"visibility: hidden\">Regresar</button>";
    html_indicator += "</th></tr>";
    document.getElementById("indicators_id").innerHTML = html_indicator;
    */
    //document.getElementById("indicators2_id").innerHTML = html_indicator;
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
        var indx_runs_id;
        for (var n = 0; n < length_moeas; n++) {
            indx_checkbox = "MOEA" + n;
            indx_runs_id = moeas[n] + "_id_nruns";
            document.getElementById(indx_checkbox).disabled = true;
            document.getElementById(indx_runs_id).disabled = true;
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
        indx_runs_id = moeas[n] + "_id_nruns";
        document.getElementById(indx_checkbox).disabled = false;
        document.getElementById(indx_runs_id).disabled = false;
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
        indx_runs_id = moeas[n] + "_id_nruns";
        indx_checkbox = "MOEA" + n;
        document.getElementById(indx_checkbox).disabled = false;
        document.getElementById(indx_runs_id).disabled = false;
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
        //document.getElementById("finish_btn").style.visibility =  "visible";
        //document.getElementById("back2prob_btn").style.visibility =  "visible";
        
        // Disable problems options
        for (n = 0; n < number_problems; n++) {
            length_p = array_problems[n].length;
            for (m = 0; m < length_p; m++) {
                indx_checkbox = array_problems_str[n] + m;
               document.getElementById(indx_checkbox).disabled = true;
            }            
        }
        // Enable checkbox list of indicators
        /*
        for (var n = 0; n < length_indicator; n++) {
            document.getElementById(indicators[n]).disabled = false;
            change_state_indic(indicators[n], false);
        }*/
        
        // INDICATORS' HTML
        // Create list of indicators
        var html_indicator = '';
        var problems_selected = [];
        var dimensions_selected = [];
        // Get list of problems selected    
        array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
        array_problems_str = ["DTLZ", "WFG", "DTLZ_1", "WFG_1", "OTHER", "VIE", "UF"];
        number_problems = array_problems_str.length;
        for (m = 0; m < number_problems; m++){
            problems_in = array_problems[m].length;
            for (p = 0; p < problems_in; p++){
                if (document.getElementById(array_problems_str[m] + p).checked)
                    problems_selected.push(array_problems_str[m] + (p + 1));
            }
        }
        var length_problems_selected = problems_selected.length;

        // Get list of dimensions selected
        for (q = 0; q < length_dimensions; q++) {
            if (document.getElementById("DIM_" + (q+1)).checked)
                dimensions_selected.push(q + 1);
        }
        
        // Create n tables in function of dimensions selected
        for (dim = 0; dim < dimensions_selected.length; dim++) {
        //html_indicator += "<tr><th>Indicador</th><th></th></tr>";
            html_indicator += "<h3>Dimensión: " + dimensions_selected[dim] + "</h3><table><tr><th>Indicador</th>";
            for (n = 0; n < length_problems_selected; n++) {
                html_indicator += "<th>" + problems_selected[n] + "</th>";
            }
            html_indicator += "</tr>";
            for (n = 0; n < length_indicator; n++) {
                //html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + indicators[n] + "\" disabled>" + indicators[n] + "</th></tr>"
                switch (indicators[n]) {
                    case "HV":
                    case "NHV":
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\">" + indicators[n]; + "</th>"; //"<th>Reference_point <input type=\"text\" id=\"" + indicators[n] + "ref_point_id\" disabled><br> Algorithm <input type=\"text\" id=\"" + indicators[n] + "algor_id\" disabled>  </th></tr>";
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "</th><th>Reference_point <input type=\"text\" id=\"" + dimensions_selected[dim] + String(col) + indicators[n] + "ref_point_id\"><br> Algorithm <input type=\"text\" id=\"" + dimensions_selected[dim] + col + indicators[n] + "algor_id\">  </th>";//"</tr>";
                        }
                        html_indicator += "</tr>";
                        break;
                    case "GD":
                    case "IGD":
                    case "DELTAP":
                    case "DELTAP+":
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\" disabled>" + indicators[n] + "</th>"; //"<th> p_norm <input type=\"number\" id=\""+ indicators[n] +"pnorm_id\" disabled><br> Reference_file <input type=\"text\" id=\"" + indicators[n] + "refile_id\" disabled>  </th></tr>";
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "<th> p_norm <input type=\"number\" id=\"" + dimensions_selected[dim] + String(col) + indicators[n] +"pnorm_id\"><br> Reference_file <input type=\"text\" id=\"" + dimensions_selected[dim] + String(col) + indicators[n] + "refile_id\" ></th>";
                        }
                        html_indicator += "</tr>";
                        break;
                    case "IGD+":
                    case "M1":
                    case "IGD-NS":
                    case "OBJIGD":
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\" >" + indicators[n] + "</th>";//"<th> Reference_file <input type=\"text\" id=\"" + indicators[n] + "refile_id\">  </th></tr>";
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "<th> Reference_file <input type=\"text\" id=\"" + dimensions_selected[dim] + String(col) + indicators[n] + "refile_id\"> </th>";
                        }
                        html_indicator += "</tr>";
                        break;
                    case "EPS+":
                    case "EPS*":
                    case "ONVGR":
                    case "C":
                    case "SIGMA":
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\">" + indicators[n] + "</th>";//"<th> Prefix_file_B <input type=\"text\" id=\"" + indicators[n] + "prefixB_id\">  </th></tr>";
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "<th> Prefix_file_B <input type=\"text\" id=\"" + dimensions_selected[dim] + String(col) + indicators[n] + "prefixB_id\"></th>";
                        }
                        html_indicator += "</tr>";
                        break;
                    case "R2":
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\">" + indicators[n] + "</th>";//"<th> Weight_filename <input type=\"text\" id=\"" + indicators[n] + "w_filename_id\"> <br> UTILITY_FUNCTION <input type=\"text\" id=\"" + indicators[n] + "util_func_id\" disabled>  </th></tr>";
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "<th> Weight_filename <input type=\"text\" id=\"" + dimensions_selected[dim] + String(col) + indicators[n] + "w_filename_id\"> <br> UTILITY_FUNCTION <input type=\"text\" id=\"" + String(col) + indicators[n] + "util_func_id\"></th>";
                        }
                        html_indicator += "</tr>";
                        break;
                    case "SPD":
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\">" + indicators[n] + "</th>"; //"<th> theta <input type=\"number\" id=\""+ indicators[n] +"theta_id\"></th></tr>";
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "<th> theta <input type=\"number\" id=\""+ dimensions_selected[dim] + String(col) + indicators[n] +"theta_id\"></th>";
                        }
                        html_indicator += "</tr>";
                        break;
                    default:
                        html_indicator += "<tr><th><input type=\"checkbox\" name=\"" + indicators[n] + "\" id=\"" + dimensions_selected[dim] + indicators[n] + "\">" + indicators[n] + "</th>";//"<th>-</th></tr>"
                        for (col = 0; col < length_problems_selected; col++) {
                            html_indicator += "<th>-</th>";
                        }
                        html_indicator += "</tr>";
                        break;
                }
            }
            html_indicator += "<tr><th colspan=\"" + (length_indicator + 1) + "\"><button onclick=\"ejecuta()\" id=\"finish_btn\" style=\"visibility: visible\">Finalizar</button>";
            html_indicator += "<button onclick=\"back_problem()\" id=\"back2prob_btn\" style=\"visibility: visible\">Regresar</button>";
            html_indicator += "</th></tr></table>";
        }

        document.getElementById("indicators_id").innerHTML = html_indicator;
    
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
    /*for (var n = 0; n < length_indicator; n++) {
        document.getElementById(indicators[n]).disabled = true;
        change_state_indic(indicators[n], true);
    }*/
    document.getElementById("indicators_id").innerHTML = " ";
}

function ejecuta() {
    /**
     * Lista de indicadores que necesitan info. extra
     *  HV                          -> {prefix_A,file_A} number_of_runs reference_point [ALGORITHM]
     *  [GD, IGD, DELTAP, DELTAP+]  -> {prefix_A,file_A} number_of_runs p_norm reference_set_file
     *  [IGD+, M1, IGD-NS]          -> {prefix_A,file_A} number_of_runs reference_set_file
     *  SIGMA                       -> {prefix_A,file_A} number_of_runs {prefix,file} number_of_runs
     *  [TAU, KAPPA]                -> *IGD, *EPS+, *R2
     *  OBJIGD                      -> {prefix_A,file_A} number_of_runs reference_set
     *  EPS                         -> {prefix_A,file_A} number_of_runs {prefix_B,file_B}
     *  MAXMIN                      -> {prefix_A,file_A} number_of_runs
     *  SPD                         -> {prefix_A,file_A} number_of_runs theta
     *  R2                          -> {prefix_A,file_A} number_of_runs weight_filename UTILITY_FUNCTION
     *  ONGG                        -> {prefix_A,file_A} number_of_runs
     */
    // Variables to use
    moeas_selected = [];
    problems_selected = [];
    dimensions_selected = [];
    indicators_selected_per_dimension = [];
    info_per_dimension = [];
    indicators_selected = [];
    number_runs = [];
    str2exec = [];
    // Get list of dimensions selected
    for (q = 0; q < length_dimensions; q++) {
        if (document.getElementById("DIM_" + (q+1)).checked)
            dimensions_selected.push(q + 1);
    }
    // Check at least one indicator was selected
    flag = false;
    for (dim = 0; dim < dimensions_selected.length; dim++){
        for (r = 0; r < length_indicator; r++) {
            flag = flag || document.getElementById(dimensions_selected[dim] + indicators[r]).checked;
        }
    }
    if(flag) {
        // Get list of MOEAs selected    
        for (n = 0; n < length_moeas; n++) {
            if (document.getElementById("MOEA" + n).checked)
                moeas_selected.push(moeas[n]);
        }
        // Get #runs for each MOEA selected
        for (t = 0; t < moeas_selected.length; t++) {
            number_runs.push(parseInt(document.getElementById(moeas_selected[t] + "_id_nruns").value));
        }
        /*
        // Get list of dimensions selected
        for (q = 0; q < length_dimensions; q++) {
            if (document.getElementById("DIM_" + (q+1)).checked)
                dimensions_selected.push(q + 1);
        }
        */
        // Get list of problems selected    
        array_problems = [dtlz_p, wfg_p, dtlz_1_p, wfg_1_p, other_p, vie_p, uf_p];
        array_problems_str = ["DTLZ", "WFG", "DTLZ_1", "WFG_1", "OTHER", "VIE", "UF"];
        number_problems = array_problems_str.length;
        for (m = 0; m < number_problems; m++){
            problems_in = array_problems[m].length;
            for (p = 0; p < problems_in; p++){
                if (document.getElementById(array_problems_str[m] + p).checked)
                    problems_selected.push(array_problems_str[m] + (p + 1));
            }
        }
        length_problems_selected = problems_selected.length;

        // Get list of indicators selected
        for (dim  = 0; dim < dimensions_selected.length; dim++) {
            indicators_selected = [];
            for (s = 0; s < length_indicator; s++) {
                if (document.getElementById(dimensions_selected[dim] + indicators[s]).checked)
                    indicators_selected.push(indicators[s].toLowerCase());
            }
            indicators_selected_per_dimension.push(indicators_selected);
        }
        // Check and get extra info. of indicators 
        extra_info = [];
        aux_array = [];
        for (dim = 0; dim < dimensions_selected.length; dim++){
            extra_info = [];
            for (t = 0; t < indicators_selected.length; t++) {
                aux_array = [];
                //switch (indicators_selected[t].toUpperCase()) {
                switch (indicators_selected_per_dimension[dim][t].toUpperCase()) {
                    case "HV":
                    case "NHV":
                        //extra_info.push(document.getElementById(indicators_selected[t].toUpperCase() + "ref_point_id").value + " " + document.getElementById(indicators_selected[t].toUpperCase() + "algor_id").value);
                        for (cols = 0; cols < length_problems_selected; cols++) {
                            //aux_array.push(document.getElementById(dimensions_selected[dim]+ String(cols) + indicators_selected[t].toUpperCase() + "ref_point_id").value + " " + document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "algor_id").value);
                            aux_array.push(document.getElementById(dimensions_selected[dim]+ String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "ref_point_id").value + " " + document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "algor_id").value);
                        }
                        break;
                    case "GD":
                    case "IGD":
                    case "DELTAP":
                    case "DELTAP+":
                        //extra_info.push(document.getElementById(indicators_selected[t].toUpperCase() + "pnorm_id").value + " " + document.getElementById(indicators_selected[t].toUpperCase() + "refile_id").value);
                        for (cols = 0; cols < length_problems_selected; cols++){
                            //aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "pnorm_id").value + " " + document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "refile_id").value);
                            aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "pnorm_id").value + " " + document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "refile_id").value);
                        }
                        break;
                    case "IGD+":
                    case "M1":
                    case "IGD-NS":
                    case "OBJIGD":
                        //extra_info.push(document.getElementById(indicators_selected[t].toUpperCase() + "refile_id").value);
                        for (cols = 0 ; cols < length_problems_selected; cols++) {
                            //aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "refile_id").value);
                            aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "refile_id").value);
                        }
                        break;
                    case "EPS+":
                    case "EPS*":
                    case "ONVGR":
                    case "C":
                    case "SIGMA":
                        //extra_info(document.getElementById(indicators_selected[t].toUpperCase() + "prefixB_id").value);
                        for (cols = 0; cols < length_problems_selected; cols++ ){
                            //aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "prefixB_id").value);
                            aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "prefixB_id").value);
                        }
                        break;
                    case "R2":
                        //extra_info.push(document.getElementById(indicators_selected[t].toUpperCase() + "w_filename_id").value + " " + document.getElementById(indicators_selected[t].toUpperCase() + "util_func_id").value);
                        for (cols = 0; cols < length_problems_selected; cols++) {
                            //aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "w_filename_id").value + " " + document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "util_func_id").value);
                        }
                        break;
                    case "SPD":
                        //extra_info.push(document.getElementById(indicators_selected[t].toUpperCase() + "theta_id").value);
                        for (cols = 0; cols < length_problems_selected; cols++) {
                            //aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected[t].toUpperCase() + "theta_id").value);
                            aux_array.push(document.getElementById(dimensions_selected[dim] + String(cols) + indicators_selected_per_dimension[dim][t].toUpperCase() + "theta_id").value);
                        }
                        break;
                    default:
                        //extra_info.push(" ");
                        for (cols = 0; cols < length_problems_selected; cols++) {
                            aux_array.push(" ");
                        }
                        break;
                }
                extra_info.push(aux_array);
            }
            info_per_dimension.push(extra_info);
        }
        console.log(aux_array);
        console.log(info_per_dimension);
        
        // Creating string for execution in emo_indicator.c
        for (a = 0; a < moeas_selected.length; a++) {
            for (b = 0; b < dimensions_selected.length; b++) {
                for (c = 0; c < problems_selected.length; c++) {
                    for (d = 0; d < indicators_selected.length; d++) {
                        //str2exec.push(moeas_selected[a] + "_" + problems_selected[c] + "_0" + dimensions_selected[b] + "D " + number_runs[a] + " " + indicators_selected[d] + " " + extra_info[d][c]);
                        str2exec.push(moeas_selected[a] + "_" + problems_selected[c] + "_0" + dimensions_selected[b] + "D " + number_runs[a] + " " + indicators_selected_per_dimension[b][d] + " " + info_per_dimension[b][d][c]);
                    }
                }
            }
        }
        console.log(moeas_selected, dimensions_selected, number_runs, problems_selected, indicators_selected);
        console.log(str2exec);
    } else {
        alert('Ningun indicador seleccionado');
    }
}

function change_state_indic(indicator, status) {
    switch (indicator) {
        case "HV":
        case "NHV":
            document.getElementById(indicator + "ref_point_id").disabled = status;
            document.getElementById(indicator + "algor_id").disabled = status;
            break;
        case "GD":
        case "IGD":
        case "DELTAP":
        case "DELTAP+":
            document.getElementById(indicator + "pnorm_id").disabled = status; 
            document.getElementById(indicator + "refile_id").disabled = status; 
            break;
        case "IGD+":
        case "M1":
        case "IGD-NS":
        case "OBJIGD":
            document.getElementById(indicator + "refile_id").disabled = status;
            break;
        case "EPS+":
        case "EPS*":
        case "ONVGR":
        case "C":
        case "SIGMA":
            document.getElementById(indicator + "prefixB_id").disabled = status;
            break;
        case "R2":
            document.getElementById(indicator + "w_filename_id").disabled = status;
            document.getElementById(indicator + "util_func_id").disabled = status;
            break;
        case "SPD":
            document.getElementById(indicator + "theta_id").disabled = status;
            break;
        default:
            break;
    }
}