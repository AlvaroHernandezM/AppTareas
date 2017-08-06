// ###########################################################
// Diferentes bases de url para el despliegue de la aplicacion
// ###########################################################
// var base = "/"
var base = "http://loencontre.co/"
// var base = "http://localhost/"


class MainController {

  constructor() {
    this.initData();
    $("#name").css("display", "none");
    $("#probability").css("display", "none");
    $("#user_id").css("display", "none");
    $("#user_name").css("display", "none");
    $("#user_email").css("display", "none");
  }


// ###########################################################
// Metodo que carga las publicaciones por primera vez
// ###########################################################
  initData(){
    firtTime();
    $.ajax({
      dataType: "json",
      url: base + "loencontre.co/SourceBackend/pagination"
    }).done(function(pages) {
      $('#pagination-here').bootpag({
        total: pages.pageAmount
      }).on("page", function(event, num){
        $.ajax({
          dataType: "json",
          url: base + "loencontre.co/SourceBackend/get-page?pageNumber="+num
        }).done(function(data) {
          setPost(data);
        });
      });
    });
    return true;
  }  
}


// ###########################################################
// Obtencion de datos de la primera pagina de publicaciones
// ###########################################################
function firtTime() {
  $.ajax({
    dataType: "json",
    url: base + "loencontre.co/SourceBackend/get-page?pageNumber=1"
  }).done(function(data) {
    setPost(data);
  });
  return true;
}


// ###########################################################
// Pintado de publiaciones por primera vez
// ###########################################################
function setPost(data) {
  $("#main").html("");
  for (var i in data) {
    var post = data[i];
    var fecha = new Date(post.date);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    addPost(post, options, fecha);
  }
  initScript();
  return true;
}


// ###########################################################
// Pintado de publicaciones luego de una busqueda
// ###########################################################
function setPostAfter(data) {
  $("#main").html("");
  for (var i in data) {
    var post = data[i];
    var fecha = new Date(post.date);
    var options = { year: 'numeric', month: 'long', day: 'numeric' };
    addPost(post, options, fecha)
  }
  setMain();
  return true;
}


// ###########################################################
// Creacion de elemento individual para cada publicacion
// ###########################################################
function addPost(post, options, fecha){
  if (post.user) {
    $("#main").append('<article class="thumb">' +
      '<a class="image" href="'+post.image+'"><img src="'+post.image+'" alt="" /></a>'+
      '<h2>'+fecha.toLocaleDateString("es-ES", options)+'</h2>' +
      '<p><a target="_blank" href="https://www.facebook.com/app_scoped_user_id/'+post.user_id+'"> ¡Contactame para la devolución! </a></p>' +
      '<p><a target="_blank" onclick="share(\''+post.name+'\', \''+post.image+'\')" >Compartir en Facebook</a></p>' +
      '</article>'); 
  }else{
    $("#main").append('<article class="thumb">' +
      '<a class="image" href="'+post.image+'"><img src="'+post.image+'" alt="" /></a>'+
      '<h2>'+fecha.toLocaleDateString("es-ES", options)+'</h2>' +
      '<p> <a target="_blank" href="https://www.facebook.com/groups/5347104545/photos/"> Fuente</a></p>' +
      '<p><a target="_blank" onclick="share(\''+post.name+'\', \''+post.image+'\')" >Compartir en Facebook</a></p>' +
      '</article>'); 
  }
}



var controller = new MainController();