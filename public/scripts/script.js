var grafico = graficoNuevo ();

function aranna(value, tipo, anno, idchart = ""){
	var parameters = { "id": value, "tipo": tipo, "anno": anno};
    $.get('/getRiesgo',parameters,function(data) {
		var tipoRiesgo = getTipoRiesgo (data.riesgo[0].valor.toFixed(0));
		grafico.data.labels = data.componentes;
		grafico.data.datasets[0].label = data.nombre;
		grafico.data.datasets[0].data = data.valores.map(function(valor){return valor.toFixed(0)});
		grafico.update();
		pintarGrafico (grafico);
		document.getElementById ("riesgo").value = data.riesgo[0].valor.toFixed(0);
		document.getElementById ("tipoRiesgo").value = (["Muy Alto", "Alto", "Intermedio", "Bajo", "Muy bajo"])[tipoRiesgo];
	});
};

function graficoAranna()
{
	var url = new URL(document.URL);
	var param = url.searchParams.get("asada");
	document.getElementById("asada").value = param == null ? document.getElementById("asada").value : param;
	var value = document.getElementById("asada").value;
    aranna(value,"INDICADORXASADA",0)
};

function graficoNuevo (asada = "")
{
	return new Chart(document.getElementById("radar-chart"+asada),
	{
		type: (document.getElementById("tipoGrafico") == null ? "bar" : document.getElementById("tipoGrafico").value),
		data:
		{
			labels: null,
		
			datasets:
			[
				{
					label: null,
					fill: true,
					backgroundColor: "rgba(25,61,102,0.2)",
					borderColor: "rgba(25,61,102,1)",
					pointBorderColor: "#fff",
					pointBackgroundColor: "rgba(179,181,198,1)",
					pointRadius: 8,
					pointHoverRadius: 12,
					data: null,
				}
			],
		},
		options:
		{
			title:
			{
				display: true,
				text: 'Nivel de Riesgo de la ASADA'
			},
			scales: tipoGrafico != null && tipoGrafico.value == "radar" ? {} :
			{
				yAxes:
				[
					{
						display: true,
						ticks:
						{
							beginAtZero: true,
							steps: 10,
							max: 100
						}
					}
				]
			},
		}
	});
}

function cambiarGrafico()
{
	grafico.destroy();
	grafico = graficoNuevo ();
	graficoAranna();
}

function presentarAsada(){
    
    var asada = document.getElementById("asada").value;
    var values_list = asada.split(";");
    //console.log(values_list);
    
    $("div.present").html(
        "<br><p><b>" + values_list[0] + "</b></p><br>" + 
        "<p><b>UBICACIÓN:</b> " + values_list[1] + ", " + values_list[2] + ", " + values_list[3] + "</p><br>" + 
        "<p><b>SEÑAS ADICIONALES:</b> " + values_list[4] + "</p><br>" + 
        "<p><b>TELÉFONO:</b> " + values_list[5] + "</p><br>" +
        "<p><b>URL:</b> " + values_list[6] + "</p><br>" 
    );
};

function cambiarTipoInforme(){

    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
        $("#agregarAsada").hide();
        $("#borrarAsada").hide();
        $("#asadasInforme").hide();
    }
    else{
        $("#agregarAsada").show();        
        $("#borrarAsada").show();
        $("#asadasInforme").show();
    }
    $("#prueba").hide();
	$("#downloadpdf").hide();
};

function addAsadaToList(){
    var asada = document.getElementById("asada").value;
	
	if ($("#listaAsadas").val() != "")
		$("#listaAsadas").val($("#listaAsadas").val() + "|" + asada);
	else
		$("#listaAsadas").val(asada);
	
    var values_list = asada.split(",");
	values_list[1] = values_list[1].trim(values_list[1]);	

	if (!$("#asadasInforme").val().includes(values_list[1]))
		$("#asadasInforme").val($("#asadasInforme").val() + values_list[1] + "\n");

};

function deleteAsadaFromList(){
    var asada = document.getElementById("asada").value;
    var values_list = asada.split(",");

	if ($("#listaAsadas").val().split("|").length > 1)
		$("#listaAsadas").val($("#listaAsadas").val().replace("|" + asada, ""));
	else
		$("#listaAsadas").val("");

	values_list[1] = values_list[1].trim(values_list[1]);
	$("#asadasInforme").val($("#asadasInforme").val().replace(values_list[1] + "\n", ""));
	
};

