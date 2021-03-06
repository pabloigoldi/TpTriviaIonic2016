// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','firebase'])

.run(function($ionicPlatform) {

   

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
   $ionicConfigProvider.navBar.alignTitle('center');

     $stateProvider 

    .state('app', {
         url: '/app',
         abstract: true,
         templateUrl: 'templates/menu.html',
          controller: 'AppCtrl'
        })

   .state('app.jugar', {
         url: '/jugar',
         views: {
           'menuContent': {
            templateUrl: 'templates/jugar.html',
           controller:'jugarCtrl'
                          }
              }
      })

    .state('app.crearPregunta', {
         url: '/crearPregunta',
         views: {
           'menuContent': {
                  templateUrl: 'templates/crearPregunta.html',
                  controller:'crearPreguntaCtrl'
                          }
              }
      })

   .state('app.info', {
       url: '/info',
        views: {
          'menuContent': {
           templateUrl: 'templates/info.html',
            controller:'infoCtrl' 
              }
        }
      })
   .state('app.login', {
       url: '/login',
        views: {
          'menuContent': {
           templateUrl: 'templates/login.html',              
           controller:'loginCtrl'
             }
        }
      })

  .state('app.browse', {
      url: '/browse/:score',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html',
          controller:'browseCtrl'
        }
      }
    })

    .state('app.logout', {
      url: '/logout',
      views: {
        'menuContent': {
          templateUrl: 'templates/logout.html',
          controller:'logoutCtrl'
        }
      }
    })



    
  .state('app.faq', {
      url: '/faq',
      views: {
        'menuContent': {
          templateUrl: 'templates/faq.html',
          controller: 'faqCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/login');
});
