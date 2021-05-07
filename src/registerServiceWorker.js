/* eslint-disable no-console */

import { register } from 'register-service-worker'

// if (process.env.NODE_ENV !== 'production') {
//   register(`${process.env.BASE_URL}service-worker.js`, {
//     ready() {
//       console.log(
//         'App is being served from cache by a service worker.\n' +
//         'For more details, visit https://goo.gl/AFskqB'
//       )
//     },
//     registered() {
//       console.log('Service worker has been registered.')
//     },
//     cached() {
//       console.log('Content has been cached for offline use.')
//     },
//     updatefound() {
//       console.log('New content is downloading.')
//     },
//     updated() {
//       console.log('New content is available; please refresh.')
//     },
//     offline() {
//       console.log('No internet connection found. App is running in offline mode.')
//     },
//     error(error) {
//       console.error('Error during service worker registration:', error)
//     }
//   })
// }

let isSubscribed = false;
let swRegistration = null;
let applicationKey = "BD6sZyUuObqr-Hq69ESi1XlOAEuyTQBMwGHpp_1-Hu_TEZ9vCpBAxRfmKJIcVlflYIA-Gxn_9P4LnnABxgzEiH4";


// Url Encription
function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Installing service worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register(`${process.env.BASE_URL}service-worker.js`)
    .then(function (swReg) {
      console.log('service worker registered');

      swRegistration = swReg;

      swRegistration.pushManager.getSubscription()
        .then(function (subscription) {
          isSubscribed = !(subscription === null);

          if (isSubscribed) {
            console.log('User is subscribed');
          } else {
            console.log("User not subsrcibed");
            console.log(applicationKey);
            swRegistration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlB64ToUint8Array(applicationKey)
            })
              .then(function (subscription) {
                console.log(subscription);
                console.log('User is subscribed');

                saveSubscription(subscription);

                isSubscribed = true;
              })
              .catch(function (err) {
                console.log('Failed to subscribe user: ', err);
              })
          }
        })
    })
    .catch(function (error) {
      console.error('Service Worker Error', error);
    });
} else {
  console.warn('Push messaging is not supported');
}

// Send request to database for add new subscriber
function saveSubscription(subscription) {
  let xmlHttp = new XMLHttpRequest();
  //put here API address
  console.log("Came HERE")
  xmlHttp.open("POST", "/api/subscribe");
  xmlHttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState != 4) return;
    if (xmlHttp.status != 200 && xmlHttp.status != 304) {
      console.log("Came Here");
      console.log('HTTP error ' + xmlHttp.status, null);
    } else {
      console.log("User subscribed to server");
    }
  };

  xmlHttp.send(JSON.stringify(subscription));
}
