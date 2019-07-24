
#include <string.h>
#include <stdlib.h>
#include <stdio.h>

#include "emo.h" 

#define _MAXCHAR 4000
#define EMO_HV_WFG 1 
#define EMO_HV_FON 2 

void filename(char **tmp, const char *prefix, int run, int nrun) {
  //if(strstr(prefix, ".") == NULL)
  if(nrun != 1)
    sprintf(*tmp, "%s_R%.2d.pof", prefix, run);
  else
    sprintf(*tmp, "%s", prefix);

  //printf("tmp %s, nrun %d\n", *tmp, nrun);
}

void savefile(double *v, int run, char **tmp, const char *prefix, const char *extension) {
  sprintf(*tmp, "%s.%s", prefix, extension);
  printf("Data stored in %s\n", *tmp);
  EMO_File_write(v, NULL, run, 1, *tmp, "%e ", 0);
}

int enclosure(int *filter, double *data, int row, double *ref, int col) {
  int i, j, c = 0;

  for(i = 0; i < row; i++) {
    for(j = 0; j < col; j++) {
      if(data[i * col + j] >= ref[j]) {
        filter[i] = 0;
        c++;
        break;
      }
    }
  }

  return c;
}

int hv(double *v, char **str, int nrun, int argc, char **argv) {
  int r, row, col, type, *filter = NULL;
  double *data, *ref, t = 1.0;
  EMO_HV wfg;
 
  row = col = 0;

  filename(str, argv[2], 1, nrun);
  data = EMO_File_read(NULL, &row, &col, *str, 0);


  if(argc != (4 + col) && argc != (5 + col)) {
    printf("Syntax: %s %s {prefix,file} number_of_runs reference_point [ALGORITHM]\n", argv[0], argv[1]);
    printf("ALGORITHM = {WFG, FONSECA} (by default WFG is applied)\n");
    return 1;
  }

  if(argc == (4 + col))
    type = EMO_HV_WFG;
  else if(argv[argc-1][0] == 'W' || argv[argc-1][0] == 'w')
    type = EMO_HV_WFG;
  else
    type = EMO_HV_FON;

  printf("Running %s program\n", (type == EMO_HV_WFG)? "WFG" : "Fonseca's");

  if((ref = (double *) malloc(sizeof(double) * col)) == NULL) {
    printf("Error, not enough memory in hv function\n");
    return 1;
  }

  for(r = 0; r < col; r++) {
    ref[r] = atof(argv[4 + r]);
    t *= ref[r];
  }

  if(t == 0.0) {
    printf("Error, one coordinate of the reference point is zero in %s.\n", argv[0]);
    exit(1);
  }

  if(type == EMO_HV_WFG) {
    if((filter = (int *) calloc(sizeof(int), row)) == NULL) {
      printf("Error, not enough memory in hv function\n");
      return 1;
    }

    /* Filter non-dominated solutions */
    EMO_Dominance_ndset(filter, data, NULL, row, col, EMO_Dominance_strict);
    EMO_HV_alloc(&wfg, row, col);
  }

  for(r = 1; r <= nrun;) {

    // WFG: Solo filtra soluciones que se encuentran afuera del punto de referencia
    // FONSECA: Filtra soluciones dominadas y que estan afuera del punto de referencia
    if(type == EMO_HV_WFG) 
      v[r-1] = EMO_HV_run(&wfg, data, filter, row, ref);
    else
      v[r-1] = EMO_hv2(data, row, ref, col);

    if(argv[1][0] == 'n' || argv[1][0] == 'N') // Normalized HV
      v[r-1] /= t;

    printf("%d %s %f\n", r, *str, v[r-1]);
    free(data);

    if(type == EMO_HV_WFG)
      free(filter);

    if(++r <= nrun) {
      row = 0;
      filename(str, argv[2], r, nrun);
      data = EMO_File_read(NULL, &row, &col, *str, 0);

      if(type == EMO_HV_WFG) {
        if((filter = (int *) calloc(sizeof(int), row)) == NULL) {
          printf("Error, not enough memory in hv function\n");
          return 1;
        }

        /* Filter non-dominated solutions */
        EMO_Dominance_ndset(filter, data, NULL, row, col, EMO_Dominance_strict);
      }
    }
  }

  if(type == EMO_HV_WFG)
    EMO_HV_free(&wfg);
 
  free(ref);
  return 0;
}

