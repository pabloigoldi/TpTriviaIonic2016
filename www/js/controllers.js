angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {




  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
         scope: $scope
      }).then(function(modal) {
      $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  // $scope.closeLogin = function() {
  //   $scope.modal.hide();
  // };

  // Open the login modal
  // $scope.login = function() {
  //   //$scope.modal.show();
  //   alert("aaa");
  // };

  // Perform the login action when the user submits the login form
  // $scope.doLogin = function() {
  //   console.log('Doing login', $scope.loginData);

  //   // Simulate a login delay. Remove this and replace with your login
  //   // code if using a login system
  //   $timeout(function() {
  //     $scope.closeLogin();
  //   }, 1000);
  // };
})

.controller('loginCtrl', function($scope,$state){


  $scope.loginData = {};
  $scope.loginData.username ="pablo.emanuel.ig@gmail.com";
  $scope.loginData.password = "hola06";

  $scope.doLogin= function()
  {
      firebase.auth().signInWithEmailAndPassword($scope.loginData.username,$scope.loginData.password).catch(function(error)
        {          
          console.info("error: " + error);
           var errorCode = error.code;
           var errorMessage = error.message;
          if(errorCode== 'auth/wrong-password')
          {
            $scope.mensajeLogin = "wrong-password";
          }
          else
          {
            $scope.mensajeLogin = "errores:" + errorMessage;
          }


        }).then(function(respuesta){
           //   console.info("respuesta: " + respuesta);
            ///  console.info("respuesta: " + firebase.auth().currentUser);
              if(respuesta)
              {
               
                  $state.go('app.faq');
              }
              else
              {
                $scope.mensajeLogin = "Error en el logueo";
              }

        });
  }



})

.controller('logoutCtrl', function($scope){

  $scope.mensaje = "Desea salir?";
  $scope.doLogout= function()
  {
      firebase.auth().signOut().catch(function(error)
        {
          console.info("error: " + error);

        }).then(function() {
          console.info("ok");
                  $scope.mensaje = "Saliendo...........";
        ionic.Platform.exitApp();
          
      });
    }

})

.controller('jugarCtrl', function($scope,$stateParams,$state,$firebaseObject,$window){  
  
 var respuestasUsuario=[];
  
  $scope.ListadoRespuestas ="";        
  $scope.pregunta = "";
  $scope.ListadoRespuestas = "";
  $scope.respuestaCorrecta = "";
  $scope.preguntaNro = 0;
  $scope.puntaje = 0;
  $scope.buttonDisabled= true;
  $scope.mensajeShow = false;
  $scope.btnJugarDisabled= false;
  $scope.botonFinal = false;
  $scope.botones = true;
  $scope.preguntas = true;

  var  listadoPreguntas = []; 
  var ref = new Firebase("https://practicasupervisada2016-f74f7.firebaseio.com/listado");


  ref.on('child_added', function (snapshot) {
        var dato = snapshot.val();
       // $scope.ListadoRespuestas = dato.listaRespuestas;        
       $scope.pregunta = dato.pregunta;
       // $scope.respuestaCorrecta = dato.respuestaCorrecta;

      var pregunta = new Object();
      pregunta.pregunta = dato.pregunta;
      pregunta.respuestaCorrecta = dato.respuestaCorrecta;
      pregunta.listaRespuestas = dato.listaRespuestas;

       
       listadoPreguntas.push(pregunta);
      // $scope.listadoPreguntas = listadoPreguntas;
       localStorage.setItem('listadoPreguntas', JSON.stringify(listadoPreguntas));

      });


  $scope.jugar = function() {


    $scope.btnJugarDisabled= true;
    $scope.mensajeShow = false;
    $scope.mensajeFinal = false;

    //console.log($scope.listadoPreguntas);
    var nroP = $scope.preguntaNro;
    if(nroP <JSON.parse(localStorage.getItem("listadoPreguntas")).length)
    {
        var p = JSON.parse(localStorage.getItem("listadoPreguntas"))[nroP];
        $scope.buttonDisabled= false;

         $scope.pregunta = p.pregunta;
         $scope.ListadoRespuestas = p.listaRespuestas;
         $scope.respuestaCorrecta = p.respuestaCorrecta;
         $scope.preguntaNro = nroP +1;
        $scope.btnJugarDisabled= true;

    }
    else
    {
     // alert("No hay mas preguntas, puntaje es: " + $scope.puntaje);

       $scope.btnSalirDisabled= true;
       $scope.btnJugarDisabled= true;

      $scope.mensajeShow = true;
      $scope.mensajeDelJuego = "No hay mas preguntas, su puntaje es: " + $scope.puntaje;
      var fecha = new Date();
      var fechaActual =  fecha.getDay()+ "-"+fecha.getMonth() + "-" +fecha.getFullYear() ;
      var ref = new Firebase("https://practicasupervisada2016-f74f7.firebaseio.com/jugadoresTrivia");
      ref.push({
          Usuario:firebase.auth().currentUser.email,        
          puntaje :$scope.puntaje,
          dia:fechaActual
      });

      $scope.mensajeFinal = true;
      $scope.botonFinal = true;
      $scope.respuestasUsuario = "Las respuesta del usuario fueron:" + $scope.respuestasUsuario ;
       $scope.botones = false;
      $scope.preguntas = false;

    }
  }
    
  $scope.responder = function(respuesta,re, rc) {
    $scope.btnJugarDisabled = false;
    $scope.buttonDisabled = true;

    if(re==rc)
    {
      $scope.puntaje = $scope.puntaje +10;
      $scope.mensajeShow = true;
      $scope.mensajeDelJuego = "Bien!" ;
      respuestasUsuario.push(respuesta + ":Bien! - ");
       $scope.respuestasUsuario = respuestasUsuario;
      //espuestasUsuario.push = respuesta + "Bien! - ";
    }
    else
    {
      $scope.mensajeShow = true;
      $scope.mensajeDelJuego = "Mal!" ;
      respuestasUsuario.push(respuesta + ":Mal! - ");
      $scope.respuestasUsuario = respuestasUsuario;
      //$scope.respuestasUsuario = respuesta + "Mal! - " ;
    }
    
  }

  $scope.finalizarJuego = function() {
    $scope.btnSalirDisabled= true;

    $scope.btnJugarDisabled= true;
    $scope.mensajeDelJuego = "Tu puntaje es: " + $scope.puntaje;  
    var fecha = new Date();
    var fechaActual =  fecha.getDay()+ "-"+fecha.getMonth() + "-" +fecha.getFullYear() ;
    var ref = new Firebase("https://practicasupervisada2016-f74f7.firebaseio.com/jugadoresTrivia");
    ref.push({
          Usuario:firebase.auth().currentUser.email,        
          puntaje :$scope.puntaje,
          dia:fechaActual
      });
     $scope.mensajeFinal = true;
     $scope.botonFinal = true;
       $scope.botones = false;
        $scope.preguntas = false;
    $scope.respuestasUsuario = "Las respuesta del usuario fueron:" + $scope.respuestasUsuario ;
  }

  $scope.salirDeJuego = function()  
  { 
    ionic.Platform.exitApp();
  }
     
})



