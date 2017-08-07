var base = "http://localhost/AppTareas/laravelAPI/public/api/"

class MainController {

    constructor() {
        this.initData();
        $("#user_id").css("display", "none");
        $("#user_name").css("display", "none");
        $("#user_email").css("display", "none");
    }

// ###########################################################
// Metodo que carga las tareas al abrir index
// ###########################################################
    initData() {
        $.showLoading("Cargando tareas");
        $.ajax({
            dataType: "json",
            type: "GET",
            url: base + "tasks"
        }).done(function (data) {
            //console.log(data);
            $.hiddenLoading();
            setTasks(data, false);
        }).fail(function (data) {
            //alert("error");
            $.showNotify('Error', data.data, 'error');
            //console.log(data);
        });
    }
}
// ###########################################################
// Pintado de tareas en la tabla
// ###########################################################
    function setTasks(data, isMyTask) {
        var numTask = 0;
        for (var i in data) {
            var task = data[i];
            var status = "Abierta";
            if(task.status==1){
              status = "Cerrada";
            }
            if(isMyTask){
                addMyTask(task,status);
            } else {
                addTask(task, status);
            }
            numTask += 1;
        }
        if(isMyTask){
            initDataTableMyTasks();
        } else {
            initDataTableTasks();
        }
        $.showNotify('Correcto', 'Se han cargado '+numTask+' tarea(s) existente(s)', 'success');
        return true;
    }

// ###########################################################
// Creacion de elemento individual para cada tarea
// ###########################################################
    function addTask(task, status) {
        $("#tableTasks").append('<tr><td>'+task.name+'</td>' +
            '<td>'+task.description+'</td>'+
            '<td>'+status+'</td>'+
            '<td>'+task.created_at+'</td>'+
            '<td>'+task.updated_at+'</td>'+
            '<td class="text-center"><a target="_blank" href="https://www.facebook.com/app_scoped_user_id/' + task.user_id + '"><img src="images/facebook.png"  alt="Logo facebook"></a></td>'+
            '</tr>');
    }

// ###########################################################
// Creacion de elemento individual para cada tarea
// ###########################################################
function addMyTask(task, status) {
    if(status=="Abierta"){
        $("#myTableTasks").append('<tr><td>'+task.name+'</td>' +
            '<td>'+task.description+'</td>'+
            '<td>'+status+'</td>'+
            '<td>'+task.created_at+'</td>'+
            '<td>'+task.updated_at+'</td>'+
            '<td class="text-center"><button type="button" class="btn btn-success" onclick="closeMyTask('+task.id+','+task.user_id+'); return false"><i class="glyphicon glyphicon-ok-circle"></i></button> <a href="editMyTask/' + task.id + '"><button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-edit"></i></button></a>' +
            ' <button type="button" class="btn btn-danger" onclick="confirmDelete('+task.id+'); return false"><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
            '</tr>');
    } else{
        $("#myTableTasks").append('<tr><td>'+task.name+'</td>' +
            '<td>'+task.description+'</td>'+
            '<td>'+status+'</td>'+
            '<td>'+task.created_at+'</td>'+
            '<td>'+task.updated_at+'</td>'+
            '<td class="text-center"><button type="button" class="btn btn-success" onclick="openMyTask('+task.id+','+task.user_id+'); return false"><i class="glyphicon glyphicon-ok-circle"></i></button> <button type="button" class="btn btn-danger" onclick="confirmDelete('+task.id+'); return false"><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
            '</tr>');
    }
}

function newTask(){
    $.showLoading("Enviando nueva tarea...")
    var task = {};
    task.name = $('#name').val();
    task.description = $('#description').val();
    task = new FormData($("#newTask")[0]);
    console.log(task);
}

function closeMyTask(id, user_id){
    $.showLoading("Cerrando tarea");
    $.ajax({
        type: "POST",
        url: base + "tasks/" +id+"/close",
        data: {'user_id' : user_id}
    }).done(function (data) {
        //console.log(data);
        $.hiddenLoading();
        $.showNotify('Correcto', data.data, 'success');
    }).fail(function (data) {
        //alert("error");
        $.showNotify('Error', data.data, 'error');
        //console.log(data);
    });
}

function openMyTask(id, user_id){
    $.showLoading("Re abriendo tarea");
    $.ajax({
        type: "POST",
        url: base + "tasks/" +id+"/open",
        data: {'user_id' : user_id}
    }).done(function (data) {
        //console.log(data);
        $.hiddenLoading();
        $.showNotify('Correcto', data.data, 'success');
        myTasks();
    }).fail(function (data) {
        //alert("error");
        $.showNotify('Error', data.data, 'error');
        //console.log(data);
    });
}

function confirmDelete(id){
    $.showConfirm("¿Esta seguro?","La tarea sera eliminada", "removeTask", id, null, "info");
}

function removeTask(id){
    if(id){
        $.showLoading("Eliminando tarea");
        $.ajax({
            dataType: "json",
            type: "DELETE",
            url: base + "tasks/" + id
        }).done(function (data) {
            //console.log(data);
            $.hiddenLoading();
            $.showNotify('Correcto', data.data, 'success');
            console.log("se debe recargar parte de la pagina");
        }).fail(function (data) {
            //alert("error");
            $.showNotify('Error', data.data, 'error');
            //console.log(data);
        });
    } else {
        $.showNotify('Estado', 'Eliminacion cancelada', 'info');
    }

}

// ###########################################################
// Metodo que carga DataTable y en Espanol
// ###########################################################
function initDataTableTasks(){
    $('#tableTasks').dataTable({
        "language": getLanguage()
    });
}

function myTasks(){
    $("#button_myTasks").css("display", "none");
    $.showLoading("Cargando mis tareas");
    $.ajax({
        dataType: "json",
        type: "GET",
        url: base + "users/77832178327381/tasks"
    }).done(function (data) {
        //console.log(data);
        $.hiddenLoading();
        setTasks(data, true);
    }).fail(function (data) {
        //alert("error");
        $.showNotify('Error', data.data, 'error');
        //console.log(data);
    });
}


// ###########################################################
// Metodo que carga DataTable y en Espanol
// ###########################################################
function initDataTableMyTasks(){
    $('#myTableTasks').dataTable({
        "language": getLanguage()
    });
}

function getLanguage(){
    return language = {
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
}

var controller = new MainController();