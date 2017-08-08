var base = "http://localhost/AppTareas/laravelAPI/public/api/"

class Main {

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
        allTasks(false);
    }
}

var myTableTask;
var tableTasks;
var userConnected;
var userIdFacebook;
var userNameFacebook;

function  allTasks(isUpdate) {
    if(!isUpdate){
        $.showLoading("Cargando tareas");
    }
    $.ajax({
        dataType: "json",
        headers: {"Content-Type": "application/json"},
        type: "GET",
        url: base + "tasks"
    }).done(function (data) {
        //console.log(data);
        $.hiddenLoading();
        setTasks(data, false, isUpdate);
    }).fail(function (data) {
        //alert("error");
        $.showNotify('Error', data.responseText, 'error');
        //console.log(data);
    });
}

// ###########################################################
// Extraccion de datos del usuario de la cuenta de facebook
// ###########################################################
function loginStatusVerificate(response, confirmSend){
    if(response.status != 'conected'){
        FB.login(function(response) {
            if(response.status = 'connected'){
                FB.api('/me?fields=id,name,email', function(response) {
                    if(response.id != ''){
                        $.hiddenLoading();
                        $.showNotify('Estado', 'Contectado con Facebook', 'success');
                        user = {
                            'id' : response.id,
                            'name' : response.name,
                            'email' : ''

                        }
                        if(!response.email){
                            user.email = 'nnnn@gmail.com';
                        }
                        userConnected = user;
                        $.hiddenLoading();
                        if(confirmSend){
                            sendTask();
                        } else {
                            getMyTasks();
                        }
                    }else{
                        $.showNotify('Error', 'Error obtener datos de usuario desde facebook. Intente de nuevo', 'error');
                    }
                });
            }else{
                $.showNotify('Error', 'Error al iniciar sesión con facebook', 'error');
            }
        });
    }else{
        $.showNotify('Error', 'No se pudo conectar con facebook', 'error');
    }
}

function sendTask(){
    if(!userConnected.email){
        userConnected.email = "nnnn@gnail.com"
    }
    $.showLoading("Enviando nueva tarea...")
    var task = {};
    task.name = $("#name").val();
    task.description = $("#description").val();
    $("#user_name").val(userConnected.name);
    $("#user_email").val(userConnected.email);
    $("#user_id").val(userConnected.id);
    taskNew = new FormData($("#newTask")[0]);
    $.ajax({
        type: "POST",
        url: base + "tasks",
        data : taskNew,
        contentType: false,
        processData: false
    }).done(function (data) {
        $.hiddenLoading();
        $.showNotify('Correcto', data.data, 'success');
        allTasks(true);
        getMyTasks();
        $("#name").val('');
        $("#description").val('');
    }).fail(function (data) {
        $.showNotify('Error', data.responseText, 'error');
    });

}

// ###########################################################
// Pintado de tareas en la tabla
// ###########################################################
    function setTasks(data, isMyTask, isUpdated) {
        var numTask = 0;
        if(isMyTask){
            $("#myTableTasks > tbody").html("");
        } else {
            $("#tableTasks > tbody").html("");
        }
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
            try {
                destroyDataTableMyTasks();
                initDataTableMyTasks();
            }
            catch(err) {
                initDataTableMyTasks();
            }
        } else {

            try {
                destroyDataTableTasks();
                initDataTableTasks();
            }
            catch(err) {
                initDataTableTasks();
            }
        }
        if(!isUpdated){
            $.showNotify('Correcto', 'Se ha cargado '+numTask+' tarea(s) existente(s)', 'success');
        }
        return true;
    }

// ###########################################################
// Creacion de elemento individual para cada tarea
// ###########################################################
    function addTask(task, status) {
    if(status=="Abierta"){
        $("#tableTasks").append('<tr><td><p class="text-danger bg-danger">'+task.name+'</p></td>' +
            '<td><p class="text-danger bg-danger">'+task.description+'</p></td>'+
            '<td><p class="text-danger bg-danger">'+status+'</p></td>'+
            '<td><p class="text-danger bg-danger">'+task.created_at+'</p></td>'+
            '<td><p class="text-danger bg-danger">'+task.updated_at+'</p></td>'+
            '<td class="text-center"><a target="_blank" href="https://www.facebook.com/app_scoped_user_id/' + task.user_id + '"><img src="images/facebook.png"  alt="Logo facebook"></a></td>'+
            '</tr>');
    } else {
        $("#tableTasks").append('<tr><td><p class="bg-success">'+task.name+'</p></td>' +
            '<td><p class="bg-success">'+task.description+'</p></td>'+
            '<td><p class="text-success bg-success">'+status+'</p></td>'+
            '<td><p class="bg-success">'+task.created_at+'</p></td>'+
            '<td><p class="bg-success">'+task.updated_at+'</p></td>'+
            '<td class="text-center"><a target="_blank" href="https://www.facebook.com/app_scoped_user_id/' + task.user_id + '"><img src="images/facebook.png"  alt="Logo facebook"></a></td>'+
            '</tr>');
    }

    }