int refpoint(double *v, char **str, int nrun, int argc, char **argv) {
  double (*apf)(double *, int *, int, double *, int, int, double);
  int r, row, row2, col, p;
  double *data, *ref;
  char *name;
 
  if(argc != 6) {
    printf("Syntax: %s %s {prefix,file} number_of_runs p_norm reference_set_file\n", argv[0], argv[1]);
    return 1;
  }

  name = EMO_toupper(argv[1]);

  if(strcmp(name, "GD") == 0)
    apf = EMO_Indicator_gd;
  else if(strcmp(name, "IGD") == 0)
    apf = EMO_Indicator_igd;
  else if(strcmp(name, "DELTAP") == 0)
    apf = EMO_Indicator_deltap;
  else if(strcmp(name, "DELTAP+") == 0)
    apf = EMO_Indicator_deltap_plus;
  else
   return 1;

  row2 = col = 0;
  p = atoi(argv[4]);
  ref = EMO_File_read(NULL, &row2, &col, argv[5], 0);
  printf("Reference set file: rows %d, columns %d\n", row2, col);

  for(r = 1; r <= nrun; r++) {
    row = 0;
    filename(str, argv[2], r, nrun);
    data = EMO_File_read(NULL, &row, &col, *str, 0);

    v[r-1] = apf(data, NULL, row, ref, row2, col, p);
    printf("%d %s %f\n", r, *str, v[r-1]);
    free(data);
  }

  free(ref);
  free(name);
  return 0;
}

//int igd_plus(double *v, char **str, int nrun, int argc, char **argv) {
int w_reference(double *v, char **str, int nrun, int argc, char **argv) {

  double (*apf)(double *, int *, int, double *, int, int);
  char *name;

  int r, row, row2, col;
  double *data, *ref;
 
  if(argc != 5) {
    printf("Syntax: %s %s {prefix,file} number_of_runs reference_set_file\n", argv[0], argv[1]);
    return 1;
  }
  

  name = EMO_toupper(argv[1]);  
  
  if(strcmp(name, "IGD+") == 0)
    apf = EMO_Indicator_igd_plus;
  else if(strcmp(name, "M1") == 0)
    apf = EMO_Indicator_m1;
  else if(strcmp(name, "IGD-NS") == 0)
    apf = EMO_Indicator_igd_ns;
  else
   return 1;
  
  

  row2 = col = 0;
  ref = EMO_File_read(NULL, &row2, &col, argv[4], 0);
  printf("Reference set file: rows %d, columns %d\n", row2, col);

  for(r = 1; r <= nrun; r++) {
    row = 0;
    filename(str, argv[2], r, nrun);

    printf("\t Nombre: %s\n", *str);

    data = EMO_File_read(NULL, &row, &col, *str, 0);

    //v[r-1] = EMO_Indicator_igd_plus(data, NULL, row, ref, row2, col);
    v[r-1] = apf(data, NULL, row, ref, row2, col);
    printf("%d %s %f\n", r, *str, v[r-1]);
    free(data);
  }

  free(ref);
  return 0;
}

int sigma(double *v, char **str, int nrun, int argc, char **argv) {
  // Check number of arguments
  if (argc != 6) {
    printf("usage: ./emo_indicator SIGMA  PrefixA N PrefixB M\n");
    return 1;
  }
  // Variables to use
  double *set1, *set2;
  // Sets' cardinality
  int cardS1 = atoi(argv[3]);
  int cardS2 = atoi(argv[5]);
  
  int rows_a, rows_b;
  int cols_a = 0, cols_b = 0;
  
  int sum_total = 0;
  // Chech each N pareto set
  for (int indx_setA = 1; indx_setA < cardS1; indx_setA++) {
    // Initialize values
    rows_a = 0; cols_a = 0;
    //sum = 0;
    //max = 0;
    sum_total = 0;
    // Get data from files
    filename(str, argv[2], indx_setA, cardS1);
    set1 = EMO_File_read(NULL, &rows_a, &cols_a, *str, 0);
    // Check each set M of PFs (1st sum)
    for (int indx_setB = 1; indx_setB < cardS2; indx_setB++) {
      // Determinate how many rows there are in B (vectors of 3?)
      rows_b = 0; cols_b = 0;
      filename(str, argv[4], indx_setB, cardS1);
      set2 = EMO_File_read(NULL, &rows_b, &cols_b, *str, 0);
      sum_total += EMO_Indicator_sigma_tau_kappa(set1, set2, rows_a, cols_a, rows_b, cols_b, "SIGMA");
      //printf("SetA#%d.- Sum total: %d\n", indx_setA, sum_total);
    }
    // Save the value associated to j-th set A from the N available.
    v[indx_setA - 1] = sum_total;
    free(set1);
    free(set2);
  }
  //free(set1);
  //free(set2);
  return 0;
}

