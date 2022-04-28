$(document).ready(function () {

  //CREAZIONE GRAFICI - DEFAULT DATA (preimpostati)


  var lineChartData = {
    labels: ['Jan_2021', 'Mar_2021', 'May_2021', 'Lug_2021', 'Sep_2021', 'Nov_2021'],
    datasets: [
      {
        label: "OC Indexed Records",
        backgroundColor: "#AB54FD",
        borderColor: "purple",
        borderWidth: 1,
        data: [759516507, 759516507, 759516507, 759516507, 1186958898, 1235170583]
      },

    ]

  }

  var lineChartOptions = {

    responsive: true,
    legend: {
      position: "top"
    },
    title: {
      display: true,
      text: "Indexed records Line Chart"
    },
    scales: {
      y: {
        display: true,
        type: 'linear',
      }
    }


  }


  var ctx2 = document.getElementById("myChart").getContext("2d");
  myLine = new Chart(ctx2, {
    type: "line",
    data: lineChartData,
    options: lineChartOptions
  });

  var barChartData = {
    labels: ['Jan_2021', 'Feb_2021', 'Mar_2021', 'Apr_2021', 'May_2021', 'Jun_2021', 'Lug_2021', 'Aug_2021', 'Sep_2021', 'Oct_2021', 'Nov_2021', 'Dec_2021'],
    datasets: [
      {
        label: "API",
        backgroundColor: "#3C41E5",
        borderColor: "blue",
        borderWidth: 1,
        data: [1319211, 1429823, 2887899, 3447441, 1229705, 727251, 1130537, 1437809, 1729375, 2117454, 2770573, 1896861]
      },
      {
        label: "Datasets",
        backgroundColor: "#AB54FD",
        borderColor: "purple",
        borderWidth: 1,
        data: [9652, 17064, 30224, 35615, 54006, 54935, 28161, 23855, 47698, 65942, 14255, 47797]
      },
    ]
  };

  var chartOptions = {
    responsive: true,
    legend: {
      position: "top"
    },
    title: {
      display: true,
      text: "Services Usage Bar Chart"
    },
    scales: {
      y: {
        display: true,
        type: 'logarithmic',
      }
    }
  }


  var ctx = document.getElementById("myChart2").getContext("2d");

  myBar = new Chart(ctx, {
    type: "bar",
    data: barChartData,
    options: chartOptions
  });







  //CALCOLO MESI TRASCORSI TRA DUE DATE
  // Reference: https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript/2536445#2536445
  function elapsedMonths(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  let init_data_month = new Date('2021-01-01') // Gennaio 2021 è il primo mese di cui sono disponibili dati da API opencitations/statistics
  let cur_data_month = new Date();

  let elapsed_record_months = elapsedMonths(init_data_month, cur_data_month);


  // Variabili con valori default
  let start = "";
  let end = "";
  let StartDate = "";
  let EndDate = "";
  let Interval = 1; // Perché i dati di log vengono calcolati su base mensile

  let start_1 = "";
  let end_1 = "";
  let StartDate_1 = "";
  let EndDate_1 = "";
  let Interval_1 = 2; // Perché gli indexed records aumentano su base bimestrale

  $('#Start').MonthPicker({
    MaxMonth: -1, // -1 rispetto al mese corrente assumendo che il resoconto mensile sia pubblicato a fine mese  --> da rivedere, il dato va estratto da "statistics/last-month"
    MinMonth: - elapsed_record_months,
    OnAfterChooseMonth: function (selectedDate) {
      StartDate = selectedDate;
      year = selectedDate.getFullYear();
      month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      let date_for_query = year + "-" + month;
      console.log(date_for_query);
      start = date_for_query;
    }
  });


  $('#Start_1').MonthPicker({
    MaxMonth: -1, // -1 rispetto al mese corrente assumendo che il resoconto mensile sia pubblicato a fine mese --> da rivedere, il dato va estratto da "statistics/last-month"
    MinMonth: - elapsed_record_months,
    OnAfterChooseMonth: function (selectedDate) {
      StartDate_1 = selectedDate;
      year_1 = selectedDate.getFullYear();
      month_1 = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      let date_for_query_1 = year_1 + "-" + month_1;
      console.log(date_for_query_1);
      start_1 = date_for_query_1;
    }
  });

  $('#End').MonthPicker({
    MaxMonth: -1, // -1 rispetto al mese corrente assumendo che il resoconto mensile sia pubblicato a fine mese --> da rivedere, il dato va estratto da "statistics/last-month"
    MinMonth: - elapsed_record_months,
    OnAfterChooseMonth: function (selectedDate) {
      EndDate = selectedDate;
      year = selectedDate.getFullYear();
      month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      let date_for_query = year + "-" + month;
      console.log(date_for_query);
      end = date_for_query;

    }
  });

  $('#End_1').MonthPicker({
    MaxMonth: -1, // -1 rispetto al mese corrente assumendo che il resoconto mensile sia pubblicato a fine mese --> da rivedere, il dato va estratto da "statistics/last-month"
    MinMonth: - elapsed_record_months,
    OnAfterChooseMonth: function (selectedDate) {
      EndDate_1 = selectedDate;
      year_1 = selectedDate.getFullYear();
      month_1 = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
      let date_for_query_1 = year_1 + "-" + month_1;
      console.log(date_for_query_1);
      end_1 = date_for_query_1;

    }
  });


  $('#Intervallo').on('change', function () {
    Interval = ($(this).val());
    console.log(Interval);
  });

  $('#Intervallo_1').on('change', function () {
    Interval_1 = ($(this).val());
    console.log(Interval_1);
  });

  //UPDATE DELLE VISUALIZZAZIONI E GESTIONE EVENTUALI ERRORI DI SELEZIONE DATE (BAR CHART)

  $('#Invio').click(function () {
    if (StartDate == "" && EndDate == "") {
      window.alert("Select a Start Date and an End Date (Bar Chart)")
    } else if (StartDate == "") {
      window.alert("Select a Start Date (Bar Chart)")
    } else if (EndDate == "") {
      window.alert("Select an End Date (Bar Chart)")
    } else {


      if (StartDate >= EndDate) {
        StartDate = ""
        EndDate = ""
        $('#Start').val("")
        $('#End').val("")

        window.alert("Start Date must precede End Date (Bar Chart)")
        throw "Start Date must precede End Date (Bar Chart)"
      } else {
        console.log(StartDate, EndDate)

        // Reference per estrazione lista di mesi: http://jsfiddle.net/McCroskey42/1tp1hw8w/419/
        var start_Date = moment(start);
        var end_Date = moment(end);
        var result = [];
        while (start_Date.isBefore(end_Date)) {
          result.push("https://opencitations.net/statistics/" + start_Date.format("YYYY-MM"));
          start_Date.add(1, 'month');
        }
        result.push("https://opencitations.net/statistics/" + end_Date.format("YYYY-MM"))
      }


      let result_w_interval = [];

      //Gestione dell'intervallo dei mesi
      if (Interval == 1) {
        result_w_interval = result;
      } else {
        for (const [index, element] of result.entries()) {
          if (index % Interval == 0) {
            result_w_interval.push(element);
          }
        }
      }

      //preparazione della lista delle richieste axios ad API
      requests_list = []

      for (i = 0; i < result_w_interval.length; i++) {
        let ax_req_serv = axios.get(result_w_interval[i])
        requests_list.push(ax_req_serv)
      }

      let dict_name = {};
      months = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Lug", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };

      //RICHIESTE PARALLELE: per ogni richiesta, conversione dati da prometheus a dizionario.
      // Dal dizionario completo ricavato dal prometheus si estraggono i dati di interesse
      // (numero indexed records x Line Chart // numero richieste dataset + numero richieste api x Bar Chart)
      // e si aggiungono come coppia chiave-valore ad un dizionario complessivo, dove la chiave
      // è la data (Mmm_YYYY) e il valore è un dizionario contenente le coppie chiavi-valore relative
      // ai dati di interesse (numero indexed records x Line Chart // numero richieste dataset + numero richieste api x Bar Chart)

      axios.all(requests_list).then(axios.spread((...responses) => {
        for (i = 0; i < responses.length; i++) {
          element = result_w_interval[i];
          const datePattern = /(\d{4})\-(\d{1,2})/;
          const date = datePattern.exec(element);
          metricsStr = (responses[i]).data;

          //Divisione prometheus in corrispondenza del \n
          var array1 = metricsStr.split(/\r?\n/);
          // alternativa : var array = metricsStr.match(/[^\r\n]+/g);
          var filtered = array1.filter(function (value, index, arr) {
            return !value.startsWith("#");
            //Elimina gli elementi che iniziano con #
          });

          // costruisci il dizionario dal prometheus
          prom_to_dict = {}

          const pattern = /{/;
          //reference: https://stackoverflow.com/a/19793380/15097248
          function extractQuotedText(str) {
            const matches = str.match(/"(.*?)"/);
            return (matches
              ? matches[1]
              : str);
          };

          for (let i = 0; i < filtered.length; i++) {
            if (pattern.test(filtered[i]) == true) {
              let pos_open_par = filtered[i].indexOf('{')
              let pos_close_par = filtered[i].indexOf('}')

              let dict_key = filtered[i].substr(0, pos_open_par);
              if (!(dict_key in prom_to_dict)) {
                prom_to_dict[dict_key] = {}
              };

              let nest_dict_key = extractQuotedText(filtered[i])
              let nest_dict_val = filtered[i].substr(pos_close_par + 2);

              prom_to_dict[dict_key][nest_dict_key] = nest_dict_val

            } else {
              // considera lo spazio come separatore, quello che viene prima è la chiave, quello che viene dopo il valore
              // Non verificato: cosa succede quando c'è più di uno spazio
              let pos_space = filtered[i].indexOf(' ');
              let dict_key = filtered[i].substr(0, pos_space);
              let dict_val = filtered[i].substr(pos_space + 1);
              prom_to_dict[dict_key] = dict_val
            };
          }

          // estrazione dati richiesti (in questo caso api_req e dataset_req)
          api_req = prom_to_dict.opencitations_agg_counter_total.oc_api_requests
          dataset_req = prom_to_dict.opencitations_agg_counter_total.dataset_requests


          let result = {};
          result["api_requests"] = Number(api_req);
          result["dataset_requests"] = Number(dataset_req);

          key_name = months[date[2]] + "_" + date[1];
          dict_name[key_name] = result;


        }

        api_req_list = [];
        dataset_req_list = [];
        labels_list = [];

        for (const key in dict_name) {
          labels_list.push(key);
          api_req_list.push(dict_name[key].api_requests);
          dataset_req_list.push(dict_name[key].dataset_requests);
        }

        /// UPDATE DEI GRAFICI
        //distruzione dei grafici default (o precedentemente generati)
        myBar.destroy()

        //creazione nuovi grafici con dati relativi ai mesi richiesti dall'utente
        //BarChart per Usage of Services
        var barChartData = {
          labels: labels_list,
          datasets: [
            {
              label: "API",
              backgroundColor: "#3C41E5",
              borderColor: "blue",
              borderWidth: 1,
              data: api_req_list
            },
            {
              label: "Datasets",
              backgroundColor: "#AB54FD",
              borderColor: "purple",
              borderWidth: 1,
              data: dataset_req_list
            },
          ]
        };

        var chartOptions = {
          responsive: true,
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Services Usage Bar Chart"
          },
          scales: {
            y: {
              display: true,
              type: 'logarithmic',
            }
          }
        }


        var ctx = document.getElementById("myChart2").getContext("2d");

        myBar = new Chart(ctx, {
          type: "bar",
          data: barChartData,
          options: chartOptions
        });

      })).catch(errors => {
        // react on errors.
      })
    }
  });




  //UPDATE DELLE VISUALIZZAZIONI E GESTIONE EVENTUALI ERRORI DI SELEZIONE DATE (LINE CHART)

  $('#Invio_1').click(function () {
    if (StartDate_1 == "" && EndDate_1 == "") {
      window.alert("Select a Start Date and an End Date (Line Chart)")
    } else if (StartDate_1 == "") {
      window.alert("Select a Start Date (Line Chart)")
    } else if (EndDate_1 == "") {
      window.alert("Select an End Date (Line Chart)")
    } else {


      if (StartDate_1 >= EndDate_1) {
        StartDate_1 = ""
        EndDate_1 = ""
        $('#Start_1').val("")
        $('#End_1').val("")

        window.alert("Start Date must precede End Date (Line Chart)")
        throw "Start Date must precede End Date (Line Chart)"
      } else {
        console.log(StartDate_1, EndDate_1)

        // Reference per estrazione lista di mesi: http://jsfiddle.net/McCroskey42/1tp1hw8w/419/
        var start_Date_1 = moment(start_1);
        var end_Date_1 = moment(end_1);
        var result_1 = [];
        while (start_Date_1.isBefore(end_Date_1)) {
          result_1.push("https://opencitations.net/statistics/" + start_Date_1.format("YYYY-MM"));
          start_Date_1.add(1, 'month');
        }
        result_1.push("https://opencitations.net/statistics/" + end_Date_1.format("YYYY-MM"))
      }


      let result_w_interval_1 = [];

      //Gestione dell'intervallo dei mesi

      if (Interval_1 == 1) {
        result_w_interval_1 = result_1;
      } else {
        for (const [index, element] of result_1.entries()) {
          if (index % Interval_1 == 0) {
            result_w_interval_1.push(element);
          }
        }
      }


      //preparazione della lista delle richieste axios ad API
      requests_list_1 = []

      for (i = 0; i < result_w_interval_1.length; i++) {
        let ax_req = axios.get(result_w_interval_1[i])
        requests_list_1.push(ax_req)
      }

      let dict_name_1 = {};
      months = { "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr", "05": "May", "06": "Jun", "07": "Lug", "08": "Aug", "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec" };

      //RICHIESTE PARALLELE: per ogni richiesta, conversione dati da prometheus a dizionario.
      // Dal dizionario completo ricavato dal prometheus si estraggono i dati di interesse
      // (numero indexed records x Line Chart // numero richieste dataset + numero richieste api x Bar Chart)
      // e si aggiungono come coppia chiave-valore ad un dizionario complessivo, dove la chiave
      // è la data (Mmm_YYYY) e il valore è un dizionario contenente le coppie chiavi-valore relative
      // ai dati di interesse (numero indexed records x Line Chart // numero richieste dataset + numero richieste api x Bar Chart)      

      axios.all(requests_list_1).then(axios.spread((...responses) => {
        for (i = 0; i < responses.length; i++) {
          element = result_w_interval_1[i];
          const datePattern = /(\d{4})\-(\d{1,2})/;
          const date = datePattern.exec(element);
          metricsStr = (responses[i]).data;

          //Divisione prometheus in corrispondenza del \n
          var array1 = metricsStr.split(/\r?\n/);
          // alternativa : var array = metricsStr.match(/[^\r\n]+/g);
          var filtered = array1.filter(function (value, index, arr) {
            return !value.startsWith("#");
            //Elimina gli elementi che iniziano con #
          });



          // costruisci il dizionario dal prometheus
          prom_to_dict = {}

          const pattern = /{/;
          //reference: https://stackoverflow.com/a/19793380/15097248
          function extractQuotedText(str) {
            const matches = str.match(/"(.*?)"/);
            return (matches
              ? matches[1]
              : str);
          };

          for (let i = 0; i < filtered.length; i++) {
            if (pattern.test(filtered[i]) == true) {
              let pos_open_par = filtered[i].indexOf('{')
              let pos_close_par = filtered[i].indexOf('}')

              let dict_key = filtered[i].substr(0, pos_open_par);
              if (!(dict_key in prom_to_dict)) {
                prom_to_dict[dict_key] = {}
              };

              let nest_dict_key = extractQuotedText(filtered[i])
              let nest_dict_val = filtered[i].substr(pos_close_par + 2);

              prom_to_dict[dict_key][nest_dict_key] = nest_dict_val

            } else {
              // considera lo spazio come separatore, quello che viene prima è la chiave, quello che viene dopo il valore
              // Non verificato: cosa succede quando c'è più di uno spazio
              let pos_space = filtered[i].indexOf(' ');
              let dict_key = filtered[i].substr(0, pos_space);
              let dict_val = filtered[i].substr(pos_space + 1);
              prom_to_dict[dict_key] = dict_val
            };
          }

          // estrazione dati richiesti (in questo caso ind_rec)
          ind_rec = prom_to_dict.opencitations_indexed_records
          let result = {};
          result["indexed_records"] = Number(ind_rec);
          key_name = months[date[2]] + "_" + date[1];
          dict_name_1[key_name] = result;


        }

        ind_rec_list = [];
        labels_list = [];


        for (const key in dict_name_1) {
          labels_list.push(key);
          ind_rec_list.push(dict_name_1[key].indexed_records);
        }

        /// UPDATE DEI GRAFICI


        //distruzione dei grafici default (o precedentemente generati)
        myLine.destroy()

        //creazione nuovi grafici con dati relativi ai mesi richiesti dall'utente
        // Linechart per indexed records
        var lineChartData = {
          labels: labels_list,
          datasets: [
            {
              label: "OC Indexed Records",
              backgroundColor: "#AB54FD",
              borderColor: "purple",
              borderWidth: 1,
              data: ind_rec_list
            },
          ]
        }

        var lineChartOptions = {

          responsive: true,
          legend: {
            position: "top"
          },
          title: {
            display: true,
            text: "Indexed records Line Chart"
          },
          scales: {
            y: {
              display: true,
              type: 'linear',
            }
          }
        }

        var ctx2 = document.getElementById("myChart").getContext("2d");
        myLine = new Chart(ctx2, {
          type: "line",
          data: lineChartData,
          options: lineChartOptions
        });

      })).catch(errors => {
        // react on errors.
      })
    }
  });
















});