function generarPDF(){
	$("#prueba").show();
    var esGlobal = $("input[value='global']:checked")[0];
    
    if (esGlobal != null){
    
        var asada = document.getElementById("asada").value;
        var values_list = asada.split(",");

        $("#prueba").html(
			'<div id="'+values_list[0]+'">'+
            "<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
            "<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
            "<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
            "<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
            "<p>Población: " + values_list[8] + "</p><br>" + 
            "<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
            "<p>Teléfono: " + values_list[10] + "</p><br>" + 
            "<p>URL: " + values_list[11] + "</p><br>" +
            "<canvas id=\"radar-chart\"></canvas></div>"
        );

        var incluirGraf = $("input[name='grafico']:checked")[0];
        var incluirHist = $("input[name='hist']:checked")[0];


        if (incluirGraf != null){
			grafico = graficoNuevo();
			aranna(parseInt(values_list[0]),"INDICADORXASADA",0, values_list[0]);
		}

        /*
        if (incluirHist != null)
            pdfdoc.addImage(canvasImg, 'JPEG', 10, 110, 100, 100);    
        */
	   $("#prueba")[0].hidden = false
    }
    else{
		var lista = $("#listaAsadas").val().split("|");

		$("#prueba").html("");

		for (var i = 0; i < lista.length; i++){
			values_list = lista[i].split(",");
			
			for (var j = 0; j < values_list.length; j++){
				values_list[j] = values_list[j].trim(values_list[j]);	
			}

			$("#prueba").append(
				'<div id="'+values_list[0]+'">'+
				"<h2>ASADA #" + values_list[0] + ": " + values_list[1] + "</h2><br>" + 
				"<p>Ubicación: " + values_list[2] + ", " + values_list[3] + ", " + values_list[4] + "</p><br>" + 
				"<p>Punto en el mapa: (" + values_list[6] + ", " + values_list[7] + ")</p><br>" + 
				"<p>Señas adicionales del lugar: " + values_list[5] + "</p><br>" + 
				"<p>Población: " + values_list[8] + "</p><br>" + 
				"<p>Cantidad de abonados: " + values_list[9] + "</p><br>" +
				"<p>Teléfono: " + values_list[10] + "</p><br>" + 
				"<p>URL: " + values_list[11] + "</p><br>" +
				"<canvas id=\"radar-chart"+values_list[0]+"\"></canvas></div>"
			);

			var incluirGraf = $("input[name='grafico']:checked")[0];
			var incluirHist = $("input[name='hist']:checked")[0];

			if (incluirGraf != null){
				grafico = graficoNuevo(values_list[0]);
				aranna(parseInt(values_list[0]),"INDICADORXASADA",0, values_list[0]);
			}
		}
	}
	$("#downloadpdf").show();
};

function downloadPDF()
{
	var pdfdoc = new jsPDF();

	var specialElementHandlers = {
		'#ignoreContent': function (element, renderer) {
			return true;
		}
	};

	var asadas = document.getElementById("prueba");
	var file_name = 'Informe - ASADAS'
	asadas.childNodes.forEach((element,key) => {
		if(key < asadas.childNodes.length && key > 0) pdfdoc.addPage();

		pdfdoc.fromHTML(element.innerHTML, 10, 10, {
			'width': 190,
			'elementHandlers': specialElementHandlers
		});
		//Cambiar el fondo a blanco para el jpeg
		var ctx = element.lastChild.getContext("2d");
		ctx.globalCompositeOperation = "destination-over";
		ctx.fillStyle = "#FFFFFF";
		ctx.fillRect(0, 0, element.lastChild.width, element.lastChild.height);
		
		pdfdoc.addImage(element.lastChild, "JPEG", 10, 110, 190, 190);
		file_name += " - " + element.id;
	});
	pdfdoc.save(file_name + '.pdf');
}

