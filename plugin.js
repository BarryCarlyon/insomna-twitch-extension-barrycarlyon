const jwt = require('jsonwebtoken');

module.exports.requestHooks = [
    async context => {
        console.log('Running insomna-twitch-extension-barrycarlyon')
        const client_id = context.request.getEnvironmentVariable('client_id');
        //const client_secret = context.request.getEnvironmentVariable('client_secret');
        const extension_secret = context.request.getEnvironmentVariable('extension_secret');
        const owner_id = context.request.getEnvironmentVariable('owner_id');
        const version = context.request.getEnvironmentVariable('version');

        const extension_secret_usable = Buffer.from(extension_secret, 'base64');

        let url = context.request.getUrl().toLowerCase();
        if (!url || url == '') {
            // no URL abort
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
    }
]