int tau_kappa(double *v, char **str, int nrun, int argc, char **argv) {
  char *name = EMO_toupper(argv[1]);

  // Variables to use
  double *set1, *set2, *ref_weigth;
  // Sets' cardinality
  int cardS1 = atoi(argv[3]);
  int cardS2 = atoi(argv[5]);
  
  int rows_a, rows_b;
  int cols_a = 0, cols_b = 0;

  int rows_ref = 0;
  int cols_ref = 0;

  // Variable for R2 indicator
  EMO_Utility utl;

  int sum_total = 0;

  //double (*apf)(double *, int *, int, double *, int, int);

  /*if ((argc != 8 && (!strcmp(argv[6], "IGD+") || !strcmp(argv[6], "EPS+"))))  {
    printf("Arguments are not enough for %s\n", argv[1]);
    return 1;
  }
  if (argc != 9 && !strcmp(argv[6], "R2")) {
    EMO_Dictionary_print(stdout, EMO_Utility_list, "UTILITY");
  }*/
  if (argc < 6) {
    printf("Not enough arguments\n");
    return 1;
  }

  // With or without reference?
  if (!strcmp(argv[6], "IGD+")) {
    if (argc != 8) {
      printf("Syntax: %s %s prefix_A #runs prefix_B #runs Indicator Reference\n", argv[0], argv[1]);
      return 1;
    }
  }
  else if (!strcmp(argv[6], "EPS+")) {
    if(argc != 8) {
      printf("Syntax: %s %s prefix_A #runs prefix_B #runs Indicator Reference\n", argv[0], argv[1]);
      return 1;
    }
  }
  else if (!strcmp(argv[6], "R2")) {
    if (argc != 9) {
      printf("Syntax: %s %s prefix_A #runs prefix_B #runs Indicator weight_filename UTILITY_FUNCTION\n", argv[0], argv[1]);
      EMO_Dictionary_print(stdout, EMO_Utility_list, "UTILITY");
      return 1;
    }
    EMO_Utility_alloc(&utl, NULL, cols_ref, argv[8]);
  } else {
    printf("Indicator %s does not exist\n", argv[6]);
    return 1;
  }
  

  ref_weigth = EMO_File_read(NULL, &rows_ref, &cols_ref, argv[7], 0);

  //if(strcmp(name, "TAU") == 0) {
    //apf = EMO_Indicator_tau;
    // Chech each N pareto set
    for (int indx_setA = 1; indx_setA < cardS1 + 1; indx_setA++) {
      // Initialize values
      rows_a = 0; cols_a = 0;
      //sum = 0;
      //max = 0;
      sum_total = 0;
      // Get data from files
      filename(str, argv[2], indx_setA, cardS1);
      set1 = EMO_File_read(NULL, &rows_a, &cols_a, *str, 0);
      // Check each set M of PFs (1st sum)
      for (int indx_setB = 1; indx_setB < cardS2 + 1; indx_setB++) {
        // Determinate how many rows there are in B (vectors of 3?)
        rows_b = 0; cols_b = 0;
        filename(str, argv[4], indx_setB, cardS1);
        set2 = EMO_File_read(NULL, &rows_b, &cols_b, *str, 0);

        if (!strcmp(name, "TAU")) {
          sum_total += EMO_Indicator_sigma_tau_kappa(set1, set2, rows_a, cols_a, rows_b, cols_b, "TAU");
        } else if (!strcmp(name, "KAPPA")) {
          sum_total += EMO_Indicator_sigma_tau_kappa(set1, set2, rows_a, cols_a, rows_b, cols_b, "KAPPA");
        }
        // Check if A waekly dominates B
        if (EMO_Dominance_weak(set1, set2, cols_a) == 1) {
          if (!strcmp(argv[6], "IGD+")){
            if (EMO_Indicator_igd_plus(set1, NULL, rows_a, ref_weigth, rows_ref, cols_a) <= EMO_Indicator_igd_plus(set2, NULL, rows_b, ref_weigth, rows_ref, cols_b)) {
              sum_total += 1;
            }
          } else if (!strcmp(argv[6], "EPS+")) {
            if (EMO_Indicator_epsilon_additive(set1, NULL, rows_a, ref_weigth, rows_ref, cols_a) <= EMO_Indicator_epsilon_additive(set2, NULL, rows_b, ref_weigth, rows_ref, cols_b)) {
              sum_total += 1;
            }
          } else if (!strcmp(argv[6], "R2")) {
            if (EMO_Indicator_r2(set1, NULL, rows_a, ref_weigth, rows_ref, &utl) <= EMO_Indicator_r2(set2, NULL, rows_b, ref_weigth, rows_ref, &utl)) {
              sum_total += 1;
            }
          } else {
            return 1;
          }
        }
      }
      // Save the value associated to j-th set A from the N available.
      v[indx_setA - 1] = sum_total;
      free(set1);
      free(set2);
    }
  //}
  //else if(strcmp(name, "K") == 0)
    //apf = EMO_Indicator_kappa;
  //else
    //return 1;
  return 0;
}


