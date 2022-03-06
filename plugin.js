const jwt = require('jsonwebtoken');

module.exports.requestHooks = [
    async context => {
        console.log('Running insomna-twitch-extension-barrycarlyon')

        let url = context.request.getUrl().toLowerCase();
        if (!url || url == '') {
            // no URL abort
            return;
        }
        if (!url.startsWith('https://api.twitch.tv/helix/extensions')) {
            console.log('Skip Run insomna-twitch-extension-barrycarlyon');
            return;
        }
        if (
            url.startsWith('https://api.twitch.tv/helix/extensions/transactions')
            ||
            url.startsWith('https://api.twitch.tv/helix/extensions/released')
        ) {
            // these enpoints use an App Access Token
            return;
        }

        // validate the environment is good
        const client_id = context.request.getEnvironmentVariable('client_id');
        const extension_secret = context.request.getEnvironmentVariable('extension_secret');
        const owner_id = context.request.getEnvironmentVariable('owner_id');
        const version = context.request.getEnvironmentVariable('version');

        if (
            !client_id || client_id == ''
            ||
            !extension_secret || extension_secret == ''
            ||
            !owner_id || owner_id == "" || typeof owner_id != 'string'
        ) {
            console.log('insomna-twitch-extension-barrycarlyon Environment is not complete');
            return;
        }
/*
            ||
            !version || version == "" || typeof version != 'string'
*/

        let extension_secret_usable = '';

        try {
            extension_secret_usable = Buffer.from(extension_secret, 'base64');
        } catch (e) {
            console.log('insomna-twitch-extension-barrycarlyon failed to process the secret');
            return;
        }

        let sigPayload = {
            'exp':          Math.floor(new Date().getTime() / 1000) + 10,
            'user_id':      owner_id,
            'role':         'external'
        }

        // configuration service
        if (url.startsWith('https://api.twitch.tv/helix/extensions/configurations')) {
            let sig = jwt.sign(sigPayload, extension_secret_usable);

            context.request.addHeader('Client-ID', `${client_id}`);
            context.request.addHeader('Authorization', `Bearer ${sig}`);

            if (context.request.getMethod() == 'PUT') {
                let body = context.request.getBodyText();
                try {
                    body = JSON.parse(body);
                    console.log(body);

                    body.extension_id = (body.extension_id ? body.extension_id : client_id);

                    // sanity check
                    if (typeof body.content != 'string') {
                        body.content = JSON.stringify(body.content);
                    }

                    console.log('Body now', body);

                    context.request.setBodyText(JSON.stringify(body));
                } catch (e) {

                }
            } else {
                context.request.setParameter('extension_id', `${client_id}`);
        }
        }
        if (url.startsWith('https://api.twitch.tv/helix/extensions/required_configuration')) {
            let sig = jwt.sign(sigPayload, extension_secret_usable);

            context.request.addHeader('Client-ID', `${client_id}`);
            context.request.addHeader('Authorization', `Bearer ${sig}`);

            if (context.request.getMethod() == 'PUT') {
                let body = context.request.getBodyText();
                try {
                    body = JSON.parse(body);
                    console.log(body);

                    body.extension_id = (body.extension_id ? body.extension_id : client_id);
                    body.extension_version = (body.extension_version ? body.extension_version : version);

                    console.log('Body now', body);

                    context.request.setBodyText(JSON.stringify(body));
                } catch (e) {

                }
            }
        }

        // pubsub
        if (url.startsWith('https://api.twitch.tv/helix/extensions/pubsub')) {
            let body = context.request.getBodyText();
            try {
                body = JSON.parse(body);
                console.log(body);

                let pubSubPayload = {
                    'exp':          Math.floor(new Date().getTime() / 1000) + 10,
                    'user_id':      owner_id,
                    'role':         'external',
                    'channel_id':   (body.target[0] == 'global' ? 'all' : body.target[0]),
                    'pubsub_perms': {
                        'send': body.target
                    }
                }
                let pubSubSig = jwt.sign(pubSubPayload, extension_secret_usable);

                context.request.addHeader('Client-ID', `${client_id}`);
                context.request.addHeader('Authorization', `Bearer ${pubSubSig}`);

                // sanity check
                if (typeof body.message != 'string') {
                    body.message = JSON.stringify(body.message);
                }

                console.log('Body now', body);

                context.request.setBodyText(JSON.stringify(body));
            } catch (e) {
                // dont care
                console.log('Extension Error', e);
            }
        }
        // chat
        if (url.startsWith('https://api.twitch.tv/helix/extensions/chat')) {
            let sig = jwt.sign(sigPayload, extension_secret_usable);

            context.request.addHeader('Client-ID', `${client_id}`);
            context.request.addHeader('Authorization', `Bearer ${sig}`);

            let body = context.request.getBodyText();
            try {
                body = JSON.parse(body);
                console.log(body);

                body.extension_id = (body.extension_id ? body.extension_id : client_id);
                body.extension_version = (body.extension_version ? body.extension_version : version);

                context.request.setBodyText(JSON.stringify(body));
            } catch (e) {
                // dont care
                console.log('Extension Error', e);
            }
        }
        // get this extension version details
        if (url == 'https://api.twitch.tv/helix/extensions') {
            let sig = jwt.sign(sigPayload, extension_secret_usable);

            context.request.addHeader('Client-ID', `${client_id}`);
            context.request.addHeader('Authorization', `Bearer ${sig}`);

            context.request.setParameter('extension_id', `${client_id}`);
            if (!context.request.getParameter('extension_version')) {
                context.request.setParameter('extension_version', `${version}`);
            }
            return;
        }
    }
]
