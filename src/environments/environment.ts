// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// Export config only; initialization happens in AppModule via AngularFire
export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyByAbVIHXfuXUQFAHMdUT9wx3l_glzCBiA",
    authDomain: "camp-cafe.firebaseapp.com",
    projectId: "camp-cafe",
    storageBucket: "camp-cafe.firebasestorage.app",
    messagingSenderId: "341412614397",
    appId: "1:341412614397:web:54235e6ae2a26739232e94",
    measurementId: "G-8VDDTL4SF3",
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
