This is the mobile app for  [Tournia](http://www.tournia.net/).


### How to start developing

Install [Ionic](http://ionicframework.com/):
```bash
$ npm install -g ionic
$ npm install
```
*Note: For a global install of -g ionic, OSX/Linux users may need to prefix the command with sudo.*

To install lib libraries
```bash
$ bower update
```

To view the result in your browser:
```bash
$ ionic serve [--lab]
```

To start developing for a mobile platform:

```bash
$ ionic platform add ios
$ ionic build ios
$ ionic emulate ios
```

Substitute ios for android if not on a Mac, but if you can, the ios development toolchain is a lot easier to work with until you need to do anything custom to Android.


Update Ionic lib:
```bash
$ ionic lib update
```

For more options, check out [the docs](http://ionicframework.com/docs/cli/).

## Demo
http://www.tournia.net/live or download the app from http://www.tournia.net/app

## Issues
Pull requests are welcome here!