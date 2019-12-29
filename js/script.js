$(document).ready(function(){
    
$(document).on('click', '#aba', function() {
    $("#container").toggleClass('fechado');
    $("#aba .fas").toggleClass('off');
});    
    
//remover a lista do envio
$(document).on('click', '.remove-lista-p', function() {
    var  pai = $(this).parent();
    var id_lista = pai.attr("data-id");
    var lista = $(".corpo-lista[data-id="+id_lista+"]"); 
    $(".criarlista").removeClass("criarlista");
    lista.removeClass("select");
    
    
    var id_novo = $("#lista-name").val();
    if (id_novo.indexOf(",") != -1){
         id_novo = id_novo.replace(id_lista+",","");
         id_novo = id_novo.replace(","+id_lista,"");
         $("#lista-name").val(id_novo);
    }else{
         id_novo = id_novo.replace(id_lista,"");
         $("#lista-name").val(id_novo);
    }
    

    pai.addClass("sumir");
    setTimeout(function(){pai.remove();}, 300);
 });    

    
$(document).on('click', '#btn-nova-lista', function() {
     $(".modal-nova-lista").toggleClass("show");
});    
        
$(document).on('click', '#fechar-modal', function() {
    $(".modal-nova-lista").toggleClass("show");
 });        

//comportamento de add-lista
$(document).on('click', '.add-arrow-lista', function() {
    var  pai = $(this).parent();
    var nome_lista = pai.attr("data-nome");
    var id_lista = pai.attr("data-id");
    var cor_lista = pai.attr("data-cor")
    
    pai.addClass("select");
    var obj = "<p data-id='" + id_lista + "' class='lista-p anima-entrada'><span style='background-color: "+ cor_lista +"'></span>"+ nome_lista +" <i class='fas fa-times-circle remove-lista-p'></i></p>";
    $("#listas-select").append(obj);
    
    
    var i = $("#lista-name").val();
    if (i == ""){
         $("#lista-name").val(id_lista);
    }else{
        $("#lista-name").val(id_lista+","+i);  
    }
    
 });  
   
$(document).on('click', '#btn-excluir', function() {
    var lista= $(this).closest('.corpo-lista');
    lista.toggleClass("danger");
    var modal = lista.find(".modal-confirma");
    modal.addClass("show");
});        

$(document).on('click', '#btn-voltar', function() {
    var lista= $(this).closest('.corpo-lista');
    lista.removeClass("danger");
    var modal = lista.find(".modal-confirma");
    modal.removeClass("show");
}); 
    
    
    
$(document).on('click', '#excluir-lista', function() {
       var lista= $(this).closest('.corpo-lista');
       $(this).parent().parent().parent().remove();
       var id = lista.attr("id");
       var id_lista = lista.attr("data-id");
        console.log(id);
    console.log(id_lista);
    $.ajax({
         url : "excluirlista.php",
         type : 'post',
         data : {
             id : id,
             id_lista: id_lista
        }
    })
     .done(function(msg){
        lista.addClass("sumir");
        
        setTimeout(function(){lista.remove();}, 400);
    })
   .fail(function(jqXHR, textStatus, msg){
         alert("não foi");
   }); 
         
}); 
    

$(document).on('click', '#ver-lista', function() {
    $(".ver-modal").toggleClass("show"); 
    var lista= $(this).closest('.corpo-lista');
    var id_lista = lista.attr("data-id");
    var cor_lista = lista.attr("data-cor");
    var nome_lista = lista.attr("data-nome");
    $(".nome-lista-ver").html(nome_lista);
    $("#tag-modal").css("background-color", cor_lista);
     $.ajax({
         url : "listaremail.php",
         type : 'post',
         data : {
             id_lista: id_lista
         },
         dataType:"json",
    })
     .done(function(data){
        $("#ul-ver").html("");    
        $.each(data, function(k, v){
            var elemento = "<li><p>"+data[k]["nome"]+"</p><p>"+data[k]["email"]+"</p></li>";
            $("#ul-ver").append(elemento);      
        })
    })
   .fail(function(jqXHR, textStatus, data){
         alert("Não foi possivel encontrar a Lista");  
   }); 
    
});     
 

$(document).on('click', '#fechar-modal-ver', function() {
      $(".ver-modal").toggleClass("show");  
});     
    
$(document).on('click', '#excluir-file', function() {
      $("#anexo").val("");
      $("#anexo").change();
});      

$(document).on('change', '#anexo', function() {
    var arquivoLength = $("#anexo")[0].files.length;
    if (arquivoLength != 0 ){
        var arquivoNome = $("#anexo")[0].files[0].name;
        $("#label-anexo > i").toggle();
        $("#arquivo-leg").html("<i class='far fa-file'></i>"+arquivoNome);
        $(".box-anexo").addClass("ativo");
       
    }else{
        $("#label-anexo > i").toggle();
       $(".box-anexo").removeClass("ativo");
       $("#arquivo-leg").html("Anexar Arquivo");
    }
});   
    
$(document).on('click', '#btn-limpar-svg', function() {
      $("#select-arq").val("");
      $("#select-arq").change();
});      
    
    
$(document).on('change', '#select-arq', function() {
    var arquivoLength = $("#select-arq")[0].files.length;
    console.log($("#select-arq"));
    if (arquivoLength != 0 ){
        var arquivoNome = $("#select-arq")[0].files[0].name;
        $("#label-arq").html("<i class='far fa-file'></i> "+arquivoNome);
        $(".modal-nova-lista").addClass("ativo");
       
    }else{
       $("#label-arq").html("<i class='fas fa-upload'></i> Arquivo ");
       $(".modal-nova-lista").removeClass("ativo");
    }
});          
    

$(document).on('change', '#cor', function() {
    
        var cor = $("#cor").val();
   
       $("#cor-label").css("background-color",cor);
       
    
});      

       
$('#formulario').submit(function(e){
        e.preventDefault();
		var formdata = new FormData(this);
      
    $.ajax({
        type: 'POST',
        url: "crialista.php",
        data: formdata ,
        processData: false,
        contentType: false,
        dataType: "json",
        beforeSend: function() {
        // setting a timeout
        var elemento = "<li class='corpo-lista' id='aguarde' data-id='' data-nome='' data-cor='' ><p> AGUARDE</p></li>"; 
        $("#cx-lista").append(elemento);
        $(".modal-nova-lista").toggleClass("show");
    }
    }).done(function (data) {
        $("#aguarde").remove();
        var elemento = "<li class='corpo-lista criarlista' id='' data-id='"+ data[0] +"' data-nome='"+ data[1] +"' data-cor='"+ data[3] +"' ><div class='tag' style='background-color: "+ data[3] +"'></div><p> "+ data[1] +" <span><i class='far fa-envelope envelope'></i> Emails: "+ data[2] +"</span></p><a class='add-arrow-lista'><i class='fas fa-chevron-right'></i></a><i id='check' class='fas fa-check-circle'></i><div class='option-lista'><div><a id='ver-lista'><i class='fas fa-eye'></i>ver</a></div><div><a id='btn-excluir'><i class='fas fa-times-circle red'></i>Excluir</a><div class='modal-confirma'><a id='excluir-lista'>EXCLUIR</a><a id='btn-voltar'>CANCELAR</a></div></div></div></li>"; 
        $("#cx-lista").append(elemento);
        
       
    }).fail(function (data){
        console.log(data.responseText);
         var elemento = "<li class='corpo-lista' id='error' data-id='' data-nome='' data-cor='' ><p> "+data.responseText+" <a id='excluir-erro'><span>Envie um arquivo .CSV válido </span></p><i class='fas fa-exclamation-circle'></i></a><div class='option-lista'><div><a id='limpar-erro'><i class='fas fa-trash-alt'></i></i>Limpar</a></div></li>"; 
        $("#aguarde").remove();
        $("#cx-lista").append(elemento);
    });
		
    });  
    
$(document).on('click', '#limpar-erro', function() {
    var lista= $(this).closest('.corpo-lista');
    lista.remove();
}); 
   
  $("#formemail").on("submit", function () {
    var hvalue = $('.ql-editor').html();
    $("#text").append("<textarea name='msg' style='display:none' hidden>"+hvalue+"</textarea>");
   });

    

});  