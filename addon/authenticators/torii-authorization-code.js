import ToriiAuthenticator from 'ember-simple-auth/authenticators/torii';
import { warn } from '@ember/debug';
import { keys as emberKeys } from '@ember/polyfills';
import { run } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { isEmpty, isPresent } from '@ember/utils';
import fetch from 'fetch';
import RSVP from 'rsvp';

const keys = Object.keys || emberKeys; // Ember.keys deprecated in 1.13

export default ToriiAuthenticator.extend({
    torii: service(),
    session: service(),
    refreshAccessTokens: true,
    tokenExchangeUri: '',
    redirectUri: '',
    clientId: '',
    clientSecret: '',
    provider: '',
    _refreshTokenTimeout: null,
    get tokenRefreshOffset() {
        const min = 5;
        const max = 10;
        return (Math.floor(Math.random() * (max - min)) + min) * 1000;
    },
    authenticate() {
        let _self = this;
        return new RSVP.Promise( (fResolve, fReject) => {
            return _self._super(...arguments).then( (oData) => {
                let _oRequestData = {
                    code: oData.authorizationCode,
                    grant_type: 'authorization_code',
                    redirect_uri: _self.get('redirectUri'),
                    client_id: _self.get('clientId'),
                    client_secret: _self.get('clientSecret')
                };
                return _self._makeRequest(_self.get('tokenExchangeUri'), _oRequestData).then( (oResponse) => {
                    // on fulfillment
                    run( () => {
                        let _iExpiresAt = _self._absolutizeExpirationTime(oResponse.expires_in);
                        _self._scheduleAccessTokenRefresh(oResponse['expires_in'], _iExpiresAt, oResponse['refresh_token']);
                        let _oResponseData = {
                            access_token: oResponse.access_token,
                            refresh_token: oResponse.refresh_token,
                            expires_in: oResponse.expires_in,
                            expires_at: _iExpiresAt,
                            scope: oResponse.scope,
                            provider: oData.provider
                        };
                        this.trigger('sessionDataUpdated', _oResponseData);
                        return fResolve(_oResponseData);
                    });
                }, (oResponse) => {
                    // on rejection
                    run(null, fReject, oResponse);
                }).catch( (oError) => {
                    return fReject('Error requesting token %o', oError);
                });
            }).catch( (oError) => {
                return fReject(oError);
            });
        });
    },
    restore(data) {
        this._assertToriiIsPresent();

        data = data || {};
        if (!isEmpty(data.provider)) {
            let _self = this;
            const now = (new Date()).getTime();
            const refreshAccessTokens = this.get('refreshAccessTokens');
            if (!isEmpty(data['expires_at']) && data['expires_at'] < now) {
                if (refreshAccessTokens) {
                    if ((isPresent(data['refresh_token'])) && (isPresent(data['expires_in']))) {
                        data = this._refreshAccessToken(data['expires_in'], data['refresh_token']);
                    }
                }
                return _self._super(data);
            } else {
                if (this._validate(data)) {
                    this._scheduleAccessTokenRefresh(data['expires_in'], data['expires_at'], data['refresh_token']);
                }
                return _self._super(data);
            }
        } else {
            delete this._provider;
            return this._super(data);
        }
    },
    _makeRequest(sUrl, oData, oHeaders = {}) {
        oHeaders['Content-Type'] = 'application/x-www-form-urlencoded';
        let _sBody = keys(oData).map( (sKey) => {
            return `${encodeURIComponent(sKey)}=${encodeURIComponent(oData[sKey])}`;
        }).join('&');
        let _oOptions = {
            body: _sBody,
            headers: oHeaders,
            method: 'POST'
        };
        return new RSVP.Promise( (fResolve, fReject) => {
            fetch(sUrl, _oOptions).then( (oResponse) => {
                oResponse.text().then( (sTextResponse) => {
                    try {
                        let _oJsonResponse = JSON.parse(sTextResponse);
                        if (!oResponse.ok) {
                            oResponse.responseJSON = _oJsonResponse;
                            fReject(oResponse);
                        } else {
                            fResolve(_oJsonResponse);
                        }
                    } catch (SyntaxError) {
                        oResponse.responseText = sTextResponse;
                        fReject(oResponse);
                    }
                });
            }).catch(fReject);
        });
    },
    _scheduleAccessTokenRefresh(expiresIn, expiresAt, refreshToken) {
        let refreshAccessTokens = this.get('refreshAccessTokens');
        if (refreshAccessTokens) {
            const now = (new Date()).getTime();
            if (isEmpty(expiresAt) && !isEmpty(expiresIn)) {
                expiresAt = new Date(now + expiresIn * 1000).getTime();
            }
            const offset = this.get('tokenRefreshOffset');
            if (!isEmpty(refreshToken) && !isEmpty(expiresAt) && expiresAt > now - offset) {
                run.cancel(this._refreshTokenTimeout);
                delete this._refreshTokenTimeout;
                this._refreshTokenTimeout = run.later(this, this._refreshAccessToken, expiresIn, refreshToken, expiresAt - now - offset);
            }
        }
    },
    _refreshAccessToken(iExpiresIn, sRefreshToken) {
        let _self = this;
        return new RSVP.Promise( (fResolve, fReject) => {
            let _oRequestData = {
                grant_type: 'refresh_token',
                refresh_token: sRefreshToken,
                client_id: _self.get('clientId'),
                client_secret: _self.get('clientSecret')
            };
            return _self._makeRequest(_self.get('tokenExchangeUri'), _oRequestData).then( (oResponse) => {
                run( () => {
                    let _iExpiresAt = _self._absolutizeExpirationTime(oResponse.expires_in);
                    _self._scheduleAccessTokenRefresh(oResponse['expires_in'], _iExpiresAt, oResponse['refresh_token']);
                    let _oResponseData = {
                        access_token: oResponse.access_token,
                        refresh_token: oResponse.refresh_token,
                        expires_in: oResponse.expires_in,
                        expires_at: _iExpiresAt,
                        scope: oResponse.scope,
                        provider: _self.get('provider')
                    };
                    _self.trigger('sessionDataUpdated', _oResponseData);
                    return fResolve(_oResponseData);
                });
            }, (oResponse) => {
                warn(`Access token could not be refreshed - server responded with ${oResponse.responseJSON}.`, false, { id: 'ember-simple-auth.failedOAuth2TokenRefresh' });
                return fReject();
            });
        });
    },
    _absolutizeExpirationTime(expiresIn) {
        if (!isEmpty(expiresIn)) {
            return new Date((new Date().getTime()) + expiresIn * 1000).getTime();
        }
    },
    _validate(data) {
        return !isEmpty(data['access_token']);
    }
});