int objigd(double *v, char **str, int nrun, int argc, char **argv) {
  int r, row, col, row2;
  double *data, *ref;

  if (argc != 5) {
    printf("syntax: %s %s prefix_A #runs reference_set", argv[0], argv[1]);
  }

  row2 = col = 0;
  ref = EMO_File_read(NULL, &row2, &col, argv[4], 0);

  for(r = 1; r <= nrun; r++) {
    row = col = 0; 
    filename(str, argv[2], r, nrun);
    data = EMO_File_read(NULL, &row, &col, *str, 0);

    v[r-1] = EMO_Indicator_objigd(data, row, ref, row2, col);
    printf("%d %s %f\n", r, *str, v[r-1]); 
    free(data);
  }
}

int eps(double *v, char **str, int nrun, int argc, char **argv) {
  double (*apf)(double *, int *, int, double *, int, int);
  int r, row, row2, col;
  double *dataA, *dataB;
  char *name;
  
  if(argc != 5) {
    printf("Syntax: %s %s {prefix_A,file_A} number_of_runs {prefix_B,file_B}\n", argv[0], argv[1]);
    return 1;
  }

  name = EMO_toupper(argv[1]);
    
  if(strcmp(name, "EPS+") == 0)
    apf = EMO_Indicator_epsilon_additive;
  else if(strcmp(name, "EPS*") == 0)
    apf = EMO_Indicator_epsilon_multiplicative;
  else if(strcmp(name, "ONVGR") == 0)
    apf = EMO_Indicator_onvgr;
  else if(strcmp(name, "C") == 0)
    apf = EMO_Indicator_c;
  else
    return 1;

  for(r = 1; r <= nrun; r++) {
    row = col = 0; 
    filename(str, argv[2], r, nrun);
    dataA = EMO_File_read(NULL, &row, &col, *str, 0);

    row2 = 0;
    filename(str, argv[4], r, nrun);
    dataB = EMO_File_read(NULL, &row2, &col, *str, 0);

    v[r-1] = apf(dataA, NULL, row, dataB, row2, col);
    printf("%d %s %f\n", r, *str, v[r-1]); 
    free(dataA);
    free(dataB);
  }

  free(name);  
  return 0;
}

int maximin(double *v, char **str, int nrun, int argc, char **argv) {
  double (*apf)(double *, double *, int *, int, int);
  double *data, *fitness;
  int r, row, col;//, i;
  //int *filter; 
  char *name;

  if(argc != 4) {
    printf("Syntax: %s %s {prefix_A,file_A} number_of_runs\n", argv[0], argv[1]);
    return 1;
  }

  name = EMO_toupper(argv[1]);
    
  if(strcmp(name, "MAXIMIN") == 0)
    apf = EMO_Indicator_maximin;
  else if(strcmp(name, "S-ENERGY") == 0)
    apf = EMO_Indicator_senergy;
  else
    return 1;

  for(r = 1; r <= nrun; r++) {
    row = col = 0; 
    filename(str, argv[2], r, nrun);
    data = EMO_File_read(NULL, &row, &col, *str, 0);

    fitness = (double *) malloc(sizeof(double *) * row);
    v[r-1] = apf(fitness, data, NULL, row, col);
    printf("%d %s %f\n", r, *str, v[r-1]); 

    //for(i = 0; i < row; i++)
    //  printf("fitness %d = %f\n", i, fitness[i]);
    
    free(data);
    free(fitness);
  }

  free(name);  
  return 0;
}

