# insomnia-plugin-twitch-extension-barrycarlyon

This is a plugin for [insomnia](https://insomnia.rest) that will help with Twitch Extension Development by doing the JWT Generation for you. No more "expired" JWT's as one is generated at request time for you!

A sample Insomnia "Request Collection" is provided in [this repository](https://github.com/BarryCarlyon/insomnia-plugin-twitch-extension-barrycarlyon/tree/main/request_collection) for easy import and getting started!

## Install

Either:
- Use this in a browser `insomnia://plugins/install?name=insomnia-plugin-twitch-extension-barrycarlyon` (GH markdown disallows this schema)
- Open Insomnia, Click on the Cog Top Right, Click Plugins and use `insomnia-plugin-twitch-extension-barrycarlyon` as the Package to install
- Find this plugin on the [Insomnia Plugins list](https://insomnia.rest/plugins/insomnia-plugin-twitch-extension-barrycarlyon) instead!

### Collection Quick Start

- Create
- Import From
- URL
- Use: https://raw.githubusercontent.com/BarryCarlyon/insomnia-plugin-twitch-extension-barrycarlyon/main/request_collection/collection.json

This will create `Twitch Extensions Insomnia` Collection

Which will contain a `Blank Twitch Environment`
To either clone of populate with your Extension Keys

## Configuration

After installing this plugin.

Create an Environment using this JSON Format:

```json
{
  "client_id": "",
  "extension_secret": "",
  "owner_id": "",
  "version": ""
}
```

A `version` isn't required, just make sure to specify a `version` as dictated by the Twitch Documentation for the relevant endpoints, either in the `Query` parameters or JSON body depending on the endpoint.

You can specify a `version` to make your environment more similar to a production `.env`

Please ensure that `owner_id` is expressed as a `string` otherwise the generated JWT's will not be valid.

This Plugin will not fix/cast to String for you, to ensure that you don't make the same mistake when moving to production code. So for example:

```json
{
  "client_id": "MyExtensionClientID",
  "extension_secret": "bXlleHRlbnNpb25zZWNyZWN0YXNiYXNlNjQ=",
  "owner_id": "15185913",
  "version": "0.0.1"
}
```

Extension Secret should be the Base64 Encoded version directly copied from the Twitch Extension Dashboard, as the plugin will handle decoding.

Don't forget to set this environment as active to Insomnia for your Collection.

## Usage

You will _not_ need to define any headers for the requests.
This Plugin will add the `Client-ID` and `Authorization` headers for you

You can also omit the following for each Endpoint this plugin supports

### [Get Extension Configuration Segment](https://dev.twitch.tv/docs/api/reference#get-extension-configuration-segment)

You do not need to add a `Query` parameter for `extension_id`. This plugin will do that for you.

So just specify `segment` and `broadcaster_id` if needed

### [Set Extension Configuration Segment](https://dev.twitch.tv/docs/api/reference#set-extension-configuration-segment)

You do not need to add a `JSON Body` parameter for `extension_id`. This plugin will do that for you.

The "content" of the Config Service needs to be a JSON Encoded string.
But if you are "lazy" and specify an object instead, the plugin will auto JSON Encode the content for you.

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

Will work fine. As the plugin will convert the former to the latter for you.

This makes reading the Insomnia JSON Panel a lot nicer and easier to format.

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

### [Send Extension Chat Message](https://dev.twitch.tv/docs/api/reference#send-extension-chat-message)

The plugin will set the required body parameters of `extension_id` and `extension_version` for you. So a JSON body of

```json
{
    "text": "words"
}
```

will do the job. Just don't forget the `Query` parameter of `broadcaster_id`.

You can override the Environment set `extension_version` by using a body parameter:

```json
{
    "text": "words",
    "extension_version": "some_version"
}
```

### [Get Extensions](https://dev.twitch.tv/docs/api/reference#get-extensions)

The plugin will set the required `Query` parameters of `extension_id`.

If there is no environment set `version` then this API will return the released version of the Extension, otherwise the optional `Query` parameter of `extension_version` is set from the environment.

You can override the environment by specifying a `Query` parameter of `extension_version`

## Other Tools!

For a more "fully fledged" Twitch Extensions Tools Client, check out my "[Twitch Extension Tools](https://github.com/barrycarlyon/twitch_extension_tools)" Project
