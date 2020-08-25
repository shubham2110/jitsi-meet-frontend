/* global APP, config, JitsiMeetJS, Promise */

import Logger from 'jitsi-meet-logger';

import { openConnection } from '../../../connection';
import { setJWT } from '../../../react/features/base/jwt';
import {
    JitsiConnectionErrors
} from '../../../react/features/base/lib-jitsi-meet';
import UIUtil from '../util/UIUtil';

import LoginDialog from './LoginDialog';

const logger = Logger.getLogger(__filename);

let externalAuthWindow;
let authRequiredDialog;

const isTokenAuthEnabled
    = typeof config.tokenAuthUrl === 'string' && config.tokenAuthUrl.length;
const getTokenAuthUrl
    = JitsiMeetJS.util.AuthUtil.getTokenAuthUrl.bind(null, config.tokenAuthUrl);

/**
 * Authenticate using external service or just focus
 * external auth window if there is one already.
 *
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function doExternalAuth(room, lockPassword) {
    if (externalAuthWindow) {
        externalAuthWindow.focus();

        return;
    }
    if (room.isJoined()) {
        let getUrl;

        if (isTokenAuthEnabled) {
            getUrl = Promise.resolve(getTokenAuthUrl(room.getName(), true));
            initJWTTokenListener(room);
        } else {
            getUrl = room.getExternalAuthUrl(true);
        }
        getUrl.then(url => {
            externalAuthWindow = LoginDialog.showExternalAuthDialog(
                url,
                () => {
                    externalAuthWindow = null;
                    if (!isTokenAuthEnabled) {
                        room.join(lockPassword);
                    }
                }
            );
        });
    } else if (isTokenAuthEnabled) {
        redirectToTokenAuthService(room.getName());
    } else {
        room.getExternalAuthUrl().then(UIUtil.redirect);
    }
}

/**
 * Redirect the user to the token authentication service for the login to be
 * performed. Once complete it is expected that the service wil bring the user
 * back with "?jwt={the JWT token}" query parameter added.
 * @param {string} [roomName] the name of the conference room.
 */
function redirectToTokenAuthService(roomName) {
    // FIXME: This method will not preserve the other URL params that were
    // originally passed.
    UIUtil.redirect(getTokenAuthUrl(roomName, false));
}

/**
 * Initializes 'message' listener that will wait for a JWT token to be received
 * from the token authentication service opened in a popup window.
 * @param room the name fo the conference room.
 */
function initJWTTokenListener(room) {
    /**
     *
     */
    function listener({ data, source }) {
        if (externalAuthWindow !== source) {
            logger.warn('Ignored message not coming '
                + 'from external authnetication window');

            return;
        }

        let jwt;

        if (data && (jwt = data.jwtToken)) {
            logger.info('Received JSON Web Token (JWT):', jwt);

            APP.store.dispatch(setJWT(jwt));

            const roomName = room.getName();

            openConnection({
                retry: false,
                roomName
            }).then(connection => {
                // Start new connection
                const newRoom = connection.initJitsiConference(
                    roomName, APP.conference._getConferenceOptions());

                // Authenticate from the new connection to get
                // the session-ID from the focus, which wil then be used
                // to upgrade current connection's user role

                newRoom.room.moderator.authenticate()
                .then(() => {
                    connection.disconnect();

                    // At this point we'll have session-ID stored in
                    // the settings. It wil be used in the call below
                    // to upgrade user's role
                    room.room.moderator.authenticate()
                        .then(() => {
                            logger.info('User role upgrade done !');
                            // eslint-disable-line no-use-before-define
                            unregister();
                        })
                        .catch((err, errCode) => {
                            logger.error('Authentication failed: ',
                                err, errCode);
                            unregister();
                        });
                })
                .catch((error, code) => {
                    unregister();
                    connection.disconnect();
                    logger.error(
                        'Authentication failed on the new connection',
                        error, code);
                });
            }, err => {
                unregister();
                logger.error('Failed to open new connection', err);
            });
        }
    }

    /**
     *
     */
    function unregister() {
        window.removeEventListener('message', listener);
    }

    if (window.addEventListener) {
        window.addEventListener('message', listener, false);
    }
}

/**
 * Authenticate on the server.
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */


 function loginWithSavedCred(room, lockPassword,  id, password, loginStatus) {

   let flag = false;
       room.authenticateAndUpgradeRole({
           id,
           password,
           roomPassword: lockPassword,

           /** Called when the XMPP login succeeds. */
           onLoginSuccessful() {
               // loginDialog.displayConnectionStatus(
               //     'connection.FETCH_SESSION_ID');
               // return true;
               loginStatus(true);
               // flag = true;
           }
       })
       .then(
           /* onFulfilled */ () => {

           // flag = true;
           // loginStatus(true);


           // return true;
               // loginDialog.displayConnectionStatus(
               //     'connection.GOT_SESSION_ID');
               // loginDialog.close();
           },
           /* onRejected */ error => {
           // flag = false;
           loginStatus(false);

               logger.error('authenticateAndUpgradeRole failed', error);

               const { authenticationError, connectionError } = error;

               if (authenticationError) {
                   // loginDialog.displayError(
                   //     'connection.GET_SESSION_ID_ERROR',
                   //     { msg: authenticationError });
               } else if (connectionError) {
                   // loginDialog.displayError(connectionError);
                   console.log('error', connectionError);
               }

           });

           // return flag;
 }


 function doAuthsk(room, lockPassword) {
   const loginDialog = LoginDialog.showAuthDialog(
       /* successCallback */ (id, password) => {
           room.authenticateAndUpgradeRole({
               id,
               password,
               roomPassword: lockPassword,

               /** Called when the XMPP login succeeds. */
               onLoginSuccessful() {
                   loginDialog.displayConnectionStatus(
                       'connection.FETCH_SESSION_ID');
               }
           })
           .then(
               /* onFulfilled */ () => {
                   loginDialog.displayConnectionStatus(
                       'connection.GOT_SESSION_ID');
                   loginDialog.close();
               },
               /* onRejected */ error => {
                   logger.error('authenticateAndUpgradeRole failed', error);

                   const { authenticationError, connectionError } = error;

                   if (authenticationError) {
                       loginDialog.displayError(
                           'connection.GET_SESSION_ID_ERROR',
                           { msg: authenticationError });
                   } else if (connectionError) {
                       loginDialog.displayError(connectionError);
                   }
               });
       },
       /* cancelCallback */ () => loginDialog.close());
 }
