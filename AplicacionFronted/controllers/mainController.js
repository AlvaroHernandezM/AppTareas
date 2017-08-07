var base = "http://localhost/pruebaLaravel/laravel/public/api/"


class MainController {

    constructor() {
        this.initData();
    }

// ###########################################################
// Metodo que carga las tareas al abrir index
// ###########################################################
    initData() {
        $.showLoading("Cargando publicaciones");
        $.ajax({
            dataType: "json",
            type: "GET",
            url: base + "tasks"
        }).done(function (data) {
            //console.log(data);
            setTasks(data);
        }).fail(function (data) {
            alert("error");
            console.log(data);
        });
    }
}
// ###########################################################
// Pintado de tareas en la tabla
// ###########################################################
    function setTasks(data) {
        var numTask = 0;
        for (var i in data) {
            var task = data[i];
            var status = "Abierta";
            if(task.status==1){
              status = "Cerrada";
            }
            addTask(task, status);
            numTask =+ 1;
        }
        initDataTable();
        $.showNotify('Correcto', 'Se han cargado '+numTask+' tarea(s) existentes', 'success');
        $.hiddenLoading();
        return true;
    }

// ###########################################################
// Creacion de elemento individual para cada tarea
// ###########################################################
    function addTask(task, status) {
        $("#myTable").append('<tr><td>'+task.name+'</td>' +
            '<td>'+task.description+'</td>'+
            '<td>'+status+'</td>'+
            '<td>'+task.created_at+'</td>'+
            '<td>'+task.updated_at+'</td>'+
            '<td class="text-center"><a target="_blank" href="https://www.facebook.com/app_scoped_user_id/' + task.user_id + '"><img src="images/facebook.png"  alt="Logo facebook"></a></td>'+
            '</tr>');
    }
// ###########################################################
// Metodo que carga DataTable y en Espanol
// ###########################################################
function initDataTable(){
    $('#myTable').dataTable({
        "language": {
            "sProcessing":     "Procesando...",
            "sLengthMenu":     "Mostrar _MENU_ registros",
            "sZeroRecords":    "No se encontraron resultados",
            "sEmptyTable":     "Ningún dato disponible en esta tabla",
            "sInfo":           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
            "sInfoEmpty":      "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered":   "(filtrado de un total de _MAX_ registros)",
            "sInfoPostFix":    "",
            "sSearch":         "Buscar:",
            "sUrl":            "",
            "sInfoThousands":  ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
                "sFirst":    "Primero",
                "sLast":     "Último",
                "sNext":     "Siguiente",
                "sPrevious": "Anterior"
            },
            "oAria": {
                "sSortAscending":  ": Activar para ordenar la columna de manera ascendente",
                "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
        }
    });
}



var controller = new MainController();