function getAnnos(object){
    var val= object.value

    $.get('/getAnno',{"asada": val},function(data) {
      jsonsites = data;
     }).done(function(res){
		var select = document.getElementById("anno");
		select.innerHTML="<option value='0'>Seleccione un año</option>";
		select.innerHTML+="<option onclick='getRespuestas("+jsonsites.anno+",\"actual\")' value='"+jsonsites.anno+"'>"+jsonsites.anno+"</option>";
        jsonsites.annos.forEach(function(anno){
            select.innerHTML+="<option onclick='getRespuestas("+anno.anno+",\"historico\")' value='"+anno.anno+"'>"+anno.anno+"</option>";
		});
		$("#btnCrearFormulario")[0].hidden = false;
	 });
     var select = document.getElementById("componenttable");
     select.innerHTML="<tr></tr>";
	 document.getElementById("radar-chart-div").style.visibility = "hidden";

}

function getRespuestas(val,tipo){
    if(val!="0" && val!=""){
    $("#error").html("");
    var asada= document.getElementById("asada").value
    var tipo = ((tipo == "actual") ? 'INDICADORXASADA' : 'HISTORICORESPUESTA');
    aranna(asada,tipo,val);
    document.getElementById("radar-chart-div").style.visibility = "visible";
    $.get('/getRespuestas',{"asada": asada, "anno": val, "tipo": tipo},function(data) {
      jsonsites = data;
     }).done(function(res){
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr>";
        jsonsites.preguntas.forEach(function(pregunta){
            select.innerHTML+="<td>" + pregunta.id + ". " +pregunta.pregunta+"</td><td>"+pregunta.respuesta+"</td>";
        });
        select.innerHTML+="</tr>";

     });
    }
     else{
        var select = document.getElementById("componenttable");
        select.innerHTML="<tr></tr>";
        $("#error").html(((val == "0") ? "No existen respuestas actuales de esta Asada" : 'No existen respuestas históricas de esta Asada'));
        document.getElementById("radar-chart-div").style.visibility = "hidden";
     }
}


function comparar(){
  layers[2].setStyle(null);
  layers2[2].setStyle(null);
  var parameters = { "tipo": "2", "anno": document.getElementById("anno1").value,  "anno2": document.getElementById("anno2").value};
  $.get('/getSites',parameters,function(data) {
      jsonsites = data.jsonsites1;
      jsonsites2 = data.jsonsites2;
     }).done(function(res){       
        layers[2].setStyle(styleFunction);
        layers2[2].setStyle(styleFunction2);
    });
};

function generarPDFInformeMejora(numAsada){
	if(numAsada == null)
	{
		$("#prueba").show();
		var asada = document.getElementById("asada").value;
		var values_list = asada.split(",");
		numAsada = values_list[0];
		$("#downloadpdf").show();
	}

	textosMejora = "";	            
	$.get(`./generarInformeMejora/getInforme/:${numAsada}`,{},function(data){
	}).done(function(mejoras){
		var parameters = { "id": numAsada, "tipo": "INDICADORXASADA", "anno": 0};
		$.get('/getRiesgo',parameters,function(data2) {
			$.get(`/getInfoAsada/:${numAsada}` , function(data3){
				$.get("/getAllSubcomponentes", function(data4){
					$.get("/getStatsSubcomponentes/" + numAsada, function(data5){
						console.log(data5.statsSubcomponentes);
						console.log("Entre a todos los gets")
						var tipoRiesgo = getTipoRiesgo (data2.riesgo[0].valor.toFixed(0));
						var tipo = (["Muy Alto", "Alto", "Intermedio", "Bajo", "Muy bajo"])[tipoRiesgo]
						textosMejora = textosMejora + 
						"<p><b>ASADA: </b>" +data3.asadaInfo.ID+"-"+data3.asadaInfo.Nombre+"</p>" +
						"<p><b>Provincia: </b>" +data3.asadaInfo.Provincia+"</p>" +
						"<p><b>Cantón: </b>" +data3.asadaInfo.Canton+"</p>" +
						"<p><b>Población atendida: </b>" +data3.asadaInfo.Poblacion+"</p>" +
						"<p><b>IRSSAS: </b>" +data2.riesgo[0].valor.toFixed(0)+"</p>" +
						"<p><b>Riesgo: </b>" + tipo +"</p>" +
						"<p><b>Fecha: </b>" + getCurrentDate() +"</p>";
						var count = 0;
						var index = 0;
						data4.AllSubcomponentes.forEach(Sub =>
							{
								textosMejora = textosMejora + "<h4>"+Sub.Nombre+": Nivel de Riesgo " + data5.statsSubcomponentes[index].valor.toFixed(2) +"</h4><br>";
								mejoras.mejoras.forEach(mejora=>
									{
										if(mejora.SUBCOMPONENTE == Sub.ID)
										{
											console.log(mejora);
											textosMejora = textosMejora + 
											"<p style='white-space: pre-line'>"+mejora.TEXTO_MEJORA+"</p><br>";
											count = count + 1;
										}
										console.log(count);
										
									});
									if(count==0)
									{
										textosMejora = textosMejora + "<p>No se presentan recomendaciones para este subcomponente</p><br>";
									}
									count = 0;
									index = index + 1;
							});
						
							
							$("#prueba").html(
								"<div id="+numAsada+">"+
								"<h2>Informe de Mejora</h2><br>" 
								+ textosMejora +"</div>"
							
						
								);
					
					
					
					});
					
				});
				
			});
			
		});
		
		
	});

	
};