// ###########################################################
// Creacion de elemento individual para cada tarea
// ###########################################################
function addMyTask(task, status) {
    if(status=="Abierta"){
        $("#myTableTasks").append('<tr><td><p class="text-danger bg-danger">'+task.name+'</p></td>' +
            '<td><p class="text-danger bg-danger">'+task.description+'</p></td>'+
            '<td><p class="text-danger bg-danger">'+status+'</p></td>'+
            '<td><p class="text-danger bg-danger">'+task.created_at+'</p></td>'+
            '<td><p class="text-danger bg-danger">'+task.updated_at+'</p></td>'+
            '<td class="text-center"><button type="button" class="btn btn-success" onclick="closeMyTask('+task.id+'); return false"><i class="glyphicon glyphicon-ok-circle"></i></button> <a href="editMyTask/' + task.id + '"><button type="button" class="btn btn-primary"><i class="glyphicon glyphicon-edit"></i></button></a>' +
            ' <button type="button" class="btn btn-danger" onclick="confirmDelete('+task.id+'); return false"><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
            '</tr>');
    } else{
        $("#myTableTasks").append('<tr><td><p class="bg-success">'+task.name+'</p></td>' +
            '<td><p class="bg-success">'+task.description+'</p></td>'+
            '<td><p class="text-success bg-success">'+status+'</p></td>'+
            '<td><p class="bg-success">'+task.created_at+'</p></td>'+
            '<td><p class="bg-success">'+task.updated_at+'</p></td>'+
            '<td class="text-center"><button type="button" class="btn btn-primary" onclick="openMyTask('+task.id+'); return false"><i class="glyphicon glyphicon-repeat"></i></button> <button type="button" class="btn btn-danger" onclick="confirmDelete('+task.id+'); return false"><i class="glyphicon glyphicon-remove-circle"></i></button></td>'+
            '</tr>');
    }
}

function newTask(){

    $.showLoading("Conectando con Facebook...");
    $.showNotify('Ayuda', "Debes estar atento a la notificación generada por el navegador para activar ventanas emergentes", 'info');
    FB.getLoginStatus(function(response) {
        loginStatusVerificate(response, true);
    });



}

function closeMyTask(id){
    $.showLoading("Cerrando tarea");
    $.ajax({
        type: "POST",
        url: base + "tasks/" +id+"/close",
        data: {'user_id' : userConnected.id}
    }).done(function (data) {
        $.hiddenLoading();
        $.showNotify('Correcto', data.data, 'success');
        getMyTasks();
        allTasks(true);
    }).fail(function (data) {
        $.showNotify('Error', data.responseText, 'error');
    });
}

function openMyTask(id){
    $.showLoading("Re abriendo tarea");
    $.ajax({
        type: "POST",
        url: base + "tasks/" +id+"/open",
        data: {'user_id' : userConnected.id}
    }).done(function (data) {
        $.hiddenLoading();
        $.showNotify('Correcto', data.data, 'success');
        getMyTasks();
        allTasks(true);
    }).fail(function (data) {
        $.showNotify('Error', data.responseText, 'error');
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
            url: base + "tasks/" + id,
        }).done(function (data) {
            $.hiddenLoading();
            $.showNotify('Correcto', data.data, 'success');
            getMyTasks();
            allTasks(true);
        }).fail(function (data) {
            $.showNotify('Error', data.responseText, 'error');
        });
    } else {
        $.showNotify('Estado', 'Eliminacion cancelada', 'info');
    }

}

// ###########################################################
// Metodo que carga DataTable y en Espanol
// ###########################################################
function initDataTableTasks(){
    tableTasks = $('#tableTasks').dataTable({
        "language": getLanguage()
    });
    tableTasks.dataTable.ext.errMode = 'none';

}

function destroyDataTableTasks(){
    tableTasks.destroy();
}

function myTasks(){
    $("#button_myTasks").css("display", "none");
    $.showLoading("Conectando con Facebook...");
    $.showNotify('Ayuda', "Debes estar atento a la notificación generada por el navegador para activar ventanas emergentes", 'info');
    FB.getLoginStatus(function(response) {
        loginStatusVerificate(response, false);
    });

}

function getMyTasks(){
    $.ajax({
        dataType: "json",
        type: "GET",
        url: base + "users/"+userConnected.id+"/tasks"
    }).done(function (data) {
        $.hiddenLoading();
        setTasks(data, true, false);
    }).fail(function (data) {
        $.showNotify('Error', data.responseText, 'error');
    });
}



// ###########################################################
// Metodo que carga DataTable y en Espanol
// ###########################################################
function initDataTableMyTasks(){
    myTableTask = $('#myTableTasks').dataTable({
        "language": getLanguage()
    });
    myTableTask.dataTable.ext.errMode = 'none';
}

// ###########################################################
// Metodo que borrar un Datatable antiguo
// ###########################################################
function destroyDataTableMyTasks(){
    myTableTask.destroy();

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

var controller = new Main();