function doXmppAuth(room, lockPassword) {

  let id =   window.localStorage.getItem('xmpp_username_override1');
  let password = window.localStorage.getItem('xmpp_password_override1');
  console.log('OurSession: ID', id, '  Session:Password', password);
  if(id&&password){
   loginWithSavedCred(room, lockPassword,  id, password, (flag) => {
if(flag) {
  return;
}
else {
  doAuthsk(room, lockPassword);
     }
       });
  } else {
    doAuthsk(room, lockPassword);
  }
}

/**
 * Authenticate for the conference.
 * Uses external service for auth if conference supports that.
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function authenticate(room, lockPassword) {
   if( window.localStorage.getItem('xmpp_username_override1') && window.localStorage.getItem('xmpp_password_override1') ) {
     doXmppAuth(room, lockPassword);
   }
   else{
    if (isTokenAuthEnabled || room.isExternalAuthEnabled()) {
        doExternalAuth(room, lockPassword);
    } else {
        doXmppAuth(room, lockPassword);
    }
  }
}

/**
 * De-authenticate local user.
 *
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 * @returns {Promise}
 */
function logout(room) {
    return new Promise(resolve => {
        room.room.moderator.logout(resolve);
    }).then(url => {
        // de-authenticate conference on the fly
        if (room.isJoined()) {
            room.join();
        }

        return url;
    });
}

/**
 * Notify user that authentication is required to create the conference.
 * @param {JitsiConference} room
 * @param {string} [lockPassword] password to use if the conference is locked
 */
function requireAuth(room, lockPassword) {

  if( window.localStorage.getItem('xmpp_username_override1') && window.localStorage.getItem('xmpp_password_override1') ) {
    authenticate.bind(null, room, lockPassword);
    return;
  }

    if (authRequiredDialog) {
        return;
    }




    authRequiredDialog = LoginDialog.showAuthRequiredDialog(
        room.getName(), authenticate.bind(null, room, lockPassword)
    );
}

/**
 * Close auth-related dialogs if there are any.
 */
function closeAuth() {
    if (externalAuthWindow) {
        externalAuthWindow.close();
        externalAuthWindow = null;
    }

    if (authRequiredDialog) {
        authRequiredDialog.close();
        authRequiredDialog = null;
    }
}

/**
 *
 */
function showXmppPasswordPrompt(roomName, connect) {
    return new Promise((resolve, reject) => {
      let username =   window.localStorage.getItem('xmpp_username_override1');
      let pass = window.localStorage.getItem('xmpp_password_override1');
      console.log('OurSession: ID', id, '  Session:Password', password);
      if(username&&pass){
        console.log('OurSession: ID inside', id, '  Session:Password inside', password);

                    connect(username, pass, roomName).then(connection => {
                      console.log('OurSession: ID conn', id, '  Session:Password conn', password, ' conn', connection);

                      //  authDialog.close();
                        resolve(connection);
                    }, err => {
                        if (err === JitsiConnectionErrors.PASSWORD_REQUIRED) {
                        //    authDialog.displayError(err);
                              console.log("Password wrong in the session ");
                        } else {
                          //  authDialog.close();

                          console.log(err);

                            reject(err);
                        }
                    });

      }
      else {
        const authDialog = LoginDialog.showAuthDialog(
            (id, password) => {
                console.log('Jitsi: ID', id, '  Jitsi:Password', password);
                connect(id, password, roomName).then(connection => {
                    authDialog.close();
                    resolve(connection);
                }, err => {
                    if (err === JitsiConnectionErrors.PASSWORD_REQUIRED) {
                        authDialog.displayError(err);
                    } else {
                        authDialog.close();
                        reject(err);
                    }
                });
            }
        );
      }
  });
}


/**
 * Show Authentication Dialog and try to connect with new credentials.
 * If failed to connect because of PASSWORD_REQUIRED error
 * then ask for password again.
 * @param {string} [roomName] name of the conference room
 * @param {function(id, password, roomName)} [connect] function that returns
 * a Promise which resolves with JitsiConnection or fails with one of
 * JitsiConnectionErrors.
 * @returns {Promise<JitsiConnection>}
 */
function requestAuth(roomName, connect) {
    if (isTokenAuthEnabled) {
        // This Promise never resolves as user gets redirected to another URL
        return new Promise(() => redirectToTokenAuthService(roomName));
    }

    return showXmppPasswordPrompt(roomName, connect);

}

export default {
    authenticate,
    requireAuth,
    requestAuth,
    closeAuth,
    logout
};