function getCurrentDate()
{   
    var today = new Date();
    if(today.getMonth()<= 10)
    {
        var date = today.getDate() +'-0'+(today.getMonth()+1)+'-'+today.getFullYear();
    }
    else{
        var date = today.getDate() +'-'+(today.getMonth()+1)+'-'+today.getFullYear();
    }
    
    console.log(date);
    return date;
};


function downloadInformeMejora(){
	var pdfdoc = new jsPDF();
	var indicadores = document.getElementById("prueba");
	var specialElementHandlers = {
		'#ignoreElement': function (element, renderer) {
			return true;
		}
	};
	//indicadores.childNodes.forEach((element,key) => {
		//if(key < indicadores.childNodes.length && key > 0) pdfdoc.addPage();
		pdfdoc.fromHTML(indicadores.innerHTML, 10, 10, {
			'width': 190,
			'elementHandlers': specialElementHandlers,
		});
	//});
	pdfdoc.save('informe-mejora.pdf');
	
};

function getEstadisticas(){
	var parameters = { "provincia": document.getElementById("prov").value, "canton": document.getElementById("cant").value, "distrito": document.getElementById("dist").value, "orden": document.getElementById("ord").value};
	var distritos;
	$.get('/getEstadisticas',parameters,function(data) {
		distritos = data;
	   }).done(function(res){       
		  var selectCant = document.getElementById("componenttable");
		  selectCant.innerHTML="";
		  var totalAsadas = document.getElementById("totalAsadas");
		  totalAsadas.textContent = "Total de ASADAS: " + distritos.rows.length;
		  distritos.rows.forEach(consulta => {
			  selectCant.innerHTML+="<tr><td>"+consulta.Nombre+"</td><td>"+
			  ""+consulta.Distrito+"</td><td>"+consulta.Canton+"</td><td>"+consulta.Provincia+"</td><td>"+
			  ""+consulta.valor.toFixed(2)+`</td><td class='text-center'><a href='/statsSubcomponentes/${consulta.Asada_ID}' ><i class='fas fa-info-circle' style='color: #325276' `+
			  `></i></a></td></tr>`;
		  });
	  });
}

function getTipoRiesgo (valor)
{
    
    if (valor < 47.0)
    {
      return 4
    }
    else if (valor < 57.0)
    {
      return 3
    }
    else if (valor < 67.0)
    {
      return 2
    }
    else if (valor < 77.0)
    {
      return 1
    }
    else
    {
      return 0
    }
}

function pintarGrafico (graficoObj)
{
	var colores = ['rgba(234, 77, 70, 0.7)','rgba(232, 215, 75, 0.7)','rgba(72, 118, 90, 0.7)','rgba(22, 155, 220, 0.7)','rgba(22, 87, 205, 0.7)'];
	var riesgo = document.getElementById ("riesgo");
	var tipoGrafico = document.getElementById ("tipoGrafico");
	graficoObj.data.datasets[0].backgroundColor = tipoGrafico != null && tipoGrafico.value == "radar" ? colores[getTipoRiesgo (riesgo.value)] : []
	graficoObj.data.datasets[0].pointBackgroundColor = []
	for (var i = 0; i < graficoObj.data.datasets[0].data.length; i++)
	{
		if (tipoGrafico != null && tipoGrafico.value == "radar")
		{
			graficoObj.data.datasets[0].pointBackgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
		else
		{
			graficoObj.data.datasets[0].backgroundColor.push(colores[getTipoRiesgo (graficoObj.data.datasets[0].data[i])]);
		}
	}
	graficoObj.update();
}