int solow_polasky(double *v, char **str, int nrun, int argc, char **argv) {
  double (*apf)(double *, double *, int *, int, int);
  double *data, *fitness;
  int r, row, col;
  char *name;

  if(argc != 5) {
    printf("Syntax: %s %s {prefix_A,file_A} number_of_runs theta\n", argv[0], argv[1]);
    return 1;
  }

  name = EMO_toupper(argv[1]);
    
  if(strcmp(name, "SPD") == 0)
    apf = EMO_Indicator_solow_polasky;
  else
    return 1;

  for(r = 1; r <= nrun; r++) {
    row = col = 0; 
    filename(str, argv[2], r, nrun);
    data = EMO_File_read(NULL, &row, &col, *str, 0);

    fitness = (double *) malloc(sizeof(double *) * row);
    v[r-1] = apf(fitness, data, NULL, row, col); //, theta);
    printf("%d %s %f\n", r, *str, v[r-1]); 

    free(data);
    free(fitness);
  }

  free(name);  
  return 0;
}

int r2(double *v, char **str, int nrun, int argc, char **argv) {
  int r, row, row2, col;
  double *data, *W;
  EMO_Utility utl;

  if(argc != 6) {
    printf("Syntax: %s %s {prefix,file} #runs weight_filename UTILITY_FUNCTION\n", argv[0], argv[1]);
    EMO_Dictionary_print(stdout, EMO_Utility_list, "UTILITY");
    return 1;
  }

  row2 = col = 0;
  W = EMO_File_read(NULL, &row2, &col, argv[4], 0);
  printf("Weight vectors: rows %d, columns %d\n", row2, col);

  EMO_Utility_alloc(&utl, NULL, col, argv[5]);

  for(r = 1; r <= nrun; r++) {
    row = 0;
    filename(str, argv[2], r, nrun);
    data = EMO_File_read(NULL, &row, &col, *str, 0);

    v[r-1] = EMO_Indicator_r2(data, NULL, row, W, row2, &utl);
    printf("%d %s %f\n", r, *str, v[r-1]);
    free(data);
  }

  EMO_Utility_free(&utl);

  free(W);
  return 0;
}

int onvg(double *v, char **str, int nrun, int argc, char **argv) {
  double (*apf)(double *, int *, int, int);
  int r, row, col;
  double *data;
  char *name;
  
  if(argc != 4) {
    printf("Syntax: %s %s {prefix_A,file_A} number_of_runs\n", argv[0], argv[1]);
    return 1;
  }

  name = EMO_toupper(argv[1]);
    
  if(strcmp(name, "ONVG") == 0)
    apf = EMO_Indicator_onvg;
  else if(strcmp(name, "SP") == 0)
    apf = EMO_Indicator_spacing;
  else
    return 1;

  for(r = 1; r <= nrun; r++) {
    row = col = 0; 
    filename(str, argv[2], r, nrun);
    data = EMO_File_read(NULL, &row, &col, *str, 0);

    v[r-1] = apf(data, NULL, row, col);
    printf("%d %s %f\n", r, *str, v[r-1]); 

    free(data);
  }

  free(name);  
  return 0;
}

