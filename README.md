# insomnia-plugin-twitch-extension-barrycarlyon

This is a plugin for [insomnia](https://insomnia.rest) that will help with Twitch Extension Development by doing the JWT Generation for you. No more "expired" JWT's as one is generated at request time for you!

A sample Insomnia "Request Collection" is provided in [this repository](https://github.com/BarryCarlyon/insomnia-plugin-twitch-extension-barrycarlyon/tree/main/request_collection) for easy import and getting started!

## Install

Either:
- Use this in a browser `insomnia://plugins/install?name=insomnia-plugin-twitch-extension-barrycarlyon` (GH markdown disallows this schema)
- Open Insomnia, Click on the Cog Top Right, Click Plugins and use `insomnia-plugin-twitch-extension-barrycarlyon` as the Package to install
- Find this plugin on the [Insomnia Plugins list](https://insomnia.rest/plugins/insomnia-plugin-twitch-extension-barrycarlyon) instead!

## Configuration

After installing this plugin. Create an Environment using this JSON Format:

```json
{
  "client_id": "",
  "extension_secret": "",
  "owner_id": "",
  "version": ""
}
```

Please make sure to express `owner_id` as a `string`

Extension Secret should be the Base64 Encoded version, as the plugin will handle decoding.

Don't forget to set this environment as active

## Usage

You will _not_ need to define any headers for the requests.
This Plugin will add the `Client-ID` and `Authorization` headers for you

You can also omit the following for each Endpoint this plugin supports


### [Get Extension Configuration Segment](https://dev.twitch.tv/docs/api/reference#get-extension-configuration-segment)

You do not need to add a `Query` parameter for `extension_id`. This plugin will do that for you.

So just specify `segment` and `broadcaster_id` if needed

### [Set Extension Configuration Segment](https://dev.twitch.tv/docs/api/reference#set-extension-configuration-segment)

You do not need to add a `JSON Body` parameter for `extension_id`. This plugin will do that for you.

The "content" of the Config Service needs to be JSON Encoded. But if you are "lazy" and specify an object, the plugin will auto JSON Encode the content for you.

For example

```json
{
    "segment": "global",
    "content": {
        "foo": "bar"
    }
}
```

or

```json
{
    "segment": "global",
    "content": "{\"foo\":\"bar\"}"
}
```

Will work fine.

### [Set Extension Required Configuration](https://dev.twitch.tv/docs/api/reference#set-extension-required-configuration)

You do not need to add a `JSON Body` parameter for `extension_id` or `extension_version`. This plugin will do that for you.

So a JSON body of

```json
{
    "broadcaster_id": "xxxyyy",
    "configuration_version": "zzzz"
}
```

Will work fine.

### [Send Extension PubSub Message](https://dev.twitch.tv/docs/api/reference#send-extension-pubsub-message)

The "message" of the Send PubSub Message request needs to be JSON Encoded. But if you are "lazy" and specify an object, the plugin will auto JSON Encode the content for you.

For example

```json
{
    "segment": "global",
    "content": {
        "foo": "bar"
    }
}
```

or

```json
{
    "segment": "global",
    "content": "{\"foo\":\"bar\"}"
}
```

### [Send Extension Chat Message](https://dev.twitch.tv/docs/api/reference#send-extension-chat-messagee)

The plugin will set the required body parameters of `extension_id` and `extension_version` for you. So a JSON body of

```json
{
    "text": "words"
}
```

will do the job. Just don't forget the `Query` parameter of `broadcaster_id`
