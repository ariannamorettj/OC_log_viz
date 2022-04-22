$(document).ready(function() {


    //CREAZIONE E CARICAMENTO DEI GRAFICI DEFAULT (per ora coprono tutto il 2021 con i dati locali)


    var lineChartData = {
        labels : ['Jan_2021', 'Mar_2021', 'May_2021', 'Lug_2021', 'Sep_2021', 'Nov_2021'],
        datasets : [
            {
                label: "OC Indexed Records",
                backgroundColor: "#AB54FD",
                borderColor: "purple",
                borderWidth: 1,
                data : [759516507, 759516507, 759516507, 759516507, 1186958898, 1235170583]
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
        labels: ['Jan_2021', 'Mar_2021', 'May_2021', 'Lug_2021', 'Sep_2021', 'Nov_2021'],
        datasets: [
          {
            label: "API",
            backgroundColor: "#3C41E5",
            borderColor: "blue",
            borderWidth: 1,
            data: [1319211, 2887899, 1229705, 1130537, 1729375, 2770573]
          },
          {
            label: "Datasets",
            backgroundColor: "#AB54FD",
            borderColor: "purple",
            borderWidth: 1,
            data: [9652, 30224, 54006, 28161, 47698, 14255]
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
    // codice di elapsedMonths: https://stackoverflow.com/questions/2536379/difference-in-months-between-two-dates-in-javascript/2536445#2536445
    function elapsedMonths(d1, d2) {
        var months;
        months = (d2.getFullYear() - d1.getFullYear()) * 12;
        months -= d1.getMonth();
        months += d2.getMonth();
        return months <= 0 ? 0 : months;
    }
    
    let init_data_month = new Date('2021-01-01') // Inizializzato al gennaio 2021 perché per ora nell'API ci soni solo i resoconti mensili da quella data. Da aggiornare quando verranno caricati altri dati.
    let cur_data_month = new Date();

    let elapsed_record_months = elapsedMonths(init_data_month, cur_data_month);


    // Default functionality.
    let start = "";
    let end = ""; 
    let StartDate = "";
    let EndDate = "";
    let Interval = 1;

    $('#Start').MonthPicker({
        MaxMonth: -1, // -1 rispetto al mese corrente assumendo che il resoconto mensile sia pubblicato a fine mese
        MinMonth: - elapsed_record_months, // TUTTAVIA: per ora funziona fino al 12/2021. Il codice è pensato per funzionare con le richieste API, che sono aggiornate al penultimo mese.
        OnAfterChooseMonth: function(selectedDate) {
            StartDate = selectedDate;
            year = selectedDate.getFullYear();
            month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
            let date_for_query = year + "-" + month;
            console.log(date_for_query);
            start = date_for_query;
        }
        
    });

    $('#End').MonthPicker({
        MaxMonth: -1, // -1 rispetto al mese corrente assumendo che il resoconto mensile sia pubblicato a fine mese
        MinMonth: - elapsed_record_months, // TUTTAVIA: per ora funziona fino al 12/2021. Il codice è pensato per funzionare con le richieste API, che sono aggiornate al penultimo mese.
        OnAfterChooseMonth: function(selectedDate) {
            EndDate = selectedDate;
            year = selectedDate.getFullYear();
            month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
            let date_for_query = year + "-" + month;
            console.log(date_for_query);
            end = date_for_query;

        }        
    });
    
    
    $('#Intervallo').on('change', function() {
        Interval = ($(this).val());
        console.log(Interval);
    });


    //CODICE PER GESTIRE L'UPDATE DELLE VISUALIZZAZIONI (e messaggi di alert in caso di errore)

    $('#Invio').click(function () {
        if (StartDate == "" && EndDate == "") {
            window.alert("Select a Start Date and an End Date")
        } else if (StartDate == ""){
            window.alert("Select a Start Date")
          } else if (EndDate == ""){
            window.alert("Select an End Date")
          } else {


            if (StartDate >= EndDate){
                StartDate = ""
                EndDate = ""
                $('#Start').val("")
                $('#End').val("")

                window.alert("Start Date must precede End Date")
                throw "Start Date must precede End Date"
            } else{
                console.log(StartDate, EndDate)

                // codice per l'estrazione della lista di mesi modificato da : http://jsfiddle.net/McCroskey42/1tp1hw8w/419/
                var start_Date = moment(start);
                var end_Date = moment(end);
                var result = [];    
                while (start_Date.isBefore(end_Date)) {
                    result.push("summary/oc-" + start_Date.format("YYYY-MM")+ ".prom");
                    //result.push("http://opencitations.net/statistics/" + start_Date.format("YYYY-MM"));
                    start_Date.add(1, 'month');
                }
                result.push("summary/oc-" + end_Date.format("YYYY-MM")+ ".prom")
                //result.push("http://opencitations.net/statistics/" + end_Date.format("YYYY-MM"))
                }
            
            
            let result_w_interval = [];
            
            //Gestione dell'intervallo dei mesi

            if(Interval == 1){
                result_w_interval = result;
            } else{
                for (const [index, element] of result.entries()) {
                    if(index % Interval == 0){
                        result_w_interval.push(element);
                    }
                }
            }

            //lista dati chiamate per per visualizzazione
            console.log(result_w_interval)





            // ESTRAZIONE DEI DATI DAL RPOMETHEUS FORMAT RESTITUITO DALL'API
            async function getMonthMetrics(month_query_list){
                var dict_name = {};
                months= {"01": "Jan","02":"Feb","03":"Mar","04":"Apr", "05":"May", "06":"Jun", "07":"Lug", "08":"Aug", "09":"Sep", "10":"Oct", "11":"Nov", "12":"Dec" };
                let element;
            
            
                for (let i = 0; i < month_query_list.length; i++) {
                    element = [month_query_list[i]];
                    const datePattern = /(\d{4})\-(\d{1,2})/;
                    const date = datePattern.exec(element);
            
                    let response = await axios.get(element);
            
                    this.markDownData = response.data;
                    const metricsStr = this.markDownData;
            
            
                    //dividi il prometheus in corrispondenza del \n
                    var array1 = metricsStr.split(/\r?\n/);
                    // alternativa : var array = metricsStr.match(/[^\r\n]+/g);
                    var filtered = array1.filter(function(value, index, arr){ 
                    return !value.startsWith("#");
                    //Elimina gli elementi che iniziano con #
                    });
                    
                    // costruisci il dizionario dal prometheus
                    prom_to_dict = {}
            
                    const pattern = /{/;
                    //reference: https://stackoverflow.com/a/19793380/15097248
                    function extractQuotedText(str){
                        const matches = str.match(/"(.*?)"/);
                        return (matches
                            ? matches[1]
                            : str);
                        };
            
                    for (let i = 0; i < filtered.length; i++) {
                        if(pattern.test(filtered[i]) == true){
                            let pos_open_par = filtered[i].indexOf('{')
                            let pos_close_par = filtered[i].indexOf('}')
                            
                            let dict_key= filtered[i].substr(0, pos_open_par);
                            if (!(dict_key in prom_to_dict)){
                                prom_to_dict[dict_key] = {}
                            };
                            
                            let nest_dict_key = extractQuotedText(filtered[i])
                            let nest_dict_val = filtered[i].substr(pos_close_par+2);
                            
                            prom_to_dict[dict_key][nest_dict_key] = nest_dict_val
            
                        }else{
                            // considera lo spazio come separatore, quello che viene prima è la chiave, quello che viene dopo il valore
                            // verifica cosa succede quando c'è più di uno spazio
                            let pos_space = filtered[i].indexOf(' ');
                            let dict_key= filtered[i].substr(0, pos_space);
                            let dict_val = filtered[i].substr(pos_space + 1);
                            //aggiungi a prom_to_dict la coppia chiave valore (non puù essercene già una con lo stesso nome )
                            prom_to_dict[dict_key] = dict_val
                            
                        };
                    }
                    // estrazione dei dati che servono 
                    ind_rec = prom_to_dict.opencitations_indexed_records
                    api_req = prom_to_dict.opencitations_agg_counter_total.oc_api_requests
                    dataset_req = prom_to_dict.opencitations_agg_counter_total.dataset_requests
                    let result = {};
                    result["indexed_records"] = Number(ind_rec);
                    result["api_requests"] = Number(api_req);
                    result["dataset_requests"] = Number(dataset_req);
                    
                    key_name =  months[date[2]] + "_" + date[1];
                    dict_name[key_name] = result;
                }
            
            
            
                //console.log("This is the result", dict_name);
                return dict_name;
            
                }
            
                //month_query_array è stata sostituita con quello che restituisce la funzione che calcola il range di mesi tra due selezioni, considerando l'intervallo specificato. 
                //month_query_array = ['summary/oc-2021-01.prom','summary/oc-2021-02.prom', 'summary/oc-2021-03.prom',  'summary/oc-2021-04.prom', 'summary/oc-2021-05.prom', 'summary/oc-2021-06.prom','summary/oc-2021-07.prom', 'summary/oc-2021-08.prom', 'summary/oc-2021-09.prom','summary/oc-2021-10.prom'];
                let a = getMonthMetrics(result_w_interval);
            
                a.then(function(result){
                    //console.log(result);
                    /// definisci le quattro liste: labels, indexed records, api requests, dataset requests
                    /// riempile con iterazione 
                    ind_rec_list = [];
                    api_req_list = [];
                    dataset_req_list = [];
                    labels_list = [];
            
            
                    for (const key in result) {
                        labels_list.push(key);
                        api_req_list.push(result[key].api_requests);
                        dataset_req_list.push(result[key].dataset_requests);
                        ind_rec_list.push(result[key].indexed_records);
                        }
                
                
                console.log("labels_list", labels_list);
                console.log("api_req_list", api_req_list);
                console.log("dataset_req_list", dataset_req_list);
                console.log("ind_rec_list", ind_rec_list);



                /// UPDATE DEI GRAFICI


                //distruzione dei grafici default (o precedentemente generati)
                myLine.destroy()
                myBar.destroy()


                //creazione nuovi grafici con dati relativi dalla selezione dell'utente

                // Linechart per indexed records
                var lineChartData = {
                    labels : labels_list,
                    datasets : [
                        {
                            label: "OC Indexed Records",
                            backgroundColor: "#AB54FD",
                            borderColor: "purple",
                            borderWidth: 1,
                            data : ind_rec_list
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
                //var ctx3 = document.getElementById("myChart3").getContext("2d");

                myBar = new Chart(ctx, {
                  type: "bar",
                  data: barChartData,
                  options: chartOptions
                });


            })
        }
    });
});