.controller('crearPreguntaCtrl', function($scope){

    $scope.mensaje = "Ingrese la pregunta con 3 respuestas posibles";

    $scope.creoPregunta=function(){       
      var ref = new Firebase("https://practicasupervisada2016-f74f7.firebaseio.com/listado");

      

      ref.push({
          pregunta:"¿En que año se jugo el primer mundial de futbol?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "1900" },
                  { "id":"2", "respuesta": "1950" },
                      { "id":"3", "respuesta": "1930" }
                      ],
          respuestaCorrecta:"3"
      });


      ref.push({
          pregunta:"¿Cuando goles hizo Maradona en Mexico 86?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "4" },
                  { "id":"2", "respuesta": "5" },
                      { "id":"3", "respuesta": "6" }
                      ],
          respuestaCorrecta:"2"
      });


      ref.push({
          pregunta:"¿En que año Argentina declaro su Independencia?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "1810" },
                  { "id":"2", "respuesta": "1813" },
                      { "id":"3", "respuesta": "1816" }
                      ],
          respuestaCorrecta:"3"
      });

      ref.push({
      pregunta:"¿En que pais murio Jose de San Martin?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "Argentina" },
                  { "id":"2", "respuesta": "Peru" },
                      { "id":"3", "respuesta": "Francia" }
                      ],
          respuestaCorrecta:"3"
      });

      ref.push({
      pregunta:"¿Cual es el pais mas grande del Mundo?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "Canada" },
                  { "id":"2", "respuesta": "Rusia" },
                      { "id":"3", "respuesta": "China" }
                      ],
          respuestaCorrecta:"2"
      });

      ref.push({
      pregunta:"¿Cuantos satelites tiene Marte?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "2" },
                  { "id":"2", "respuesta": "3" },
                      { "id":"3", "respuesta": "4" }
                      ],
          respuestaCorrecta:"1"
      });

      ref.push({
      pregunta:"¿Cual es el planeta mas grande del sistema solar?",        
          listaRespuestas :[
                  { "id":"1", "respuesta": "Jupiter" },
                  { "id":"2", "respuesta": "Saturno" },
                      { "id":"3", "respuesta": "Venus" }
                      ],
          respuestaCorrecta:"1"
      });

  } 
    
})




.controller('infoCtrl', function($scope){
    $scope.showBrowser=function(){
      var ref = window.open('https://github.com/pabloigoldi/TpTriviaIonic2016', '_blank', 'location=yes');
      ref.addEventListener('loadstart', function() { alert(event.url); });
    };
})
           



.controller('browseCtrl', function($scope,$state){
    $scope.score= $state.params.score;s
   
    $scope.resetear=function(){
        document.location.href='index.html';
    };
    
    $scope.salir=function(){
        ionic.Platform.exitApp();
    };
})

.controller('faqCtrl', function($scope, $stateParams,$state) {
    $scope.irJugar= function()
    {
      $state.go('app.jugar');
    }

});