int main(int argc, char **argv) {
  char *name, *str, *ext;
  int nrun, r = 0;
  double *v;

  if(argc < 4) {
    printf("\nSyntax: %s INDICATOR {file, prefix} number_of_runs [options...] \n\n", argv[0]);

    printf("INDICATOR = {HV, NHV, GD, IGD, IGD+, \\Delta_p, EPS*, EPS+, MAXIMIN, R2, ONVG, ONVGR, C, SP, SPD, S-ENERGY}\n");
    printf("HV:            Hypervolume\n");
    printf("NHV:           Normalized hypervolume\n");
    printf("GD:            Generational Distance\n");
    printf("IGD:           Inverted Generational Distance\n");
    printf("IGD+:          Modified Inverted Generational Distance\n");
    printf("DELTAP:        max{GD, IGD}\n");
    printf("EPS*:          Multiplicative Epsilon Indicator\n");
    printf("EPS+:          Additive Epsilon Indicator\n");
    printf("MAXIMIN:       Maximin fitness\n");
    printf("R2:            R2 Indicator\n");
    printf("ONVG:          Overall Non-dominated Vector Generation\n");
    printf("ONVGR:         Overall Non-dominated Vector Generation Ratio\n");
    printf("C:             Coverage of two sets\n");
    printf("SP:            Spacing\n");
    printf("SPD:           Solow-Polasky Diversity\n");
    printf("S-ENERGY:      Riesz s-energy\n\n");
    return 1;
  }

  nrun = atoi(argv[3]);

  str = (char *) malloc(sizeof(char) * _MAXCHAR);
  ext = (char *) malloc(sizeof(char) * _MAXCHAR);
  v = (double *) malloc(sizeof(double) * nrun);

  name = EMO_toupper(argv[1]);

  if(strcmp(name, "HV") == 0 || strcmp(name, "NHV") == 0) {
    r = hv(v, &str, nrun, argc, argv);
    strcpy(ext, "hv");
  }
  else if(strcmp(name, "GD") == 0) {
    r = refpoint(v, &str, nrun, argc, argv);
    strcpy(ext, "gd");
  }
  else if(strcmp(name, "IGD") == 0) {
    r = refpoint(v, &str, nrun, argc, argv);
    strcpy(ext, "igd");
  }
  else if(strcmp(name, "IGD+") == 0) {
    //r = igd_plus(v, &str, nrun, argc, argv);
    r = w_reference(v, &str, nrun, argc, argv);
    strcpy(ext, "igd+");
  }
  else if(strcmp(name, "DELTAP") == 0) {
    r = refpoint(v, &str, nrun, argc, argv);
    strcpy(ext, "deltap");
  }
  else if(strcmp(name, "EPS*") == 0) {
    r = eps(v, &str, nrun, argc, argv);
    strcpy(ext, "eps*");
  }
  else if(strcmp(name, "EPS+") == 0) {
    r = eps(v, &str, nrun, argc, argv);
    strcpy(ext, "eps+");
  }
  else if(strcmp(name, "MAXIMIN") == 0) {
    r = maximin(v, &str, nrun, argc, argv);
    strcpy(ext, "maximin");
  }
  else if(strcmp(name, "SPD") == 0) {
    r = solow_polasky(v, &str, nrun, argc, argv);
    strcpy(ext, "spd");
  }
  else if(strcmp(name, "R2") == 0) {
    r = r2(v, &str, nrun, argc, argv);
    strcpy(ext, "r2");
  }
  else if(strcmp(name, "ONVG") == 0) {
    r = onvg(v, &str, nrun, argc, argv);
    strcpy(ext, "onvg");
  }
  else if(strcmp(name, "ONVGR") == 0) {
    r = eps(v, &str, nrun, argc, argv);
    strcpy(ext, "onvgr");
  }
  else if(strcmp(name, "C") == 0) {
    r = eps(v, &str, nrun, argc, argv);
    strcpy(ext, "c");
  }
  else if(strcmp(name, "SP") == 0) {
    r = onvg(v, &str, nrun, argc, argv);
    strcpy(ext, "sp");
  }
  else if(strcmp(name, "S-ENERGY") == 0) {
    r = maximin(v, &str, nrun, argc, argv);
    strcpy(ext, "s-energy");
  }
  
  // Nuevos indicadores
  else if(strcmp(name, "M1") == 0) {
    r = w_reference(v, &str, nrun, argc, argv);
    strcpy(ext, "M1");
  }
  else if(strcmp(name, "DELTAP+") == 0) {
    r = refpoint(v, &str, nrun, argc, argv);
    strcpy(ext, "DELTAP+");
  }
  else if(strcmp(name, "IGD-NS") == 0) {
    r = w_reference(v, &str, nrun, argc,   argv);
    strcpy(ext, "IGD-NS");  
  }

  else if(strcmp(name, "SIGMA") == 0) {
    r = sigma(v, &str, nrun, argc, argv);
    strcpy(ext, "SIGMA");
  }

  else if(strcmp(name, "TAU") == 0) {
    r = tau_kappa(v, &str, nrun, argc, argv);
    strcpy(ext, "TAU");
  }

  else if(strcmp(name, "KAPPA") == 0) {
    r = tau_kappa(v, &str, nrun, argc, argv);
    strcpy(ext, "KAPPA");
  }

  else if(strcmp(name, "OBJIGD") == 0) {
    r = objigd(v, &str, nrun, argc, argv);
    strcpy(ext, "OBJIGD");
  }

  else {
    printf("Error, unknown performance indicator %s.\n", argv[1]);
  }

  if(r == 0 && nrun > 1)
    savefile(v, nrun, &str, argv[2], ext);

  free(v);
  free(ext);
  free(str);
  free(name);
  return r;
}

#undef _MAXCHAR 
#undef EMO_HV_WFG
#undef EMO_HV_FON


